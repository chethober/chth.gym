const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const assert = require('node:assert/strict');
require.extensions['.ts'] = (mod, filename) => {
  mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
  }).outputText, filename);
};
const { renderAppHtml } = require('../src/frontend/html.ts');
const html = renderAppHtml();
for (const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
assert.ok(html.includes('id="first-workout"'));
assert.ok(html.includes('جلسه قبل:'));
assert.ok(html.includes('showWorkoutRecap(finishedSnapshot)'));
const { escapeHtml } = require('../src/frontend/publicPrograms.ts');
assert.equal(escapeHtml('<script>"&'), '&lt;script&gt;&quot;&amp;');
const app = require('../src/index.ts').default;
(async () => {
  const list = await app.request('https://example.com/programs');
  assert.equal(list.status, 200);
  assert.ok((await list.text()).includes('href="/programs/preset_general_health_fitness"'));
  const page = await app.request('https://example.com/programs/preset_general_health_fitness');
  assert.equal(page.status, 200);
  const body = await page.text();
  assert.ok(body.includes('rel="canonical" href="https://example.com/programs/preset_general_health_fitness"'));
  assert.ok(body.includes('href="/?preset=preset_general_health_fitness"'));
  assert.ok(body.includes('راهنمای پرس سینه با دمبل'));
  assert.equal((await app.request('https://example.com/programs/missing')).status, 404);
  const sitemap = await app.request('https://example.com/sitemap.xml');
  assert.match(sitemap.headers.get('content-type'), /application\/xml/);
  assert.ok((await sitemap.text()).includes('<loc>https://example.com/programs/preset_general_health_fitness</loc>'));
  const robots = await app.request('https://example.com/robots.txt');
  assert.ok((await robots.text()).includes('Sitemap: https://example.com/sitemap.xml'));
  console.log('Rendered scripts and public program routes passed');
})().catch(e => { console.error(e); process.exitCode = 1; });
