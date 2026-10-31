import { BRAND_MARK_SVG } from './components';
import { ACCENTS, DEFAULT_PREFS, FOUNDATION_TOKENS, DARK_SURFACE_TOKENS, LIGHT_SURFACE_TOKENS, PREF_OPTIONS, PREF_SCALE_RULES } from './theme';

export function renderPublicAccentStyles(scope: string): string {
  const tokens = (tone: typeof ACCENTS[number]['dark']) => `--accent:${tone.accent};--accent-hover:${tone.hover};--accent-text:${tone.text};--on-accent:${tone.on};`;
  // Light tones come last, so html.light (on the landing, which follows the app theme) wins.
  return `${scope}{${tokens(ACCENTS[0].dark)}}${ACCENTS.map(a => `html[data-accent="${a.id}"] ${scope}{${tokens(a.dark)}}`).join('')}`
    + `html.light ${scope}{${tokens(ACCENTS[0].light)}}${ACCENTS.map(a => `html.light[data-accent="${a.id}"] ${scope}{${tokens(a.light)}}`).join('')}`;
}

// Public pages read the accent chosen in logged-in appearance settings.
export function renderAppearanceHead(publicPage = false): string {
  const palette = Object.fromEntries(ACCENTS.map(a => [a.id, { dark: a.dark, light: a.light }]));
  const tokens = (tone: typeof ACCENTS[number]['dark']) => `--accent:${tone.accent};--accent-hover:${tone.hover};--accent-text:${tone.text};--on-accent:${tone.on};`;
  return `${publicPage ? `<style>:root{${tokens(ACCENTS[0].dark)}${FOUNDATION_TOKENS}} ${ACCENTS.map(a => `html[data-accent="${a.id}"]{${tokens(a.dark)}}`).join('')} ${PREF_SCALE_RULES}</style>` : ''}
    <script>
      (() => {
        const palette = ${JSON.stringify(palette)};
        const root = document.documentElement;
        const read = () => {
          try { const saved = JSON.parse(localStorage.getItem('jesm_prefs') || '{}'); return saved && typeof saved === 'object' ? saved : {}; }
          catch (_) { return {}; }
        };
        const validAccent = value => Object.prototype.hasOwnProperty.call(palette, value) ? value : '${DEFAULT_PREFS.accent}';
        function restorePrefs() {
          const prefs = read();
          root.setAttribute('data-accent', validAccent(prefs.accent));
          for (const [key, values] of Object.entries(${JSON.stringify(PREF_OPTIONS)})) {
            root.setAttribute('data-' + key, values.includes(prefs[key]) ? prefs[key] : ${JSON.stringify(DEFAULT_PREFS)}[key]);
          }
        }
        restorePrefs();
        let lastIcon = '';
        function sync() {
          const accent = validAccent(root.getAttribute('data-accent'));
          const tone = palette[accent][${publicPage ? "'dark'" : "root.classList.contains('light') ? 'light' : 'dark'"}];
          const iconKey = tone.accent + tone.on;
          if (iconKey === lastIcon) return;
          lastIcon = iconKey;
          const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="' + tone.accent + '"/><g fill="' + tone.on + '"><rect x="4" y="14.75" width="24" height="2.5" rx="1.25"/><rect x="8.5" y="9" width="3" height="14" rx="1.25"/><rect x="20.5" y="9" width="3" height="14" rx="1.25"/><rect x="5.5" y="11.5" width="2.25" height="9" rx="1"/><rect x="24.25" y="11.5" width="2.25" height="9" rx="1"/></g></svg>';
          // Keep one favicon candidate so a static PNG cannot override the selected color.
          const icons = Array.from(document.querySelectorAll('link[rel="icon"]'));
          const icon = icons.shift() || document.createElement('link');
          icons.forEach(item => item.remove());
          icon.rel = 'icon'; icon.type = 'image/svg+xml'; icon.removeAttribute('sizes');
          icon.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
          if (!icon.isConnected) document.head.appendChild(icon);
        }
        new MutationObserver(sync).observe(root, { attributes:true, attributeFilter:['data-accent','class'] });
        window.addEventListener('storage', event => {
          if (event.key === 'jesm_prefs' || event.key === null) {
            restorePrefs();
            if (typeof applyPrefs === 'function') { applyPrefs(getPrefs()); updateChartTheme(root.classList.contains('dark')); }
            sync();
          }
        });
        window.addEventListener('DOMContentLoaded', () => {
          const landing = document.getElementById('landing-page');
          if (landing) new MutationObserver(sync).observe(landing, {attributes:true,attributeFilter:['hidden']});
          sync();
        });
      })();
    </script>`;
}

// Public pages (landing, /programs) keep their marketing scale but are built from
// the app's tokens and component specs. The scope redeclares every token it uses: graphite by
// default (the /programs pages are always dark), paper under html.light, which only the landing
// gets, from the app's theme toggle.
export function renderPublicPatterns(scope: string): string {
  const reduced = (s: string) => `
    ${s} :is(.landing-hero-copy,.landing-ring) { animation:none !important; }
    ${s} .landing-reveal { transition:opacity 150ms ease !important; }
    ${s} .landing-reveal[data-pending] { transform:none; }
    ${s} :is(.public-button,.public-chip) { transition:background-color 150ms ease,border-color 150ms ease,color 150ms ease; }
    ${s} :is(.public-button,.public-chip):active, ${s} .public-button span, ${s} .landing-scroll span { transform:none !important; transition:none; }`;
  return `<style>
    ${scope} {
      color-scheme:dark;
      ${DARK_SURFACE_TOKENS}
      --accent-soft:color-mix(in srgb,var(--accent) 12%,transparent);
      --accent-line:color-mix(in srgb,var(--accent) 45%,transparent);
      --shadow-control:inset 0 1px 0 rgba(255,255,255,0.04),0 1px 2px rgba(0,0,0,0.3);
      background:var(--bg); color:var(--text); font-family:var(--font-sans); line-height:1.65;
      font-feature-settings:"ss01","tnum"; -webkit-font-smoothing:antialiased;
    }
    html.light ${scope} {
      color-scheme:light;
      ${LIGHT_SURFACE_TOKENS}
      --accent-soft:color-mix(in srgb,var(--accent) 10%,transparent);
      --shadow-control:inset 0 1px 0 rgba(255,255,255,0.7),0 1px 2px rgba(16,17,19,0.08);
    }
    /* Theme toggle (landing only): the icon shows the theme it switches to */
    ${scope} .site-theme { display:inline-grid; place-items:center; flex:none; width:2.5rem; height:2.5rem; padding:0; border:1px solid var(--line-strong); border-radius:var(--r-full); background:transparent; color:var(--text-2); cursor:pointer; transition:background-color var(--dur-fast) ease,color var(--dur-fast) ease,transform var(--dur-press) var(--ease-out); }
    ${scope} .site-theme:active { transform:scale(0.92) rotate(-20deg); }
    ${scope} .site-theme svg { width:1.15rem; height:1.15rem; }
    ${scope} .site-theme .is-moon, html.light ${scope} .site-theme .is-sun { display:none; }
    html.light ${scope} .site-theme .is-moon { display:block; }
    ${scope} ::selection { background:var(--accent); color:var(--on-accent); }
    ${scope} :is(a,button):focus-visible { outline:2px solid var(--accent); outline-offset:3px; border-radius:var(--r-sm); }
    ${scope} :is(h1,h2,h3) { text-wrap:balance; }

    /* Button: the app's .btn-lg, with .btn-secondary as the outline variant */
    ${scope} .public-button {
      display:inline-flex; align-items:center; justify-content:center; gap:0.5rem;
      min-height:var(--h-lg); padding:0.625rem 1.375rem; border:1px solid var(--accent); border-radius:var(--r-md);
      background:var(--accent); color:var(--on-accent); font:inherit; font-size:0.9375rem; font-weight:600; line-height:1.4;
      text-align:center; text-decoration:none; cursor:pointer; user-select:none; -webkit-user-select:none;
      box-shadow:inset 0 1px 0 rgba(255,255,255,0.25),0 1px 2px rgba(0,0,0,0.2);
      transition:transform var(--dur-press) var(--ease-out),background-color var(--dur-fast) ease,border-color var(--dur-fast) ease,color var(--dur-fast) ease;
    }
    ${scope} .public-button:active { transform:scale(0.97); }
    ${scope} .public-button.is-outline { background:var(--surface-2); color:var(--accent-text); border-color:var(--accent-line); box-shadow:var(--shadow-control); }
    ${scope} .public-button span { display:inline-block; transition:transform var(--dur-base) var(--ease-out); }

    /* Chip: the app's .chip, as a toggle (aria-pressed) or a static tag */
    ${scope} .public-chip {
      display:inline-flex; align-items:center; gap:0.375rem; min-height:1.875rem; padding:0.25rem 0.75rem;
      border:1px solid var(--line-strong); border-radius:var(--r-full); background:var(--surface);
      color:var(--text-2); font:inherit; font-size:0.8125rem; font-weight:500; line-height:1.5; white-space:nowrap;
    }
    ${scope} button.public-chip { min-height:2.75rem; padding:0.5rem 1.125rem; font-size:0.875rem; cursor:pointer;
      transition:background-color var(--dur-fast) ease,border-color var(--dur-fast) ease,color var(--dur-fast) ease,transform var(--dur-press) var(--ease-out); }
    ${scope} button.public-chip:active { transform:scale(0.96); }
    ${scope} .public-chip[aria-pressed="true"] { background:var(--accent); border-color:var(--accent); color:var(--on-accent); font-weight:600; }
    ${scope} .public-chip.is-accent { background:var(--accent-soft); border-color:transparent; color:var(--accent-text); }

    /* Card: the app's .card at marketing padding */
    ${scope} .public-card { background:var(--surface); border:1px solid var(--line); border-radius:var(--r-lg); min-width:0; }
    ${scope} .public-card.is-large { border-radius:var(--r-xl); }

    /* Section label: small accent text that names what follows */
    ${scope} .public-kicker { color:var(--accent-text); font-size:0.875rem; font-weight:500; }
    ${scope} .public-index { color:var(--accent-text); font-size:0.8125rem; font-weight:600; letter-spacing:0.08em; font-variant-numeric:tabular-nums; }

    /* Site chrome: one nav for every public page */
    ${scope} .site-nav { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1.25rem max(5vw, calc((100vw - 77.5rem) / 2), 1.25rem); }
    ${scope} .site-nav { position:relative; z-index:2; border-bottom:1px solid var(--line); }
    ${scope} .site-brand { display:inline-flex; align-items:center; gap:0.75rem; min-height:2.75rem; color:var(--text); font-size:1.125rem; font-weight:700; text-decoration:none; white-space:nowrap; }
    ${scope} .site-brand svg { width:2.25rem; height:2.25rem; flex-shrink:0; color:var(--accent); }
    ${scope} .site-links { display:flex; align-items:center; gap:1.5rem; }
    ${scope} .site-link { display:inline-flex; align-items:center; min-height:2.75rem; color:var(--text-2); font-size:0.875rem; font-weight:500; text-decoration:none; white-space:nowrap; transition:color var(--dur-fast) ease; }
    ${scope} .site-link[aria-current] { color:var(--accent-text); }
    ${scope} .site-nav .public-button { min-height:2.75rem; padding:0.5rem 1rem; font-size:0.875rem; white-space:nowrap; }
    @media (max-width:640px) {
      ${scope} .site-brand { font-size:0.9375rem; gap:0.5rem; } ${scope} .site-brand svg { width:1.75rem; height:1.75rem; }
      ${scope} .site-links { gap:0.875rem; } ${scope} .site-link { font-size:0.8125rem; }
    }
    /* Narrow phones: the mark alone carries the brand so the links keep one row */
    @media (max-width:400px) { ${scope} .site-nav .site-brand span { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; } }

    @media (hover:hover) and (pointer:fine) {
      ${scope} .public-button:hover { background:var(--accent-hover); border-color:var(--accent-hover); }
      ${scope} .public-button.is-outline:hover { background:var(--surface-3); border-color:var(--accent-line); }
      ${scope} .public-button:hover span { transform:translate(-2px,-2px); }
      ${scope} button.public-chip:not([aria-pressed="true"]):hover { border-color:var(--text-3); color:var(--text); }
      ${scope} .site-link:not([aria-current]):hover { color:var(--text); }
      ${scope} .site-theme:hover { background:var(--surface-2); color:var(--text); }
      ${scope} .public-card.is-interactive { transition:border-color var(--dur-fast) ease; }
      ${scope} .public-card.is-interactive:is(:hover,:focus-within) { border-color:var(--line-strong); }
    }
    @media (prefers-reduced-motion:reduce) { ${reduced(scope)} }
    ${reduced(`html[data-motion="reduce"] ${scope}`)}
  </style>`;
}

// A program page sits inside the programs section, so its nav link stays marked
function navCurrent(path: string, href: string): string {
  if (path === href) return ' aria-current="page"';
  return href !== '/' && path.startsWith(href + '/') ? ' aria-current="true"' : '';
}

// The same nav on / and /programs/*; only aria-current changes.
const SUN_SVG = '<svg class="is-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
const MOON_SVG = '<svg class="is-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

// The landing shares the app's document, so its toggle uses the app's toggleTheme().
export function renderPublicNav(path: string, opts: { themeToggle?: boolean } = {}): string {
  const current = (href: string) => navCurrent(path, href);
  const theme = opts.themeToggle ? `<button type="button" class="site-theme" onclick="toggleTheme()" title="تغییر حالت روز و شب" aria-label="تغییر حالت روز و شب">${SUN_SVG}${MOON_SVG}</button>` : '';
  return `<nav class="site-nav" aria-label="ناوبری اصلی">
      <a class="site-brand" href="/"${current('/')}>${BRAND_MARK_SVG}<span>جسم و اندیشه</span></a>
      <div class="site-links"><a class="site-link" href="/programs"${current('/programs')}>همه برنامه‌ها</a><a class="landing-button public-button is-outline" href="/api/auth/google">ورود به حساب <span aria-hidden="true">↖</span></a><!--chth-lang-->${theme}</div>
    </nav>`;
}

// The only footer on public pages is the shared CHTH one (filled in per language by finishPage).
export function renderPublicFooter(): string {
  return '<!--chth-footer-->';
}
