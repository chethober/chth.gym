// Offline-first data layer for signed-in users. Everything the app does in a workout, with its
// routines and with the profile works without a connection; the network is only needed to sync.
//
// How it works, all in the page (public/sw.js only caches reads):
// - window.fetch is wrapped for same-origin /api/ calls.
// - A change (start/finish a workout, log or remove a set, routines, profile, check-in, weekly
//   plan) gets ids and times made on the device, so replaying it later is idempotent on the server.
//   Online it goes straight to the server; without a connection it is kept in an ordered outbox
//   (localStorage) and answered locally with the response the server would have given.
// - Reads (served by the network, or the service worker's cache when offline) are "rebased": the
//   changes still in the outbox, and the ones synced since that read was cached, are applied on top.
// - The outbox is sent in order when the connection returns, on load, and before reads.
export function renderOfflineScript(): string {
  return String.raw`
    var OUTBOX_KEY = 'jesm_outbox_v1';
    var SYNCED_KEY = 'jesm_synced_v1';
    var LEGACY_SETS_KEY = 'pending_set_logs_v1';
    var nativeFetch = window.fetch.bind(window);
    var syncingOutbox = null;
    var refreshTimer = null;
    var refreshPaths = new Set();
    // navigator.onLine misses weak signal and captive Wi-Fi, so the last real request decides too
    var networkFailed = false;
    var NETWORK_TIMEOUT_MS = 8000;

    // --- Storage --------------------------------------------------------------------------
    function readList(key) {
      try {
        var list = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(list) ? list : [];
      } catch (e) { return []; }
    }
    function writeList(key, list) {
      try {
        if (list.length) localStorage.setItem(key, JSON.stringify(list));
        else localStorage.removeItem(key);
      } catch (e) {}
      if (key === OUTBOX_KEY) updateSyncIndicator();
    }
    function readOutbox() { return readList(OUTBOX_KEY); }
    function outboxSize() { return readOutbox().length; }
    function clearOfflineData() { writeList(OUTBOX_KEY, []); writeList(SYNCED_KEY, []); writeList(LEGACY_SETS_KEY, []); }

    function makeUuid() {
      if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
      var b = new Uint8Array(16);
      crypto.getRandomValues(b);
      b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
      var h = Array.from(b, function(x) { return (x + 256).toString(16).slice(1); }).join('');
      return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
    }
    function makeId(prefix) { return prefix + '_' + makeUuid(); }
    function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }
    function isOffline() { return navigator.onLine === false || networkFailed; }
    function noteNetwork(ok) {
      if (networkFailed === !ok) return;
      networkFailed = !ok;
      updateSyncIndicator();
    }
    // Changes are idempotent (ids made on the device), so giving up on a slow request and
    // sending it again later is safe even if the server did receive it
    function fetchWithTimeout(url, init) {
      var ctrl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function() { if (ctrl) ctrl.abort(); }, NETWORK_TIMEOUT_MS);
      return nativeFetch(url, Object.assign({}, init, ctrl ? { signal: ctrl.signal } : {}))
        .then(function(res) { clearTimeout(timer); noteNetwork(true); return res; },
              function(e) { clearTimeout(timer); noteNetwork(false); throw e; });
    }
    function signedIn() { return typeof currentUser !== 'undefined' && !!currentUser; }

    // --- Which calls are changes, and which reads they affect -----------------------------
    var READS = {
      active: '/api/workouts/active',
      history: '/api/workouts/history',
      dashboard: '/api/analytics/dashboard',
      routines: '/api/routines',
      profile: '/api/profile',
      weekly: '/api/profile/weekly-plan'
    };
    var AFFECTS = {
      start: ['active', 'dashboard'], set: ['active', 'dashboard'], unset: ['active', 'dashboard'],
      finish: ['active', 'history', 'dashboard'], discard: ['active', 'dashboard'],
      routine_create: ['routines'], routine_update: ['routines'], routine_delete: ['routines'],
      profile: ['profile'], daily_log: ['profile'], weekly_plan: ['weekly']
    };

    function matchChange(method, path) {
      var m;
      if (method === 'POST' && path === '/api/workouts/start') return { kind: 'start' };
      if (method === 'POST' && (m = path.match(/^\/api\/workouts\/([^/]+)\/(sets|log-set)$/))) return { kind: 'set', sid: decodeURIComponent(m[1]) };
      if (method === 'DELETE' && (m = path.match(/^\/api\/workouts\/([^/]+)\/(sets|delete-set)\/([^/]+)$/))) return { kind: 'unset', sid: decodeURIComponent(m[1]), setId: decodeURIComponent(m[3]) };
      if (method === 'POST' && (m = path.match(/^\/api\/workouts\/([^/]+)\/finish$/))) return { kind: 'finish', sid: decodeURIComponent(m[1]) };
      if ((method === 'POST' && (m = path.match(/^\/api\/workouts\/([^/]+)\/discard$/))) || (method === 'DELETE' && (m = path.match(/^\/api\/workouts\/([^/]+)$/)))) return { kind: 'discard', sid: decodeURIComponent(m[1]) };
      if (method === 'POST' && path === '/api/routines') return { kind: 'routine_create' };
      if (method === 'PUT' && (m = path.match(/^\/api\/routines\/([^/]+)$/))) return { kind: 'routine_update', rid: decodeURIComponent(m[1]) };
      if (method === 'DELETE' && (m = path.match(/^\/api\/routines\/([^/]+)$/))) return { kind: 'routine_delete', rid: decodeURIComponent(m[1]) };
      if (method === 'PUT' && path === '/api/profile') return { kind: 'profile' };
      if (method === 'POST' && path === '/api/profile/daily-log') return { kind: 'daily_log' };
      if (method === 'PUT' && path === '/api/profile/weekly-plan') return { kind: 'weekly_plan' };
      return null;
    }

    function readKeyFor(path) {
      if (path === READS.active) return 'active';
      if (path === READS.history) return 'history';
      if (path === READS.dashboard) return 'dashboard';
      if (path === READS.routines || /^\/api\/routines\/(?!share\/|suggestions|import\/)[^/]+$/.test(path)) return 'routines';
      if (path === READS.profile) return 'profile';
      if (path === READS.weekly) return 'weekly';
      return null;
    }

    // Ids and times made on the device, so the server stores what happened when it happened
    function prepareBody(kind, body) {
      var now = new Date().toISOString();
      if (kind === 'start') { body.id = body.id || makeId('ses'); body.start_time = body.start_time || now; }
      if (kind === 'set') { body.id = body.id || makeId('set'); body.completed_at = body.completed_at || now; }
      if (kind === 'finish') body.end_time = body.end_time || now;
      if (kind === 'routine_create') body.id = body.id || makeId('rtn');
      if (kind === 'daily_log') body.log_date = body.log_date || now.split('T')[0];
      return body;
    }

    // --- Local copies of what the server holds ---------------------------------------------
    async function cachedJson(path) {
      try {
        if (!window.caches) return null;
        var keys = await caches.keys();
        for (var i = 0; i < keys.length; i++) {
          if (keys[i].indexOf('api-') !== 0) continue;
          var hit = await (await caches.open(keys[i])).match(path);
          if (hit) return await hit.json();
        }
      } catch (e) {}
      return null;
    }
    // The rebased view of a read, from the cache only (used to answer changes made offline)
    async function localView(path, fallback) {
      var data = (await cachedJson(path)) || clone(fallback);
      return applyChanges(path, data, overlayOps());
    }

    function exerciseInfo(exerciseId, planned, catalog) {
      var p = (planned || []).find(function(x) { return x.exercise_id === exerciseId; }) || {};
      var e = (catalog || []).find(function(x) { return x.id === exerciseId; }) || {};
      return {
        exercise_name_fa: p.name_fa || p.exercise_name_fa || e.name_fa || 'حرکت تمرینی',
        exercise_name_en: p.name_en || p.exercise_name_en || e.name_en || '',
        exercise_category: p.category || e.category || '',
        exercise_category_fa: p.category_fa || p.exercise_category_fa || e.category_fa || '',
        exercise_gif_url: p.gif_url || p.exercise_gif_url || e.gif_url || ''
      };
    }

    async function exerciseCatalog() {
      if (typeof exercisesCache !== 'undefined' && exercisesCache && exercisesCache.length) return exercisesCache;
      var data = await cachedJson('/api/exercises');
      return (data && data.exercises) || [];
    }

    function routineExercises(items, catalog) {
      return (items || []).filter(function(ex) { return ex && ex.exercise_id; }).map(function(ex, i) {
        var e = (catalog || []).find(function(x) { return x.id === ex.exercise_id; }) || {};
        return {
          id: 're_local_' + i, exercise_id: ex.exercise_id, order_index: i,
          target_sets: Number(ex.target_sets) || 3, target_reps: Number(ex.target_reps) || 10,
          rest_seconds: Number(ex.rest_seconds) || 60, superset_next: ex.superset_next ? 1 : 0,
          name_fa: e.name_fa || ex.name_fa || '', name_en: e.name_en || ex.name_en || '',
          category: e.category || '', category_fa: e.category_fa || ex.category_fa || '',
          equipment: e.equipment || '', equipment_fa: e.equipment_fa || '', gif_url: e.gif_url || ex.gif_url || ''
        };
      });
    }

    function volumeOf(logs) {
      return (logs || []).reduce(function(sum, s) { return sum + (Number(s.weight_kg) || 0) * (Number(s.reps) || 0); }, 0);
    }

    // The answer the server would give, built on the device. Returns { status, body, local, skip }.
    // local is what the read views need to show the change; skip means nothing needs sending.
    async function answerLocally(change, body) {
      var now = new Date().toISOString();
      var userId = signedIn() ? currentUser.id : 'me';
      var kind = change.kind;

      if (kind === 'start') {
        var active = (await localView(READS.active, { session: null })).session;
        // Like the server: an open workout is resumed rather than a second one started
        if (active) return { status: 200, body: { success: true, session: active, offline: true }, skip: true };
        var routines = (await localView(READS.routines, { routines: [] })).routines || [];
        var routine = body.routine_id ? routines.find(function(r) { return r.id === body.routine_id; }) : null;
        var planned = routine ? clone(routine.exercises || []) : [];
        var title = body.title || (routine && routine.title) || '';
        if (body.preset_id) {
          var presets = (typeof preloadedPresetsCache !== 'undefined' && preloadedPresetsCache) || [];
          var preset = presets.find(function(p) { return p.id === body.preset_id; });
          if (preset) {
            title = title || preset.title;
            planned = routineExercises(preset.exercises, await exerciseCatalog()).map(function(ex, i) {
              return Object.assign(ex, { notes_fa: (preset.exercises[i] || {}).notes_fa || '' });
            });
          }
        }
        var session = {
          id: body.id, user_id: userId, routine_id: routine ? routine.id : null,
          routine_title: routine ? routine.title : null, title: title || 'تمرین آزاد و اختصاصی',
          start_time: body.start_time, end_time: null, duration_seconds: null, total_volume_kg: 0,
          status: 'active', notes: null, set_logs: [], planned_exercises: planned
        };
        return { status: 200, body: { success: true, session: session, offline: true }, local: session };
      }

      if (kind === 'set') {
        var current = (await localView(READS.active, { session: null })).session;
        if (!current || current.id !== change.sid) return { status: 404, body: { error: 'جلسه تمرین یافت نشد' }, skip: true };
        var log = Object.assign({
          id: body.id, session_id: change.sid, user_id: userId, exercise_id: body.exercise_id,
          set_number: Number(body.set_number) || 1, reps: Number(body.reps) || 0,
          weight_kg: Number(body.weight_kg) || 0, rpe: body.rpe ? Number(body.rpe) : null,
          is_pr: 0, completed_at: body.completed_at, pending: true
        }, exerciseInfo(body.exercise_id, current.planned_exercises, await exerciseCatalog()));
        return { status: 200, body: { success: true, log: log, set_log: log, isPr: false, is_pr: false, is_e1rm_pr: false, offline: true }, local: log };
      }

      if (kind === 'unset') return { status: 200, body: { success: true, message: 'ست حذف شد', offline: true } };

      if (kind === 'finish') {
        var open = (await localView(READS.active, { session: null })).session;
        if (!open || open.id !== change.sid) return { status: 404, body: { error: 'جلسه تمرین یافت نشد' }, skip: true };
        var done = Object.assign(clone(open), {
          status: 'completed', end_time: body.end_time, notes: body.notes || null,
          duration_seconds: Math.max(0, Math.floor((Date.parse(body.end_time) - Date.parse(open.start_time)) / 1000)),
          total_volume_kg: volumeOf(open.set_logs)
        });
        delete done.planned_exercises;
        return { status: 200, body: { success: true, session: done, offline: true, message: 'تمرین ذخیره شد و پس از اتصال همگام می‌شود' }, local: done };
      }

      if (kind === 'discard') return { status: 200, body: { success: true, discarded: true, offline: true } };

      if (kind === 'routine_create' || kind === 'routine_update') {
        if (!body.title || !String(body.title).trim()) return { status: 400, body: { error: 'عنوان برنامه تمرینی الزامی است' }, skip: true };
        if (!Array.isArray(body.exercises) || !body.exercises.length) return { status: 400, body: { error: 'حداقل یک حرکت باید به برنامه اضافه شود' }, skip: true };
        var list = (await localView(READS.routines, { routines: [] })).routines || [];
        var rid = kind === 'routine_create' ? body.id : change.rid;
        var before = list.find(function(r) { return r.id === rid; });
        if (kind === 'routine_update' && !before) return { status: 404, body: { error: 'برنامه تمرینی یافت نشد' }, skip: true };
        var saved = {
          id: rid, user_id: userId, title: String(body.title).trim(), description: body.description || '',
          is_public: before ? before.is_public : 0, created_at: before ? before.created_at : now, updated_at: now,
          exercises: routineExercises(body.exercises, await exerciseCatalog())
        };
        return { status: kind === 'routine_create' ? 201 : 200, body: { success: true, routine: saved, offline: true }, local: saved };
      }

      if (kind === 'routine_delete') return { status: 200, body: { success: true, offline: true } };

      if (kind === 'profile') {
        var prof = (await localView(READS.profile, { profile: null })).profile || { user_id: userId };
        var merged = Object.assign({}, prof, body, { updated_at: now });
        return { status: 200, body: { success: true, profile: merged, offline: true }, local: merged };
      }

      if (kind === 'daily_log') {
        var entry = {
          id: 'dlog_local_' + body.log_date, user_id: userId, log_date: body.log_date,
          weight_kg: body.weight_kg != null ? Number(body.weight_kg) : null,
          water_liters: body.water_liters != null ? Number(body.water_liters) : null,
          notes: body.notes || null, created_at: now
        };
        return { status: 200, body: { success: true, log: entry, offline: true }, local: entry };
      }

      if (kind === 'weekly_plan') {
        var plan = {};
        var input = (body && body.plan) || {};
        for (var day = 0; day < 7; day++) {
          var ids = input[String(day)];
          if (!Array.isArray(ids)) continue;
          var clean = Array.from(new Set(ids.filter(function(id) { return typeof id === 'string' && id && id.length <= 64; }))).slice(0, 6);
          if (clean.length) plan[String(day)] = clean;
        }
        return { status: 200, body: { success: true, plan: plan, offline: true }, local: plan };
      }
      return null;
    }

    // What the views need from a server answer, for changes that went straight through
    function localFromServer(kind, data) {
      if (!data) return undefined;
      if (kind === 'start' || kind === 'finish') return data.session;
      if (kind === 'set') return data.set_log || data.log;
      if (kind === 'routine_create' || kind === 'routine_update') return data.routine;
      if (kind === 'profile') return data.profile;
      if (kind === 'daily_log') return data.log;
      if (kind === 'weekly_plan') return data.plan;
      return undefined;
    }

    // --- Rebasing reads ---------------------------------------------------------------------
    // Changes to show on top of reads: synced ones whose reads may still be stale, then the outbox
    function overlayOps() { return readList(SYNCED_KEY).concat(readOutbox()); }

    function applyToSession(session, op) {
      var b = op.body || {};
      if (op.kind === 'start') return session || clone(op.local);
      if (!session || session.id !== op.sid) return session;
      if (op.kind === 'set' && op.local) {
        session.set_logs = (session.set_logs || []).filter(function(s) {
          return s.id !== op.local.id && !(s.exercise_id === op.local.exercise_id && Number(s.set_number) === Number(op.local.set_number));
        });
        session.set_logs.push(clone(op.local));
      }
      if (op.kind === 'unset') session.set_logs = (session.set_logs || []).filter(function(s) { return s.id !== op.setId; });
      if (op.kind === 'finish' || op.kind === 'discard') return null;
      if (session) session.total_volume_kg = volumeOf(session.set_logs);
      return session;
    }

    function applyToHistory(list, op) {
      if (op.kind === 'finish' && op.local && !list.some(function(w) { return w.id === op.local.id; })) {
        list.unshift(clone(op.local));
        list.sort(function(a, b) { return String(b.start_time).localeCompare(String(a.start_time)); });
      }
      if (op.kind === 'discard') list = list.filter(function(w) { return w.id !== op.sid; });
      return list;
    }

    // Pure: the read at path, with the changes in ops applied in order (safe to apply twice)
    function applyChanges(path, data, ops) {
      var key = readKeyFor(path);
      if (!key || !data || !ops.length) return data;
      ops = ops.filter(function(op) { return (AFFECTS[op.kind] || []).indexOf(key) >= 0; });
      if (!ops.length) return data;

      if (key === 'active') {
        ops.forEach(function(op) { data.session = applyToSession(data.session || null, op); });
      } else if (key === 'history') {
        ops.forEach(function(op) { data.history = applyToHistory(data.history || [], op); });
      } else if (key === 'dashboard') {
        var known = new Set((data.recentWorkouts || []).map(function(w) { return w.id; }));
        ops.forEach(function(op) {
          data.activeSession = applyToSession(data.activeSession || null, op);
          if (op.kind === 'finish' && op.local && !known.has(op.local.id)) {
            known.add(op.local.id);
            data.totalWorkouts = (Number(data.totalWorkouts) || 0) + 1;
            data.totalVolumeKg = (Number(data.totalVolumeKg) || 0) + (Number(op.local.total_volume_kg) || 0);
          }
          data.recentWorkouts = applyToHistory(data.recentWorkouts || [], op).slice(0, 5);
        });
      } else if (key === 'routines') {
        var single = path !== READS.routines;
        var rid = single ? decodeURIComponent(path.split('/').pop()) : null;
        ops.forEach(function(op) {
          var id = op.kind === 'routine_create' ? (op.local && op.local.id) : op.rid;
          if (single) {
            if (id !== rid) return;
            if (op.kind === 'routine_delete') data = { error: 'برنامه تمرینی یافت نشد' };
            else if (op.local) data = { routine: clone(op.local) };
            return;
          }
          var list = (data.routines || []).filter(function(r) { return r.id !== id; });
          if (op.kind === 'routine_create' && op.local) list.unshift(clone(op.local));
          if (op.kind === 'routine_update' && op.local) {
            var at = (data.routines || []).findIndex(function(r) { return r.id === id; });
            list.splice(at < 0 ? 0 : at, 0, clone(op.local));
          }
          data.routines = list;
        });
      } else if (key === 'profile') {
        var today = new Date().toISOString().split('T')[0];
        ops.forEach(function(op) {
          if (!op.local) return;
          if (op.kind === 'profile') data.profile = Object.assign({}, data.profile || {}, op.local);
          if (op.kind === 'daily_log') {
            var logs = (data.dailyLogs || []).filter(function(l) { return l.log_date !== op.local.log_date; });
            logs.unshift(clone(op.local));
            logs.sort(function(a, b) { return String(b.log_date).localeCompare(String(a.log_date)); });
            data.dailyLogs = logs;
            if (op.local.log_date === today) { data.todayLog = clone(op.local); data.hasLoggedToday = true; }
            if (op.local.weight_kg > 0 && data.profile) data.profile.current_weight_kg = op.local.weight_kg;
          }
        });
      } else if (key === 'weekly') {
        ops.forEach(function(op) { if (op.local) data.plan = clone(op.local); });
      }
      return data;
    }

    // --- Outbox -------------------------------------------------------------------------------
    // Changes to records that never reached the server are folded into the outbox instead of queued
    function foldIntoOutbox(change) {
      var list = readOutbox();
      if (change.kind === 'discard' && list.some(function(op) { return op.kind === 'start' && op.body.id === change.sid; })) {
        writeList(OUTBOX_KEY, list.filter(function(op) { return op.sid !== change.sid && !(op.kind === 'start' && op.body.id === change.sid); }));
        return true;
      }
      if (change.kind === 'unset' && list.some(function(op) { return op.kind === 'set' && op.body.id === change.setId; })) {
        writeList(OUTBOX_KEY, list.filter(function(op) { return !(op.kind === 'set' && op.body.id === change.setId); }));
        return true;
      }
      if (change.kind === 'routine_delete' && list.some(function(op) { return op.kind === 'routine_create' && op.body.id === change.rid; })) {
        writeList(OUTBOX_KEY, list.filter(function(op) { return op.rid !== change.rid && !(op.kind === 'routine_create' && op.body.id === change.rid); }));
        return true;
      }
      return false;
    }

    function rememberSynced(op) {
      var keep = Date.now() - 3 * 86400000;
      var list = readList(SYNCED_KEY).filter(function(o) { return o.syncedAt > keep; });
      list.push(Object.assign({}, op, { syncedAt: Date.now(), stale: (AFFECTS[op.kind] || []).slice() }));
      writeList(SYNCED_KEY, list.slice(-300));
    }

    // A fresh read from the server already includes everything synced before it was asked for
    function markFresh(key, askedAt) {
      var list = readList(SYNCED_KEY);
      var next = list.map(function(o) {
        if (o.syncedAt > askedAt) return o;
        return Object.assign({}, o, { stale: o.stale.filter(function(k) { return k !== key; }) });
      }).filter(function(o) { return o.stale.length; });
      if (next.length !== list.length || next.some(function(o, i) { return o.stale.length !== list[i].stale.length; })) writeList(SYNCED_KEY, next);
    }

    function jsonResponse(status, body, extra) {
      return new Response(JSON.stringify(body), { status: status, headers: Object.assign({ 'Content-Type': 'application/json' }, extra || {}) });
    }

    // Sends the outbox in order; resolves with how many changes are still waiting
    function syncOutbox() {
      if (!syncingOutbox) {
        syncingOutbox = (async function() {
          var sent = 0;
          while (true) {
            var list = readOutbox();
            if (!list.length || navigator.onLine === false) break;
            var op = list[0];
            var res;
            try {
              res = await fetchWithTimeout(op.path, {
                method: op.method, credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: op.method === 'DELETE' ? undefined : JSON.stringify(op.body)
              });
            } catch (e) { break; } // Still offline
            if (res.status === 401) break; // Signed out: keep everything until they sign in again
            if (res.status >= 500 || res.status === 429) {
              op.tries = (op.tries || 0) + 1;
              // A change the server keeps failing on would block every change after it
              if (op.tries < 8) { writeList(OUTBOX_KEY, [op].concat(list.slice(1))); break; }
            }
            var data = await res.json().catch(function() { return null; });
            writeList(OUTBOX_KEY, readOutbox().filter(function(o) { return o.id !== op.id; }));
            if (res.ok) {
              sent++;
              var fromServer = localFromServer(op.kind, data);
              rememberSynced(Object.assign({}, op, fromServer !== undefined ? { local: fromServer } : {}));
              scheduleRefresh(op.kind);
            } else {
              console.warn('Offline change rejected by the server', op, res.status, data);
            }
          }
          if (sent) window.dispatchEvent(new CustomEvent('jesm:synced', { detail: { sent: sent } }));
          return readOutbox().length;
        })().finally(function() { syncingOutbox = null; });
      }
      return syncingOutbox;
    }

    // Re-read what a change touched, so the service worker's offline copies stay current
    function scheduleRefresh(kind) {
      (AFFECTS[kind] || []).forEach(function(k) { refreshPaths.add(READS[k]); });
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(async function() {
        var paths = Array.from(refreshPaths);
        refreshPaths.clear();
        if (isOffline() || readOutbox().length) return;
        try {
          var urls = new Set(paths);
          if (window.caches) {
            var names = (await caches.keys()).filter(function(k) { return k.indexOf('api-') === 0; });
            for (var i = 0; i < names.length; i++) {
              (await (await caches.open(names[i])).keys()).forEach(function(req) {
                var u = new URL(req.url);
                if (paths.some(function(p) { return u.pathname === p || u.pathname.indexOf(p + '/') === 0; })) urls.add(u.pathname + u.search);
              });
            }
          }
          urls.forEach(function(u) { offlineFetch(u).catch(function() {}); });
        } catch (e) {}
      }, 1500);
    }

    // --- The fetch wrapper ----------------------------------------------------------------------
    async function offlineFetch(input, init) {
      init = init || {};
      var url;
      try { url = new URL(typeof input === 'string' ? input : input.url, location.href); } catch (e) { return nativeFetch(input, init); }
      var method = String(init.method || (typeof input !== 'string' && input.method) || 'GET').toUpperCase();
      if (url.origin !== location.origin || url.pathname.indexOf('/api/') !== 0 || !signedIn()) return nativeFetch(input, init);
      var path = url.pathname;

      if (method === 'GET') {
        var key = readKeyFor(path);
        if (!key) return nativeFetch(input, init);
        if (outboxSize() && !isOffline()) await syncOutbox();
        var askedAt = Date.now();
        var res = null;
        try {
          res = await nativeFetch(input, init);
          noteNetwork(!res.headers.get('X-From-Offline-Cache'));
        } catch (e) {
          noteNetwork(false);
          var fallback = { active: { session: null }, history: { history: [] }, routines: path === READS.routines ? { routines: [] } : null }[key];
          if (!fallback || !overlayOps().some(function(op) { return (AFFECTS[op.kind] || []).indexOf(key) >= 0; })) throw e;
        }
        if (res && res.ok && !res.headers.get('X-From-Offline-Cache')) markFresh(key, askedAt);
        var ops = overlayOps();
        if (res && (!res.ok || !ops.length)) return res;
        var data = res ? await res.clone().json().catch(function() { return null; }) : clone(fallback);
        if (!data) return res;
        var rebased = applyChanges(path, data, ops);
        return jsonResponse(rebased && rebased.error ? 404 : 200, rebased, res ? {} : { 'X-From-Offline-Cache': '1' });
      }

      var change = matchChange(method, path);
      if (!change) return nativeFetch(input, init);
      var body = {};
      try { body = init.body ? JSON.parse(init.body) : {}; } catch (e) { return nativeFetch(input, init); }
      prepareBody(change.kind, body);
      var sendInit = Object.assign({}, init, {
        headers: Object.assign({}, init.headers || {}, { 'Content-Type': 'application/json' }),
        body: method === 'DELETE' ? undefined : JSON.stringify(body)
      });

      if (outboxSize() && !isOffline()) await syncOutbox();
      if (!outboxSize() && !isOffline()) {
        try {
          var direct = await fetchWithTimeout(url.href, sendInit);
          if (direct.ok) {
            var answer = await direct.clone().json().catch(function() { return null; });
            var fromServer = localFromServer(change.kind, answer);
            rememberSynced(Object.assign({ id: makeId('op'), method: method, path: path, body: body, at: Date.now() }, change, fromServer !== undefined ? { local: fromServer } : {}));
            scheduleRefresh(change.kind);
          }
          return direct;
        } catch (e) { /* No connection: keep it for later */ }
      }

      var local = await answerLocally(change, body);
      if (!local) return nativeFetch(input, sendInit);
      if (!local.skip && !foldIntoOutbox(change)) {
        var list = readOutbox();
        list.push(Object.assign({ id: makeId('op'), method: method, path: path, body: body, at: Date.now(), local: local.local }, change));
        writeList(OUTBOX_KEY, list);
        // Maybe the connection is already back: try in the background
        if (navigator.onLine !== false) setTimeout(function() { syncOutbox(); }, 0);
      }
      return jsonResponse(local.status, local.body, { 'X-From-Offline-Cache': '1' });
    }
    window.fetch = offlineFetch;

    // Sets queued by the earlier set-only offline queue become outbox changes
    (function migrateLegacySets() {
      var legacy = readList(LEGACY_SETS_KEY);
      if (!legacy.length) return;
      var list = readOutbox();
      legacy.forEach(function(p) {
        var body = { id: makeId('set'), exercise_id: p.exercise_id, set_number: p.set_number, reps: p.reps, weight_kg: p.weight_kg, rpe: p.rpe, completed_at: new Date().toISOString() };
        var log = Object.assign({}, p, { id: body.id, completed_at: body.completed_at, pending: true });
        list.push({ id: makeId('op'), kind: 'set', sid: p.session_id, method: 'POST', path: '/api/workouts/' + encodeURIComponent(p.session_id) + '/sets', body: body, at: Date.now(), local: log });
      });
      writeList(OUTBOX_KEY, list);
      writeList(LEGACY_SETS_KEY, []);
    })();

    // --- Connection status ----------------------------------------------------------------------
    function updateSyncIndicator() {
      var el = document.getElementById('sync-indicator');
      if (!el) return;
      var waiting = outboxSize();
      var offline = isOffline();
      el.classList.toggle('hidden', !offline && !waiting);
      el.dataset.state = offline ? 'offline' : 'syncing';
      var label = el.querySelector('[data-sync-label]');
      if (label) {
        label.textContent = offline
          ? (waiting ? 'آفلاین · ' + toPersianDigits(waiting) + ' تغییر در انتظار همگام‌سازی' : 'آفلاین · تغییرات روی همین دستگاه ذخیره می‌شوند')
          : 'در حال همگام‌سازی ' + toPersianDigits(waiting) + ' تغییر…';
      }
    }

    window.addEventListener('online', function() { networkFailed = false; updateSyncIndicator(); if (signedIn()) syncOutbox(); });
    window.addEventListener('offline', updateSyncIndicator);
    // The online event doesn't fire when a weak signal recovers; keep trying while changes wait
    setInterval(function() {
      if (signedIn() && outboxSize() && navigator.onLine !== false && !document.hidden) syncOutbox();
    }, 15000);
    document.addEventListener('visibilitychange', function() { if (!document.hidden && signedIn() && outboxSize()) syncOutbox(); });
    window.addEventListener('jesm:synced', function(e) {
      showNotification(toPersianDigits(e.detail.sent) + ' تغییر آفلاین همگام شد', 'success');
      // Server-side numbers (PRs, streak, totals) are only known after syncing
      if (typeof loadDashboardData === 'function') loadDashboardData();
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', updateSyncIndicator);
    else updateSyncIndicator();

    // Cached API reads belong to whoever was signed in; drop them on logout
    async function clearOfflineApiCache() {
      try {
        if (!window.caches) return;
        var keys = await caches.keys();
        await Promise.all(keys.filter(function(k) { return k.indexOf('api-') === 0; }).map(function(k) { return caches.delete(k); }));
      } catch (e) {}
    }

    // Registered right away: the load event can wait on slow exercise GIFs for a long time
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(function() {
        return navigator.serviceWorker.ready;
      }).then(function(reg) {
        // The first visit loads its libraries before the worker runs; hand it their addresses
        // so the app opens offline from the very next launch
        var urls = performance.getEntriesByType('resource').map(function(r) { return r.name; })
          .concat([location.origin + '/', location.origin + '/icons/site.webmanifest']);
        if (reg.active) reg.active.postMessage({ type: 'cache-urls', urls: urls });
      }).catch(function() {});
    }
  `;
}
