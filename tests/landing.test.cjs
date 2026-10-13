const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const assert = require('node:assert/strict');
require.extensions['.ts'] = (mod, filename) => mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const html = require('../src/frontend/html.ts').renderAppHtml();
assert.match(html, /id="dashboard-shell" hidden/);
assert.match(html, /id="landing-page"/);
assert.equal((html.match(/class="landing-button landing-primary[^"]*" href="\/api\/auth\/google"/g) || []).length, 2);
const auth = html.slice(html.indexOf('    async function checkAuth()'), html.indexOf('    function renderUserUI(user)'));
const init = html.slice(html.indexOf("    document.addEventListener('DOMContentLoaded'"), html.indexOf('    async function checkUrlParams()'));
async function check(data, search = '', fail = false) {
  let callback;
  const nodes = { 'landing-page': { hidden: false }, 'dashboard-shell': { hidden: true } };
  const calls = [];
  const ctx = vm.createContext({
    currentUser: null, URLSearchParams,
    document: { title: 'app', addEventListener: (_, fn) => callback = fn, getElementById: id => nodes[id] },
    window: { location: { search, pathname: '/' }, history: { replaceState: () => calls.push('clear-url') } },
    localStorage: { getItem: () => 'profile' },
    lucide: { createIcons() {} }, initTheme() {},
    fetch: async () => { if (fail) throw new Error('offline'); return { ok: true, json: async () => data }; },
    renderUserUI: () => calls.push('user'), renderAuthPrompt: () => calls.push('guest'),
    loadExercises: async () => calls.push('exercises'), switchTab: tab => calls.push(tab),
    checkUrlParams: async () => calls.push('params'), showConfirmDialog: opts => calls.push(opts.message)
  });
  vm.runInContext(auth + init, ctx);
  await callback();
  return { nodes, calls };
}
(async () => {
  for (const result of [await check({ authenticated: false, user: null }), await check({}, '', true)]) {
    assert.equal(result.nodes['dashboard-shell'].hidden, true);
    assert.equal(result.nodes['landing-page'].hidden, false);
    assert.ok(!result.calls.includes('exercises'));
  }
  const signedIn = await check({ authenticated: true, user: { name: 'athlete' } }, '?auth=success');
  assert.equal(signedIn.nodes['dashboard-shell'].hidden, false);
  assert.equal(signedIn.nodes['landing-page'].hidden, true);
  assert.ok(signedIn.calls.includes('dashboard'));
  assert.ok(!signedIn.calls.includes('profile'));
  const failed = await check({ authenticated: false, user: null }, '?auth_error=Login%20failed');
  assert.ok(failed.calls.includes('Login failed'));
  console.log('Landing and authenticated dashboard flow passed');
})().catch(err => { console.error(err); process.exitCode = 1; });
