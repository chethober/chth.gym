// Offline-first data layer (src/frontend/offlineUi.ts) and the server's client-id checks.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const load = file => {
  const out = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const mod = { exports: {} }; vm.runInNewContext(out, { exports: mod.exports, RegExp, Date, Number, Math, Array, String });
  return mod.exports;
};

// --- Server: ids and times made on the device ---------------------------------------------
const { clientId, clientTime } = load('src/lib/limits.ts');
const uuid = '123e4567-e89b-42d3-a456-426614174000';
assert.equal(clientId('ses_' + uuid, 'ses'), 'ses_' + uuid);
assert.equal(clientId('set_' + uuid, 'ses'), undefined, 'Prefix must match');
assert.equal(clientId("ses_1' OR 1=1", 'ses'), undefined);
const now = new Date('2026-11-06T12:00:00Z');
assert.equal(clientTime('2026-11-06T10:00:00.000Z', now), '2026-11-06T10:00:00.000Z');
assert.equal(clientTime('2026-11-06T12:03:00Z', now), now.toISOString(), 'Small clock skew is clamped to now');
assert.equal(clientTime('2026-10-01T00:00:00Z', now), now.toISOString(), 'Too old');
assert.equal(clientTime('2027-01-01T00:00:00Z', now), now.toISOString(), 'In the future');
assert.equal(clientTime('nonsense', now), now.toISOString());

// --- Page: outbox, local answers and rebased reads ------------------------------------------
const { renderOfflineScript } = load('src/frontend/offlineUi.ts');
const storage = new Map();
const notes = [];
let online = false;
let server = []; // requests that reached the "server"
let serverActive = null;
const nativeFetch = async (url, init = {}) => {
  if (!online) throw new TypeError('Failed to fetch');
  const u = new URL(url, 'https://chth.space');
  const method = (init.method || 'GET').toUpperCase();
  const body = init.body ? JSON.parse(init.body) : {};
  server.push(method + ' ' + u.pathname + (body.id ? ' ' + body.id : ''));
  const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
  if (u.pathname === '/api/workouts/active') return json({ session: serverActive });
  if (u.pathname === '/api/workouts/history') return json({ history: [] });
  if (u.pathname === '/api/workouts/start') { serverActive = { id: body.id, start_time: body.start_time, set_logs: [], planned_exercises: [] }; return json({ success: true, session: serverActive }); }
  if (/\/sets$/.test(u.pathname)) { const log = { id: body.id, exercise_id: body.exercise_id, set_number: body.set_number, reps: body.reps, weight_kg: body.weight_kg, is_pr: 1 }; serverActive.set_logs.push(log); return json({ success: true, set_log: log }); }
  if (/\/finish$/.test(u.pathname)) { const done = { ...serverActive, status: 'completed', end_time: body.end_time }; serverActive = null; return json({ success: true, session: done }); }
  return json({ success: true });
};
const context = {
  currentUser: { id: 'usr_1' },
  exercisesCache: [{ id: 'squat', name_fa: 'اسکوات' }, { id: 'bench', name_fa: 'پرس سینه' }],
  localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => storage.delete(k) },
  window: { fetch: nativeFetch, addEventListener() {}, dispatchEvent(e) { notes.push(e.type); } },
  document: { readyState: 'complete', getElementById: () => null, addEventListener() {} },
  navigator: { get onLine() { return online; } },
  location: { href: 'https://chth.space/', origin: 'https://chth.space' },
  CustomEvent: class { constructor(type, opts) { this.type = type; this.detail = opts && opts.detail; } },
  showNotification: msg => notes.push(msg), toPersianDigits: String,
  setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, console,
  crypto: globalThis.crypto, Response, URL, JSON, Date, Math, Array, String, Number, Object, Set, Promise, Uint8Array
};
context.window.crypto = globalThis.crypto;
vm.createContext(context);
vm.runInContext(renderOfflineScript(), context);
const run = code => vm.runInContext(code, context);
const api = async (path, method = 'GET', body) => {
  const res = await context.window.fetch(path, body || method !== 'GET' ? { method, headers: { 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) } : undefined);
  return { status: res.status, offline: res.headers.get('X-From-Offline-Cache') === '1', data: await res.json() };
};
const outbox = () => JSON.parse(storage.get('jesm_outbox_v1') || '[]');

(async () => {
  // A whole workout without a connection
  const start = await api('/api/workouts/start', 'POST', { title: 'تمرین آزاد' });
  assert.equal(start.status, 200);
  assert.ok(start.offline && start.data.success);
  const sid = start.data.session.id;
  assert.match(sid, /^ses_[0-9a-f-]{36}$/, 'Session id is made on the device');

  const again = await api('/api/workouts/start', 'POST', { title: 'دوباره' });
  assert.equal(again.data.session.id, sid, 'An open workout is resumed, as on the server');
  assert.equal(outbox().length, 1);

  const s1 = await api('/api/workouts/' + sid + '/sets', 'POST', { exercise_id: 'squat', set_number: 1, reps: 5, weight_kg: 100 });
  assert.equal(s1.data.set_log.exercise_name_fa, 'اسکوات', 'Exercise names come from the local catalog');
  const s2 = await api('/api/workouts/' + sid + '/sets', 'POST', { exercise_id: 'bench', set_number: 1, reps: 8, weight_kg: 60 });
  await api('/api/workouts/' + sid + '/sets', 'POST', { exercise_id: 'squat', set_number: 2, reps: 5, weight_kg: 100 });

  let active = await api('/api/workouts/active');
  assert.equal(active.data.session.id, sid, 'A reload offline still shows the workout');
  assert.equal(active.data.session.set_logs.length, 3);
  assert.equal(active.data.session.total_volume_kg, 1480);

  await api('/api/workouts/' + sid + '/sets/' + s2.data.set_log.id, 'DELETE');
  assert.equal(outbox().length, 3, 'Removing a set that never left the device just drops it from the outbox');
  active = await api('/api/workouts/active');
  assert.equal(active.data.session.set_logs.length, 2);

  const fin = await api('/api/workouts/' + sid + '/finish', 'POST', { notes: '' });
  assert.equal(fin.data.session.status, 'completed');
  assert.equal(fin.data.session.total_volume_kg, 1000);
  assert.equal((await api('/api/workouts/active')).data.session, null);
  const history = await api('/api/workouts/history?limit=60');
  assert.equal(history.data.history[0].id, sid, 'The finished workout is in history before syncing');
  assert.deepEqual(outbox().map(o => o.kind), ['start', 'set', 'set', 'finish']);

  // Back online: everything is sent in order, with the device's ids
  online = true;
  assert.equal(await run('syncOutbox()'), 0);
  assert.equal(server.length, 4);
  assert.match(server[0], new RegExp('^POST /api/workouts/start ' + sid));
  assert.ok(server[3].endsWith('/finish'));
  assert.equal(outbox().length, 0);
  assert.ok(notes.includes('jesm:synced'));

  // Synced changes still show on a stale offline copy, and are dropped once a fresh read has them
  const stale = run('applyChanges')('/api/workouts/history', { history: [] }, run('overlayOps()'));
  assert.equal(stale.history.length, 1);
  await api('/api/workouts/history');
  const left = JSON.parse(storage.get('jesm_synced_v1') || '[]');
  assert.ok(left.every(o => !o.stale.includes('history')), 'A fresh read clears what it already includes');

  // Rebasing is safe to apply twice (the server already has the set)
  const view = run('applyChanges')('/api/workouts/active', { session: { id: 'x', set_logs: [{ id: 'set_a', exercise_id: 'squat', set_number: 1, reps: 5, weight_kg: 100 }] } },
    [{ kind: 'set', sid: 'x', local: { id: 'set_a', exercise_id: 'squat', set_number: 1, reps: 5, weight_kg: 100 } }]);
  assert.equal(view.session.set_logs.length, 1);

  // A workout started and discarded offline never reaches the server
  online = false; server = [];
  const s = (await api('/api/workouts/start', 'POST', { title: 'x' })).data.session.id;
  await api('/api/workouts/' + s + '/sets', 'POST', { exercise_id: 'squat', set_number: 1, reps: 5, weight_kg: 100 });
  await api('/api/workouts/' + s + '/discard', 'POST');
  assert.equal(outbox().length, 0);

  // Routines, profile check-in and weekly plan offline
  const r = await api('/api/routines', 'POST', { title: 'پا', exercises: [{ exercise_id: 'squat', target_sets: 5, target_reps: 5, rest_seconds: 120 }] });
  assert.equal(r.status, 201);
  assert.equal(r.data.routine.exercises[0].name_fa, 'اسکوات');
  const list = await api('/api/routines');
  assert.equal(list.data.routines[0].id, r.data.routine.id);
  const bad = await api('/api/routines', 'POST', { title: '', exercises: [] });
  assert.equal(bad.status, 400, 'Invalid input is rejected locally, not queued');
  await api('/api/routines/' + r.data.routine.id, 'DELETE');
  assert.equal(outbox().length, 0, 'Deleting a routine that never synced cancels its creation');
  const plan = await api('/api/profile/weekly-plan', 'PUT', { plan: { 0: ['rtn_a', 'rtn_a'], 9: ['x'] } });
  assert.deepEqual(plan.data.plan, { 0: ['rtn_a'] });
  await api('/api/profile/daily-log', 'POST', { weight_kg: 80 });
  assert.equal(outbox().length, 2);

  // Logging out clears it all
  run('clearOfflineData()');
  assert.equal(outbox().length, 0);
  console.log('Offline sync checks passed');
})().catch(e => { console.error(e); process.exitCode = 1; });
