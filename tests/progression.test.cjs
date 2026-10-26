const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const source = ts.transpileModule(fs.readFileSync('src/frontend/progressionUi.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const moduleContext = { exports: {} }; vm.runInNewContext(source, moduleContext);
let renders = 0;
const context = {
  currentUser: { id: 'u' }, activeSession: { id: 's' },
  currentExerciseWeights: {}, currentExerciseReps: {},
  renderActiveWorkoutTodoList: () => { renders++; },
  toPersianDigits: String, encodeURIComponent, Set, Math, Number, Object
};
vm.createContext(context); vm.runInContext(moduleContext.exports.renderProgressionScript(), context);
const suggest = (sets, target) => vm.runInContext('suggestNextSet', context)(sets, target);
const sets = (...pairs) => pairs.map(([weight_kg, reps], i) => ({ set_number: i + 1, weight_kg, reps }));

assert.equal(suggest([], 10), null, 'No history, no suggestion');
assert.deepEqual({ ...suggest(sets([60, 10], [60, 10], [60, 11]), 10) }, { weight_kg: 62.5, reps: 10, reason: 'increase' }, 'All top sets hit target: add weight');
assert.deepEqual({ ...suggest(sets([12, 12], [12, 12]), 12) }, { weight_kg: 13, reps: 12, reason: 'increase' }, 'Light weights step by 1kg');
assert.deepEqual({ ...suggest(sets([60, 10], [60, 8], [60, 7]), 10) }, { weight_kg: 60, reps: 8, reason: 'repeat' }, 'Missed target: same weight, one more rep than the worst top set');
assert.deepEqual({ ...suggest(sets([40, 12], [60, 6]), 8) }, { weight_kg: 60, reps: 7, reason: 'repeat' }, 'Warm-up sets at lower weight are ignored');
assert.deepEqual({ ...suggest(sets([0, 12], [0, 9]), 10) }, { weight_kg: 0, reps: 13, reason: 'reps' }, 'Bodyweight: beat best reps');

// Auto-filled inputs are replaced when last-session data arrives; user-adjusted ones are kept.
context.currentExerciseWeights = { a: 50, b: 70 }; context.currentExerciseReps = { a: 8, b: 5 };
vm.runInContext('autoSeededInputs.add("a")', context);
context.fetch = async url => {
  assert.ok(url.includes('ids=a%2Cb'));
  return { ok: true, json: async () => ({ sets: { a: sets([50, 10]), b: sets([70, 5]) } }) };
};
(async () => {
  await vm.runInContext('loadProgressionFor([{ id: "a" }, { id: "b" }])', context);
  assert.equal(context.currentExerciseWeights.a, undefined, 'Auto-filled value cleared for re-seed');
  assert.equal(context.currentExerciseWeights.b, 70, 'User-adjusted value kept');
  assert.equal(renders, 1);
  context.fetch = async () => { throw new Error('should not refetch'); };
  await vm.runInContext('loadProgressionFor([{ id: "a" }])', context);
  console.log('Progression suggestion checks passed');
})().catch(e => { console.error(e); process.exitCode = 1; });
