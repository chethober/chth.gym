import { renderPublicAccentStyles } from './appearanceUi';
import { BRAND_MARK_SVG } from './components';

// Public introduction with a local, illustrative workout preview. Sign-in uses existing auth.
export function renderLandingStyles(): string {
  return `<style>
    ${renderPublicAccentStyles('#landing-page')}
    #dashboard-shell[hidden], #landing-page[hidden] { display: none !important; }
    #landing-page { --landing-lime:var(--accent); background:#101010; color:#fdfdfd; font-family:'Vazirmatn',system-ui,sans-serif; min-height:100svh; overflow:hidden; }
    .landing-nav { display:flex; align-items:center; justify-content:space-between; padding:28px 5vw; border-bottom:1px solid #333; position:relative; z-index:2; }
    .landing-brand { display:flex; align-items:center; gap:12px; font-size:18px; font-weight:600; color:#fdfdfd; text-decoration:none; }
    .landing-brand img { width:36px; height:36px; filter:grayscale(1); }
    .landing-links { display:flex; align-items:center; gap:28px; }
    .landing-links a { font-size:14px; color:#fdfdfd; text-decoration:none; }
    #landing-page .landing-button { display:inline-flex; align-items:center; justify-content:center; gap:12px; min-height:48px; padding:13px 24px; border-radius:100px; border:1px solid #333; color:#fdfdfd; font-size:14px; font-weight:500; text-decoration:none; cursor:pointer; background:transparent; }
    #landing-page .landing-primary { color:var(--on-accent); background:var(--landing-lime); border-color:var(--landing-lime); }
    #landing-page a:focus-visible { outline:2px solid var(--accent); outline-offset:6px; }
    .landing-hero { min-height:850px; min-height:min(900px,calc(100svh - 94px)); position:relative; display:flex; align-items:center; justify-content:center; padding:100px 24px 120px; text-align:center; isolation:isolate; overflow:hidden; }
    .landing-ring { width:min(86vw,1040px); aspect-ratio:1; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); border-radius:50%; background:conic-gradient(from -35deg,var(--accent) 0deg, #35d5b4 62deg,#5176ef 125deg,#9a58db 185deg,#ed84c9 240deg,#f39b58 300deg,var(--accent) 360deg); mask:radial-gradient(farthest-side,transparent calc(100% - 25px),#000 calc(100% - 24px)),repeating-conic-gradient(#000 0deg 18deg,transparent 18deg 20deg); mask-composite:intersect; z-index:-1; }
    .landing-hero-copy { max-width:1000px; }
    .landing-eyebrow { font-size:14px; color:var(--accent); display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:28px; }
    .landing-eyebrow:before { content:''; width:6px; height:6px; border-radius:50%; background:var(--accent); }
    .landing-hero h1 { font-size:clamp(68px,10.5vw,148px); font-weight:600; line-height:1.2; letter-spacing:-.045em; margin:0; }
    .landing-subtitle { font-size:21px; color:#999; margin:20px 0 36px; line-height:1.7; }
    .landing-hero-note { display:block; margin-top:20px; color:#999; font-size:14px; }
    .landing-scroll { position:absolute; bottom:28px; font-size:14px; color:#999; text-decoration:none; }
    .landing-manifesto { text-align:center; padding:108px 5vw 80px; border-top:1px solid #333; }
    .landing-kicker { color:#999; font-size:14px; margin:0 0 32px; }
    .landing-manifesto h2 { font-size:clamp(44px,7.3vw,109px); font-weight:500; line-height:1.5; letter-spacing:-.035em; color:#6f6f6f; margin:0; }
    .landing-manifesto h2 span { color:#fdfdfd; }
    .landing-features { padding:0 5vw 80px; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:20px; }
    .landing-card { background:#171717; border:1px solid #333; border-radius:40px; padding:56px 40px; }
    .landing-card-number { font:14px Arial,sans-serif; color:#999; display:block; margin-bottom:48px; }
    .landing-card h3 { font-size:36px; line-height:1.4; font-weight:500; margin:0 0 20px; }
    .landing-card p { font-size:16px; line-height:1.9; color:#999; margin:0; }
    .landing-finale { text-align:center; padding:80px 24px 108px; border-top:1px solid #333; }
    .landing-finale h2 { font-size:clamp(44px,6vw,78px); font-weight:500; line-height:1.4; margin:0 0 32px; }
    .landing-footer { display:flex; justify-content:space-between; gap:20px; padding:28px 5vw; border-top:1px solid #333; color:#999; font-size:14px; }
    .landing-footer a { color:#fdfdfd; text-decoration:none; }
    @media(max-width:760px) { .landing-nav { padding:20px; } .landing-links { gap:12px; } .landing-links .landing-program-link { display:inline-flex; font-size:13px; } .landing-brand { font-size:14px; gap:8px; } .landing-hero { min-height:680px; padding:100px 20px; } .landing-ring { width:130vw; max-width:650px; mask:radial-gradient(farthest-side,transparent calc(100% - 18px),#000 calc(100% - 17px)),repeating-conic-gradient(#000 0deg 18deg,transparent 18deg 20deg); mask-composite:intersect; } .landing-hero h1 { font-size:clamp(58px,13vw,92px); } .landing-subtitle { font-size:18px; } .landing-features { grid-template-columns:1fr; padding:0 20px 80px; } .landing-card { padding:40px; } .landing-card-number { margin-bottom:28px; } .landing-manifesto { padding:80px 20px; } .landing-footer { flex-direction:column; text-align:center; } }

    #landing-page :is(a,button,input):focus-visible { outline:2px solid var(--landing-lime); outline-offset:5px; }
    #landing-page .landing-button { transition:transform var(--dur-press) var(--ease-out),background-color var(--dur-fast) ease,border-color var(--dur-fast) ease; }
    #landing-page .landing-button:active { transform:scale(.97); }
    .landing-button span { transition:transform var(--dur-base) var(--ease-out); }
    .landing-hero-copy > * { animation:landing-enter 650ms var(--ease-out) backwards; }
    .landing-hero-copy > :nth-child(2) { animation-delay:50ms; }
    .landing-hero-copy > :nth-child(3) { animation-delay:100ms; }
    .landing-hero-copy > :nth-child(4) { animation-delay:150ms; }
    .landing-hero-copy > :nth-child(5) { animation-delay:200ms; }
    .landing-ring { animation:landing-ring-enter 1100ms var(--ease-out) backwards; }
    @keyframes landing-enter { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes landing-ring-enter { from { opacity:0; transform:translate(-50%,-50%) rotate(-24deg) scale(.94); } to { opacity:1; transform:translate(-50%,-50%) rotate(0) scale(1); } }
    .landing-reveal { transition:opacity 600ms var(--ease-out),transform 600ms var(--ease-out); }
    .landing-reveal[data-pending] { opacity:0; transform:translateY(24px); }
    .landing-reveal[data-pending]:focus-within { opacity:1; transform:none; transition:none; }
    .landing-card:nth-child(2) { transition-delay:50ms; }
    .landing-card:nth-child(3) { transition-delay:100ms; }
    .landing-demo { margin:0 5vw 100px; display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; border:1px solid #333; border-radius:40px; padding:56px; background:radial-gradient(ellipse at top left,color-mix(in srgb,var(--accent) 4%,transparent),transparent 65%),#141414; }
    .landing-demo h2 { font-size:clamp(32px,4vw,54px); line-height:1.5; margin:0 0 16px; letter-spacing:-.025em; }
    .landing-demo p { color:#999; font-size:16px; line-height:1.9; }
    .landing-demo .landing-kicker { color:var(--landing-lime); margin-bottom:20px; }
    .landing-goals { display:flex; flex-wrap:wrap; gap:8px; margin:28px 0 20px; }
    #landing-page .landing-goal { font:inherit; font-size:14px; min-height:44px; padding:10px 18px; border:1px solid color-mix(in srgb,var(--accent) 35%,#444); border-radius:100px; background:transparent; color:var(--accent); cursor:pointer; transition:background-color var(--dur-fast) ease,color var(--dur-fast) ease,transform var(--dur-press) var(--ease-out); }
    #landing-page .landing-goal[aria-pressed="true"] { background:var(--landing-lime); border-color:var(--landing-lime); color:var(--on-accent); }
    .landing-goal:active { transform:scale(.97); }
    .landing-preview { border:1px solid #383838; border-radius:24px; padding:28px; background:#1b1b1b; min-width:0; }
    .landing-preview-head { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:24px; }
    .landing-preview-head span { color:#999; font-size:12px; }
    .landing-preview-head strong { font-size:20px; font-weight:500; }
    .landing-preview-label { font-size:12px; color:var(--landing-lime); border:1px solid color-mix(in srgb,var(--accent) 20%,transparent); border-radius:100px; padding:5px 10px; }
    .landing-exercise { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:18px 0; border-top:1px solid #333; }
    .landing-exercise strong { font-weight:500; font-size:16px; }
    .landing-exercise span { color:#999; font-size:14px; }
    .landing-preview-foot { display:flex; justify-content:space-between; gap:12px; padding-top:20px; border-top:1px solid #333; color:#999; font-size:13px; }
    .landing-preview-foot a { color:var(--landing-lime); text-decoration:none; }
    @media (hover:hover) and (pointer:fine) {
      #landing-page .landing-button:hover { background:#262626; border-color:#666; }
      #landing-page .landing-primary:hover { background:var(--accent-hover); border-color:var(--accent-hover); }
      .landing-button:hover span { transform:translate(-2px,-2px); }
      #landing-page .landing-goal:hover { border-color:var(--landing-lime); }
      .landing-card:hover { border-color:#666; }
    }
    @media(max-width:760px) { .landing-demo { grid-template-columns:1fr; gap:28px; margin:0 20px 80px; padding:28px 20px; border-radius:28px; } .landing-preview { padding:20px; } .landing-preview-head strong { font-size:18px; } }
    @media(prefers-reduced-motion:reduce) {
      .landing-hero-copy > *, .landing-ring { animation:none; }
      .landing-reveal { transition:opacity 150ms ease; }
      .landing-reveal[data-pending] { transform:none; }
      #landing-page .landing-button, #landing-page .landing-goal { transition:background-color 150ms ease,color 150ms ease; }
      #landing-page .landing-button:active, #landing-page .landing-goal:active, .landing-button:hover span { transform:none; }
      .landing-button span { transition:none; }
    }

    #landing-page { box-sizing:border-box; }
    #landing-page *, #landing-page *::before, #landing-page *::after { box-sizing:border-box; }
    #landing-page :is(a,button) { touch-action:manipulation; }
    .landing-brand .brand-mark { flex-shrink:0; width:36px; height:36px; color:var(--accent); }
    .landing-nav { gap:20px; }
    .landing-links { flex-wrap:wrap; justify-content:flex-end; }
    #landing-page .landing-button:not(.landing-primary) { border-color:color-mix(in srgb,var(--accent) 45%,#333); color:var(--accent); }
    .landing-hero-copy { min-width:0; }
    .landing-card { min-width:0; }
    .landing-card h3, .landing-demo h2, .landing-footer, .landing-exercise { overflow-wrap:anywhere; }
    .landing-exercise span { flex-shrink:0; }
    .landing-preview-head > div { min-width:0; }
    .landing-preview-label { flex-shrink:0; }
    .landing-preview-foot { flex-wrap:wrap; }
    @media(max-width:1000px) and (min-width:761px) { .landing-card { padding:36px 24px; } .landing-card h3 { font-size:28px; } .landing-demo { gap:32px; padding:36px; } }
    @media(max-width:760px) { .landing-nav { flex-wrap:wrap; gap:16px; } .landing-links { gap:12px; } .landing-brand .brand-mark { width:28px; height:28px; } .landing-links .landing-button { min-height:44px !important; padding:10px 16px !important; } }
    @media(max-width:420px) { .landing-nav { justify-content:center; } .landing-links { width:100%; justify-content:center; } .landing-hero h1 { font-size:clamp(48px,12vw,58px); } .landing-card { padding:32px 24px; } .landing-exercise { flex-wrap:wrap; gap:6px; } }
  </style>`;
}

export function renderLandingPage(): string {
  return `<div id="landing-page">
    <nav class="landing-nav" aria-label="ناوبری صفحه اصلی">
      <a class="landing-brand" href="/">${BRAND_MARK_SVG}<span>جسم و اندیشه</span></a>
      <div class="landing-links"><a class="landing-program-link" href="/programs">همه برنامه‌ها</a><a class="landing-button" href="/api/auth/google">ورود به حساب <span aria-hidden="true">↖</span></a></div>
    </nav>
    <main>
      <section class="landing-hero" aria-labelledby="landing-title">
        <div class="landing-ring" aria-hidden="true"></div>
        <div class="landing-hero-copy">
          <p class="landing-eyebrow">فضایی برای قوی‌تر شدن</p>
          <h1 id="landing-title">جسم و اندیشه</h1>
          <p class="landing-subtitle">تمرین با هدف. پیشرفت با آگاهی.</p>
          <a class="landing-button landing-primary" href="/api/auth/google"><span aria-hidden="true">↖</span> با گوگل شروع کن</a>
          <span class="landing-hero-note">برنامه‌ات، تمرین‌هایت، مسیر پیشرفتت. یک‌جا.</span>
        </div>
        <a class="landing-scroll" href="#landing-manifesto">مسیرت را پیدا کن ↓</a>
      </section>
      <section class="landing-manifesto landing-reveal" id="landing-manifesto" aria-labelledby="landing-statement">
        <p class="landing-kicker">هر تمرین، یک قدم به جلو</p>
        <h2 id="landing-statement">فقط تمرین نکن.<br><span>پیشرفتت را ببین.</span></h2>
      </section>
      <section class="landing-features" aria-label="امکانات جسم و اندیشه">
        <article class="landing-card landing-reveal"><span class="landing-card-number">01 / PLAN</span><h3>مسیر خودت را بساز.</h3><p>از برنامه‌های آماده شروع کن یا روتین خودت را بچین. تمرین‌ها را با هدف و زمانت هماهنگ کن.</p></article>
        <article class="landing-card landing-reveal"><span class="landing-card-number">02 / TRAIN</span><h3>هر ست را ثبت کن.</h3><p>وزنه، تکرار و جلسه‌های تمرینت را ثبت کن. برای تمرین بعدی، بدان دقیقاً از کجا ادامه بدهی.</p></article>
        <article class="landing-card landing-reveal"><span class="landing-card-number">03 / GROW</span><h3>روندت را بشناس.</h3><p>تاریخچه تمرین و رکوردهای شخصی‌ات را ببین. قدم‌های کوچک امروز، پیشرفت فردای تو هستند.</p></article>
      </section>
      <section class="landing-demo landing-reveal" aria-labelledby="landing-demo-title">
        <div>
          <p class="landing-kicker">قبل از شروع، امتحان کن</p>
          <h2 id="landing-demo-title">هدفت را انتخاب کن.<br>مسیرت را تصور کن.</h2>
          <p>یک نگاه به شکل برنامه‌ات. هدف‌های مختلف را لمس کن و ببین یک جلسه تمرین چطور می‌تواند باشد.</p>
          <div class="landing-goals" role="group" aria-label="انتخاب هدف برای پیش‌نمایش تمرین">
            <button type="button" class="landing-goal" data-goal="strength" aria-pressed="true" aria-controls="landing-preview-content">قدرت بیشتر</button>
            <button type="button" class="landing-goal" data-goal="muscle" aria-pressed="false" aria-controls="landing-preview-content">عضله‌سازی</button>
            <button type="button" class="landing-goal" data-goal="fitness" aria-pressed="false" aria-controls="landing-preview-content">آمادگی عمومی</button>
          </div>
          <p style="font-size:13px">این فقط یک نمونه است؛ برنامه اصلی را متناسب با خودت می‌سازی.</p>
        </div>
        <div class="landing-preview">
          <div id="landing-preview-content" aria-live="polite" aria-atomic="true">
            <div class="landing-preview-head"><div><span>پیش‌نمایش یک جلسه</span><br><strong data-preview-title>پایه‌های قدرت</strong></div><div class="landing-preview-label" data-preview-time>۴۵ دقیقه</div></div>
            <div class="landing-exercise"><strong data-preview-name>اسکوات</strong><span data-preview-sets>۳ ست × ۵ تکرار</span></div>
            <div class="landing-exercise"><strong data-preview-name>پرس سینه</strong><span data-preview-sets>۳ ست × ۵ تکرار</span></div>
            <div class="landing-exercise"><strong data-preview-name>زیربغل هالتر</strong><span data-preview-sets>۳ ست × ۶ تکرار</span></div>
          </div>
          <div class="landing-preview-foot"><span>نمونه تمرین · بدون نیاز به حساب</span><a href="/programs">دیدن برنامه‌ها ↖</a></div>
        </div>
      </section>
      <section class="landing-finale landing-reveal"><p class="landing-kicker">قدم بعدی از همین‌جا شروع می‌شود</p><h2>برای خودت وقت بگذار.</h2><a class="landing-button landing-primary" href="/api/auth/google">شروع با حساب گوگل <span aria-hidden="true">↖</span></a></section>
    </main>
    <footer class="landing-footer"><span>جسم و اندیشه · همراه مسیر تمرین تو</span><a href="/programs">کاوش برنامه‌های تمرینی ↖</a></footer>
  </div>
  <script>
    (() => {
      const page = document.getElementById('landing-page');
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const preview = page.querySelector('#landing-preview-content');
      const samples = {
        strength: { title:'پایه‌های قدرت', time:'۴۵ دقیقه', names:['اسکوات','پرس سینه','زیربغل هالتر'], sets:['۳ ست × ۵ تکرار','۳ ست × ۵ تکرار','۳ ست × ۶ تکرار'] },
        muscle: { title:'ساختن عضله، قدم به قدم', time:'۵۵ دقیقه', names:['پرس دمبل','لت سیم‌کش','نشر جانب'], sets:['۳ ست × ۱۰ تکرار','۳ ست × ۱۲ تکرار','۳ ست × ۱۵ تکرار'] },
        fitness: { title:'حرکت برای حال بهتر', time:'۳۰ دقیقه', names:['اسکوات با وزن بدن','شنا روی نیمکت','پیاده‌روی تند'], sets:['۳ ست × ۱۲ تکرار','۳ ست × ۸ تکرار','۱۵ دقیقه'] }
      };
      let animation;
      page.querySelectorAll('[data-goal]').forEach(button => {
        button.addEventListener('click', event => {
          if (button.getAttribute('aria-pressed') === 'true') return;
          const sample = samples[button.dataset.goal];
          page.querySelectorAll('[data-goal]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
          preview.querySelector('[data-preview-title]').textContent = sample.title;
          preview.querySelector('[data-preview-time]').textContent = sample.time;
          preview.querySelectorAll('[data-preview-name]').forEach((item, i) => item.textContent = sample.names[i]);
          preview.querySelectorAll('[data-preview-sets]').forEach((item, i) => item.textContent = sample.sets[i]);
          if (animation) animation.cancel();
          if (event.detail && preview.animate) {
            animation = preview.animate(reducedMotion.matches ? [{opacity:.6},{opacity:1}] : [{opacity:.4,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}], {duration:200,easing:'cubic-bezier(0.23, 1, 0.32, 1)'});
          }
        });
      });
      page.querySelectorAll('a[href="#landing-manifesto"]').forEach(link => {
        link.addEventListener('click', event => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          const target = page.querySelector('#landing-manifesto');
          target.scrollIntoView({behavior:reducedMotion.matches || !event.detail ? 'instant' : 'smooth',block:'start'});
          target.setAttribute('tabindex','-1');
          target.focus({preventScroll:true});
          window.history.replaceState(null,'','#landing-manifesto');
        });
      });
      if ('IntersectionObserver' in window && !reducedMotion.matches) {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.removeAttribute('data-pending');
              observer.unobserve(entry.target);
            }
          });
        }, {threshold:.12});
        page.querySelectorAll('.landing-reveal').forEach(item => {
          item.setAttribute('data-pending','');
          observer.observe(item);
        });
        reducedMotion.addEventListener('change', event => {
          if (event.matches) {
            observer.disconnect();
            page.querySelectorAll('[data-pending]').forEach(item => item.removeAttribute('data-pending'));
            if (animation) animation.cancel();
          }
        });
      }
    })();
  </script>`;
}
