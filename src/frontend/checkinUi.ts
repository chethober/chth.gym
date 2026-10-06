// ============================================================================
// Pre-workout check-in (وزن امروز) for جسم و اندیشه
// A two-step sheet shown before a workout starts when today's weight has not
// been logged yet: 1) weigh-in with a − / + stepper, 2) ready → start.
// Skipping is remembered for the rest of the day.
// ============================================================================

export function renderCheckinStyles(): string {
  return `
    <style>
      .ci-steps { display: flex; gap: 0.375rem; }
      .ci-steps span {
        flex: 1;
        height: 4px;
        border-radius: 999px;
        background: var(--line-strong);
        transition: background-color var(--dur-base) ease;
      }
      .ci-steps span.is-on { background: var(--accent); }

      .ci-step { animation: ci-step-in var(--dur-base) var(--ease-out); }
      @keyframes ci-step-in {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: none; }
      }
      @media (prefers-reduced-motion: reduce) { .ci-step { animation: none; } }

      .ci-weight {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
      }
      .ci-weight .stepper-btn {
        width: 2.75rem;
        height: 2.75rem;
        border-radius: var(--r-sm);
        font-size: 1.25rem;
        flex-shrink: 0;
      }
      .ci-weight-field {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 0.25rem;
        min-width: 0;
      }
      .ci-weight-input {
        width: 6.5rem;
        background: transparent;
        border: none;
        outline: none;
        text-align: center;
        font-size: 2.5rem;
        font-weight: 800;
        line-height: 1.1;
        color: var(--text);
        font-variant-numeric: tabular-nums;
        border-bottom: 2px solid var(--line-strong);
        border-radius: 0;
        padding: 0;
        -moz-appearance: textfield;
        transition: border-color var(--dur-fast) ease;
      }
      .ci-weight-input:focus { border-bottom-color: var(--accent); }
      .ci-weight-input::-webkit-outer-spin-button,
      .ci-weight-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      .ci-weight-unit { font-size: 0.875rem; color: var(--text-3); }
    </style>
  `;
}

export function renderCheckinModal(): string {
  return `
    <!-- Pre-workout Check-in Stepper -->
    <div id="checkin-modal" class="modal-backdrop hidden" onclick="if (event.target === this) closeCheckin(false)">
      <div role="dialog" aria-modal="true" aria-labelledby="checkin-title" class="modal-panel max-w-sm p-5 space-y-5">
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-3">
            <span id="checkin-step-label" class="text-[11px] text-zinc-400">مرحله ۱ از ۲</span>
            <button type="button" onclick="closeCheckin(false)" class="btn-icon btn-ghost" aria-label="بستن">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="ci-steps" aria-hidden="true">
            <span id="checkin-bar-1" class="is-on"></span>
            <span id="checkin-bar-2"></span>
          </div>
        </div>

        <!-- Step 1: weigh-in -->
        <form id="checkin-step-1" class="ci-step space-y-5" onsubmit="event.preventDefault(); submitCheckinWeight();">
          <div class="text-center space-y-1">
            <h3 id="checkin-title" class="text-base font-bold text-white">وزن امروز</h3>
            <p class="text-xs text-zinc-400">قبل از شروع تمرین، وزن امروزت را ثبت کن.</p>
          </div>

          <div class="ci-weight">
            <button type="button" onclick="adjustCheckinWeight(-0.1)" class="stepper-btn" aria-label="کاهش وزن">−</button>
            <label class="ci-weight-field">
              <input type="number" id="checkin-weight-input" step="0.1" min="30" max="250" inputmode="decimal" class="ci-weight-input" aria-label="وزن امروز به کیلوگرم">
              <span class="ci-weight-unit">kg</span>
            </label>
            <button type="button" onclick="adjustCheckinWeight(0.1)" class="stepper-btn" aria-label="افزایش وزن">+</button>
          </div>

          <p id="checkin-last-weight" class="text-[11px] text-zinc-400 text-center"></p>

          <div class="modal-foot">
            <button type="button" onclick="skipCheckin()" class="btn btn-ghost btn-md">رد کردن</button>
            <button type="submit" id="checkin-save-btn" class="btn btn-primary btn-md">
              <span>ثبت و ادامه</span>
              <i data-lucide="arrow-left" class="w-4 h-4"></i>
            </button>
          </div>
        </form>

        <!-- Step 2: ready -->
        <div id="checkin-step-2" class="ci-step hidden space-y-5">
          <div class="text-center space-y-3">
            <div class="icon-box icon-box-emerald w-12 h-12 mx-auto">
              <i data-lucide="dumbbell" class="w-5 h-5"></i>
            </div>
            <div class="space-y-1">
              <h3 class="text-base font-bold text-white">آماده‌ای؟</h3>
              <p id="checkin-workout-title" class="text-xs text-zinc-400"></p>
            </div>
            <span id="checkin-summary" class="badge badge-emerald font-mono"></span>
          </div>

          <div class="modal-foot">
            <button type="button" onclick="showCheckinStep(1)" class="btn btn-secondary btn-md">بازگشت</button>
            <button type="button" onclick="closeCheckin(true)" class="btn btn-primary btn-md">
              <i data-lucide="play" class="w-4 h-4 fill-current"></i>
              <span>شروع تمرین</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderCheckinClientScript(): string {
  return `
    // --- Pre-workout Check-in Stepper ---
    let checkinState = { day: null, loggedToday: false, lastWeight: null, prevWeight: null };
    let checkinResolve = null;
    let checkinLoggedWeight = null;

    function checkinTodayStr() {
      return new Date().toISOString().split('T')[0];
    }

    // Called by loadProfileData with the newest-first daily logs.
    function setCheckinState(logs, fallbackWeight) {
      const today = checkinTodayStr();
      const weighed = (logs || []).filter(function(l) { return Number(l.weight_kg) > 0; });
      const todayLog = weighed.find(function(l) { return l.log_date === today; });
      const prior = weighed.find(function(l) { return l.log_date !== today; });
      checkinState = {
        day: today,
        loggedToday: !!todayLog,
        lastWeight: Number((todayLog || prior || {}).weight_kg) || Number(fallbackWeight) || null,
        prevWeight: prior ? Number(prior.weight_kg) : null
      };
    }

    function roundWeight(w) {
      return Math.round(w * 10) / 10;
    }

    // Resolves true to go ahead with the workout, false if the user backed out.
    async function ensurePreWorkoutCheckin(workoutTitle) {
      const today = checkinTodayStr();
      let skippedOn = null;
      try { skippedOn = localStorage.getItem('checkin_skipped_on'); } catch (e) {}
      if (skippedOn === today) return true;

      // Profile data is only loaded with the profile tab; fetch it if missing or stale
      if (checkinState.day !== today) await loadProfileData();
      if (checkinState.loggedToday) return true;

      if (checkinResolve) checkinResolve(false);
      return new Promise(function(resolve) {
        checkinResolve = resolve;
        checkinLoggedWeight = null;

        const input = document.getElementById('checkin-weight-input');
        input.value = checkinState.lastWeight ? roundWeight(checkinState.lastWeight) : '';
        document.getElementById('checkin-last-weight').innerText = checkinState.prevWeight
          ? 'آخرین ثبت: ' + toPersianDigits(roundWeight(checkinState.prevWeight)) + ' kg'
          : '';
        document.getElementById('checkin-workout-title').innerText = workoutTitle ? '«' + workoutTitle + '»' : 'جلسه‌ی امروز';

        showCheckinStep(1);
        document.getElementById('checkin-modal').classList.remove('hidden');
        document.addEventListener('keydown', checkinKeydown);
        lockBodyScroll();
        lucide.createIcons();
        setTimeout(function() { input.focus(); input.select(); }, 50);
      });
    }

    function checkinKeydown(e) {
      if (e.key === 'Escape') closeCheckin(false);
    }

    function showCheckinStep(step) {
      document.getElementById('checkin-step-1').classList.toggle('hidden', step !== 1);
      document.getElementById('checkin-step-2').classList.toggle('hidden', step !== 2);
      document.getElementById('checkin-bar-2').classList.toggle('is-on', step === 2);
      document.getElementById('checkin-step-label').innerText = 'مرحله ' + toPersianDigits(step) + ' از ۲';

      if (step === 2) {
        const summary = document.getElementById('checkin-summary');
        if (checkinLoggedWeight) {
          let text = toPersianDigits(checkinLoggedWeight) + ' kg ثبت شد';
          if (checkinState.prevWeight) {
            const delta = roundWeight(checkinLoggedWeight - checkinState.prevWeight);
            if (delta !== 0) text += ' · ' + toPersianDigits((delta > 0 ? '+' : '−') + Math.abs(delta));
          }
          summary.innerText = text;
          summary.classList.remove('hidden');
        } else {
          summary.classList.add('hidden');
        }
      }
    }

    function adjustCheckinWeight(delta) {
      const input = document.getElementById('checkin-weight-input');
      const current = parseFloat(input.value) || checkinState.lastWeight || 70;
      input.value = Math.min(250, Math.max(30, roundWeight(current + delta)));
    }

    async function submitCheckinWeight() {
      const weight = roundWeight(parseFloat(document.getElementById('checkin-weight-input').value));
      if (!weight || weight < 30 || weight > 250) {
        showNotification('لطفاً وزن معتبری وارد کنید', 'warning');
        return;
      }

      const btn = document.getElementById('checkin-save-btn');
      btn.disabled = true;
      try {
        await saveTodayWeight(weight);
        checkinLoggedWeight = weight;
        checkinState.loggedToday = true;
        checkinState.lastWeight = weight;
        showCheckinStep(2);
        // Refresh profile KPIs and suggestions in the background
        loadProfileData().then(function() {
          if (typeof loadSmartSuggestions === 'function') loadSmartSuggestions();
        });
      } catch (e) {
        showNotification('خطا در ثبت وزن', 'error');
      } finally {
        btn.disabled = false;
      }
    }

    async function saveTodayWeight(weight) {
      if (!currentUser) {
        const todayStr = checkinTodayStr();
        const guestLogs = JSON.parse(localStorage.getItem('guest_daily_logs') || '[]');
        const existing = guestLogs.find(function(l) { return l.log_date === todayStr; });
        if (existing) {
          existing.weight_kg = weight;
        } else {
          guestLogs.unshift({ id: 'guest-log-' + Date.now(), log_date: todayStr, weight_kg: weight });
        }
        localStorage.setItem('guest_daily_logs', JSON.stringify(guestLogs));

        const guestProfile = JSON.parse(localStorage.getItem('guest_profile') || '{}');
        guestProfile.current_weight_kg = weight;
        localStorage.setItem('guest_profile', JSON.stringify(guestProfile));
        return;
      }

      const res = await fetch('/api/profile/daily-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight_kg: weight })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'daily-log failed');
    }

    function skipCheckin() {
      checkinLoggedWeight = null;
      showCheckinStep(2);
    }

    function closeCheckin(proceed) {
      const modal = document.getElementById('checkin-modal');
      if (modal.classList.contains('hidden')) return;
      modal.classList.add('hidden');
      document.removeEventListener('keydown', checkinKeydown);
      unlockBodyScroll();
      // Starting without a weigh-in: don't ask again today
      if (proceed && !checkinState.loggedToday) {
        try { localStorage.setItem('checkin_skipped_on', checkinTodayStr()); } catch (e) {}
      }
      if (checkinResolve) {
        const resolve = checkinResolve;
        checkinResolve = null;
        resolve(!!proceed);
      }
    }
  `;
}
