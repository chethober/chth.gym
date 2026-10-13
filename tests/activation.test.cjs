const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const source = ts.transpileModule(fs.readFileSync('src/frontend/activationUi.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const moduleContext = { exports: {} }; vm.runInNewContext(source, moduleContext);
const elements = new Map();
const storage = new Map();
const context = {
  currentUser: null, activeSession: null, currentProfile: null,
  currentExerciseWeights: {}, currentExerciseReps: {},
  localStorage: { getItem: k => storage.get(k) || null, setItem: (k,v) => storage.set(k,v) },
  document: { getElementById: id => {
    if (!elements.has(id)) elements.set(id, { value: id === 'setup-level' ? 'beginner' : '3', classList: { toggle() {}, add() {}, remove() {} } });
    return elements.get(id);
  } },
  preloadedPresetsCache: [{ id: 'preset_general_health_fitness', title: 'Starter', estimated_duration_min: 40, exercises: [{ name_fa: 'Squat' }] }],
  loadPreloadedPresets: async () => {}, showNotification: () => {}, switchTab: () => {},
  startPresetWorkout: async () => { context.activeSession = { id: 'new' }; },
  startRoutineWorkout: async id => { context.startedId = id; },
  toPersianDigits: String, Date, JSON, Set, Number, location: { origin: 'https://example.com' }
};
vm.createContext(context); vm.runInContext(moduleContext.exports.renderActivationScript(), context);
(async () => {
  await vm.runInContext('startGuidedWorkout()', context);
  assert.equal(context.activeSession, null, 'Preview must precede starting');
  await vm.runInContext('startGuidedWorkout()', context);
  assert.equal(JSON.parse(storage.get('guest_profile')).target_weekly_workouts, 3);
  assert.equal(storage.get('jesm_setup_guest'), 'done');
  context.activeSession = null;
  context.history = [{ id: 'old', title: 'Free workout', set_logs: [{ exercise_id: 'squat', weight_kg: 40, reps: 8 }, { exercise_id: 'squat', weight_kg: 45, reps: 6 }] }];
  vm.runInContext('updateReturnWorkout(history)', context);
  assert.equal(vm.runInContext('previousExerciseLogs.squat.weight_kg', context), 45, 'Use most recent set');
  await vm.runInContext('repeatLastWorkout()', context);
  const routine = JSON.parse(storage.get('guest_routines'))[0];
  assert.equal(routine.exercises[0].target_sets, 2);
  assert.equal(routine.exercises[0].target_reps, 6);
  assert.equal(context.startedId, 'repeat-old');
  context.activeSession = { id: 'ongoing' }; context.startedId = null;
  await vm.runInContext('repeatLastWorkout()', context);
  assert.equal(context.startedId, null, 'Repeat must preserve active session');
  context.activeSession = null;
  context.currentUser = { id: 'account' };
  context.fetch = async () => ({ ok: false });
  await vm.runInContext('startGuidedWorkout()', context);
  assert.equal(storage.has('jesm_setup_account'), false, 'Failed save must allow retry');
  console.log('Activation flow checks passed');
})().catch(e => { console.error(e); process.exitCode = 1; });
