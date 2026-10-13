const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const assert = require('node:assert/strict');
require.extensions['.ts'] = (mod, filename) => mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText, filename);
const { renderAppearanceHead } = require('../src/frontend/appearanceUi.ts');
const { ACCENTS } = require('../src/frontend/theme.ts');
const { renderAppHtml } = require('../src/frontend/html.ts');
const { renderPublicPrograms, renderProgramNotFound } = require('../src/frontend/publicPrograms.ts');
function mount(saved = '{}', publicPage = true, blocked = false) {
  const listeners = {};
  const attrs = {};
  const observers = [];
  const landing = {hidden:false};
  let light = false;
  const icon = {isConnected:true,removeAttribute(){}};
  let removedExtraIcon = false;
  const localStorage = {getItem(){if(blocked)throw Error('blocked');return saved;}};
  const ctx = {localStorage,encodeURIComponent,document:{getElementById(){return publicPage ? null : landing;},documentElement:{setAttribute(key,value){attrs[key]=value;},getAttribute(key){return attrs[key];},classList:{contains(name){return name==='light' && light;}}},querySelectorAll(){return [icon,{remove(){removedExtraIcon=true;}}];},head:{appendChild(){}},createElement(){return icon;}},window:{addEventListener(name,fn){listeners[name]=fn;}},MutationObserver:class{constructor(fn){observers.push(fn);}observe(){}}};
  const script = renderAppearanceHead(publicPage).match(/<script>([\s\S]*?)<\/script>/)[1];
  vm.runInNewContext(script,ctx);
  listeners.DOMContentLoaded();
  return {attrs,icon,landing,listeners,light(value){light=value;},sync(){observers.forEach(fn=>fn());},store(value){saved=value;},removedExtraIcon:()=>removedExtraIcon};
}
for(const accent of ACCENTS){
  const page = mount(JSON.stringify({accent:accent.id,text:'lg',radius:'lg',motion:'reduce'}));
  assert.equal(page.attrs['data-accent'],accent.id);
  assert.equal(page.attrs['data-motion'],'reduce');
  assert.equal(page.attrs['data-text'],'lg');
  assert.equal(page.attrs['data-radius'],'md'); // Invalid saved value falls back to the shared default.
  assert.ok(decodeURIComponent(page.icon.href).includes(`fill="${accent.dark.accent}"`));
  assert.equal(page.icon.type,'image/svg+xml');
  assert.ok(page.removedExtraIcon());
  // Profile selection changes the root attribute; the shared observer updates the favicon.
  const app = mount('{}',false);
  app.attrs['data-accent']=accent.id;
  app.sync();
  assert.ok(decodeURIComponent(app.icon.href).includes(`fill="${accent.dark.accent}"`));
  app.light(true);
  app.sync();
  assert.ok(decodeURIComponent(app.icon.href).includes(`fill="${accent.dark.accent}"`));
  app.landing.hidden=true;
  app.sync();
  assert.ok(decodeURIComponent(app.icon.href).includes(`fill="${accent.light.accent}"`));
}
for(const saved of ['invalid JSON','null','{"accent":"unknown"}'])assert.equal(mount(saved).attrs['data-accent'],'ember');
assert.equal(mount('{}',true,true).attrs['data-accent'],'ember');
assert.equal(mount('{}').attrs['data-motion'],'full');
const page = mount('{"accent":"violet"}');
page.store('{"accent":"azure","radius":"sharp","motion":"reduce"}');
page.listeners.storage({key:'jesm_prefs'});
assert.equal(page.attrs['data-accent'],'azure');
assert.equal(page.attrs['data-radius'],'sharp');
assert.equal(page.attrs['data-motion'],'reduce');
assert.ok(decodeURIComponent(page.icon.href).includes('fill="#4C9AFF"'));
const html=renderAppHtml();
const landing=html.slice(html.indexOf('<div id="landing-page">'),html.indexOf('<div id="dashboard-shell"'));
assert.ok(!landing.includes('data-swatch') && !landing.includes('public-appearance'));
assert.ok(html.includes('data-swatch="lime" onclick="setPref(\'accent\', \'lime\')"'));
for(const publicHtml of [renderPublicPrograms('https://example.com'),renderProgramNotFound('https://example.com')]){
  assert.ok(!publicHtml.includes('public-appearance'));
  for(const match of publicHtml.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(match[1]);
}
console.log('Appearance settings placement, saved palette, favicon sync, and unavailable-storage checks passed');
