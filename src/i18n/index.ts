// Five languages for the gym. The app is written in Persian; catalog.json maps every Persian UI
// string to English, Arabic, Russian and Spanish. Pages are translated on the server before
// they're sent (no flash of Persian), and the browser script below translates whatever the app
// renders afterwards: toasts, lists, charts, dialogs.

import { LOCALES, dirOf, isLocale, localeCookie, localeFromCookie } from '../chth-kit/locales.js';
import type { Locale } from '../chth-kit/locales.js';
import { footerHtml } from '../chth-kit/footer.js';
import { BRAND_CSS, LOGO_SVG } from '../chth-kit/brand.js';
import { makeTranslator } from './core.js';
import catalog from './catalog.json';

export type { Locale };

const COLUMN: Record<Exclude<Locale, 'fa'>, number> = { en: 0, ar: 1, ru: 2, es: 3 };
const CATALOG = catalog as unknown as Record<string, [string, string, string, string]>;
const SOURCE_URL = 'https://github.com/chethober/chth.gym';

const ENTITIES: Record<string, string> = { '&lt;': '<', '&gt;': '>', '&amp;': '&', '&quot;': '"', '&#39;': "'" };
const decode = (s: string) => s.replace(/&(lt|gt|amp|quot|#39);/g, (m) => ENTITIES[m]);

const dicts = new Map<Locale, Record<string, string>>();
/** Persian → translation for one locale; keys with HTML entities also match decoded. */
export function dictFor(locale: Locale): Record<string, string> {
  if (locale === 'fa') return {};
  let dict = dicts.get(locale);
  if (!dict) {
    dict = {};
    for (const [fa, row] of Object.entries(CATALOG)) {
      const text = row[COLUMN[locale]];
      if (!text) continue;
      dict[fa] = text;
      if (/&(lt|gt|amp|quot|#39);/.test(fa)) dict[decode(fa)] = decode(text);
    }
    dicts.set(locale, dict);
  }
  return dict;
}

/**
 * The visitor's language: ?lang= (remembered in the chth_lang cookie), then the cookie, then the
 * browser's languages. Persian is the fallback, and any browser that lists Persian gets it,
 * since most of the gym's users are Persian speakers.
 */
export function resolveLocale(req: Request): { locale: Locale; setCookie?: string } {
  const url = new URL(req.url);
  const param = url.searchParams.get('lang');
  if (isLocale(param)) return { locale: param, setCookie: localeCookie(param) };
  const cookie = localeFromCookie(req.headers.get('Cookie'));
  if (cookie) return { locale: cookie };
  const accept = (req.headers.get('Accept-Language') ?? '').toLowerCase();
  const langs = accept.split(',').map((p) => p.split(';')[0].trim().split('-')[0]).filter(Boolean);
  if (langs.includes('fa')) return { locale: 'fa' };
  const first = langs.find((l) => isLocale(l));
  return { locale: (first as Locale | undefined) ?? 'fa' };
}

const TEXT_ATTRS = /\b(placeholder|title|aria-label|alt|content|data-tooltip)="([^"]*)"/g;

/** Translates an HTML page's text and text attributes, leaving scripts and styles alone. */
export function localizeHtml(html: string, locale: Locale): string {
  if (locale === 'fa') return html;
  const { translate } = makeTranslator(dictFor(locale), locale);
  return html.split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>)/i).map((part, i) => {
    if (i % 2 === 1) return part;
    return part
      .replace(/>([^<>]+)</g, (m, text: string) => {
        const out = translate(text);
        return out == null ? m : `>${out}<`;
      })
      .replace(TEXT_ATTRS, (m, name: string, value: string) => {
        const out = translate(value);
        return out == null ? m : `${name}="${out.replace(/"/g, '&quot;')}"`;
      });
  }).join('');
}

/** The language links: the current page with ?lang=. */
export function languageSwitcher(locale: Locale): string {
  const label = { en: 'Language', fa: 'زبان', ar: 'اللغة', ru: 'Язык', es: 'Idioma' }[locale];
  return `<nav class="chth-footer__langs chth-lang" aria-label="${label}">${LOCALES.map((l) =>
    `<a href="?lang=${l.code}" hreflang="${l.code}" lang="${l.code}"${l.code === locale ? ' aria-current="true"' : ''}>${l.native}</a>`).join('')}</nav>`;
}

// LTR pages: the app's few physical left/right classes were written for RTL, so mirror them.
const LTR_FIXES = `html[dir="ltr"] .text-left{text-align:right}html[dir="ltr"] .text-right{text-align:left}
html[dir="ltr"] .ml-1{margin-left:0;margin-right:.25rem}html[dir="ltr"] .mr-1{margin-right:0;margin-left:.25rem}
html[dir="ltr"] .left-2{left:auto;right:.5rem}html[dir="ltr"] .right-2{right:auto;left:.5rem}
.chth-lang{justify-content:center;margin:.5rem 0}.chth-lang a{text-decoration:none;color:inherit}`;

/**
 * The browser side: translates text the app adds later (MutationObserver), dialogs, and number
 * and date formatting written for fa-IR; and shows exercise names in English where the API
 * has them.
 */
export function clientScript(locale: Locale): string {
  if (locale === 'fa') return '';
  const dict = JSON.stringify(dictFor(locale)).replace(/</g, '\\u003c');
  const tag = { en: 'en-US', ar: 'ar', ru: 'ru-RU', es: 'es-ES' }[locale];
  return `<script>
(function () {
  var LOCALE = ${JSON.stringify(locale)}, TAG = ${JSON.stringify(tag)};
  // Bundlers may wrap named functions in __name(); the translator's source below can carry it.
  var __name = function (f) { return f; };
  var t = (${makeTranslator.toString()})(${dict}, LOCALE);
  window.chthTranslate = t.translate;

  // Formatting written for Persian (fa-IR, Solar Hijri) follows the chosen language instead.
  var fix = function (loc) { return typeof loc === 'string' && /^fa/i.test(loc) ? TAG : loc; };
  var fixOpts = function (o) { if (o && o.calendar === 'persian') { o = Object.assign({}, o); delete o.calendar; } return o; };
  ['toLocaleString', 'toLocaleDateString', 'toLocaleTimeString'].forEach(function (m) {
    var d = Date.prototype[m];
    Date.prototype[m] = function (loc, o) { return d.call(this, fix(loc), fixOpts(o)); };
  });
  var n = Number.prototype.toLocaleString;
  Number.prototype.toLocaleString = function (loc, o) { return n.call(this, fix(loc), o); };
  var DTF = Intl.DateTimeFormat, NF = Intl.NumberFormat;
  Intl.DateTimeFormat = function (loc, o) { return new DTF(fix(loc), fixOpts(o)); };
  Intl.DateTimeFormat.prototype = DTF.prototype; Intl.DateTimeFormat.supportedLocalesOf = DTF.supportedLocalesOf;
  Intl.NumberFormat = function (loc, o) { return new NF(fix(loc), o); };
  Intl.NumberFormat.prototype = NF.prototype; Intl.NumberFormat.supportedLocalesOf = NF.supportedLocalesOf;

  // Dialogs.
  ['alert', 'confirm', 'prompt'].forEach(function (m) {
    var f = window[m];
    window[m] = function (msg) { var a = [].slice.call(arguments); a[0] = t.translate(String(msg)) || msg; return f.apply(window, a); };
  });

  // API data: exercise names and guides in English where the library has them.
  var PAIRS = [['name_fa', 'name_en'], ['exercise_name_fa', 'exercise_name_en'], ['instructions_fa', 'instructions_en'], ['title', 'title_en']];
  function swap(v, depth) {
    if (!v || typeof v !== 'object' || depth > 8) return v;
    if (Array.isArray(v)) { v.forEach(function (x) { swap(x, depth + 1); }); return v; }
    PAIRS.forEach(function (p) {
      if (typeof v[p[1]] === 'string' && v[p[1]].trim() && typeof v[p[0]] === 'string') {
        v[p[0]] = v[p[1]];
        if (p[0] !== 'instructions_fa' && p[0] !== 'title') v[p[1]] = '';
      }
    });
    for (var k in v) if (v[k] && typeof v[k] === 'object') swap(v[k], depth + 1);
    return v;
  }
  var json = Response.prototype.json;
  Response.prototype.json = function () {
    var url = this.url || '';
    return json.call(this).then(function (d) { return url.indexOf('/api/') >= 0 ? swap(d, 0) : d; });
  };

  // Text the app adds or changes.
  var ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'data-tooltip'];
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1 };
  function skip(el) { return !el || SKIP[el.nodeName] || (el.closest && el.closest('[translate="no"],[contenteditable="true"]')); }
  function text(node) {
    if (skip(node.parentNode)) return;
    var out = t.translate(node.nodeValue);
    if (out != null && out !== node.nodeValue) node.nodeValue = out;
  }
  function attrs(el) {
    if (skip(el)) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var v = el.getAttribute(ATTRS[i]);
      if (v) { var out = t.translate(v); if (out != null && out !== v) el.setAttribute(ATTRS[i], out); }
    }
    if (el.nodeName === 'INPUT' && /^(button|submit)$/.test(el.type) && el.value) {
      var o = t.translate(el.value); if (o != null) el.value = o;
    }
  }
  function walk(root) {
    if (root.nodeType === 3) return text(root);
    if (root.nodeType !== 1 || skip(root)) return;
    attrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    for (var node = w.nextNode(); node; node = w.nextNode()) node.nodeType === 3 ? text(node) : attrs(node);
  }
  function start() {
    walk(document.body);
    var title = t.translate(document.title); if (title) document.title = title;
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        if (m.type === 'childList') m.addedNodes.forEach(walk);
        else if (m.type === 'characterData') text(m.target);
        else attrs(m.target);
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
</script>`;
}

/** Brand stylesheet, LTR fixes and the browser translator, for the page's <head>. */
export function headExtras(locale: Locale): string {
  return `<style>${BRAND_CSS}${LTR_FIXES}</style>${clientScript(locale)}`;
}

/** The shared CHTH footer for this locale (other CHTH sites and bots, languages). */
export function chthFooter(locale: Locale): string {
  return footerHtml(locale, 'gym', { sourceUrl: SOURCE_URL, logoSvg: LOGO_SVG });
}

/**
 * Finishes a rendered page for a locale: translated text, <html lang/dir>, the CHTH brand and
 * footer, the language switcher, and the browser translator.
 */
export function finishPage(html: string, locale: Locale): string {
  const page = localizeHtml(html, locale)
    .replace(/<html lang="fa" dir="rtl"/, `<html lang="${locale}" dir="${dirOf(locale)}" data-chth-product="gym"`)
    .replace('</head>', `${headExtras(locale)}\n</head>`)
    .replaceAll('<!--chth-lang-->', languageSwitcher(locale))
    .replaceAll('<!--chth-footer-->', chthFooter(locale));
  // "Forward" arrows point left in the RTL design.
  return dirOf(locale) === 'ltr' ? page.replaceAll('↖', '↗') : page;
}
