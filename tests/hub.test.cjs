// The gym's side of the CHTH hub: signed /internal/stats (with the marketing numbers),
// the banner set through /internal/announcement, and ?ref= tags kept for sign-ups.
const fs = require('node:fs');
const ts = require('typescript');
const assert = require('node:assert/strict');
require.extensions['.ts'] = (mod, filename) => {
  mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
  }).outputText, filename);
};
const app = require('../src/index.ts').default;
const { refFromCookie, bannerHtml } = require('../src/hub.ts');

const SECRET = 'h'.repeat(32);
const kv = new Map();
const KV_SESSIONS = {
  get: async (k) => kv.get(k) ?? null,
  put: async (k, v) => { kv.set(k, v); },
  delete: async (k) => { kv.delete(k); },
};
// A D1 stand-in: every count is 3, every list is empty.
const DB = {
  prepare: (sql) => ({
    sql,
    first: async () => ({ n: 3 }),
    all: async () => ({ results: [] }),
    bind() { return this; },
  }),
};
const hubCalls = [];
const HUB = { fetch: async (url, init) => { hubCalls.push({ url: String(url), init }); return new Response('{"ok":true}'); } };
const env = { DB, KV_SESSIONS, HUB, HUB_SECRET: SECRET };
const ctx = { waitUntil: () => {}, passThroughOnException: () => {} };

(async () => {
  const { signedHeaders, verifySigned } = await import('../src/chth-kit/hub.js');
  const signed = async (method, url, payload, secret = SECRET) => {
    const body = payload === undefined ? '' : JSON.stringify(payload);
    return app.request(url, { method, headers: await signedHeaders({ source: 'hub', secret, method, url, body }), body: body || undefined }, env, ctx);
  };

  // Stats: refused without a valid signature, and carry the marketing block.
  assert.equal((await app.request('https://gym.test/internal/stats', {}, env, ctx)).status, 403);
  assert.equal((await signed('GET', 'https://gym.test/internal/stats', undefined, 'x'.repeat(32))).status, 403);
  const stats = await (await signed('GET', 'https://gym.test/internal/stats')).json();
  assert.equal(stats.users, 3);
  assert.equal(stats.marketing.signupsByDay.length, 14);
  assert.deepEqual(stats.marketing.activation, { signedUp30d: 3, trained30d: 3 });
  assert.deepEqual(stats.marketing.retention, { cohort: 3, returned: 3 });
  assert.equal(stats.marketing.announcement, null);

  // The banner: refused unsigned or with a bad link, then set, shown on pages, and cleared.
  assert.equal((await app.request('https://gym.test/internal/announcement', { method: 'POST', body: '{"text":"x"}' }, env, ctx)).status, 403);
  assert.equal((await signed('POST', 'https://gym.test/internal/announcement', { text: 'Hi', url: 'javascript:alert(1)' })).status, 400);
  const set = await (await signed('POST', 'https://gym.test/internal/announcement', { text: 'New <program>', url: 'https://gym.test/programs' })).json();
  assert.deepEqual(set, { ok: true, announcement: { text: 'New <program>', url: 'https://gym.test/programs' } });
  const programs = await (await app.request('https://gym.test/programs', {}, env, ctx)).text();
  assert.match(programs, /<body[^>]*><div id="chth-banner"/);
  assert.ok(programs.includes('New &lt;program&gt;') && !programs.includes('New <program>'));
  assert.equal((await (await signed('GET', 'https://gym.test/internal/stats')).json()).marketing.announcement.text, 'New <program>');
  await signed('POST', 'https://gym.test/internal/announcement', { text: '' });
  assert.ok(!(await (await app.request('https://gym.test/programs', {}, env, ctx)).text()).includes('chth-banner'));
  assert.equal(bannerHtml(null), '');

  // ?ref= is reported through the hub binding (signed) and remembered for a later sign-up.
  const tagged = await app.request('https://gym.test/programs?ref=insta_nov', {}, env, ctx);
  assert.match(tagged.headers.get('set-cookie') ?? '', /chth_ref=insta_nov; Path=\/; Max-Age=2592000/);
  await new Promise((r) => setTimeout(r, 50));
  const call = hubCalls.at(-1);
  assert.equal(new URL(call.url).pathname, '/ingest');
  const req = new Request(call.url, call.init);
  const ok = await verifySigned(req, (s) => (s === 'gym' ? SECRET : null));
  assert.ok(ok, 'the visit is signed with HUB_SECRET');
  assert.equal(JSON.parse(ok.body).events[0].data.ref, 'insta_nov');
  assert.equal(refFromCookie('a=1; chth_ref=insta_nov; b=2'), 'insta_nov');
  assert.equal(refFromCookie('chth_ref=bad%20tag'), undefined);
  assert.equal(refFromCookie(undefined), undefined);
  // Bad tags are ignored.
  assert.equal((await app.request('https://gym.test/programs?ref=bad tag!', {}, env, ctx)).headers.get('set-cookie'), null);

  console.log('Hub stats, banner and campaign tag checks passed');
})().catch((e) => { console.error(e); process.exitCode = 1; });
