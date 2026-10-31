// The translator shared by the server (pages are translated before they're sent) and the
// browser (text the app adds later is translated as it appears). Persian is the source
// language: the catalog maps each Persian UI string to its translation.
//
// This function must stay self-contained (no outside references): the browser gets its source
// via makeTranslator.toString().

/**
 * @param {Record<string, string>} dict  Persian text → translation, for one locale
 * @param {string} locale                en, ar, ru or es
 */
export function makeTranslator(dict, locale) {
  var PERSIAN = /[؀-ۿ]/;
  var NUM = /[0-9۰-۹٠-٩]+(?:[.,٫٬][0-9۰-۹٠-٩]+)*/g;
  // Letters only: Persian punctuation (، ؛ ؟) counts as a word boundary.
  var LETTER = '\\u0621-\\u064A\\u066E-\\u06D3\\u200C';

  // Strings with numbers also match with any numbers: "۳ جلسه" → "# جلسه" → "# sessions".
  var patterns = {};
  var keys = [];
  for (var k in dict) {
    if (!Object.prototype.hasOwnProperty.call(dict, k)) continue;
    keys.push(k);
    if (/[0-9۰-۹]/.test(k)) patterns[k.replace(NUM, '#')] = dict[k].replace(NUM, '#');
  }
  // Fallback for text built from several pieces ("۳ ست، ۴۵ دقیقه"): translate each known piece,
  // longest first, only where it stands as whole words.
  keys.sort(function (a, b) { return b.length - a.length; });
  var esc = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
  var pieces = keys.filter(function (k) { return k.length > 1 && !/[0-9۰-۹]/.test(k); });
  var pieceRe = pieces.length
    ? new RegExp('(^|[^' + LETTER + '])(' + pieces.map(esc).join('|') + ')(?=$|[^' + LETTER + '])', 'g')
    : null;

  var digits = locale === 'ar' ? '٠١٢٣٤٥٦٧٨٩' : '0123456789';
  function localDigits(s) {
    s = s.replace(/[۰-۹]/g, function (d) { return digits[d.charCodeAt(0) - 0x06F0]; });
    if (locale !== 'ar') {
      s = s.replace(/[٠-٩]/g, function (d) { return digits[d.charCodeAt(0) - 0x0660]; })
        .replace(/٫/g, '.').replace(/٬/g, ',')
        .replace(/،/g, ',').replace(/؛/g, ';').replace(/؟/g, '?');
    } else {
      s = s.replace(/[0-9]/g, function (d) { return digits[+d]; });
    }
    return s;
  }

  /** The translation of one piece of text, keeping its surrounding spaces; null if unchanged. */
  function translate(text) {
    if (text == null || !PERSIAN.test(text) && !/[۰-۹]/.test(text)) return null;
    var lead = /^\s*/.exec(text)[0];
    var trail = /\s*$/.exec(text)[0];
    var core = text.slice(lead.length, text.length - trail.length).replace(/\s+/g, ' ');
    var out = Object.prototype.hasOwnProperty.call(dict, core) ? dict[core] : null;
    if (out == null) {
      var nums = [];
      var tpl = patterns[core.replace(NUM, function (m) { nums.push(m); return '#'; })];
      if (tpl != null) { var i = 0; out = tpl.replace(/#/g, function () { return nums[i++] || ''; }); }
    }
    if (out == null && pieceRe) out = core.replace(pieceRe, function (_, before, piece) { return before + dict[piece]; });
    out = localDigits(out == null ? core : out);
    return out === core && lead + core + trail === text ? null : lead + out + trail;
  }

  return { translate: translate, localDigits: localDigits };
}
