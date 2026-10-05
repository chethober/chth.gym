// ============================================================================
// Weekly Planner (برنامه) for جسم و اندیشه
// A recurring Sat→Fri plan: drag a saved routine onto a day to schedule it.
// Pointer-event drag (works with touch + mouse), tap-to-place fallback,
// calendar view of the current week with done / missed markers from history.
// ============================================================================

export function renderWeeklyPlanStyles(): string {
  return `
    <style>
      /* ==========================================================================
         Weekly planner
         ========================================================================== */
      .wp-tray-wrap {
        position: sticky;
        top: 3.5rem;
        z-index: 20;
        background: color-mix(in srgb, var(--bg) 86%, transparent);
        backdrop-filter: saturate(160%) blur(10px);
        -webkit-backdrop-filter: saturate(160%) blur(10px);
        margin-inline: -1rem;
        padding: 0.625rem 1rem;
        border-bottom: 1px solid transparent;
        transition: border-color var(--dur-fast) ease, background-color var(--dur-fast) ease;
      }
      @media (min-width: 640px) { .wp-tray-wrap { margin-inline: -1.5rem; padding-inline: 1.5rem; } }
      @media (min-width: 768px) { .wp-tray-wrap { top: 4rem; } }
      @media (min-width: 1024px) { .wp-tray-wrap { margin-inline: -2rem; padding-inline: 2rem; } }

      .wp-tray {
        display: flex;
        gap: 0.5rem;
        overflow-x: auto;
        scrollbar-width: none;
        padding-block: 0.125rem;
        overscroll-behavior-x: contain;
      }
      .wp-tray::-webkit-scrollbar { display: none; }

      /* Dragging a scheduled routine back here removes it */
      .wp-remove-hint {
        display: none;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        height: 2.75rem;
        border-radius: var(--r-md);
        border: 1.5px dashed color-mix(in srgb, var(--danger) 55%, transparent);
        color: var(--danger);
        font-size: 0.8125rem;
        font-weight: 600;
        transition: background-color var(--dur-fast) ease, transform var(--dur-fast) var(--ease-out);
      }
      html.wp-dragging-from-day .wp-tray-wrap .wp-tray { display: none; }
      html.wp-dragging-from-day .wp-tray-wrap .wp-remove-hint { display: flex; }
      .wp-tray-wrap.is-over .wp-remove-hint { background: var(--danger-soft); transform: scale(1.01); }

      .wp-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        flex-shrink: 0;
        max-width: 15rem;
        height: 2.75rem;
        padding-inline: 0.75rem 0.875rem;
        border-radius: var(--r-md);
        background: var(--surface);
        border: 1px solid var(--line-strong);
        box-shadow: var(--shadow-control);
        color: var(--text);
        font-size: 0.8125rem;
        font-weight: 600;
        cursor: grab;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
        transition:
          transform var(--dur-press) var(--ease-out),
          opacity var(--dur-fast) ease,
          border-color var(--dur-fast) ease,
          background-color var(--dur-fast) ease;
      }
      .wp-chip .wp-chip-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
      .wp-chip .wp-chip-meta { color: var(--text-3); font-size: 0.6875rem; font-weight: 500; white-space: nowrap; }
      .wp-chip .wp-grip { color: var(--text-3); flex-shrink: 0; }
      .wp-chip:active, .wp-chip.is-pressing { transform: scale(0.97); }
      .wp-chip.is-selected { border-color: var(--accent); background: var(--accent-soft); }
      .wp-chip.is-drag-source { opacity: 0.35; transform: none; }
      @media (hover: hover) and (pointer: fine) {
        .wp-chip:hover { border-color: var(--accent-line); }
      }

      /* Scheduled chip inside a day */
      .wp-chip.is-slotted {
        height: 2.5rem;
        max-width: 100%;
        background: var(--accent-soft);
        border-color: color-mix(in srgb, var(--accent) 30%, transparent);
        box-shadow: none;
        padding-inline: 0.625rem 0.25rem;
      }
      .wp-chip.is-slotted.is-done { background: var(--done-soft); border-color: var(--done-line); }
      .wp-chip-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        flex-shrink: 0;
        border-radius: var(--r-sm);
        color: var(--text-3);
        transition: color var(--dur-fast) ease, background-color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);
      }
      .wp-chip-btn:active { transform: scale(0.92); }
      .wp-chip-btn.is-play { color: var(--accent-text); }
      @media (hover: hover) and (pointer: fine) {
        .wp-chip-btn:hover { color: var(--text); background: var(--surface-2); }
      }

      /* Day cards */
      .wp-days { display: grid; gap: 0.5rem; grid-template-columns: 1fr; }
      @media (min-width: 640px) { .wp-days { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; } }
      @media (min-width: 1024px) { .wp-days { grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 0.5rem; } }

      .wp-day {
        position: relative;
        display: flex;
        gap: 0.75rem;
        min-height: 4rem;
        padding: 0.625rem;
        border-radius: var(--r-lg);
        background: var(--surface);
        border: 1px solid var(--line);
        transition:
          border-color var(--dur-fast) ease,
          background-color var(--dur-fast) ease,
          transform var(--dur-base) var(--ease-out);
      }
      @media (min-width: 1024px) {
        .wp-day { flex-direction: column; min-height: 11rem; gap: 0.625rem; }
        .wp-day .wp-day-head { width: auto; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 0.25rem 0.375rem; }
        .wp-day .wp-day-head .wp-status, .wp-day .wp-day-head .badge { margin-inline-start: auto; }
        /* Narrow columns: title gets its own two lines, actions sit underneath */
        .wp-chip.is-slotted { height: auto; flex-wrap: wrap; gap: 0.125rem; padding: 0.5rem 0.5rem 0.25rem; }
        .wp-chip.is-slotted .wp-chip-title {
          flex-basis: 100%;
          white-space: normal;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.4;
        }
        .wp-chip.is-slotted .wp-chip-btn { width: 1.75rem; height: 1.75rem; }
        .wp-chip.is-slotted .wp-chip-btn:first-of-type { margin-inline-start: auto; }
      }
      .wp-day.is-today { border-color: var(--accent-line); box-shadow: 0 0 0 3px var(--accent-soft); }
      .wp-day.is-past { background: color-mix(in srgb, var(--surface) 70%, var(--bg)); }

      .wp-day-head {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 4.25rem;
        flex-shrink: 0;
        gap: 0.125rem;
      }
      .wp-day-name { font-size: 0.8125rem; font-weight: 700; color: var(--text); }
      .wp-day-date { font-size: 0.6875rem; color: var(--text-3); }
      .wp-day.is-today .wp-day-name { color: var(--accent-text); }

      .wp-slots { flex: 1; display: flex; flex-wrap: wrap; align-content: center; gap: 0.375rem; min-width: 0; }
      @media (min-width: 1024px) { .wp-slots { flex-direction: column; flex-wrap: nowrap; align-content: stretch; justify-content: flex-start; } }
      .wp-slots .wp-chip { min-width: 0; }

      .wp-rest {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        min-height: 2.5rem;
        border-radius: var(--r-md);
        border: 1.5px dashed var(--line-strong);
        color: var(--text-3);
        font-size: 0.75rem;
        transition: border-color var(--dur-fast) ease, color var(--dur-fast) ease, background-color var(--dur-fast) ease;
      }

      /* While something is in hand, every day says "you can drop here" */
      html.wp-dragging .wp-day, .wp-days.is-armed .wp-day { border-style: dashed; border-color: var(--line-strong); cursor: copy; }
      html.wp-dragging .wp-rest, .wp-days.is-armed .wp-rest { border-color: var(--accent-line); color: var(--accent-text); }
      .wp-day.is-over {
        border-style: solid !important;
        border-color: var(--accent) !important;
        background: var(--accent-soft);
        transform: scale(1.015);
      }
      .wp-day.is-over .wp-rest { background: var(--surface); }

      /* Landing confirmation: a ring that fades out once */
      .wp-day::after {
        content: '';
        position: absolute;
        inset: -1px;
        border-radius: inherit;
        box-shadow: 0 0 0 3px var(--accent-line);
        opacity: 0;
        pointer-events: none;
      }
      .wp-day.just-dropped::after { animation: wp-ring 520ms var(--ease-out); }
      @keyframes wp-ring { 0% { opacity: 1; } 100% { opacity: 0; } }

      .wp-status { display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.625rem; font-weight: 600; }
      .wp-status.is-done { color: var(--done); }
      .wp-status.is-missed { color: var(--text-3); }

      .wp-chip.is-new { animation: pop-in 200ms var(--ease-out); }

      /* Floating copy that follows the pointer */
      .wp-ghost {
        position: fixed;
        z-index: 70;
        pointer-events: none;
        will-change: transform;
      }
      .wp-ghost .wp-chip {
        width: 100%;
        height: 100%;
        cursor: grabbing;
        box-shadow: var(--shadow-pop);
        border-color: var(--accent-line);
        will-change: transform;
      }
      html.wp-dragging, html.wp-dragging * { cursor: grabbing !important; user-select: none; -webkit-user-select: none; }

      .wp-hint { font-size: 0.75rem; color: var(--text-3); }
      .wp-hint.is-armed { color: var(--accent-text); }

      @media (prefers-reduced-motion: reduce) {
        .wp-day.is-over { transform: none; }
        .wp-chip:active, .wp-chip.is-pressing { transform: none; }
      }
    </style>
  `;
}

export function renderWeeklyPlanSection(): string {
  return `
    <section id="tab-plan" class="tab-content hidden space-y-4">
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <h2 class="text-lg font-black text-white">برنامه هفتگی</h2>
          <p id="wp-week-label" class="text-xs text-zinc-400 mt-0.5">&nbsp;</p>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button type="button" onclick="wpShiftWeek(-1)" class="btn-icon btn-ghost" title="هفته قبل" aria-label="هفته قبل">
            <i data-lucide="chevron-right" class="w-5 h-5"></i>
          </button>
          <button type="button" id="wp-this-week-btn" onclick="wpShiftWeek(0)" class="btn btn-secondary btn-sm">این هفته</button>
          <button type="button" onclick="wpShiftWeek(1)" class="btn-icon btn-ghost" title="هفته بعد" aria-label="هفته بعد">
            <i data-lucide="chevron-left" class="w-5 h-5"></i>
          </button>
        </div>
      </div>

      <div id="wp-today" class="card-glass p-4 flex items-center justify-between gap-3 min-h-[4.5rem]"></div>

      <div id="wp-tray-wrap" class="wp-tray-wrap" data-wp-drop="tray">
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="text-xs font-bold text-zinc-300">برنامه‌های ذخیره‌شده</span>
          <span id="wp-hint" class="wp-hint">بکشید و روی یک روز رها کنید</span>
        </div>
        <div id="wp-tray" class="wp-tray"></div>
        <div class="wp-remove-hint">
          <i data-lucide="calendar-x-2" class="w-4 h-4"></i>
          <span>برای حذف از برنامه اینجا رها کنید</span>
        </div>
      </div>

      <div id="wp-days" class="wp-days"></div>

      <p id="wp-summary" class="text-xs text-zinc-400 text-center"></p>
    </section>
  `;
}

export function renderWeeklyPlanClientScript(): string {
  return `
    // =========================================================================
    // WEEKLY PLANNER
    // =========================================================================
    const WP_DAY_NAMES = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
    const WP_CACHE_KEY = 'weekly_plan_v1';
    const WP_EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
    const wpState = { plan: {}, routines: [], history: [], weekOffset: 0, selectedId: null, saveTimer: null, wired: false };
    const wpDrag = { pending: null, active: null, suppressClick: false };

    function wpReducedMotion() {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function wpEsc(str) {
      return String(str == null ? '' : str).replace(/[&<>"']/g, function(ch) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
      });
    }

    // Saturday-first weekday index: Sat = 0 ... Fri = 6
    function wpWeekdayIndex(date) { return (date.getDay() + 1) % 7; }

    function wpDateKey(date) {
      return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    }

    function wpWeekStart(offset) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - wpWeekdayIndex(d) + offset * 7);
      return d;
    }

    function wpFormat(date, opts) {
      try { return new Intl.DateTimeFormat('fa-IR-u-ca-persian', opts).format(date); }
      catch (e) { return toPersianDigits(date.getDate()); }
    }

    function wpRoutine(id) { return wpState.routines.find(function(r) { return String(r.id) === String(id); }); }

    function wpDayIds(day) {
      return (wpState.plan[String(day)] || []).filter(function(id) { return !!wpRoutine(id); });
    }

    // --- Data -----------------------------------------------------------------
    async function loadWeeklyPlan() {
      wpWire();
      try { wpState.plan = JSON.parse(localStorage.getItem(WP_CACHE_KEY) || '{}') || {}; } catch (e) { wpState.plan = {}; }
      renderWeeklyPlan();

      const jobs = [];
      if (currentUser) {
        jobs.push(fetch('/api/routines').then(function(r) { return r.json(); }).then(function(d) { wpState.routines = d.routines || []; }).catch(function() {}));
        jobs.push(fetch('/api/profile/weekly-plan').then(function(r) { return r.json(); }).then(function(d) {
          if (d && d.plan) {
            wpState.plan = d.plan;
            try { localStorage.setItem(WP_CACHE_KEY, JSON.stringify(d.plan)); } catch (e) {}
          }
        }).catch(function() {}));
        jobs.push(fetch('/api/workouts/history?limit=60').then(function(r) { return r.json(); }).then(function(d) { wpState.history = d.history || []; }).catch(function() {}));
      } else {
        try { wpState.routines = JSON.parse(localStorage.getItem('guest_routines') || '[]'); } catch (e) { wpState.routines = []; }
        wpState.history = [];
      }
      await Promise.all(jobs);
      renderWeeklyPlan();
    }

    function wpSave() {
      try { localStorage.setItem(WP_CACHE_KEY, JSON.stringify(wpState.plan)); } catch (e) {}
      if (!currentUser) return;
      clearTimeout(wpState.saveTimer);
      wpState.saveTimer = setTimeout(function() {
        fetch('/api/profile/weekly-plan', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: wpState.plan })
        }).catch(function() { showNotification('ذخیره برنامه هفتگی ناموفق بود', 'error'); });
      }, 400);
    }

    function wpAssign(day, routineId) {
      const key = String(day);
      const ids = wpState.plan[key] ? wpState.plan[key].slice() : [];
      if (ids.indexOf(String(routineId)) !== -1) return false;
      if (ids.length >= 6) { showNotification('حداکثر ۶ برنامه در یک روز', 'warning'); return false; }
      ids.push(String(routineId));
      wpState.plan[key] = ids;
      return true;
    }

    function wpUnassign(day, routineId) {
      const key = String(day);
      wpState.plan[key] = (wpState.plan[key] || []).filter(function(id) { return String(id) !== String(routineId); });
      if (wpState.plan[key].length === 0) delete wpState.plan[key];
    }

    // --- Rendering ------------------------------------------------------------
    function wpChipHtml(r, opts) {
      const count = (r.exercises || []).length;
      const meta = '<span class="wp-chip-meta">' + toPersianDigits(count) + ' حرکت</span>';
      if (!opts.slotted) {
        return '<button type="button" draggable="false" class="wp-chip' + (wpState.selectedId === String(r.id) ? ' is-selected' : '') + '" data-wp-routine="' + wpEsc(r.id) + '" data-wp-from="tray" aria-pressed="' + (wpState.selectedId === String(r.id)) + '">' +
          '<i data-lucide="grip-vertical" class="wp-grip w-4 h-4"></i>' +
          '<span class="wp-chip-title">' + wpEsc(r.title) + '</span>' + meta +
        '</button>';
      }
      const play = opts.isToday
        ? '<button type="button" class="wp-chip-btn is-play" data-wp-play="' + wpEsc(r.id) + '" title="شروع تمرین" aria-label="شروع ' + wpEsc(r.title) + '"><i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i></button>'
        : '';
      return '<div class="wp-chip is-slotted' + (opts.done ? ' is-done' : '') + '" data-wp-routine="' + wpEsc(r.id) + '" data-wp-from="day" data-wp-src-day="' + opts.day + '">' +
        '<span class="wp-chip-title flex-1">' + wpEsc(r.title) + '</span>' +
        play +
        '<button type="button" class="wp-chip-btn" data-wp-remove="' + wpEsc(r.id) + '" title="حذف از این روز" aria-label="حذف ' + wpEsc(r.title) + ' از ' + WP_DAY_NAMES[opts.day] + '"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>' +
      '</div>';
    }

    function renderWeeklyPlan() {
      const daysEl = document.getElementById('wp-days');
      const trayEl = document.getElementById('wp-tray');
      if (!daysEl || !trayEl) return;

      const start = wpWeekStart(wpState.weekOffset);
      const end = new Date(start); end.setDate(start.getDate() + 6);
      const todayKey = wpDateKey(new Date());

      const label = document.getElementById('wp-week-label');
      if (label) label.textContent = wpFormat(start, { day: 'numeric', month: 'long' }) + ' تا ' + wpFormat(end, { day: 'numeric', month: 'long', year: 'numeric' });
      const thisWeekBtn = document.getElementById('wp-this-week-btn');
      if (thisWeekBtn) thisWeekBtn.disabled = wpState.weekOffset === 0;

      const doneByDate = {};
      wpState.history.forEach(function(s) {
        if (!s.start_time) return;
        const key = wpDateKey(new Date(s.start_time));
        (doneByDate[key] = doneByDate[key] || []).push(String(s.routine_id || ''));
      });

      // Tray
      if (wpState.routines.length === 0) {
        trayEl.innerHTML = '<div class="flex items-center justify-between gap-3 w-full card-glass-subtle px-3 py-2.5">' +
          '<span class="text-xs text-zinc-400">هنوز برنامه‌ای ذخیره نکرده‌اید.</span>' +
          '<button type="button" onclick="switchTab(\\'movements\\')" class="btn btn-primary btn-sm shrink-0"><i data-lucide="plus" class="w-3.5 h-3.5"></i><span>ساخت برنامه</span></button>' +
        '</div>';
      } else {
        trayEl.innerHTML = wpState.routines.map(function(r) { return wpChipHtml(r, { slotted: false }); }).join('');
      }

      // Days
      let trainingDays = 0;
      let html = '';
      for (let day = 0; day < 7; day++) {
        const date = new Date(start); date.setDate(start.getDate() + day);
        const key = wpDateKey(date);
        const isToday = key === todayKey;
        const isPast = key < todayKey;
        const ids = wpDayIds(day);
        const doneIds = doneByDate[key] || [];
        if (ids.length) trainingDays++;

        let status = '';
        if (doneIds.length && (isPast || isToday)) {
          status = '<span class="wp-status is-done"><i data-lucide="check" class="w-3 h-3"></i>انجام شد</span>';
        } else if (isPast && ids.length && currentUser) {
          status = '<span class="wp-status is-missed">انجام نشد</span>';
        } else if (isToday) {
          status = '<span class="badge badge-emerald">امروز</span>';
        }

        const slots = ids.length
          ? ids.map(function(id) {
              return wpChipHtml(wpRoutine(id), { slotted: true, day: day, isToday: isToday, done: doneIds.indexOf(String(id)) !== -1 });
            }).join('')
          : '<div class="wp-rest"><i data-lucide="coffee" class="w-3.5 h-3.5"></i><span>استراحت</span></div>';

        html += '<div class="wp-day' + (isToday ? ' is-today' : '') + (isPast ? ' is-past' : '') + '" data-wp-drop="day" data-wp-day="' + day + '" tabindex="0" aria-label="' + WP_DAY_NAMES[day] + '">' +
          '<div class="wp-day-head">' +
            '<span class="wp-day-name">' + WP_DAY_NAMES[day] + '</span>' +
            '<span class="wp-day-date">' + wpFormat(date, { day: 'numeric', month: 'short' }) + '</span>' +
            status +
          '</div>' +
          '<div class="wp-slots">' + slots + '</div>' +
        '</div>';
      }
      daysEl.innerHTML = html;
      wpSyncArmed();

      const summary = document.getElementById('wp-summary');
      if (summary) summary.textContent = toPersianDigits(trainingDays) + ' روز تمرین، ' + toPersianDigits(7 - trainingDays) + ' روز استراحت';

      wpRenderToday();
      lucide.createIcons();
    }

    function wpRenderToday() {
      const el = document.getElementById('wp-today');
      if (!el) return;
      const todayIdx = wpWeekdayIndex(new Date());
      const ids = wpDayIds(todayIdx);
      if (ids.length === 0) {
        el.innerHTML = '<div class="flex items-center gap-3 min-w-0">' +
          '<div class="icon-box icon-box-emerald w-10 h-10 shrink-0"><i data-lucide="coffee" class="w-5 h-5"></i></div>' +
          '<div class="min-w-0"><p class="text-[11px] text-zinc-400">امروز، ' + WP_DAY_NAMES[todayIdx] + '</p><p class="text-sm font-bold text-white">روز استراحت</p></div>' +
        '</div>';
        return;
      }
      const r = wpRoutine(ids[0]);
      const more = ids.length > 1 ? ' <span class="text-zinc-400 font-normal text-xs">+' + toPersianDigits(ids.length - 1) + '</span>' : '';
      el.innerHTML = '<div class="flex items-center gap-3 min-w-0">' +
          '<div class="icon-box icon-box-emerald w-10 h-10 shrink-0"><i data-lucide="dumbbell" class="w-5 h-5"></i></div>' +
          '<div class="min-w-0"><p class="text-[11px] text-zinc-400">امروز، ' + WP_DAY_NAMES[todayIdx] + '</p><p class="text-sm font-bold text-white truncate">' + wpEsc(r.title) + more + '</p></div>' +
        '</div>' +
        '<button type="button" onclick="startRoutineWorkout(\\'' + wpEsc(r.id) + '\\')" class="btn btn-primary btn-sm shrink-0"><i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i><span>شروع تمرین</span></button>';
    }

    function wpShiftWeek(dir) {
      const prev = wpState.weekOffset;
      wpState.weekOffset = dir === 0 ? 0 : prev + dir;
      if (wpState.weekOffset === prev) return;
      renderWeeklyPlan();
      const daysEl = document.getElementById('wp-days');
      if (daysEl && !wpReducedMotion()) {
        // RTL: later weeks arrive from the left, earlier weeks from the right
        const fromX = wpState.weekOffset > prev ? -14 : 14;
        daysEl.animate(
          [{ transform: 'translateX(' + fromX + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }],
          { duration: 220, easing: WP_EASE_OUT }
        );
      }
    }

    // --- Tap to place (fallback for when dragging isn't convenient) -----------
    function wpSyncArmed() {
      const armed = !!wpState.selectedId;
      document.getElementById('wp-days')?.classList.toggle('is-armed', armed);
      const hint = document.getElementById('wp-hint');
      if (hint) {
        hint.classList.toggle('is-armed', armed);
        hint.textContent = armed ? 'حالا روی یک روز بزنید' : 'بکشید و روی یک روز رها کنید';
      }
    }

    function wpSelect(id) {
      wpState.selectedId = wpState.selectedId === String(id) ? null : String(id);
      document.querySelectorAll('#wp-tray .wp-chip').forEach(function(chip) {
        const on = chip.dataset.wpRoutine === wpState.selectedId;
        chip.classList.toggle('is-selected', on);
        chip.setAttribute('aria-pressed', String(on));
      });
      wpSyncArmed();
    }

    function wpPlaceOn(day, routineId, opts) {
      if (!wpAssign(day, routineId)) return;
      wpSave();
      renderWeeklyPlan();
      const chip = document.querySelector('.wp-day[data-wp-day="' + day + '"] .wp-chip[data-wp-routine="' + CSS.escape(String(routineId)) + '"]');
      if (chip && !(opts && opts.silent)) chip.classList.add('is-new');
      wpPulseDay(day);
      return chip;
    }

    function wpPulseDay(day) {
      const dayEl = document.querySelector('.wp-day[data-wp-day="' + day + '"]');
      if (!dayEl) return;
      dayEl.classList.remove('just-dropped');
      void dayEl.offsetWidth;
      dayEl.classList.add('just-dropped');
      setTimeout(function() { dayEl.classList.remove('just-dropped'); }, 560);
    }

    function wpRemove(chip, day, routineId) {
      const done = function() { wpUnassign(day, routineId); wpSave(); renderWeeklyPlan(); };
      if (wpReducedMotion() || !chip.animate) return done();
      chip.style.pointerEvents = 'none';
      chip.animate(
        [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.92)' }],
        { duration: 140, easing: 'ease-out', fill: 'forwards' }
      ).finished.then(done, done);
    }

    function wpOnClick(e) {
      if (wpDrag.suppressClick) { e.preventDefault(); e.stopPropagation(); return; }

      const play = e.target.closest('[data-wp-play]');
      if (play) return startRoutineWorkout(play.dataset.wpPlay);

      const remove = e.target.closest('[data-wp-remove]');
      if (remove) {
        const chip = remove.closest('.wp-chip');
        return wpRemove(chip, Number(chip.dataset.wpSrcDay), remove.dataset.wpRemove);
      }

      const trayChip = e.target.closest('#wp-tray .wp-chip');
      if (trayChip) return wpSelect(trayChip.dataset.wpRoutine);

      const day = e.target.closest('.wp-day');
      if (day && wpState.selectedId) {
        const id = wpState.selectedId;
        wpState.selectedId = null;
        wpPlaceOn(Number(day.dataset.wpDay), id);
      }
    }

    // --- Drag & drop ------------------------------------------------------------
    // Mouse: drag starts after 4px of travel. Touch: long-press 220ms, so a
    // normal swipe still scrolls the page / tray. Pointer events + a non-passive
    // touchmove guard keep the page from scrolling once a chip is in hand.
    function wpWire() {
      if (wpState.wired) return;
      wpState.wired = true;
      const root = document.getElementById('tab-plan');
      root.addEventListener('pointerdown', wpOnPointerDown);
      root.addEventListener('click', wpOnClick, true);
      root.addEventListener('keydown', function(e) {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('wp-day') && wpState.selectedId) {
          e.preventDefault();
          const id = wpState.selectedId;
          wpState.selectedId = null;
          wpPlaceOn(Number(e.target.dataset.wpDay), id);
        }
      });
      root.addEventListener('contextmenu', function(e) { if (e.target.closest('.wp-chip')) e.preventDefault(); });
      document.addEventListener('pointermove', wpOnPointerMove, { passive: true });
      document.addEventListener('pointerup', function(e) { wpOnPointerEnd(e, false); });
      document.addEventListener('pointercancel', function(e) { wpOnPointerEnd(e, true); });
      document.addEventListener('touchmove', function(e) { if (wpDrag.active) e.preventDefault(); }, { passive: false });
      document.addEventListener('keydown', function(e) {
        if (e.key !== 'Escape') return;
        if (wpDrag.active) wpEndDrag(true);
        else if (wpState.selectedId) wpSelect(wpState.selectedId);
      });
    }

    function wpOnPointerDown(e) {
      // One pointer at a time: a second finger can't hijack the drag
      if (wpDrag.active || wpDrag.pending) return;
      if (e.button > 0) return;
      const chip = e.target.closest('.wp-chip');
      if (!chip || e.target.closest('.wp-chip-btn')) return;

      const p = { chip: chip, pointerId: e.pointerId, type: e.pointerType, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, timer: null };
      if (e.pointerType !== 'mouse') {
        chip.classList.add('is-pressing');
        p.timer = setTimeout(function() { if (wpDrag.pending === p) wpStartDrag(p); }, 220);
      }
      wpDrag.pending = p;
    }

    function wpOnPointerMove(e) {
      const p = wpDrag.pending;
      if (p && e.pointerId === p.pointerId) {
        p.x = e.clientX; p.y = e.clientY;
        const dist = Math.hypot(p.x - p.x0, p.y - p.y0);
        if (p.type === 'mouse') {
          if (dist > 4) wpStartDrag(p);
        } else if (dist > 8) {
          wpClearPending(); // finger moved before the long-press: it's a scroll
        }
        return;
      }
      const a = wpDrag.active;
      if (a && e.pointerId === a.pointerId) {
        const now = performance.now();
        const dt = Math.max(1, now - a.lastT);
        a.vx = a.vx * 0.6 + ((e.clientX - a.x) / dt) * 0.4;
        a.x = e.clientX; a.y = e.clientY; a.lastT = now;
      }
    }

    function wpOnPointerEnd(e, cancelled) {
      const p = wpDrag.pending;
      if (p && e.pointerId === p.pointerId) { wpClearPending(); return; }
      const a = wpDrag.active;
      if (a && e.pointerId === a.pointerId) {
        a.x = e.clientX || a.x; a.y = e.clientY || a.y;
        wpEndDrag(cancelled);
      }
    }

    function wpClearPending() {
      const p = wpDrag.pending;
      if (!p) return;
      clearTimeout(p.timer);
      p.chip.classList.remove('is-pressing');
      wpDrag.pending = null;
    }

    function wpStartDrag(p) {
      wpClearPending();
      if (wpState.selectedId) wpSelect(wpState.selectedId);
      const chip = p.chip;
      const rect = chip.getBoundingClientRect();
      const reduced = wpReducedMotion();

      const ghost = document.createElement('div');
      ghost.className = 'wp-ghost';
      ghost.style.left = rect.left + 'px';
      ghost.style.top = rect.top + 'px';
      ghost.style.width = rect.width + 'px';
      ghost.style.height = rect.height + 'px';
      const inner = chip.cloneNode(true);
      inner.classList.remove('is-pressing', 'is-selected', 'is-new');
      inner.removeAttribute('id');
      // Scale/tilt around the point the user grabbed
      inner.style.transformOrigin = (p.x - rect.left) + 'px ' + (p.y - rect.top) + 'px';
      ghost.appendChild(inner);
      document.body.appendChild(ghost);

      chip.classList.add('is-drag-source');
      const fromDay = chip.dataset.wpFrom === 'day';
      document.documentElement.classList.add('wp-dragging');
      if (fromDay) document.documentElement.classList.add('wp-dragging-from-day');
      if (navigator.vibrate) { try { navigator.vibrate(8); } catch (e) {} }

      wpDrag.active = {
        pointerId: p.pointerId, chip: chip, ghost: ghost, inner: inner, rect: rect,
        offX: p.x - rect.left, offY: p.y - rect.top,
        x: p.x, y: p.y, vx: 0, lastT: performance.now(),
        lift: 1, tilt: 0, reduced: reduced,
        routineId: chip.dataset.wpRoutine,
        fromDay: fromDay ? Number(chip.dataset.wpSrcDay) : null,
        over: null, raf: 0
      };
      wpDrag.active.raf = requestAnimationFrame(wpFrame);
    }

    function wpFrame() {
      const a = wpDrag.active;
      if (!a) return;

      // Follow the pointer 1:1; the lift and tilt ease in so it feels picked up
      const tx = a.x - a.offX - a.rect.left;
      const ty = a.y - a.offY - a.rect.top;
      a.ghost.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
      if (!a.reduced) {
        a.vx *= 0.9;
        const targetTilt = Math.max(-6, Math.min(6, a.vx * 4));
        a.tilt += (targetTilt - a.tilt) * 0.2;
        a.lift += (1.05 - a.lift) * 0.25;
        a.inner.style.transform = 'scale(' + a.lift.toFixed(4) + ') rotate(' + a.tilt.toFixed(2) + 'deg)';
      }

      // Hit test under the pointer (ghost has pointer-events: none)
      const hit = document.elementFromPoint(a.x, a.y);
      let over = hit ? hit.closest('[data-wp-drop]') : null;
      if (over && over.dataset.wpDrop === 'tray' && a.fromDay === null) over = null;
      if (over !== a.over) {
        if (a.over) a.over.classList.remove('is-over');
        if (over) over.classList.add('is-over');
        a.over = over;
      }

      // Edge auto-scroll, faster the closer to the edge
      const topEdge = 96, bottomEdge = window.innerHeight - (window.innerWidth < 768 ? 120 : 60);
      let dy = 0;
      if (a.y < topEdge) dy = -Math.ceil((topEdge - a.y) / 6);
      else if (a.y > bottomEdge) dy = Math.ceil((a.y - bottomEdge) / 6);
      if (dy) window.scrollBy(0, Math.max(-16, Math.min(16, dy)));

      a.raf = requestAnimationFrame(wpFrame);
    }

    function wpEndDrag(cancelled) {
      const a = wpDrag.active;
      if (!a) return;
      wpDrag.active = null;
      cancelAnimationFrame(a.raf);
      if (a.over) a.over.classList.remove('is-over');
      document.documentElement.classList.remove('wp-dragging', 'wp-dragging-from-day');

      // The click that follows pointerup must not select / place again
      wpDrag.suppressClick = true;
      setTimeout(function() { wpDrag.suppressClick = false; }, 0);

      const target = cancelled ? null : a.over;
      const kind = target ? target.dataset.wpDrop : null;

      if (kind === 'day') {
        const day = Number(target.dataset.wpDay);
        if (a.fromDay === day) return wpFlyBack(a);
        const destIds = wpState.plan[String(day)] || [];
        const already = destIds.indexOf(String(a.routineId)) !== -1;
        if (!already && destIds.length >= 6) {
          showNotification('حداکثر ۶ برنامه در یک روز', 'warning');
          return wpFlyBack(a);
        }
        if (a.fromDay !== null) wpUnassign(a.fromDay, a.routineId);
        if (!already) wpAssign(day, a.routineId);
        wpSave();
        renderWeeklyPlan();
        wpPulseDay(day);
        const landed = document.querySelector('.wp-day[data-wp-day="' + day + '"] .wp-chip[data-wp-routine="' + CSS.escape(String(a.routineId)) + '"]');
        return wpLand(a, landed);
      }

      if (kind === 'tray' && a.fromDay !== null) {
        wpUnassign(a.fromDay, a.routineId);
        wpSave();
        renderWeeklyPlan();
        return wpDiscardGhost(a);
      }

      wpFlyBack(a);
    }

    // Ghost glides into the chip it became, then hands over
    function wpLand(a, landed) {
      if (!landed || a.reduced) {
        if (landed && a.reduced) landed.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'ease-out' });
        return a.ghost.remove();
      }
      const to = landed.getBoundingClientRect();
      landed.style.opacity = '0';
      a.ghost.style.transition = 'transform 240ms ' + WP_EASE_OUT + ', width 240ms ' + WP_EASE_OUT + ', height 240ms ' + WP_EASE_OUT;
      a.inner.style.transition = 'transform 240ms ' + WP_EASE_OUT + ', box-shadow 240ms ease-out';
      requestAnimationFrame(function() {
        a.ghost.style.transform = 'translate3d(' + (to.left - a.rect.left) + 'px,' + (to.top - a.rect.top) + 'px,0)';
        a.ghost.style.width = to.width + 'px';
        a.ghost.style.height = to.height + 'px';
        a.inner.style.transform = 'none';
        a.inner.style.boxShadow = 'none';
      });
      setTimeout(function() {
        landed.style.opacity = '';
        a.ghost.remove();
      }, 250);
    }

    // Nowhere valid: return to where it was picked up
    function wpFlyBack(a) {
      const restore = function() { a.chip.classList.remove('is-drag-source'); a.ghost.remove(); };
      if (a.reduced) return restore();
      a.ghost.style.transition = 'transform 260ms ' + WP_EASE_OUT;
      a.inner.style.transition = 'transform 260ms ' + WP_EASE_OUT;
      requestAnimationFrame(function() {
        a.ghost.style.transform = 'translate3d(0,0,0)';
        a.inner.style.transform = 'none';
      });
      setTimeout(restore, 270);
    }

    // Dropped on the tray: it's being removed, so it leaves rather than lands
    function wpDiscardGhost(a) {
      if (a.reduced) return a.ghost.remove();
      a.inner.style.transition = 'transform 150ms ease-out, opacity 150ms ease-out';
      requestAnimationFrame(function() {
        a.inner.style.transform = 'scale(0.9)';
        a.inner.style.opacity = '0';
      });
      setTimeout(function() { a.ghost.remove(); }, 160);
    }
  `;
}
