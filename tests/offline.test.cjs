const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const source = ts.transpileModule(fs.readFileSync('src/frontend/offlineUi.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const moduleContext = { exports: {} }; vm.runInNewContext(source, moduleContext);
const storage = new Map();
const notes = [];
let renders = 0;
const context = {
  currentUser: { id: 'u' }, activeSession: { id: 's1', set_logs: [] },
  localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k) },
  window: { addEventListener() {} }, navigator: {},
  showNotification: msg => notes.push(msg), renderActiveWorkoutTodoList: () => { renders++; },
  toPersianDigits: String, encodeURIComponent, JSON, Date, Math, Array, String
};
vm.createContext(context); vm.runInContext(moduleContext.exports.renderOfflineScript(), context);
const run = code => vm.runInContext(code, context);
const set = (exercise_id, set_number, reps = 10) => ({ session_id: 's1', exercise_id, set_number, reps, weight_kg: 50, rpe: 8 });

(async () => {
  run('queuePendingSet')(set('squat', 1, 8));
  run('queuePendingSet')(set('squat', 1, 10));
  run('queuePendingSet')(set('squat', 2));
  run('queuePendingSet')({ ...set('bench', 1), session_id: 'other' });
  assert.equal(run('pendingSetsFor("s1")').length, 2, 'Re-logging a set number replaces it');
  assert.equal(run('pendingSetsFor("s1")')[0].reps, 10);

  context.fetch = async () => { throw new TypeError('offline'); };
  assert.equal(await run('flushPendingSets()'), 3, 'Offline: nothing sent');

  const sent = [];
  context.fetch = async (url, opts) => {
    const body = JSON.parse(opts.body);
    sent.push(url + ':' + body.exercise_id + ':' + body.set_number);
    if (body.exercise_id === 'bench') return { ok: false, status: 404, json: async () => ({ error: 'gone' }) };
    if (body.set_number === 2 && sent.length === 2) return { ok: false, status: 503, json: async () => ({}) };
    return { ok: true, status: 200, json: async () => ({ success: true, set_log: { id: 'real-' + body.set_number, exercise_id: body.exercise_id, set_number: body.set_number, reps: body.reps, weight_kg: body.weight_kg } }) };
  };
  assert.equal(await run('flushPendingSets()'), 2, 'A server error stops the run and keeps the rest queued');
  assert.deepEqual(context.activeSession.set_logs.map(l => l.id), ['real-1']);
  assert.equal(context.activeSession.total_volume_kg, 500);

  assert.equal(await run('flushPendingSets()'), 0, 'Rejected sets are dropped so the queue never blocks');
  assert.deepEqual(context.activeSession.set_logs.map(l => l.id).sort(), ['real-1', 'real-2']);
  assert.equal(storage.has('pending_set_logs_v1'), false);
  assert.ok(renders >= 2 && notes.length >= 2);

  run('queuePendingSet')(set('row', 1));
  const id = run('pendingSetsFor("s1")')[0].id;
  run('removePendingSet')(id);
  assert.equal(run('pendingSetsFor("s1")').length, 0);
  console.log('Offline set queue checks passed');
})().catch(e => { console.error(e); process.exitCode = 1; });
