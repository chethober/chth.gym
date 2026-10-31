import { PRELOADED_WORKOUTS, PreloadedWorkout } from '../data/preloadedWorkouts';
import { renderAppearanceHead, renderPublicPatterns, renderPublicNav, renderPublicFooter } from './appearanceUi';

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
}

const digits = (value: number) => String(value).replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);

function renderPublicDocument(origin: string, title: string, description: string, path: string, content: string, missing = false): string {
  const url = origin + path;
  return `<!doctype html><html lang="fa" dir="rtl" class="dark"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
    <title>${escapeHtml(title)} | جسم و اندیشه</title><meta name="description" content="${escapeHtml(description)}">
    ${missing ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${escapeHtml(url)}">`}
    <meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${escapeHtml(url)}"><meta property="og:type" content="website"><meta property="og:image" content="${escapeHtml(origin)}/icons/icon-512x512.png">
    <meta name="theme-color" content="#0E0F11"><link rel="icon" type="image/svg+xml" href="/icons/favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300..900&display=swap" rel="stylesheet">
    ${renderAppearanceHead(true)}
    <style>
      *{box-sizing:border-box}html{-webkit-text-size-adjust:100%;scrollbar-gutter:stable;overflow-y:scroll;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.13) transparent}body{margin:0}a{color:var(--accent-text);text-decoration:none}a,button{touch-action:manipulation}h1,h2,h3,p{margin:0}h1,h2,h3{overflow-wrap:anywhere;font-weight:700;letter-spacing:-0.01em}p{color:var(--text-2)}
      .public-main{width:min(77.5rem,90%);margin:auto;padding:4rem 0 5rem}.public-breadcrumb{display:flex;flex-wrap:wrap;gap:0.625rem;font-size:0.8125rem;color:var(--text-3);margin-bottom:2rem}.public-breadcrumb span:last-child{color:var(--text-2)}.public-intro{max-width:53rem;margin-bottom:3rem}.public-intro .public-kicker{margin-bottom:1rem}.public-intro h1{font-size:clamp(2rem,4.5vw,3.75rem);line-height:1.45;letter-spacing:-0.015em;margin-bottom:1.25rem}.public-intro>p{font-size:1.0625rem;line-height:2;max-width:47.5rem}.public-intro .public-button{margin-top:1.75rem}
      .program-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}.program-card{display:flex;flex-direction:column;gap:1.25rem;padding:1.75rem}.program-card h2{font-size:1.4375rem;line-height:1.7}.program-card h2 a{color:var(--text);transition:color var(--dur-fast) ease}.program-card p{font-size:0.875rem;line-height:2}.program-card .public-button{align-self:flex-start;margin-top:auto}.program-meta{display:flex;flex-wrap:wrap;gap:0.5rem}.program-card .program-meta{margin-top:auto}
      .program-summary{display:flex;flex-wrap:wrap;gap:0.75rem;margin-top:1.5rem}.exercise-heading{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem}.exercise-heading h2{font-size:1.75rem}.exercise-heading p{font-size:0.875rem}.exercise-list{display:grid;gap:1rem;list-style:none;margin:0;padding:0;counter-reset:exercise}.exercise-card{counter-increment:exercise;display:grid;grid-template-columns:minmax(0,1fr) 180px;gap:2rem;align-items:center;padding:1.75rem}.exercise-copy{min-width:0}.exercise-copy::before{content:counter(exercise,decimal-leading-zero);display:block;color:var(--accent-text);font-size:0.8125rem;font-weight:600;letter-spacing:0.08em;font-variant-numeric:tabular-nums;margin-bottom:1rem}.exercise-copy h3{font-size:1.5rem;margin-bottom:0.75rem}.exercise-copy .program-meta{margin-bottom:0.875rem}.exercise-copy p{font-size:0.875rem;line-height:2}.exercise-card img{display:block;width:180px;height:180px;max-width:100%;object-fit:contain;background:#fff;border-radius:var(--r-md)}.program-next{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem;margin-top:2.5rem;padding:2rem}.program-next h2{font-size:1.5rem;margin-bottom:0.5rem}.program-next p{font-size:0.875rem}
      .public-empty{padding:3rem 0;max-width:47.5rem}.public-empty .public-index{display:block;font-size:1rem;margin-bottom:1rem}.public-empty p{margin-bottom:1.75rem}
      @media(hover:hover) and (pointer:fine){.program-card h2 a:hover{color:var(--text)}}
      @media(max-width:1050px){.program-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:640px){.public-main{width:auto;margin:0 1.25rem;padding:2.5rem 0 4rem}.public-intro{margin-bottom:2rem}.public-intro>p{font-size:1rem}.program-grid{grid-template-columns:1fr}.program-card{padding:1.5rem}.exercise-card{grid-template-columns:minmax(0,1fr) 110px;gap:1rem;padding:1.25rem}.exercise-card img{width:110px;height:110px}.exercise-copy h3{font-size:1.25rem}.program-next{padding:1.5rem}.public-button{max-width:100%}}
      @media(max-width:380px){.exercise-card{grid-template-columns:1fr}.exercise-card img{width:160px;height:160px;justify-self:center}.program-card h2{font-size:1.3125rem}}
    </style>${renderPublicPatterns('body')}
  </head><body>
    ${renderPublicNav(path)}
    <main class="public-main">${content}</main>
    ${renderPublicFooter()}
  </body></html>`;
}

export function renderPublicPrograms(origin: string, preset?: PreloadedWorkout): string {
  const title = preset ? preset.title : 'برنامه‌های آماده تمرین';
  const description = preset ? preset.description : 'برنامه‌های تمرین فارسی با راهنمای حرکات، تعداد ست و تکرار؛ برنامه را انتخاب کنید و بدون ساخت حساب تمرین را ثبت کنید.';
  const intro = `<header class="public-intro"><p class="public-kicker">${preset ? 'یک مسیر روشن برای جلسه بعدی' : 'مسیر خودت را پیدا کن'}</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p>${preset ? `<div class="program-summary"><span class="public-chip">${escapeHtml(preset.fitness_level_fa)}</span><span class="public-chip">${digits(preset.exercises.length)} حرکت</span><span class="public-chip">حدود ${digits(preset.estimated_duration_min)} دقیقه</span></div><a class="public-button" href="/?preset=${encodeURIComponent(preset.id)}">باز کردن برنامه و شروع تمرین <span aria-hidden="true">↖</span></a>` : ''}</header>`;
  const content = preset ? `
    <nav class="public-breadcrumb" aria-label="مسیر صفحه"><a href="/">صفحه اصلی</a><span aria-hidden="true">/</span><a href="/programs">برنامه‌ها</a><span aria-hidden="true">/</span><span aria-current="page">جزئیات برنامه</span></nav>${intro}
    <section aria-labelledby="exercise-title"><div class="exercise-heading"><h2 id="exercise-title">حرکات این برنامه</h2><p>راهنمای حرکت، ست و استراحت</p></div><ol class="exercise-list">${preset.exercises.map(ex => `<li class="exercise-card public-card"><div class="exercise-copy"><h3>${escapeHtml(ex.name_fa)}</h3><div class="program-meta"><span class="public-chip">${digits(ex.target_sets)} ست × ${digits(ex.target_reps)} تکرار</span><span class="public-chip">${digits(ex.rest_seconds)} ثانیه استراحت</span></div>${ex.notes_fa ? `<p>${escapeHtml(ex.notes_fa)}</p>` : ''}</div><img loading="lazy" src="${escapeHtml(ex.gif_url)}" alt="راهنمای ${escapeHtml(ex.name_fa)}" width="180" height="180"></li>`).join('')}</ol></section>
    <section class="program-next public-card is-large"><div><h2>آماده‌ای شروع کنی؟</h2><p>برنامه را باز کن و اولین ست را ثبت کن.</p></div><a class="public-button" href="/?preset=${encodeURIComponent(preset.id)}">شروع این برنامه <span aria-hidden="true">↖</span></a></section>` : `${intro}<section class="program-grid" aria-label="فهرست برنامه‌های تمرینی">${PRELOADED_WORKOUTS.map((p, index) => `<article class="program-card public-card is-interactive"><span class="public-index" dir="ltr">${String(index + 1).padStart(2, '0')} / PROGRAM</span><h2><a href="/programs/${p.id}">${escapeHtml(p.title)}</a></h2><p>${escapeHtml(p.description)}</p><div class="program-meta"><span class="public-chip">${escapeHtml(p.fitness_level_fa)}</span><span class="public-chip">${digits(p.exercises.length)} حرکت</span><span class="public-chip">${digits(p.estimated_duration_min)} دقیقه</span></div><a class="public-button is-outline" href="/programs/${p.id}">دیدن برنامه <span aria-hidden="true">↖</span></a></article>`).join('')}</section>`;
  return renderPublicDocument(origin, title, description, '/programs' + (preset ? '/' + preset.id : ''), content);
}

export function renderProgramNotFound(origin: string): string {
  return renderPublicDocument(origin, 'برنامه یافت نشد', 'این برنامه در دسترس نیست. از میان برنامه‌های آماده مسیر دیگری انتخاب کنید.', '/programs/missing', `<header class="public-intro public-empty"><p class="public-index" dir="ltr">404 / PROGRAM NOT FOUND</p><h1>این برنامه پیدا نشد.</h1><p>ممکن است آدرس تغییر کرده باشد. برنامه‌های آماده را ببین و مسیر مناسب خودت را انتخاب کن.</p><a class="public-button" href="/programs">کاوش برنامه‌های تمرینی <span aria-hidden="true">↖</span></a></header>`, true);
}
