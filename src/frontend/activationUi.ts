// First-workout setup and return visits, using the existing guest and account flows.
export function renderActivationSection(): string {
  return `<div id="first-workout" class="card-glass p-5 space-y-4 hidden" aria-labelledby="first-workout-title">
    <h2 id="first-workout-title" class="text-lg font-bold text-white">اولین تمرینت را آماده کن</h2>
    <p class="text-sm text-zinc-400">سطح و تعداد جلساتت را انتخاب کن؛ برنامه را ببین و بدون ساخت حساب شروع کن.</p>
    <div class="grid sm:grid-cols-2 gap-3">
      <label class="text-sm text-zinc-300">تجربه تمرین<select id="setup-level" class="input-styled mt-2"><option value="beginner">تازه شروع کرده‌ام</option><option value="intermediate">به‌طور منظم تمرین می‌کنم</option><option value="advanced">باتجربه هستم</option></select></label>
      <label class="text-sm text-zinc-300">جلسات در هفته<select id="setup-days" class="input-styled mt-2"><option value="2">۲ جلسه</option><option value="3" selected>۳ جلسه</option><option value="4">۴ جلسه</option></select></label>
    </div>
    <p id="setup-recommendation" class="text-sm text-zinc-300" aria-live="polite"></p>
    <div class="flex flex-wrap gap-2"><button id="setup-start" type="button" onclick="startGuidedWorkout()" class="btn btn-primary">مشاهده برنامه پیشنهادی</button><button type="button" onclick="dismissWorkoutSetup()" class="btn btn-ghost">خودم برنامه دارم</button><a href="/programs" class="btn btn-secondary">راهنمای برنامه‌ها</a></div>
  </div>
  <div id="return-workout" class="card-glass p-5 space-y-3 hidden">
    <h2 class="text-base font-bold text-white">تمرین بعدی، آماده است</h2><p id="return-workout-title" class="text-sm text-zinc-400"></p>
    <button id="repeat-workout" type="button" onclick="repeatLastWorkout()" class="btn btn-primary">تکرار آخرین تمرین</button>
    <button type="button" onclick="switchTab('plan')" class="btn btn-secondary">تنظیم روزهای تمرین</button>
  </div>
  <div id="workout-recap" class="card-glass p-5 space-y-3 hidden" role="status"><h2 class="text-base font-bold text-white">تمرینت ثبت شد!</h2><p id="workout-recap-text" class="text-sm text-zinc-300"></p><p class="text-sm text-zinc-400">برای جلسه بعد، روز تمرینت را در برنامه هفتگی انتخاب کن.</p><button type="button" onclick="shareWorkoutResult()" class="btn btn-secondary">اشتراک نتیجه تمرین</button><button type="button" onclick="switchTab('plan')" class="btn btn-primary">برنامه‌ریزی جلسه بعد</button></div>`;
}

export function renderActivationScript(): string {
  return String.raw`
    let returnWorkout = null;
    let previousExerciseLogs = {};
    let guidedPresetId = null;
    let workoutShareText = '';
    let workoutShareLines = [];
    function activationKey() { return 'jesm_setup_' + (currentUser ? currentUser.id : 'guest'); }
    function dismissWorkoutSetup() {
      localStorage.setItem(activationKey(), 'done');
      document.getElementById('first-workout').classList.add('hidden');
    }
    function updateReturnWorkout(history) {
      returnWorkout = history[0] || null;
      previousExerciseLogs = {};
      history.forEach(w => (w.set_logs || []).slice().reverse().forEach(log => {
        if (!previousExerciseLogs[log.exercise_id]) previousExerciseLogs[log.exercise_id] = log;
      }));
      const fresh = !history.length && !localStorage.getItem(activationKey()) && !activeSession;
      document.getElementById('first-workout').classList.toggle('hidden', !fresh);
      document.getElementById('return-workout').classList.toggle('hidden', !returnWorkout || !!activeSession);
      document.getElementById('return-workout-title').textContent = returnWorkout ? returnWorkout.title : '';
    }
    async function startGuidedWorkout() {
      const btn = document.getElementById('setup-start');
      btn.disabled = true;
      try {
        const level = document.getElementById('setup-level').value;
        const days = Number(document.getElementById('setup-days').value);
        const presetId = level === 'beginner' ? 'preset_general_health_fitness' : 'preset_normal_hypertrophy_upper';
        await loadPreloadedPresets();
        const preset = preloadedPresetsCache.find(p => p.id === presetId);
        if (!preset) throw new Error();
        if (guidedPresetId !== presetId) {
          guidedPresetId = presetId;
          document.getElementById('setup-recommendation').textContent = preset.title + ' · حدود ' + toPersianDigits(preset.estimated_duration_min) + ' دقیقه · ' + preset.exercises.map(e => e.name_fa).join('، ');
          btn.textContent = 'شروع این برنامه';
          return;
        }
        const profile = { fitness_level: level, target_weekly_workouts: days };
        if (currentUser) {
          const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) });
          if (!res.ok) throw new Error();
        } else {
          localStorage.setItem('guest_profile', JSON.stringify({ ...JSON.parse(localStorage.getItem('guest_profile') || '{}'), ...profile }));
        }
        currentProfile = { ...(currentProfile || {}), ...profile };
        if (activeSession) { showNotification('ابتدا تمرین فعال را تمام کنید', 'info'); return; }
        await startPresetWorkout(presetId);
        if (activeSession) dismissWorkoutSetup();
      } catch (e) { showNotification('آماده‌سازی برنامه انجام نشد؛ دوباره تلاش کنید', 'error'); }
      finally { btn.disabled = false; }
    }
    async function repeatLastWorkout() {
      if (!returnWorkout) return;
      if (activeSession) { switchTab('dashboard'); showNotification('تمرین فعلی را ادامه دهید', 'info'); return; }
      const btn = document.getElementById('repeat-workout');
      btn.disabled = true;
      try {
        const logs = returnWorkout.set_logs || [];
        const planned = (returnWorkout.planned_exercises || []).length ? returnWorkout.planned_exercises : [...new Set(logs.map(l => l.exercise_id))].map(id => {
          const sets = logs.filter(l => l.exercise_id === id);
          const last = sets[sets.length - 1];
          return { exercise_id: id, name_fa: last.exercise_name_fa || 'حرکت', name_en: last.exercise_name_en || '', gif_url: last.exercise_gif_url || '', target_sets: sets.length, target_reps: last.reps, rest_seconds: 60 };
        });
        if (!planned.length) { showNotification('این جلسه حرکتی برای تکرار ندارد', 'info'); return; }
        let routineId = returnWorkout.routine_id;
        if (!currentUser || !routineId) {
          if (currentUser) {
            const res = await fetch('/api/routines', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: returnWorkout.title, exercises: planned }) });
            const data = await res.json();
            if (!res.ok || !data.routine) throw new Error();
            routineId = data.routine.id;
          } else {
            routineId = 'repeat-' + returnWorkout.id;
            const routines = JSON.parse(localStorage.getItem('guest_routines') || '[]').filter(r => r.id !== routineId);
            routines.unshift({ id: routineId, title: returnWorkout.title, exercises: planned });
            localStorage.setItem('guest_routines', JSON.stringify(routines));
          }
        }
        currentExerciseWeights = {}; currentExerciseReps = {};
        await startRoutineWorkout(routineId);
      } catch (e) { showNotification('تکرار تمرین انجام نشد؛ دوباره تلاش کنید', 'error'); }
      finally { btn.disabled = false; }
    }
    function showWorkoutRecap(session) {
      const sets = (session.set_logs || []).length;
      const minutes = Math.max(0, Math.round((Date.now() - new Date(session.start_time).getTime()) / 60000));
      workoutShareText = session.title + ' — ' + toPersianDigits(sets) + ' ست، ' + toPersianDigits(minutes) + ' دقیقه، ' + toPersianDigits(session.total_volume_kg || 0) + ' کیلوگرم حجم تمرین';
      workoutShareLines = [session.title, toPersianDigits(sets) + ' ست · ' + toPersianDigits(minutes) + ' دقیقه', toPersianDigits(session.total_volume_kg || 0) + ' کیلوگرم حجم تمرین'];
      document.getElementById('workout-recap-text').textContent = workoutShareText;
      document.getElementById('workout-recap').classList.remove('hidden');
      dismissWorkoutSetup();
      currentExerciseWeights = {}; currentExerciseReps = {};
    }
    async function shareWorkoutResult() {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1080; canvas.height = 1080;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0e0f11'; ctx.fillRect(0, 0, 1080, 1080);
        ctx.fillStyle = '#ff6a2b'; ctx.fillRect(80, 110, 920, 8);
        ctx.textAlign = 'center'; ctx.direction = 'rtl';
        ctx.font = 'bold 64px Vazirmatn, sans-serif'; ctx.fillText('تمرین امروز من', 540, 250, 900);
        ctx.fillStyle = '#ffffff'; ctx.font = '42px Vazirmatn, sans-serif';
        workoutShareLines.forEach((line, i) => ctx.fillText(line, 540, 410 + i * 140, 900));
        ctx.fillStyle = '#ff9563'; ctx.font = '32px Vazirmatn, sans-serif';
        ctx.fillText('جسم و اندیشه · ' + location.host, 540, 920, 900);
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        if (!blob) throw new Error();
        const file = new File([blob], 'workout.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: 'تمرین امروز من', text: workoutShareText, files: [file] });
        } else {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a'); link.href = url; link.download = 'workout.png';
          document.body.appendChild(link); link.click(); link.remove();
          setTimeout(() => URL.revokeObjectURL(url), 10000);
          showNotification('تصویر نتیجه تمرین آماده شد', 'success');
        }
      } catch (e) { if (e.name !== 'AbortError') showNotification('اشتراک‌گذاری انجام نشد', 'error'); }
    }
    async function saveAndStartSharedRoutine() {
      if (!currentSharedRoutine || activeSession) { showNotification('ابتدا تمرین فعال را تمام کنید', 'info'); return; }
      const routine = currentSharedRoutine;
      try {
        let id = routine.id;
        if (currentUser) {
          const res = await fetch('/api/routines/import/' + encodeURIComponent(id), { method: 'POST' });
          const data = await res.json();
          if (!res.ok || !data.routine) throw new Error();
          id = data.routine.id;
        } else {
          const routines = JSON.parse(localStorage.getItem('guest_routines') || '[]');
          if (!routines.some(r => r.id === id)) { routines.unshift(routine); localStorage.setItem('guest_routines', JSON.stringify(routines)); }
        }
        closeSharedRoutineModal();
        dismissWorkoutSetup();
        await startRoutineWorkout(id);
      } catch (e) { showNotification('ذخیره برنامه انجام نشد؛ دوباره تلاش کنید', 'error'); }
    }
  `;
}
