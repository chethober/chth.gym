// Every Persian string in the gym's UI and preset programs needs English, Arabic, Russian and
// Spanish in src/i18n/catalog.json (numbers may differ: "۳ جلسه" is covered by "۲ جلسه").
// When this fails, add the listed strings to the catalog.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { makeTranslator } from '../src/i18n/core.js';

const catalog = JSON.parse(readFileSync(new URL('../src/i18n/catalog.json', import.meta.url), 'utf8'));
const files = [
  ...readdirSync('src/frontend').map((f) => `src/frontend/${f}`),
  ...readdirSync('src/routes').map((f) => `src/routes/${f}`),
  'src/index.ts', 'src/data/preloadedWorkouts.ts',
];
const NUM = /[0-9۰-۹]+(?:[.,٫٬][0-9۰-۹]+)*/g;
const norm = (s) => s.replace(NUM, '#');
const known = new Set(Object.keys(catalog).map(norm));
const missing = new Set();
for (const file of files) {
  let src = readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  src = src.split('\n').filter((l) => !l.trim().startsWith('//')).join('\n').replace(/\s\/\/[^\n'"`]*$/gm, '');
  for (const m of src.matchAll(/[؀-ۿ‌«][^<>"'`{}$\n\\]*/g)) {
    const t = m[0].replace(/\s+/g, ' ').trim().replace(/^[ ·،:|–-]+|[ ·،:|–-]+$/g, '').trim();
    if (!/[\u0621-\u064A\u067E-\u06D3]{2,}/.test(t)) continue; // needs letters, not just digits
    if (!known.has(norm(t))) missing.add(`${t}   (${file})`);
  }
}
assert.equal(missing.size, 0, `Untranslated strings:\n${[...missing].join('\n')}`);

for (const [fa, row] of Object.entries(catalog)) {
  assert.equal(row.length, 4, fa);
  row.forEach((text, i) => assert.ok(text && text.trim(), `${fa} is missing ${['en', 'ar', 'ru', 'es'][i]}`));
}

const en = makeTranslator(Object.fromEntries(Object.entries(catalog).map(([k, v]) => [k, v[0]])), 'en');
assert.equal(en.translate('  استریک: ۱۲ روز '), '  Streak: 12 days ');
assert.equal(en.translate('۳ جلسه'), '3 sessions');
assert.equal(en.translate('۵ ست، ۴۵ دقیقه'), '5 sets, 45 min');
assert.equal(en.translate('Already English'), null);
const ar = makeTranslator({ 'حجم کل': 'الحجم الكلي' }, 'ar');
assert.equal(ar.translate('حجم کل ۱۲۰'), 'الحجم الكلي ١٢٠');
console.log(`i18n: ${Object.keys(catalog).length} strings in 5 languages, every UI string covered`);
