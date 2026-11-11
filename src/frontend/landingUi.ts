import { renderPublicAccentStyles, renderPublicPatterns, renderPublicNav, renderPublicFooter } from './appearanceUi';

// Public introduction with a local, illustrative workout preview. Sign-in uses existing auth.
export function renderLandingStyles(): string {
  return `<style>
    ${renderPublicAccentStyles('#landing-page')}
    #dashboard-shell[hidden], #landing-page[hidden] { display: none !important; }
    #landing-page { min-height:100svh; overflow:hidden; box-sizing:border-box; }
    #landing-page *, #landing-page *::before, #landing-page *::after { box-sizing:border-box; }
    #landing-page :is(a,button) { touch-action:manipulation; }
    #landing-page a { text-decoration:none; }

    /* Hero */
    /* The ring runs up behind the CHTH navbar, so the top of the page reads as one surface */
    .landing-hero { min-height:min(calc(56rem + var(--chth-nav-space)),100svh); margin-top:calc(-1 * var(--chth-nav-space)); position:relative; display:flex; align-items:center; justify-content:center; padding:calc(6rem + var(--chth-nav-space)) 1.5rem 7.5rem; text-align:center; isolation:isolate; overflow:hidden; }
    /* One accent: the ring is the user's accent at stepped strengths, not a rainbow */
    .landing-ring { width:min(86vw,65rem); aspect-ratio:1; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); border-radius:50%; z-index:-1;
      background:conic-gradient(from -35deg, var(--accent), color-mix(in srgb,var(--accent) 55%,var(--surface-3)) 90deg, color-mix(in srgb,var(--accent) 18%,var(--surface)) 180deg, color-mix(in srgb,var(--accent) 55%,var(--surface-3)) 270deg, var(--accent));
      mask:radial-gradient(farthest-side,transparent calc(100% - 25px),#000 calc(100% - 24px)),repeating-conic-gradient(#000 0deg 18deg,transparent 18deg 20deg); mask-composite:intersect; }
    .landing-hero-copy { max-width:62.5rem; min-width:0; }
    .landing-eyebrow { display:flex; align-items:center; justify-content:center; gap:var(--chth-space-10); margin:0 0 var(--chth-space-28); }
    .landing-eyebrow::before { content:''; width:6px; height:6px; border-radius:50%; background:var(--accent); }
    .landing-hero h1 { font-size:clamp(4.25rem,10.5vw,9.25rem); font-weight:800; line-height:1.15; letter-spacing:-0.02em; margin:0; }
    .landing-subtitle { font-size:var(--chth-text-20); color:var(--text-2); margin:var(--chth-space-20) 0 var(--chth-space-36); line-height:1.7; }
    .landing-hero-note { display:block; margin-top:var(--chth-space-20); color:var(--text-3); font-size:var(--chth-text-14); }
    .landing-scroll { position:absolute; bottom:1.75rem; font-size:var(--chth-text-14); color:var(--text-2); min-height:2.75rem; display:inline-flex; align-items:center; gap:var(--chth-space-6); }
    .landing-scroll span { display:inline-block; transition:transform var(--dur-base) var(--ease-out); }

    /* Manifesto */
    .landing-manifesto { text-align:center; padding:6.75rem 5vw var(--chth-space-80); border-top:1px solid var(--line); }
    #landing-page .landing-manifesto .public-kicker { margin:0 0 var(--chth-space-32); color:var(--text-2); }
    .landing-manifesto h2 { font-size:clamp(2.75rem,7.3vw,6.75rem); font-weight:700; line-height:1.45; letter-spacing:-0.015em; color:var(--text-3); margin:0; }
    .landing-manifesto h2 span { color:var(--text); }

    /* Feature cards */
    .landing-features { padding:0 5vw var(--chth-space-80); display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:var(--chth-space-20); }
    .landing-card { padding:var(--chth-space-56) var(--chth-space-40); }
    #landing-page .landing-card .public-index { display:block; margin-bottom:var(--chth-space-48); }
    .landing-card h3 { font-size:var(--chth-text-36); line-height:1.4; font-weight:700; letter-spacing:-0.01em; margin:0 0 var(--chth-space-20); overflow-wrap:anywhere; }
    .landing-card p { font-size:var(--chth-text-16); line-height:1.9; color:var(--text-2); margin:0; }

    /* Interactive demo */
    .landing-demo { margin:0 5vw 6.25rem; display:grid; grid-template-columns:1fr 1fr; gap:var(--chth-space-64); align-items:center; padding:var(--chth-space-56); }
    #landing-page .landing-demo .public-kicker { margin:0 0 var(--chth-space-20); }
    .landing-demo h2 { font-size:clamp(2rem,4vw,3.375rem); font-weight:700; line-height:1.5; letter-spacing:-0.01em; margin:0 0 var(--chth-space-16); overflow-wrap:anywhere; }
    .landing-demo p { color:var(--text-2); font-size:var(--chth-text-16); line-height:1.9; margin:0; }
    .landing-demo .landing-demo-note { font-size:var(--chth-text-13); color:var(--text-3); }
    .landing-goals { display:flex; flex-wrap:wrap; gap:var(--chth-space-8); margin:var(--chth-space-28) 0 var(--chth-space-20); }
    /* Inset well: the app's .well */
    .landing-preview { background:var(--surface-2); border:1px solid var(--line); border-radius:var(--r-md); padding:var(--chth-space-28); min-width:0; }
    .landing-preview-head { display:flex; justify-content:space-between; align-items:center; gap:var(--chth-space-16); margin-bottom:var(--chth-space-24); }
    .landing-preview-head > div { min-width:0; }
    .landing-preview-head span:not(.public-chip) { color:var(--text-3); font-size:var(--chth-text-12); }
    .landing-preview-head strong { font-size:var(--chth-text-20); font-weight:700; }
    #landing-page .landing-preview-head .public-chip { flex-shrink:0; }
    .landing-exercise { display:flex; justify-content:space-between; align-items:center; gap:var(--chth-space-12); padding:var(--chth-space-18) 0; border-top:1px solid var(--line); overflow-wrap:anywhere; }
    .landing-exercise strong { font-weight:600; font-size:var(--chth-text-16); }
    .landing-exercise span { color:var(--text-2); font-size:var(--chth-text-14); flex-shrink:0; }
    .landing-preview-foot { display:flex; flex-wrap:wrap; justify-content:space-between; gap:var(--chth-space-12); padding-top:var(--chth-space-20); border-top:1px solid var(--line); color:var(--text-3); font-size:var(--chth-text-13); }
    .landing-preview-foot a { color:var(--accent-text); font-weight:600; }

    /* Finale */
    .landing-finale { text-align:center; padding:var(--chth-space-80) var(--chth-space-24) 6.75rem; border-top:1px solid var(--line); }
    #landing-page .landing-finale .public-kicker { margin:0 0 var(--chth-space-32); color:var(--text-2); }
    .landing-finale h2 { font-size:clamp(2.75rem,6vw,4.875rem); font-weight:700; line-height:1.4; letter-spacing:-0.015em; margin:0 0 var(--chth-space-32); }

    /* Motion: hero settles in once, sections reveal on scroll */
    .landing-hero-copy { animation:landing-enter var(--chth-dur-600) var(--ease-out) backwards; }
    .landing-ring { animation:landing-ring-enter var(--chth-dur-1000) var(--ease-out) backwards; }
    @keyframes landing-enter { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes landing-ring-enter { from { opacity:0; transform:translate(-50%,-50%) rotate(-24deg) scale(.94); } to { opacity:1; transform:translate(-50%,-50%) rotate(0) scale(1); } }
    .landing-reveal { transition:opacity var(--chth-dur-600) var(--ease-out),transform var(--chth-dur-600) var(--ease-out),border-color var(--dur-fast) ease; }
    .landing-reveal[data-pending] { opacity:0; transform:translateY(24px); }
    .landing-reveal[data-pending]:focus-within { opacity:1; transform:none; transition:none; }
    .landing-card:nth-child(2) { transition-delay:50ms; }
    .landing-card:nth-child(3) { transition-delay:var(--chth-dur-100); }

    @media (hover:hover) and (pointer:fine) {
      .landing-scroll:hover span { transform:translateY(3px); }
      #landing-page .landing-card:hover { border-color:var(--line-strong); }
    }
    @media(max-width:1000px) and (min-width:761px) { .landing-card { padding:var(--chth-space-36) var(--chth-space-24); } .landing-card h3 { font-size:var(--chth-text-28); } .landing-demo { gap:var(--chth-space-32); padding:var(--chth-space-36); } }
    @media(max-width:760px) {
      .landing-hero { min-height:calc(42.5rem + var(--chth-nav-space)); padding:calc(6.25rem + var(--chth-nav-space)) 1.25rem 6.25rem; }
      .landing-ring { width:130vw; max-width:40.625rem; mask:radial-gradient(farthest-side,transparent calc(100% - 18px),#000 calc(100% - 17px)),repeating-conic-gradient(#000 0deg 18deg,transparent 18deg 20deg); mask-composite:intersect; }
      .landing-hero h1 { font-size:clamp(3.625rem,13vw,5.75rem); } .landing-subtitle { font-size:var(--chth-text-18); }
      .landing-manifesto { padding:var(--chth-space-80) var(--chth-space-20); }
      .landing-features { grid-template-columns:1fr; padding:0 var(--chth-space-20) var(--chth-space-80); } .landing-card { padding:var(--chth-space-40); } #landing-page .landing-card .public-index { margin-bottom:var(--chth-space-28); }
      .landing-demo { grid-template-columns:1fr; gap:var(--chth-space-28); margin:0 var(--chth-space-20) var(--chth-space-80); padding:var(--chth-space-28) var(--chth-space-20); } .landing-preview { padding:var(--chth-space-20); } .landing-preview-head strong { font-size:var(--chth-text-18); }
    }
    @media(max-width:420px) { .landing-hero h1 { font-size:clamp(3rem,12vw,3.625rem); } .landing-card { padding:var(--chth-space-32) var(--chth-space-24); } .landing-exercise { flex-wrap:wrap; gap:var(--chth-space-6); } }
  </style>${renderPublicPatterns('#landing-page')}`;
}

export function renderLandingPage(): string {
  return `<div id="landing-page">
    ${renderPublicNav('/', { themeToggle: true })}
    <main>
      <section class="landing-hero" aria-labelledby="landing-title">
        <div class="landing-ring" aria-hidden="true"></div>
        <div class="landing-hero-copy">
          <p class="landing-eyebrow public-kicker">فضایی برای قوی‌تر شدن</p>
          <h1 id="landing-title">جسم و اندیشه</h1>
          <p class="landing-subtitle">تمرین با هدف. پیشرفت با آگاهی.</p>
          <a class="landing-button landing-primary public-button" href="/api/auth/google"><span aria-hidden="true">↖</span> با گوگل شروع کن</a>
          <span class="landing-hero-note">برنامه‌ات، تمرین‌هایت، مسیر پیشرفتت. یک‌جا.</span>
        </div>
        <a class="landing-scroll" href="#landing-manifesto">مسیرت را پیدا کن <span aria-hidden="true">↓</span></a>
      </section>
      <section class="landing-manifesto landing-reveal" id="landing-manifesto" aria-labelledby="landing-statement">
        <p class="public-kicker">هر تمرین، یک قدم به جلو</p>
        <h2 id="landing-statement">فقط تمرین نکن.<br><span>پیشرفتت را ببین.</span></h2>
      </section>
      <section class="landing-features" aria-label="امکانات جسم و اندیشه">
        <article class="landing-card public-card landing-reveal"><span class="public-index" dir="ltr">01 / PLAN</span><h3>مسیر خودت را بساز.</h3><p>از برنامه‌های آماده شروع کن یا روتین خودت را بچین. تمرین‌ها را با هدف و زمانت هماهنگ کن.</p></article>
        <article class="landing-card public-card landing-reveal"><span class="public-index" dir="ltr">02 / TRAIN</span><h3>هر ست را ثبت کن.</h3><p>وزنه، تکرار و جلسه‌های تمرینت را ثبت کن. برای تمرین بعدی، بدان دقیقاً از کجا ادامه بدهی.</p></article>
        <article class="landing-card public-card landing-reveal"><span class="public-index" dir="ltr">03 / GROW</span><h3>روندت را بشناس.</h3><p>تاریخچه تمرین و رکوردهای شخصی‌ات را ببین. قدم‌های کوچک امروز، پیشرفت فردای تو هستند.</p></article>
      </section>
      <section class="landing-demo public-card is-large landing-reveal" aria-labelledby="landing-demo-title">
        <div>
          <p class="public-kicker">قبل از شروع، امتحان کن</p>
          <h2 id="landing-demo-title">هدفت را انتخاب کن.<br>مسیرت را تصور کن.</h2>
          <p>یک نگاه به شکل برنامه‌ات. هدف‌های مختلف را لمس کن و ببین یک جلسه تمرین چطور می‌تواند باشد.</p>
          <div class="landing-goals" role="group" aria-label="انتخاب هدف برای پیش‌نمایش تمرین">
            <button type="button" class="landing-goal public-chip" data-goal="strength" aria-pressed="true" aria-controls="landing-preview-content">قدرت بیشتر</button>
            <button type="button" class="landing-goal public-chip" data-goal="muscle" aria-pressed="false" aria-controls="landing-preview-content">عضله‌سازی</button>
            <button type="button" class="landing-goal public-chip" data-goal="fitness" aria-pressed="false" aria-controls="landing-preview-content">آمادگی عمومی</button>
          </div>
          <p class="landing-demo-note">این فقط یک نمونه است؛ برنامه اصلی را متناسب با خودت می‌سازی.</p>
        </div>
        <div class="landing-preview">
          <div id="landing-preview-content" aria-live="polite" aria-atomic="true">
            <div class="landing-preview-head"><div><span>پیش‌نمایش یک جلسه</span><br><strong data-preview-title>پایه‌های قدرت</strong></div><span class="public-chip is-accent" data-preview-time>۴۵ دقیقه</span></div>
            <div class="landing-exercise"><strong data-preview-name>اسکوات</strong><span data-preview-sets>۳ ست × ۵ تکرار</span></div>
            <div class="landing-exercise"><strong data-preview-name>پرس سینه</strong><span data-preview-sets>۳ ست × ۵ تکرار</span></div>
            <div class="landing-exercise"><strong data-preview-name>زیربغل هالتر</strong><span data-preview-sets>۳ ست × ۶ تکرار</span></div>
          </div>
          <div class="landing-preview-foot"><span>نمونه تمرین · بدون نیاز به حساب</span><a href="/programs">دیدن برنامه‌ها ↖</a></div>
        </div>
      </section>
      <section class="landing-finale landing-reveal"><p class="public-kicker">قدم بعدی از همین‌جا شروع می‌شود</p><h2>برای خودت وقت بگذار.</h2><a class="landing-button landing-primary public-button" href="/api/auth/google">شروع با حساب گوگل <span aria-hidden="true">↖</span></a></section>
    </main>
    ${renderPublicFooter()}
  </div>
  <script>
    (() => {
      const page = document.getElementById('landing-page');
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const shouldReduce = () => reducedMotion.matches || document.documentElement.getAttribute('data-motion') === 'reduce';
      const preview = page.querySelector('#landing-preview-content');
      const samples = {
        strength: { title:'پایه‌های قدرت', time:'۴۵ دقیقه', names:['اسکوات','پرس سینه','زیربغل هالتر'], sets:['۳ ست × ۵ تکرار','۳ ست × ۵ تکرار','۳ ست × ۶ تکرار'] },
        muscle: { title:'ساختن عضله، قدم به قدم', time:'۵۵ دقیقه', names:['پرس دمبل','لت سیم‌کش','نشر جانب'], sets:['۳ ست × ۱۰ تکرار','۳ ست × ۱۲ تکرار','۳ ست × ۱۵ تکرار'] },
        fitness: { title:'حرکت برای حال بهتر', time:'۳۰ دقیقه', names:['اسکوات با وزن بدن','شنا روی نیمکت','پیاده‌روی تند'], sets:['۳ ست × ۱۲ تکرار','۳ ست × ۸ تکرار','۱۵ دقیقه'] }
      };
      let animation;
      const settleMotion = () => {
        if (!shouldReduce()) return;
        if (animation) animation.cancel();
        page.querySelectorAll('[data-pending]').forEach(item => item.removeAttribute('data-pending'));
      };
      reducedMotion.addEventListener('change', settleMotion);
      new MutationObserver(settleMotion).observe(document.documentElement, {attributes:true,attributeFilter:['data-motion']});
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
            animation = preview.animate(shouldReduce() ? [{opacity:.6},{opacity:1}] : [{opacity:.4,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}], {duration:200,easing:'cubic-bezier(0.23, 1, 0.32, 1)'});
          }
        });
      });
      page.querySelectorAll('a[href="#landing-manifesto"]').forEach(link => {
        link.addEventListener('click', event => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          const target = page.querySelector('#landing-manifesto');
          target.scrollIntoView({behavior:shouldReduce() || !event.detail ? 'instant' : 'smooth',block:'start'});
          target.setAttribute('tabindex','-1');
          target.focus({preventScroll:true});
          window.history.replaceState(null,'','#landing-manifesto');
        });
      });
      if ('IntersectionObserver' in window && !shouldReduce()) {
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
      }
    })();
  </script>`;
}
