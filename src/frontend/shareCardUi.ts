// The image a finished workout is shared as: a summary card (date, title, exercises, body map) or a
// stats card (volume, time, sets, body map), drawn on a canvas from the CHTH kit's tokens.
import { BRAND, productTheme } from '../chth-kit/brand.js';
import { buttonHtml, copyButtonHtml, switchHtml } from '../chth-kit/controls.js';
import { ICON } from '../chth-kit/html.js';
import { BRAND_MARK_SVG } from './components';

const DOWNLOAD_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>';

// Kit sizes are named by their px at the default text size; the card is laid out at half size and drawn at 2x.
const SCALE = 2;
const px = (rem: string) => Math.round(parseFloat(rem) * 16 * SCALE);
const gym = productTheme('gym');

// The kit's line colour laid over ink, as one opaque colour, so overlapping body paths don't stack up
function over(rgba: string, hex: string): string {
  const [r, g, b, a = 1] = (rgba.match(/[\d.]+/g) || []).map(Number);
  const base = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  return '#' + [r, g, b].map((c, i) => Math.round(c * a + base[i] * (1 - a)).toString(16).padStart(2, '0')).join('');
}

const CARD = {
  width: 1080,
  height: 1350,
  color: {
    bg: BRAND.color.ink,
    text: BRAND.color.paper,
    muted: BRAND.color.muted,
    muscle: over(BRAND.color.line, BRAND.color.ink),
    primary: gym.accent,
  },
  font: BRAND.font.rtl,
  text: Object.fromEntries(Object.entries(BRAND.text).map(([k, v]) => [k, px(v)])) as Record<string, number>,
  space: Object.fromEntries(Object.entries(BRAND.space).map(([k, v]) => [k, px(v)])) as Record<string, number>,
  mark: BRAND_MARK_SVG
    .replace(/ class="brand-mark"/, ' xmlns="http://www.w3.org/2000/svg"')
    .replace(/ aria-hidden="true"/, '')
    .replace('fill="currentColor"', `fill="${gym.accent}"`)
    .replace('fill="var(--on-accent)"', `fill="${gym.onAccent}"`),
};

// Goes inside the finished-workout recap (activationUi), under its summary line.
export function renderShareCardSection(): string {
  return `<div class="share-card space-y-3">
    <div class="share-card__preview"><img id="share-card-img" alt="پیش‌نمایش تصویر اشتراک تمرین" width="1080" height="1350"></div>
    <div class="chth-seg w-full" role="radiogroup" aria-label="قالب تصویر" data-chth-seg><span class="chth-seg__thumb" aria-hidden="true"></span>
      <button type="button" role="radio" aria-checked="true" data-share-layout="summary" class="chth-seg__item is-active flex-1">خلاصه</button>
      <button type="button" role="radio" aria-checked="false" data-share-layout="stats" class="chth-seg__item flex-1">آمار</button>
    </div>
    <div>
      ${switchHtml({ id: 'share-card-map', label: 'نمایش نقشه عضلات', checked: true })}
      ${switchHtml({ id: 'share-card-volume', label: 'نمایش حجم تمرین', checked: true })}
    </div>
    <div class="flex flex-wrap gap-2">
      ${buttonHtml({ label: 'اشتراک‌گذاری', variant: 'primary', icon: ICON.share, attrs: { onclick: 'shareWorkoutResult()' } })}
      ${buttonHtml({ label: 'ذخیره تصویر', variant: 'secondary', icon: DOWNLOAD_ICON, attrs: { onclick: 'saveWorkoutImage()' } })}
      ${copyButtonHtml('fa', { from: '#workout-recap-text', label: 'کپی متن', variant: 'ghost', size: 'md' })}
    </div>
  </div>`;
}

export function renderShareCardScript(): string {
  return `
    const SHARE_CARD = ${JSON.stringify(CARD)};
    let shareCardSession = null;
    let shareCardBlob = null;
    let shareCardUrl = '';
    let shareCardRender = 0;

    // The card is laid out right to left; in an LTR language every x is mirrored (text, boxes), never the glyphs
    let shareCardRtl = true;
    const shareTx = x => shareCardRtl ? x : SHARE_CARD.width - x;
    const shareBx = (x, w) => shareCardRtl ? x : SHARE_CARD.width - x - w;
    const shareAlign = a => shareCardRtl || a === 'center' ? a : (a === 'right' ? 'left' : 'right');
    // Canvas text never reaches the page translator, so the card asks it directly
    const shareTr = text => (window.chthTranslate && window.chthTranslate(text)) || text;

    function shareCardNumber(n) { return Math.round(Number(n) || 0).toLocaleString('fa-IR'); }

    function shareCardData(session) {
      const logs = session.set_logs || [];
      const byId = new Map();
      logs.forEach(log => {
        if (!byId.has(log.exercise_id)) {
          const ex = (typeof exercisesCache !== 'undefined' ? exercisesCache : []).find(e => e.id === log.exercise_id) || {};
          byId.set(log.exercise_id, { name: shareTr(log.exercise_name_fa || ex.name_fa || 'حرکت تمرینی'), sets: 0, ex });
        }
        byId.get(log.exercise_id).sets++;
      });
      const exercises = [...byId.values()];
      const muscles = {};
      exercises.forEach(({ ex }) => {
        splitMuscles(ex.muscles_secondary).forEach(m => { if (!muscles[m]) muscles[m] = 'secondary'; });
        splitMuscles(ex.muscles_primary).forEach(m => { muscles[m] = 'primary'; });
      });
      const start = new Date(session.start_time);
      const seconds = session.duration_seconds || Math.max(0, Math.floor((Date.now() - start.getTime()) / 1000));
      const minutes = Math.round(seconds / 60);
      return {
        title: shareTr(session.title || 'تمرین امروز'),
        date: start.toLocaleDateString('fa-IR-u-ca-persian', { day: 'numeric', month: 'long', year: 'numeric' }),
        volume: shareCardNumber(session.total_volume_kg),
        sets: shareCardNumber(logs.length),
        exerciseCount: shareCardNumber(exercises.length),
        hours: Math.floor(minutes / 60),
        minutes,
        exercises,
        muscles
      };
    }

    function shareCardDuration(d) {
      const min = shareTr('دقیقه'), hr = shareTr('ساعت');
      if (d.hours < 1) return { long: shareCardNumber(d.minutes) + ' ' + min, value: shareCardNumber(d.minutes), unit: min };
      const mm = (d.minutes % 60).toLocaleString('fa-IR', { minimumIntegerDigits: 2 });
      const long = shareCardNumber(d.hours) + ' ' + hr + (d.minutes % 60 ? ' ' + shareCardNumber(d.minutes % 60) + ' ' + min : '');
      return { long, value: shareCardNumber(d.hours) + ':' + mm, unit: hr };
    }

    function shareCardFont(size, weight) { return (weight || 400) + ' ' + size + 'px ' + SHARE_CARD.font; }

    // Trims text to maxWidth with an ellipsis
    function shareCardFit(ctx, text, maxWidth) {
      if (ctx.measureText(text).width <= maxWidth) return text;
      let t = text;
      while (t.length > 1 && ctx.measureText(t + '…').width > maxWidth) t = t.slice(0, -1);
      return t.trim() + '…';
    }

    // Draws one view of the body map (BODY_PATHS, the app's muscle outlines) into a box, top-centred
    function drawShareCardBody(ctx, view, x, y, w, h, muscles) {
      const [vx, vy, vw, vh] = BODY_PATHS[view].viewBox.split(' ').map(Number);
      const s = Math.min(w / vw, h / vh);
      ctx.save();
      ctx.translate(x + (w - vw * s) / 2, y);
      ctx.scale(s, s);
      ctx.translate(-vx, -vy);
      ctx.fillStyle = SHARE_CARD.color.muscle;
      BODY_PATHS[view].outline.forEach(d => ctx.fill(new Path2D(d)));
      ctx.strokeStyle = SHARE_CARD.color.bg;
      ctx.lineWidth = 3;
      Object.entries(BODY_PATHS[view].muscles).forEach(([slug, paths]) => {
        const state = muscles[slug];
        paths.forEach(d => {
          const p = new Path2D(d);
          ctx.fillStyle = SHARE_CARD.color.muscle;
          ctx.fill(p);
          if (state) {
            ctx.globalAlpha = state === 'secondary' ? 0.45 : 1;
            ctx.fillStyle = SHARE_CARD.color.primary;
            ctx.fill(p);
            ctx.globalAlpha = 1;
          }
          ctx.stroke(p);
        });
      });
      ctx.restore();
      return vh * s;
    }

    function shareCardBodyHeight(view, w) {
      const [, , vw, vh] = BODY_PATHS[view].viewBox.split(' ').map(Number);
      return vh * (w / vw);
    }

    function loadShareCardMark() {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(SHARE_CARD.mark);
      });
    }

    // The app's mark and name, centred on cx or ending at the right edge
    function drawShareCardBrand(ctx, mark, right, baseline, centred) {
      const T = SHARE_CARD.text, S = SHARE_CARD.space;
      const size = S['32'] || 64;
      ctx.font = shareCardFont(T['22'], 800);
      const name = shareTr('جسم و اندیشه');
      const width = size + S['10'] + ctx.measureText(name).width;
      const x = centred ? right + width / 2 : right;
      if (mark) ctx.drawImage(mark, shareBx(x - size, size), baseline - size * 0.82, size, size);
      ctx.fillStyle = SHARE_CARD.color.text;
      ctx.textAlign = shareAlign('right');
      ctx.fillText(name, shareTx(x - size - S['10']), baseline);
    }

    function drawSummaryCard(ctx, d, opts, mark) {
      const W = SHARE_CARD.width, H = SHARE_CARD.height, T = SHARE_CARD.text, S = SHARE_CARD.space;
      const padX = S['32'], padTop = S['36'], padBottom = S['30'];
      const bodyW = opts.map ? 300 : 0;
      const gap = opts.map ? S['16'] : 0;
      const right = W - padX;
      const textW = W - padX * 2 - bodyW - gap;
      const brandBaseline = H - padBottom - S['6'];
      ctx.textAlign = shareAlign('right');

      let y = padTop + T['15'];
      ctx.fillStyle = SHARE_CARD.color.muted;
      ctx.font = shareCardFont(T['15']);
      ctx.fillText(d.date, shareTx(right), y);

      y += S['64'] + T['32'];
      ctx.fillStyle = SHARE_CARD.color.text;
      ctx.font = shareCardFont(T['32'], 800);
      ctx.fillText(shareCardFit(ctx, d.title, textW), shareTx(right), y);

      y += S['8'] + T['16'];
      ctx.fillStyle = SHARE_CARD.color.muted;
      ctx.font = shareCardFont(T['16']);
      const duration = shareCardDuration(d).long;
      ctx.fillText(opts.volume ? d.volume + ' ' + shareTr('کیلوگرم') + ' | ' + duration : duration, shareTx(right), y, textW);

      // Exercise lines until the brand row; the rest become "+N حرکت دیگر"
      const lineH = T['17'] + S['12'] + S['6'];
      const listTop = y + S['36'];
      const room = Math.floor((brandBaseline - S['48'] - listTop) / lineH);
      const shown = d.exercises.length > room ? Math.max(0, room - 1) : d.exercises.length;
      y = listTop;
      d.exercises.slice(0, shown).forEach(ex => {
        y += lineH;
        const count = shareCardNumber(ex.sets) + ' ×';
        ctx.font = shareCardFont(T['17'], 700);
        ctx.fillStyle = SHARE_CARD.color.primary;
        ctx.fillText(count, shareTx(right), y);
        const cw = ctx.measureText(count).width + S['10'];
        ctx.font = shareCardFont(T['17']);
        ctx.fillStyle = SHARE_CARD.color.text;
        ctx.fillText(shareCardFit(ctx, ex.name, textW - cw), shareTx(right - cw), y);
      });
      if (shown < d.exercises.length) {
        y += lineH;
        ctx.font = shareCardFont(T['17']);
        ctx.fillStyle = SHARE_CARD.color.muted;
        ctx.fillText('+' + shareCardNumber(d.exercises.length - shown) + ' ' + shareTr('حرکت دیگر'), shareTx(right), y);
      }

      drawShareCardBrand(ctx, mark, right, brandBaseline, false);

      if (opts.map) {
        const bodyGap = S['22'];
        const total = shareCardBodyHeight('front', bodyW) + bodyGap + shareCardBodyHeight('back', bodyW);
        const room = H - padTop - padBottom;
        const w = total > room ? bodyW * room / total : bodyW;
        const h1 = shareCardBodyHeight('front', w);
        const top = padTop + (room - (h1 + bodyGap + shareCardBodyHeight('back', w))) / 2;
        drawShareCardBody(ctx, 'front', shareBx(padX + (bodyW - w) / 2, w), top, w, h1, d.muscles);
        drawShareCardBody(ctx, 'back', shareBx(padX + (bodyW - w) / 2, w), top + h1 + bodyGap, w, shareCardBodyHeight('back', w), d.muscles);
      }
    }

    function drawStatsCard(ctx, d, opts, mark) {
      const W = SHARE_CARD.width, H = SHARE_CARD.height, T = SHARE_CARD.text, S = SHARE_CARD.space;
      const cx = W / 2;
      const padBottom = S['30'];
      const duration = shareCardDuration(d);
      ctx.textAlign = 'center';

      const label = (text, y) => { ctx.font = shareCardFont(T['16']); ctx.fillStyle = SHARE_CARD.color.muted; ctx.fillText(shareTr(text), cx, y); };
      // A number with its unit after it, centred as one
      const figure = (value, unit, x, y, size) => {
        ctx.fillStyle = SHARE_CARD.color.text;
        ctx.font = shareCardFont(size, 800);
        const vw = ctx.measureText(value).width;
        ctx.font = shareCardFont(Math.round(size * 0.6), 800);
        const uw = unit ? ctx.measureText(unit).width + S['8'] : 0;
        const start = x + (vw + uw) / 2;
        ctx.textAlign = shareAlign('right');
        ctx.font = shareCardFont(size, 800);
        ctx.fillText(value, shareTx(start), y);
        if (unit) { ctx.font = shareCardFont(Math.round(size * 0.6), 800); ctx.fillText(unit, shareTx(start - vw - S['8']), y); }
        ctx.textAlign = 'center';
      };

      const stats = [['مدت', duration.value, duration.unit], ['ست‌ها', d.sets, ''], ['حرکت‌ها', d.exerciseCount, '']];
      const blockH = (opts.volume ? T['16'] + S['6'] + T['40'] + S['24'] : 0) + T['16'] + S['4'] + T['36'];
      let y = (opts.map ? S['40'] : (H - blockH) / 2 - S['32']) + T['16'];
      if (opts.volume) {
        label('حجم تمرین', y);
        y += S['6'] + T['40'];
        figure(d.volume, shareTr('کیلوگرم'), cx, y, T['40']);
        y += S['24'];
      }
      // Three columns, right to left
      const colW = (W - S['32'] * 2) / 3;
      y += T['16'];
      const valueY = y + S['4'] + T['36'];
      stats.forEach(([name, value, unit], i) => {
        const x = W - S['32'] - colW * (i + 0.5);
        ctx.font = shareCardFont(T['16']); ctx.fillStyle = SHARE_CARD.color.muted; ctx.fillText(shareTr(name), shareTx(x), y);
        figure(value, unit, x, valueY, T['36']);
      });
      y = valueY;

      if (opts.map) {
        const top = y + S['30'];
        const legendH = T['13'] + S['14'];
        const h = H - padBottom - S['72'] - legendH - top;
        const front = BODY_PATHS.front.viewBox.split(' ').map(Number);
        const w = h * front[2] / front[3];
        const gap = S['28'];
        drawShareCardBody(ctx, 'front', shareBx(cx + gap / 2, w), top, w, h, d.muscles);
        drawShareCardBody(ctx, 'back', shareBx(cx - gap / 2 - w, w), top, w, h, d.muscles);

        // Legend: main and secondary muscles
        const ly = top + h + S['14'] + T['13'];
        ctx.font = shareCardFont(T['13']);
        const items = [[shareTr('درگیری اصلی'), 1], [shareTr('درگیری فرعی'), 0.45]];
        const sw = T['13'] * 0.8, sg = S['6'], ig = S['18'];
        const widths = items.map(([t]) => sw + sg + ctx.measureText(t).width);
        let x = cx + (widths[0] + widths[1] + ig) / 2;
        ctx.textAlign = shareAlign('right');
        items.forEach(([t, alpha], i) => {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = SHARE_CARD.color.primary;
          ctx.fillRect(shareBx(x - sw, sw), ly - sw, sw, sw);
          ctx.globalAlpha = 1;
          ctx.fillStyle = SHARE_CARD.color.muted;
          ctx.fillText(t, shareTx(x - sw - sg), ly);
          x -= widths[i] + ig;
        });
      }

      drawShareCardBrand(ctx, mark, cx, H - padBottom - S['6'], true);
    }

    function shareCardOptions() {
      return {
        layout: document.querySelector('[data-share-layout][aria-checked="true"]')?.dataset.shareLayout || 'summary',
        map: document.getElementById('share-card-map')?.checked !== false,
        volume: document.getElementById('share-card-volume')?.checked !== false
      };
    }

    async function renderShareCard() {
      if (!shareCardSession) return null;
      const run = ++shareCardRender;
      const opts = shareCardOptions();
      const d = shareCardData(shareCardSession);
      try { await Promise.all([document.fonts.load(shareCardFont(40, 800)), document.fonts.load(shareCardFont(40, 400))]); } catch (e) {}
      const mark = await loadShareCardMark();
      const canvas = document.createElement('canvas');
      canvas.width = SHARE_CARD.width; canvas.height = SHARE_CARD.height;
      const ctx = canvas.getContext('2d');
      shareCardRtl = document.documentElement.dir !== 'ltr';
      ctx.direction = shareCardRtl ? 'rtl' : 'ltr';
      ctx.fillStyle = SHARE_CARD.color.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      (opts.layout === 'stats' ? drawStatsCard : drawSummaryCard)(ctx, d, opts, mark);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (run !== shareCardRender || !blob) return shareCardBlob;
      shareCardBlob = blob;
      if (shareCardUrl) URL.revokeObjectURL(shareCardUrl);
      shareCardUrl = URL.createObjectURL(blob);
      const img = document.getElementById('share-card-img');
      if (img) img.src = shareCardUrl;
      return blob;
    }

    function prepareWorkoutShare(session) {
      shareCardSession = session;
      shareCardBlob = null;
      const recap = document.getElementById('workout-recap');
      if (recap && !recap.dataset.shareBound) {
        recap.dataset.shareBound = '1';
        recap.addEventListener('change', e => { if (e.target.closest('.share-card')) renderShareCard(); });
        recap.addEventListener('click', e => {
          const pick = e.target.closest('[data-share-layout]');
          if (!pick) return;
          recap.querySelectorAll('[data-share-layout]').forEach(b => {
            const on = b === pick;
            b.classList.toggle('is-active', on);
            b.setAttribute('aria-checked', on ? 'true' : 'false');
          });
          renderShareCard();
        });
      }
      if (window.chthUi && recap) window.chthUi.scan(recap);
      renderShareCard();
    }

    function shareCardFile(blob) {
      return new File([blob], 'workout.png', { type: 'image/png' });
    }

    function downloadShareCard(blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = 'workout.png';
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }

    async function shareWorkoutResult() {
      try {
        const blob = shareCardBlob || await renderShareCard();
        if (!blob) throw new Error();
        const file = shareCardFile(blob);
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: 'تمرین امروز من', text: workoutShareText, files: [file] });
        } else {
          downloadShareCard(blob);
          showNotification('تصویر نتیجه تمرین ذخیره شد', 'success');
        }
      } catch (e) { if (e.name !== 'AbortError') showNotification('اشتراک‌گذاری انجام نشد', 'error'); }
    }

    async function saveWorkoutImage() {
      try {
        const blob = shareCardBlob || await renderShareCard();
        if (!blob) throw new Error();
        downloadShareCard(blob);
        showNotification('تصویر نتیجه تمرین ذخیره شد', 'success');
      } catch (e) { showNotification('ساخت تصویر انجام نشد', 'error'); }
    }
  `;
}
