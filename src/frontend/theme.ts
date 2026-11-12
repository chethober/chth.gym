// ============================================================================
// Design System for جسم و اندیشه — "Iron & Ember"
// Graphite neutrals, one accent (the CHTH grey by default, user-selectable), one font (Vazirmatn).
//
// Appearance preferences live as data-* attributes on <html>: data-accent,
// data-text, data-radius, data-motion. Markup names roles (text-accent,
// badge-emerald, btn-primary); only the tokens here decide the colors.
//
// Rule of the system: components own their surface (background, border,
// radius, shadow); Tailwind utilities only handle layout and spacing.
// Component selectors are written as `html .x` so they win over any stray
// rounded-*/border-*/bg-* utility left on an element.
// ============================================================================

export const THEME = {
  colors: {
    grey: { 300: '#D4D4D8', 200: '#E4E4E7', 800: '#27272A', 700: '#3F3F46' },
    graphite: { 950: '#0E0F11', 900: '#16181B', 800: '#1D2024', 700: '#2A2E33' },
    paper: { 50: '#FFFFFF', 100: '#F6F6F4', 200: '#EEEEEB' },
  },
  typography: {
    fontFamily: "'Vazirmatn', system-ui, sans-serif",
  },
};

// User-selectable accents. Each is tuned per mode: `accent` fills buttons,
// `text` is the readable-on-surface variant, `on` is text placed on `accent`.
// Red and success green retain semantic roles; lime is a separate brand accent.
type AccentTone = { accent: string; hover: string; text: string; on: string };
export const ACCENTS: { id: string; name: string; dark: AccentTone; light: AccentTone }[] = [
  {
    // The default: the CHTH grey (chth-kit tokens.json, gym). The others are kept for people who pick them.
    id: 'mono', name: 'خنثی',
    dark: { accent: '#D4D4D8', hover: '#E4E4E7', text: '#E4E4E7', on: '#09090B' },
    light: { accent: '#27272A', hover: '#3F3F46', text: '#27272A', on: '#FAFAFA' },
  },
  {
    id: 'ember', name: 'اخگر',
    dark: { accent: '#FF6A2B', hover: '#FF7D45', text: '#FF8A57', on: '#1A0A02' },
    light: { accent: '#F2601F', hover: '#FF6E2E', text: '#C2410C', on: '#1A0A02' },
  },
  {
    id: 'azure', name: 'آبی',
    dark: { accent: '#4C9AFF', hover: '#66AAFF', text: '#7DB5FF', on: '#03122A' },
    light: { accent: '#2F6FEB', hover: '#3D7DF5', text: '#1D4FBF', on: '#FFFFFF' },
  },
  {
    id: 'violet', name: 'بنفش',
    dark: { accent: '#9B7BFF', hover: '#AA8EFF', text: '#B39CFF', on: '#12082E' },
    light: { accent: '#7151E8', hover: '#7E60F0', text: '#5B3CC4', on: '#FFFFFF' },
  },
  {
    id: 'pink', name: 'صورتی',
    dark: { accent: '#F2589B', hover: '#F56FA9', text: '#F78BB9', on: '#2A0614' },
    light: { accent: '#D61F69', hover: '#E2307A', text: '#A3195A', on: '#FFFFFF' },
  },
  {
    id: 'cyan', name: 'فیروزه‌ای',
    dark: { accent: '#2EC4E6', hover: '#4DCFEC', text: '#5BD3EE', on: '#031C24' },
    light: { accent: '#0891B2', hover: '#0AA0C4', text: '#0E7490', on: '#031C24' },
  },
  {
    id: 'lime', name: 'لیمویی',
    dark: { accent: '#A6FF00', hover: '#BDFF42', text: '#BDFF42', on: '#101010' },
    light: { accent: '#A6FF00', hover: '#BDFF42', text: '#416500', on: '#101010' },
  },
];

// Shared sizing and motion rhythm for public and authenticated surfaces: the gym's names for the
// CHTH kit's tokens (brand.css, inlined on every page), so a change to the kit reaches the gym.
export const FOUNDATION_TOKENS = `        --font-sans: var(--chth-font-rtl);

        --r-xs: var(--chth-radius-6);     /* badges, tiny inner controls */
        --r-sm: var(--chth-radius-sm);    /* chips, small inner controls (8px) */
        --r-md: var(--chth-radius-md);    /* buttons, inputs, inset wells (10px) */
        --r-lg: var(--chth-radius-lg);    /* cards (14px) */
        --r-xl: var(--chth-radius-xl);    /* hero, modals (20px) */
        --r-full: var(--chth-radius-full);

        --h-sm: var(--chth-space-32);     /* control heights */
        --h-md: var(--chth-space-40);
        --h-lg: var(--chth-space-48);

        --ease-out: var(--chth-ease-out);
        --ease-in-out: var(--chth-ease-in-out);
        --dur-press: var(--chth-dur-150);
        --dur-fast: var(--chth-dur-fast);
        --dur-base: var(--chth-dur-base);`;

export const DARK_SURFACE_TOKENS = `        --bg: #0E0F11;
        --bg-sunken: #0A0B0D;
        --surface: #16181B;
        --surface-2: #1D2024;
        --surface-3: #24282D;
        --line: rgba(255, 255, 255, 0.07);
        --line-strong: rgba(255, 255, 255, 0.13);
        --text: #F2F2F0;
        --text-2: #A1A1A6;
        --text-3: #6E6F75;`;

// The paper surfaces of html.light, for public pages that switch theme inside their own scope.
export const LIGHT_SURFACE_TOKENS = `        --bg: #F6F6F4;
        --bg-sunken: #EEEEEB;
        --surface: #FFFFFF;
        --surface-2: #F4F4F1;
        --surface-3: #ECECE8;
        --line: rgba(16, 17, 19, 0.08);
        --line-strong: rgba(16, 17, 19, 0.15);
        --text: #111214;
        --text-2: #55575C;
        --text-3: #85878C;`;

// Text size and corner preferences. Shared so public pages honor the same settings.
export const PREF_OPTIONS = { text: ['sm', 'md', 'lg', 'xl'], radius: ['sharp', 'md', 'round'], motion: ['full', 'reduce'] };
export const PREF_SCALE_RULES = `/* Text size preference: everything is rem-based, so the root scales the page */
      html[data-text="sm"] { font-size: 93.75%; }
      html[data-text="lg"] { font-size: 106.25%; }
      html[data-text="xl"] { font-size: 112.5%; }

      /* Corner preference */
      html[data-radius="sharp"] { --r-xs: var(--chth-radius-2); --r-sm: var(--chth-radius-4); --r-md: var(--chth-radius-6); --r-lg: var(--chth-radius-sm); --r-xl: var(--chth-radius-md); }
      html[data-radius="round"] { --r-xs: var(--chth-radius-sm); --r-sm: var(--chth-radius-md); --r-md: var(--chth-radius-lg); --r-lg: var(--chth-radius-xl); --r-xl: var(--chth-radius-24); }`;

export const DEFAULT_PREFS = { accent: 'mono', text: 'md', radius: 'md', motion: 'full' };

function renderAccentTokens(): string {
  const tone = (t: AccentTone) =>
    `--accent: ${t.accent}; --accent-hover: ${t.hover}; --accent-text: ${t.text}; --on-accent: ${t.on};`;
  return ACCENTS.filter(a => a.id !== DEFAULT_PREFS.accent).map(a => `
      html.dark[data-accent="${a.id}"] { ${tone(a.dark)} }
      html.light[data-accent="${a.id}"] { ${tone(a.light)} }`).join('') +
    // Swatches always show their own hue for the current mode, whatever accent is active
    ACCENTS.map(a => `
      html.dark [data-swatch="${a.id}"] { --swatch: ${a.dark.accent}; --swatch-on: ${a.dark.on}; }
      html.light [data-swatch="${a.id}"] { --swatch: ${a.light.accent}; --swatch-on: ${a.light.on}; }`).join('');
}

// Reduced motion applies both from the OS setting and from the in-app preference
function renderReducedMotionRules(scope: string): string {
  return `
        ${scope} *, ${scope} ::before, ${scope} ::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          scroll-behavior: auto !important;
        }
        ${scope} .chth-btn:active, ${scope} .chth-btn--icon:active, ${scope} .chth-btn--icon-sm:active, ${scope} .chth-chip:active, ${scope} .set-chip:active,
        ${scope} .option-card:active, ${scope} .chth-seg__item:active, ${scope} .chth-stepper__btn:active, ${scope} .swatch:active { transform: none; }
        /* Gentler, not zero: these keep their fade but lose the movement */
        ${scope} .rest-timer, ${scope} .rest-timer.is-leaving, ${scope} .reveal { transform: none !important; }
        ${scope} #rest-timer-svg-path { transition: none; }`;
}

export function renderThemeStyles(): string {
  return `
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              sans: ['var(--chth-font-rtl)'],
              mono: ['var(--chth-font-rtl)'],
              display: ['var(--chth-font-rtl)'],
            },
            // Layout utilities (p-4, gap-2, w-10…) and text sizes come from the CHTH kit's scales.
            spacing: Object.fromEntries([[0.5, 2], [1, 4], [1.5, 6], [2, 8], [2.5, 10], [3, 12], [3.5, 14], [4, 16], [5, 20], [6, 24], [7, 28], [8, 32], [9, 36], [10, 40], [11, 44], [12, 48], [14, 56], [16, 64], [20, 80], [24, 96]].map(([k, px]) => [k, 'var(--chth-space-' + px + ')'])),
            fontSize: {
              xs: ['var(--chth-text-12)', { lineHeight: '1rem' }], sm: ['var(--chth-text-14)', { lineHeight: '1.25rem' }],
              base: ['var(--chth-text-16)', { lineHeight: '1.5rem' }], lg: ['var(--chth-text-18)', { lineHeight: '1.75rem' }],
              xl: ['var(--chth-text-20)', { lineHeight: '1.75rem' }], '2xl': ['var(--chth-text-24)', { lineHeight: '2rem' }],
              '4xl': ['var(--chth-text-36)', { lineHeight: '2.5rem' }],
              // The small sizes the app's labels use (text-10 replaces text-10); size only, like the arbitrary values were.
              10: 'var(--chth-text-10)', 11: 'var(--chth-text-11)', 12: 'var(--chth-text-12)', 13: 'var(--chth-text-13)', 14: 'var(--chth-text-14)',
            },
            borderRadius: { sm: 'var(--chth-radius-4)', DEFAULT: 'var(--chth-radius-4)', md: 'var(--chth-radius-6)', lg: 'var(--chth-radius-sm)', xl: 'var(--chth-radius-12)', '2xl': 'var(--chth-radius-16)', '3xl': 'var(--chth-radius-24)', full: 'var(--chth-radius-full)' },
            transitionDuration: { DEFAULT: 'var(--chth-dur-150)', 100: 'var(--chth-dur-100)', 150: 'var(--chth-dur-150)', 200: 'var(--chth-dur-200)', 300: 'var(--chth-dur-300)', 500: 'var(--chth-dur-500)', 1000: 'var(--chth-dur-1000)' },
            colors: {
              // Legacy "emerald" utilities follow the user's accent
              emerald: {
                50: 'var(--accent-soft)', 100: 'var(--accent-soft)', 200: 'var(--accent-line)',
                300: 'var(--accent-text)', 400: 'var(--accent-text)', 500: 'var(--accent)', 600: 'var(--accent-text)',
                700: 'var(--accent-text)', 800: 'var(--accent-text)', 900: 'var(--accent-text)', 950: 'var(--accent-text)'
              },
              // Secondary tag hue: cool steel, never competes with the accent
              cyan: {
                50: '#F1F5F9', 100: '#E2E8F0', 200: '#CBD5E1', 300: '#A9B8CC', 400: '#8FA3BD',
                500: '#6B819E', 600: '#52657F', 700: '#3F4E63', 800: '#2E3949', 900: '#1F2733', 950: '#141A22'
              },
              zinc: {
                50: '#F6F6F4', 100: '#EEEEEB', 200: '#DEDEDA', 300: '#C4C4C0', 400: '#A1A1A6',
                500: '#7A7A80', 600: '#5A5B60', 700: '#2A2E33', 800: '#1D2024', 900: '#16181B', 950: '#0E0F11'
              },
              amber: { 300: '#F8CF79', 400: '#F5B83D', 500: '#E0A21F', 600: '#B7791F' },
              rose: { 300: '#F8A0A3', 400: '#F2555A', 500: '#E5484D', 600: '#DC2626' },
            }
          }
        }
      }
    </script>
    <style>
      /* ==========================================================================
         1. Tokens
         ========================================================================== */
      :root {
        ${FOUNDATION_TOKENS}
      }

      /* Dark: graphite */
      :root, html.dark {
        color-scheme: dark;
        ${DARK_SURFACE_TOKENS}

        --accent: #D4D4D8;
        --accent-hover: #E4E4E7;
        --accent-text: #E4E4E7;
        --on-accent: #09090B;

        --done: #3FCF8E;
        --done-soft: rgba(63, 207, 142, 0.12);
        --done-line: rgba(63, 207, 142, 0.45);
        --gold: #F5B83D;
        --gold-soft: rgba(245, 184, 61, 0.13);
        --danger: #F2555A;
        --danger-soft: rgba(242, 85, 90, 0.12);
        --steel: #A9B8CC;
        --steel-soft: rgba(143, 163, 189, 0.13);

        --shadow-card: inset 0 1px 0 rgba(255, 255, 255, 0.03);
        --shadow-control: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 1px 2px rgba(0, 0, 0, 0.3);
        --shadow-pop: 0 0 0 1px rgba(255, 255, 255, 0.06), 0 16px 40px -12px rgba(0, 0, 0, 0.7);
        --backdrop: rgba(5, 6, 7, 0.7);

        --plate-yellow: #F5B83D;
        --plate-green: #A1A1A6;
        --plate-white: #5A5B60;
        --color-bar: #7A7A80;
      }

      /* Light: paper */
      html.light {
        color-scheme: light;
        --bg: #F6F6F4;
        --bg-sunken: #EEEEEB;
        --surface: #FFFFFF;
        --surface-2: #F4F4F1;
        --surface-3: #ECECE8;
        --line: rgba(16, 17, 19, 0.08);
        --line-strong: rgba(16, 17, 19, 0.15);
        --text: #111214;
        --text-2: #55575C;
        --text-3: #85878C;

        --accent: #27272A;
        --accent-hover: #3F3F46;
        --accent-text: #27272A;
        --on-accent: #FAFAFA;

        --done: #16A34A;
        --done-soft: rgba(22, 163, 74, 0.09);
        --done-line: rgba(22, 163, 74, 0.45);
        --gold: #B7791F;
        --gold-soft: rgba(224, 162, 31, 0.13);
        --danger: #DC2626;
        --danger-soft: rgba(220, 38, 38, 0.08);
        --steel: #52657F;
        --steel-soft: rgba(82, 101, 127, 0.1);

        --shadow-card: 0 1px 2px rgba(16, 17, 19, 0.04), 0 1px 1px rgba(16, 17, 19, 0.02);
        --shadow-control: 0 1px 2px rgba(16, 17, 19, 0.06);
        --shadow-pop: 0 0 0 1px rgba(16, 17, 19, 0.06), 0 16px 40px -12px rgba(16, 17, 19, 0.25);
        --backdrop: rgba(17, 18, 20, 0.4);

        --plate-yellow: #E0A21F;
        --plate-green: #85878C;
        --plate-white: #C4C4C0;
        --color-bar: #A1A1A6;
      }

      /* Accent presets (ember is the default above) */${renderAccentTokens()}

      /* Everything tinted by the accent derives from it, so any preset gets them free */
      :root, html.dark {
        --accent-soft: color-mix(in srgb, var(--accent) 12%, transparent);
        --accent-line: color-mix(in srgb, var(--accent) 45%, transparent);
      }
      html.light {
        --accent-soft: color-mix(in srgb, var(--accent) 9%, transparent);
        --accent-line: color-mix(in srgb, var(--accent) 45%, transparent);
      }
      :root, html.dark, html.light {
        --plate-red: var(--accent);
        --plate-blue: color-mix(in srgb, var(--accent) 82%, #000);
        --viz-1: var(--accent);
        --viz-1-hover: var(--accent-hover);
      }

      ${PREF_SCALE_RULES}

      /* Back-compat aliases for any remaining inline references */
      :root, html.dark, html.light {
        --color-bg-base: var(--bg);
        --color-bg-sunken: var(--bg-sunken);
        --color-surface: var(--surface);
        --color-surface-2: var(--surface-2);
        --color-line: var(--line);
        --color-line-strong: var(--line-strong);
        --color-text-primary: var(--text);
        --color-text-secondary: var(--text-2);
        --color-text-muted: var(--text-3);
        --color-primary: var(--accent);
      }

      /* Component selectors are specific; plain .hidden must still win.
         Responsive/dark variants (hidden md:flex, hidden dark:block) are left to Tailwind. */
      html .hidden:not([class*="sm:"]):not([class*="md:"]):not([class*="lg:"]):not([class*="xl:"]):not([class*="dark:"]) { display: none; }

      /* ==========================================================================
         2. Base & Typography
         ========================================================================== */
      html {
        font-family: var(--font-sans);
        scrollbar-gutter: stable;
        overflow-y: scroll;
        scrollbar-color: var(--line-strong) transparent;
        scrollbar-width: thin;
      }
      body {
        font-family: var(--font-sans);
        background-color: var(--bg);
        color: var(--text);
        -webkit-tap-highlight-color: transparent;
        font-feature-settings: "ss01", "tnum";
        line-height: 1.65;
        text-rendering: optimizeLegibility;
      }
      button, input, optgroup, select, textarea, dialog { font-family: var(--font-sans); }
      .font-mono, code, pre, kbd {
        font-family: var(--font-sans) !important;
        font-variant-numeric: tabular-nums;
      }

      #dashboard-shell h1, #dashboard-shell h2, .font-display, .stat-value {
        font-family: var(--font-sans);
        font-weight: 800 !important;
        letter-spacing: -0.01em;
        line-height: 1.3;
      }
      #dashboard-shell main section > div > h2,
      #dashboard-shell main section > h2 {
        font-size: var(--chth-text-18) !important;
      }
      /* Quiet hierarchy: titles are labels, content carries the weight */
      #dashboard-shell main h3, #dashboard-shell main h4 { font-weight: 600 !important; }
      main h3.text-sm, main h3.text-base, main h3.text-xs { font-size: var(--chth-text-14) !important; }
      main h4.text-xs { font-size: var(--chth-text-13) !important; }
      main h3 > i[data-lucide], main h4 > i[data-lucide] { width: 0.875rem; height: 0.875rem; }
      .font-black { font-weight: 800; }

      /* Persian script gets hard to read under 11px */
      .text-\\[8px\\], .text-\\[9px\\] { font-size: var(--chth-text-10) !important; }
      .text-\\[10px\\] { font-size: var(--chth-text-11) !important; }

      :focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
      ::selection { background: var(--accent); color: var(--on-accent); }

      /* Theme and accent swaps crossfade the whole page as one composited layer
         (crossfade() in html.ts), so canvas, SVG and shadows change with the rest */
      ::view-transition-old(root), ::view-transition-new(root) {
        animation-duration: var(--dur-base);
        animation-timing-function: ease;
      }

      /* Section headings inside cards: icon + title, one look everywhere */
      #dashboard-shell main h3, #dashboard-shell main h4 { letter-spacing: -0.005em; }
      main h3 > i[data-lucide], main h4 > i[data-lucide] { color: var(--accent-text); }

      /* ==========================================================================
         3. Surfaces
         One card, one inset well, one list row. Everything else is an alias.
         ========================================================================== */
      html .card,
      html .card-glass, html .glass-card,
      html .card-glass-elevated, html .glass-card-elevated,
      html .card-glass-interactive,
      html .hero-panel {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: var(--r-lg);
        box-shadow: var(--shadow-card);
      }
      html .hero-panel { border-radius: var(--r-xl); }

      /* Highlighted card: the one thing on screen that needs attention */
      html .card-accent {
        border-color: var(--accent-line);
        box-shadow: var(--shadow-card), 0 0 0 3px var(--accent-soft);
      }

      html .card-glass-interactive {
        transition: border-color var(--dur-fast) ease, transform var(--dur-base) var(--ease-out);
      }
      @media (hover: hover) and (pointer: fine) {
        html .card-glass-interactive:hover { border-color: var(--line-strong); }
      }

      /* Inset well: grouped content inside a card (rows, controls, notes) */
      html .card-glass-subtle, html .glass-card-subtle, html .well {
        background: var(--surface-2);
        border: 1px solid var(--line);
        border-radius: var(--r-md);
        box-shadow: none;
      }
      html .well-sunken {
        background: var(--bg-sunken);
        border: 1px solid var(--line);
        border-radius: var(--r-md);
      }
      html.light .well-sunken { background: var(--surface-2); }

      /* Callout: tinted note, used for banners and insights */
      html .callout {
        background: var(--accent-soft);
        border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
        border-radius: var(--r-md);
        color: var(--text);
      }

      /* Card header: title block on one side, actions on the other, hairline under */
      .card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--chth-space-12);
        padding-bottom: var(--chth-space-14);
        border-bottom: 1px solid var(--line);
      }
      .divider-top { border-top: 1px solid var(--line); }
      /* Text people type: may be one unbroken token (#hashtag, URL), so break it if it has to */
      .text-wrap-safe { overflow-wrap: anywhere; }

      /* Empty states */
      .empty-state {
        text-align: center;
        padding: var(--chth-space-28) var(--chth-space-16);
        border: 1px dashed var(--line-strong);
        border-radius: var(--r-md);
        color: var(--text-3);
        font-size: var(--chth-text-13);
      }

      /* Retired effects */
      .glow-emerald, .glow-gold, .glow-cyan, .glow-purple, .glow-rose { box-shadow: none !important; }

      /* ==========================================================================
         4. Buttons
         Three sizes by height, five variants. Press = scale(0.97).
         ========================================================================== */
      html .chth-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--chth-space-8);
        height: var(--h-md);
        padding: 0 var(--chth-space-16);
        font-size: var(--chth-text-14);
        font-weight: 600;
        line-height: 1;
        white-space: nowrap;
        border-radius: var(--r-md);
        border: 1px solid transparent;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
        transition:
          transform var(--dur-press) var(--ease-out),
          background-color var(--dur-fast) ease,
          border-color var(--dur-fast) ease,
          color var(--dur-fast) ease,
          box-shadow var(--dur-fast) ease;
      }
      html .chth-btn:active { transform: scale(0.97); }
      html .chth-btn:disabled, html .chth-btn[aria-disabled="true"] { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
      html .chth-btn i[data-lucide], html .chth-btn svg { width: 1rem; height: 1rem; flex-shrink: 0; }

      html .chth-btn--sm { height: var(--h-sm); padding: 0 var(--chth-space-12); font-size: var(--chth-text-13); gap: var(--chth-space-6); border-radius: var(--r-sm); }
      html .chth-btn--sm i[data-lucide], html .chth-btn--sm svg { width: 0.875rem; height: 0.875rem; }
      html .chth-btn--md { height: var(--h-md); padding: 0 var(--chth-space-16); font-size: var(--chth-text-14); }
      html .chth-btn--lg { height: var(--h-lg); padding: 0 var(--chth-space-22); font-size: var(--chth-text-15); }
      html .chth-btn--block { width: 100%; }

      html .chth-btn--primary {
        background: var(--accent);
        color: var(--on-accent) !important;
        border-color: transparent;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 1px 2px rgba(0, 0, 0, 0.2);
      }
      html .chth-btn--secondary {
        background: var(--surface-2);
        color: var(--accent-text) !important;
        border-color: var(--accent-line);
        box-shadow: var(--shadow-control);
      }
      html.light .chth-btn--secondary { background: var(--surface); }
      html .chth-btn--ghost {
        background: transparent;
        color: var(--accent-text);
        border-color: transparent;
      }
      html .chth-btn--danger {
        background: var(--danger-soft);
        color: var(--danger) !important;
        border-color: transparent;
      }
      html .chth-btn--dashed {
        background: transparent;
        color: var(--text-2);
        border: 1px dashed var(--line-strong);
      }

      @media (hover: hover) and (pointer: fine) {
        html .chth-btn--primary:hover { background: var(--accent-hover); }
        html .chth-btn--secondary:hover { background: var(--surface-3); }
        html.light .chth-btn--secondary:hover { background: var(--surface-2); }
        html .chth-btn--ghost:hover { background: var(--surface-2); color: var(--text); }
        html .chth-btn--danger:hover { background: var(--danger); color: #fff !important; }
        html .chth-btn--dashed:hover { border-color: var(--accent-line); color: var(--accent-text); background: var(--accent-soft); }
      }

      /* Icon buttons: square, same heights as text buttons */
      html .chth-btn--icon, html .chth-btn--icon-sm {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        padding: 0;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: var(--r-md);
        cursor: pointer;
        transition:
          transform var(--dur-press) var(--ease-out),
          background-color var(--dur-fast) ease,
          color var(--dur-fast) ease;
      }
      html .chth-btn--icon-sm { width: var(--h-sm); height: var(--h-sm); border-radius: var(--r-sm); }
      html .chth-btn--icon:active, html .chth-btn--icon-sm:active { transform: scale(0.94); }
      html .chth-btn--icon:not(.chth-btn--secondary):not(.chth-btn--danger):not(.chth-btn--primary),
      html .chth-btn--icon-sm:not(.chth-btn--secondary):not(.chth-btn--danger):not(.chth-btn--primary) { color: var(--accent-text); }
      html .chth-btn--icon.chth-btn--danger, html .chth-btn--icon-sm.chth-btn--danger { color: var(--danger); }
      html .chth-btn--icon-danger { color: var(--text-3) !important; }
      @media (hover: hover) and (pointer: fine) {
        html .chth-btn--icon-danger:hover { background: var(--danger-soft) !important; color: var(--danger) !important; }
      }

      /* The account chip in the CHTH navbar: round, like the icons beside it */
      html .chth-nav__auth { display: flex; align-items: center; gap: var(--chth-space-2); }
      html .chth-nav__auth .account-chip { border-radius: var(--chth-radius-full); }
      html .chth-nav__auth .chth-btn--icon { width: 2rem; height: 2rem; border-radius: var(--chth-radius-full); }
      @media (max-width: 640px) { html .chth-nav__auth .account-chip span { display: none; } }

      /* Text link button */
      html .link-btn {
        display: inline-flex;
        align-items: center;
        gap: var(--chth-space-6);
        font-size: var(--chth-text-13);
        font-weight: 600;
        color: var(--accent-text);
        border-radius: var(--r-xs);
        transition: opacity var(--dur-fast) ease;
      }
      @media (hover: hover) and (pointer: fine) {
        html .link-btn:hover { opacity: 0.75; }
      }

      /* ==========================================================================
         5. Selection controls: segmented, chips, option cards, switch
         ========================================================================== */
      html .chth-seg {
        display: inline-flex;
        align-items: center;
        gap: var(--chth-space-2);
        padding: var(--chth-space-2);
        background: var(--bg-sunken);
        border: 1px solid var(--line);
        border-radius: var(--r-md);
      }
      html.light .chth-seg { background: var(--surface-3); }
      html .chth-seg .chth-seg__item {
        height: 1.75rem;
        padding: 0 var(--chth-space-14);
        font-size: var(--chth-text-13);
        font-weight: 500;
        color: var(--text-2);
        border-radius: max(2px, calc(var(--r-md) - 3px));
        transition: background-color var(--dur-fast) ease, color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);
      }
      html .chth-seg .chth-seg__item:active { transform: scale(0.97); }
      html .chth-seg .chth-seg__item.is-active {
        background: var(--accent-soft);
        color: var(--accent-text);
        font-weight: 600;
        box-shadow: var(--shadow-control);
      }
      html.light .chth-seg .chth-seg__item.is-active { background: var(--accent-soft); }
      @media (hover: hover) and (pointer: fine) {
        html .chth-seg .chth-seg__item:not(.is-active):hover { color: var(--text); }
      }

      html .chth-chip {
        display: inline-flex;
        align-items: center;
        gap: var(--chth-space-6);
        height: 1.875rem;
        padding: 0 var(--chth-space-12);
        font-size: var(--chth-text-13);
        font-weight: 500;
        color: var(--text-2);
        background: var(--surface);
        border: 1px solid var(--line-strong);
        border-radius: var(--r-full);
        transition: background-color var(--dur-fast) ease, border-color var(--dur-fast) ease, color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);
      }
      html .chth-chip:active { transform: scale(0.96); }
      html .chth-chip.is-selected {
        background: var(--accent);
        border-color: var(--accent);
        color: var(--on-accent);
        font-weight: 600;
      }
      @media (hover: hover) and (pointer: fine) {
        html .chth-chip:not(.is-selected):hover { border-color: var(--text-3); color: var(--text); }
      }

      /* Option card: a large selectable tile (theme picker) */
      html .option-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--chth-space-6);
        padding: var(--chth-space-14) var(--chth-space-8);
        font-size: var(--chth-text-13);
        color: var(--text);
        background: var(--surface-2);
        border: 1px solid var(--line);
        border-radius: var(--r-md);
        transition: border-color var(--dur-fast) ease, background-color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);
      }
      html .option-card:active { transform: scale(0.97); }
      html .option-card i[data-lucide] { color: var(--text-2); }
      html .option-card.active, html .option-card.is-selected {
        border-color: var(--accent);
        background: var(--accent-soft);
        box-shadow: inset 0 0 0 1px var(--accent);
      }
      html .option-card.active i[data-lucide], html .option-card.is-selected i[data-lucide] { color: var(--accent-text); }
      @media (hover: hover) and (pointer: fine) {
        html .option-card:not(.active):hover { border-color: var(--line-strong); }
      }

      /* Accent swatch: a color dot that rings itself when chosen */
      html .swatch {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: var(--r-full);
        background: var(--swatch);
        color: var(--swatch-on);
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
        cursor: pointer;
        transition: box-shadow var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);
      }
      html .swatch:active { transform: scale(0.94); }
      html .swatch i[data-lucide], html .swatch svg {
        width: 1rem;
        height: 1rem;
        opacity: 0;
        transform: scale(0.6);
        transition: opacity var(--dur-fast) ease, transform var(--dur-base) var(--ease-out);
      }
      html .swatch.is-selected {
        box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--swatch);
      }
      html .swatch.is-selected i[data-lucide], html .swatch.is-selected svg { opacity: 1; transform: none; }
      /* All seven fit one line on a phone; spread evenly up to a comfortable width */
      .swatch-row { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--chth-space-8); max-width: 22rem; padding: var(--chth-space-4); }

      /* Settings rows: label on one side, control on the other */
      .pref-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--chth-space-12);
        flex-wrap: wrap;
        padding-top: var(--chth-space-14);
        border-top: 1px solid var(--line);
      }
      .pref-label { font-size: var(--chth-text-13); font-weight: 600; color: var(--text); }
      .pref-hint { font-size: var(--chth-text-12); color: var(--text-3); }

      /* The CHTH kit's components (buttons, badges, fields, chips, segmented controls, steppers,
         switches; chth-kit/brand.css) take the gym's accent, palette and corner preference here.
         The rules in this file are the gym's own look on top of the kit's classes. */
      html {
        --chth-product-accent-hover: var(--accent-hover);
        --chth-product-on-accent: var(--on-accent);
        --chth-product-accent-soft: var(--accent-soft);
        --chth-success: var(--done); --chth-success-soft: var(--done-soft);
        --chth-danger: var(--danger); --chth-danger-soft: var(--danger-soft);
        --chth-warning: var(--gold); --chth-warning-soft: var(--gold-soft);
        --chth-telegram: var(--steel); --chth-telegram-soft: var(--steel-soft);
        --chth-btn-radius: var(--r-md);
        --chth-field-radius: var(--r-md);
        --chth-field-focus: var(--accent);
        --chth-field-h: var(--h-md);
        --chth-field-font: var(--chth-text-14);
        --chth-chip-radius: var(--r-full);
        --chth-badge-radius: var(--r-xs);
        --chth-seg-radius: var(--r-md);
        --chth-dialog-radius: var(--r-xl);
        --chth-card-radius: var(--r-lg);
      }
      @media (pointer: coarse) { html { --chth-field-font: var(--chth-text-16); } }
      /* The segmented thumb: the gym's soft accent chip, sliding */
      html .chth-seg__thumb { background: var(--accent-soft); box-shadow: var(--shadow-control); border-radius: max(2px, calc(var(--r-md) - 3px)); top: var(--chth-space-2); bottom: var(--chth-space-2); }
      html .chth-seg { position: relative; }
      html .chth-seg .chth-seg__item { opacity: 1; min-height: 0; }
      /* The gym's smaller switch, its thumb white on a coloured accent */
      html .chth-switch__track { width: 2.375rem; height: 1.375rem; }
      html .chth-switch__thumb { width: 1rem; height: 1rem; inset-block-start: 2px; inset-inline-start: 2px; }
      html .chth-switch__input:checked + .chth-switch__track .chth-switch__thumb { transform: translateX(1rem); background: #fff; }
      html[dir="rtl"] .chth-switch__input:checked + .chth-switch__track .chth-switch__thumb { transform: translateX(-1rem); }
      html[data-accent="mono"] .chth-switch__input:checked + .chth-switch__track .chth-switch__thumb { background: var(--on-accent); }
      html .chth-stepper__input { width: auto; }
      html .chth-chip, html .chth-badge { min-height: 0; }
      /* The switch: the gym's neutral track, its accent when on */
      html .chth-switch__track { background: var(--surface-3); box-shadow: inset 0 0 0 1px var(--line-strong); }
      html .chth-switch__input:checked + .chth-switch__track { box-shadow: none; }

      /* ==========================================================================
         6. Badges
         ========================================================================== */
      html .chth-badge {
        display: inline-flex;
        align-items: center;
        gap: var(--chth-space-4);
        height: 1.375rem;
        padding: 0 var(--chth-space-8);
        border-radius: var(--r-xs);
        font-size: var(--chth-text-11);
        font-weight: 600;
        line-height: 1;
        white-space: nowrap;
        border: 1px solid transparent;
        background: var(--surface-3);
        color: var(--text-2);
      }
      html .chth-badge i[data-lucide] { width: 0.75rem; height: 0.75rem; }
      /* A badge carrying data (BMI + category) may wrap instead of overflowing on narrow phones */
      html .chth-badge.chth-badge--wrap { height: auto; min-height: 1.375rem; padding-block: var(--chth-space-4); white-space: normal; line-height: 1.4; }
      html .chth-badge--accent { background: var(--accent-soft); color: var(--accent-text); }
      html .chth-badge--info, html .chth-badge--info { background: var(--steel-soft); color: var(--steel); }
      html .chth-badge--warning, html .chth-badge--warning { background: var(--gold-soft); color: var(--gold); }
      html .chth-badge--danger { background: var(--danger-soft); color: var(--danger); }
      html .chth-badge--success { background: var(--done-soft); color: var(--done); }
      html .chth-badge--neutral, html .chth-badge--neutral { background: var(--surface-3); color: var(--text-2); }
      html .chth-badge--live { background: var(--danger); color: #fff; }
      /* Badges sitting on top of imagery */
      html .chth-badge--overlay {
        background: rgba(14, 15, 17, 0.72) !important;
        color: #F2F2F0 !important;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }

      /* ==========================================================================
         7. Form Controls
         One height (40px), one radius, one focus ring.
         ========================================================================== */
      .field { display: flex; flex-direction: column; gap: var(--chth-space-6); }

      html .chth-field__label {
        display: block;
        font-size: var(--chth-text-13);
        font-weight: 500;
        color: var(--text-2);
        margin-bottom: var(--chth-space-6);
      }

      html .chth-input, html .chth-select, html .chth-textarea {
        width: 100%;
        height: var(--h-md);
        padding: 0 var(--chth-space-14);
        font-size: var(--chth-text-14);
        color: var(--text);
        background-color: var(--bg-sunken);
        border: 1px solid var(--line-strong);
        border-radius: var(--r-md);
        box-shadow: none;
        transition: border-color var(--dur-fast) ease, box-shadow var(--dur-fast) ease, background-color var(--dur-fast) ease;
      }
      html.light .chth-input, html.light .chth-select, html.light .chth-textarea {
        background-color: var(--surface);
        box-shadow: var(--shadow-control);
      }
      html .chth-textarea { height: auto; min-height: 5.5rem; padding: var(--chth-space-10) var(--chth-space-14); }
      html .chth-input--sm { height: var(--h-sm); font-size: var(--chth-text-13); padding: 0 var(--chth-space-10); border-radius: var(--r-sm); }

      @media (hover: hover) and (pointer: fine) {
        html .chth-input:hover:not(:focus), html .chth-select:hover:not(:focus), html .chth-textarea:hover:not(:focus) {
          border-color: var(--text-3);
        }
      }
      html .chth-input:focus, html .chth-select:focus, html .chth-textarea:focus {
        outline: none;
        border-color: var(--accent);
        box-shadow: 0 0 0 3px var(--accent-soft);
      }
      html .chth-input::placeholder, html .chth-textarea::placeholder { color: var(--text-3); }
      html .chth-input[type="number"] { font-variant-numeric: tabular-nums; }
      html .chth-input[type="number"]::-webkit-inner-spin-button,
      html .chth-input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      html .chth-input[type="number"] { -moz-appearance: textfield; }

      /* Input with leading icon (search) */
      .input-icon { position: relative; }
      .input-icon > i[data-lucide], .input-icon > svg {
        position: absolute;
        inset-inline-start: 0.875rem;
        top: 50%;
        transform: translateY(-50%);
        width: 1rem;
        height: 1rem;
        color: var(--text-3);
        pointer-events: none;
      }
      html .input-icon > .chth-input { padding-inline-start: var(--chth-space-40); }

      /* Native select with our own chevron, placed for RTL */
      html .chth-select, html select.chth-input {
        appearance: none;
        -webkit-appearance: none;
        cursor: pointer;
        padding-inline-end: var(--chth-space-36);
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2385878C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-size: 1rem;
        background-position: left 0.75rem center;
      }
      [dir="ltr"] .chth-select { background-position: right 0.75rem center; }

      /* Range */
      html .range {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 1.25rem;
        background: transparent;
        cursor: pointer;
      }
      html .range::-webkit-slider-runnable-track { height: 4px; border-radius: var(--chth-radius-4); background: var(--line-strong); }
      html .range::-moz-range-track { height: 4px; border-radius: var(--chth-radius-4); background: var(--line-strong); }
      html .range::-moz-range-progress { height: 4px; border-radius: var(--chth-radius-4); background: var(--accent); }
      html .range::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px; height: 16px; margin-top: calc(-1 * var(--chth-space-6));
        border-radius: 50%;
        background: #fff;
        border: 2px solid var(--accent);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        transition: transform var(--dur-press) var(--ease-out);
      }
      html .range::-moz-range-thumb {
        width: 12px; height: 12px;
        border-radius: 50%;
        background: #fff;
        border: 2px solid var(--accent);
      }
      html .range:active::-webkit-slider-thumb { transform: scale(1.15); }

      input[type="checkbox"], input[type="radio"] { accent-color: var(--accent); }

      /* Stepper: − value + */
      html .chth-stepper {
        display: inline-flex;
        align-items: center;
        gap: var(--chth-space-4);
        height: var(--h-sm);
        padding: 0 var(--chth-space-4);
        background: var(--surface);
        border: 1px solid var(--line-strong);
        border-radius: var(--r-sm);
        flex-shrink: 0;
      }
      html.light .chth-stepper { box-shadow: var(--shadow-control); }
      html .chth-stepper__label {
        font-size: var(--chth-text-12);
        color: var(--text-3);
        padding-inline: var(--chth-space-4);
      }
      html .chth-stepper__input {
        min-width: 2rem;
        text-align: center;
        font-size: var(--chth-text-14);
        font-weight: 700;
        color: var(--text);
        font-variant-numeric: tabular-nums;
      }
      html .chth-stepper__unit { font-size: var(--chth-text-11); color: var(--text-3); padding-inline-end: var(--chth-space-4); }
      html .chth-stepper__btn {
        width: 1.5rem;
        height: 1.5rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        line-height: 1;
        border-radius: var(--r-xs);
        color: var(--accent-text);
        background: var(--surface-3);
        transition: background-color var(--dur-fast) ease, color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);
      }
      html .chth-stepper__btn:active { transform: scale(0.9); }
      @media (hover: hover) and (pointer: fine) {
        html .chth-stepper__btn:hover { background: var(--accent-soft); color: var(--accent-text); }
      }

      /* ==========================================================================
         8. Icon Boxes & Avatars
         ========================================================================== */
      html .icon-box {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border-radius: var(--r-md);
        background: var(--surface-3);
        color: var(--text-2);
      }
      html .icon-box i[data-lucide] { color: inherit !important; }
      html .icon-box-emerald { background: var(--accent-soft); color: var(--accent-text); }
      html .icon-box-cyan { background: var(--steel-soft); color: var(--steel); }
      html .icon-box-gold { background: var(--gold-soft); color: var(--gold); }
      html .icon-box-purple { background: var(--surface-3); color: var(--text-2); }
      html .icon-box-rose { background: var(--danger-soft); color: var(--danger); }
      html .icon-box-done { background: var(--done-soft); color: var(--done); }

      /* Exercise GIF thumbnail: the GIFs are drawn on white, so the frame stays white in both modes */
      html .thumb {
        flex-shrink: 0;
        object-fit: cover;
        background: #fff;
        border: 1px solid var(--line);
        border-radius: var(--r-sm);
      }

      .avatar-frame {
        border-radius: var(--r-full);
        border: 1px solid var(--line-strong);
        background: var(--surface-2);
      }

      /* ==========================================================================
         9. Stats
         ========================================================================== */
      html .stat-tile {
        padding: var(--chth-space-16) var(--chth-space-18);
        border-radius: var(--r-lg);
        background: var(--surface);
        border: 1px solid var(--line);
        box-shadow: var(--shadow-card);
        display: flex;
        flex-direction: column;
        gap: var(--chth-space-4);
      }
      .stat-tile .icon-box { display: none; }
      .stat-label { font-size: var(--chth-text-12); color: var(--text-2); }
      /* Big standalone numbers use proportional figures; tabular only in columns */
      .stat-value { font-size: var(--chth-text-20); color: var(--text); font-feature-settings: "ss01"; font-variant-numeric: proportional-nums; }
      .stat-delta { font-size: var(--chth-text-12); color: var(--text-3); display: flex; gap: var(--chth-space-6); flex-wrap: wrap; }
      .stat-delta-mark { font-weight: 600; }
      .stat-delta-mark.is-good { color: var(--done); }
      .stat-delta-mark.is-bad { color: var(--danger); }
      .stat-delta-mark.is-neutral { color: var(--text-2); }

      html .metric-pill {
        background: var(--surface-2);
        padding: var(--chth-space-6) var(--chth-space-12);
        border-radius: var(--r-md);
        border: 1px solid var(--line);
        text-align: center;
        min-width: 4.5rem;
      }

      /* ==========================================================================
         10. Progress
         ========================================================================== */
      .progress-track {
        width: 100%;
        height: 6px;
        border-radius: var(--r-full);
        background: var(--line-strong);
        overflow: hidden;
      }
      .progress-bar-emerald, .progress-bar-gold {
        height: 100%;
        border-radius: var(--r-full);
        transition: width var(--chth-dur-400) var(--ease-out);
      }
      .progress-bar-emerald { background: var(--accent); }
      .progress-bar-gold { background: var(--gold); }

      /* ==========================================================================
         11. Workout sets: done is green, everywhere
         ========================================================================== */
      html .card-done { border-color: var(--done-line); }

      html .set-chip {
        display: inline-flex;
        align-items: center;
        gap: var(--chth-space-6);
        height: var(--h-sm);
        padding: 0 var(--chth-space-10);
        font-size: var(--chth-text-13);
        font-weight: 500;
        color: var(--text-2);
        background: var(--surface);
        border: 1px solid var(--line-strong);
        border-radius: var(--r-sm);
        cursor: pointer;
        transition: background-color var(--dur-fast) ease, border-color var(--dur-fast) ease, color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);
      }
      html .set-chip:active { transform: scale(0.95); }
      html .set-chip i[data-lucide] { width: 0.875rem; height: 0.875rem; }
      html .set-chip.is-done {
        background: var(--done-soft);
        border-color: var(--done-line);
        color: var(--done);
        font-weight: 600;
      }
      html .set-chip-add { border-style: dashed; background: transparent; }
      @media (hover: hover) and (pointer: fine) {
        html .set-chip:not(.is-done):hover { border-color: var(--done-line); color: var(--text); }
        html .set-chip-add:hover { border-color: var(--accent-line) !important; color: var(--accent-text) !important; }
      }

      /* Ongoing workout: one row per movement */
      html .ex-list {
        background: var(--surface-2);
        border: 1px solid var(--line);
        border-radius: var(--r-lg);
      }
      html .ex-row {
        display: flex;
        align-items: center;
        gap: var(--chth-space-8);
        padding: var(--chth-space-10) var(--chth-space-12);
      }
      html .ex-row + .ex-row { border-top: 1px solid var(--line); }
      html .ex-row-main {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: var(--chth-space-12);
        padding: var(--chth-space-4);
        margin: calc(-1 * var(--chth-space-4));
        text-align: start;
        border-radius: var(--r-md);
        transition: background-color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);
      }
      html .ex-row-main:active { transform: scale(0.98); }
      @media (hover: hover) and (pointer: fine) {
        html .ex-row-main:hover { background: var(--surface-3); }
      }
      html .ex-row-thumb {
        width: 2.5rem;
        height: 2.5rem;
        flex-shrink: 0;
        object-fit: cover;
        background: #fff;
        border: 1px solid var(--line);
        border-radius: var(--r-sm);
      }
      html .ex-row-thumb.icon-box { background: var(--surface-3); border-color: transparent; }
      html .ex-row-name {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        font-size: var(--chth-text-13);
        font-weight: 700;
        line-height: 1.35;
        color: var(--text);
      }
      html .ex-row-meta {
        display: block;
        margin-top: var(--chth-space-2);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: var(--chth-text-11);
        color: var(--text-3);
        font-variant-numeric: tabular-nums;
      }
      /* Phones: the controls stay on the name's line; the thumbnail goes (the popup shows it).
         Only very narrow lists (huge text) drop the controls to a second line. */
      html .ex-list { container: exlist / inline-size; }
      @container exlist (max-width: 26rem) {
        html .ex-row { gap: var(--chth-space-6); padding-inline: var(--chth-space-10); }
        html .ex-row-thumb { display: none; }
        html .ex-row .rep-pill-btn { width: 1.625rem; height: 1.625rem; }
        html .ex-row .set-ring { width: 2.5rem; height: 2.5rem; }
      }
      @container exlist (max-width: 16rem) {
        html .ex-row { flex-wrap: wrap; row-gap: var(--chth-space-8); }
        html .ex-row-main { flex-basis: 100%; }
        html .ex-row .set-ring { margin-inline-start: auto; }
      }
      /* Weight after the sets × reps, split by a thin rule (a middle dot reads as a Persian zero) */
      html .ex-row-meta [data-weight-label-for]:not(:empty) {
        margin-inline-start: var(--chth-space-6);
        padding-inline-start: var(--chth-space-6);
        border-inline-start: 1px solid var(--line-strong);
      }
      /* The superset note sits on its own line inside the clipped meta; it ellipsizes too */
      html .ex-row-meta > .block { overflow: hidden; text-overflow: ellipsis; }
      html .ex-row.is-done .ex-row-name {
        color: var(--text-3);
        text-decoration: line-through;
        text-decoration-color: var(--done-line);
      }

      /* Rolling number inside a counter; the wrapper clips the roll */
      .roll { display: inline-block; }
      html .chth-stepper__input { overflow: hidden; }

      /* Rep counter: round − / + around a rolling number */
      html .rep-pill {
        display: inline-flex;
        align-items: center;
        flex-shrink: 0;
        gap: var(--chth-space-2);
        padding: var(--chth-space-2);
        border-radius: var(--r-full);
        background: var(--surface-3);
      }
      html .rep-pill-btn {
        width: 1.75rem;
        height: 1.75rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        line-height: 1;
        color: var(--text-2);
        background: var(--surface);
        border-radius: var(--r-full);
        transition: background-color var(--dur-fast) ease, color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);
      }
      html .rep-pill-btn:active { transform: scale(0.88); }
      @media (hover: hover) and (pointer: fine) {
        html .rep-pill-btn:hover { background: var(--accent-soft); color: var(--accent-text); }
      }
      html .rep-pill-value {
        min-width: 1.5rem;
        overflow: hidden;
        text-align: center;
        font-size: var(--chth-text-15);
        font-weight: 800;
        line-height: 1.75rem;
        color: var(--text);
        font-variant-numeric: tabular-nums;
      }

      /* Set ring: tap to log the next set; the ring fills as sets land */
      html .set-ring {
        position: relative;
        width: 2.75rem;
        height: 2.75rem;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--text);
        border-radius: var(--r-full);
        transition: background-color var(--dur-fast) ease, color var(--dur-fast) ease, opacity var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);
      }
      html .set-ring:active { transform: scale(0.9); }
      html .set-ring > svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
      html .set-ring-track { fill: none; stroke: var(--line-strong); stroke-width: 3.5; }
      html .set-ring-fill {
        fill: none;
        stroke: var(--accent);
        stroke-width: 3.5;
        stroke-dasharray: 100;
        transition: stroke var(--dur-base) ease;
      }
      /* A zero-length dash still antialiases into a sliver at 12 o'clock */
      html .set-ring-fill.is-empty { visibility: hidden; }
      html .set-ring-label {
        position: relative;
        display: inline-flex;
        font-size: var(--chth-text-12);
        font-weight: 800;
        font-variant-numeric: tabular-nums;
      }
      html .set-ring.is-busy { opacity: 0.55; pointer-events: none; }
      html .ex-row.is-done .set-ring { color: var(--done); background: var(--done-soft); }
      html .ex-row.is-done .set-ring-fill { stroke: var(--done); }

      /* Exercise popup: movement GIF on a white card at the top of the dialog */
      html .ex-sheet-media {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 16 / 10;
        background: #fff;
        border: 1px solid var(--line);
        border-radius: var(--r-lg);
        overflow: hidden;
      }
      html .ex-sheet-media:empty { display: none; }
      html .ex-sheet-media.hidden { display: none; }
      html .ex-sheet-media img { width: 100%; height: 100%; object-fit: contain; }

      .todo-card, .set-row { border-radius: var(--r-md); }

      .check-btn {
        width: 2.25rem; height: 2.25rem;
        border-radius: var(--r-full);
        display: inline-flex; align-items: center; justify-content: center;
        border: 1.5px solid var(--line-strong);
        background: transparent;
        color: var(--text-3);
        cursor: pointer;
        transition: background-color var(--dur-fast) ease, border-color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);
      }
      .check-btn:active { transform: scale(0.92); }
      .check-btn.completed { background: var(--done); border-color: var(--done); color: #fff; }

      /* Calendar day tiles */
      html .day-tile {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 5rem;
        padding: var(--chth-space-8) var(--chth-space-4);
        text-align: center;
        background: var(--surface-2);
        border: 1px solid var(--line);
        border-radius: var(--r-md);
      }
      html .day-tile.is-done { background: var(--accent-soft); border-color: var(--accent-line); }
      html .day-tile.is-today { border-color: var(--text-3); border-style: dashed; }
      /* Seven tiles share a phone's width; the "today" badge must fit a ~38px tile */
      html .day-tile .chth-badge { max-width: 100%; padding: 0 var(--chth-space-4); font-size: var(--chth-text-10); }
      html .day-tile.is-empty { opacity: 0.55; }
      html .day-tile-sm { height: auto; gap: var(--chth-space-4); padding: var(--chth-space-8) var(--chth-space-4); border-radius: var(--r-sm); }

      /* 3-month heatmap: accent intensity, no glow */
      .heat-cell { display: inline-block; width: 0.875rem; height: 0.875rem; border-radius: var(--chth-radius-2); background: var(--line); }
      .heat-0 { background: var(--line); }
      .heat-1 { background: color-mix(in srgb, var(--accent) 30%, transparent); }
      .heat-2 { background: color-mix(in srgb, var(--accent) 60%, transparent); }
      .heat-3 { background: var(--accent); }

      /* ==========================================================================
         12. Overlays: dialogs are the CHTH kit's (<dialog class="chth-dialog">, a sheet on
         phones; components.ts kitDialog), toasts are the kit's too
         ========================================================================== */
      /* Actions stacked full width (the shared routine's import and close) */
      .chth-dialog__actions.is-stacked { flex-direction: column; align-items: stretch; }
      .chth-dialog__actions.is-stacked > * { flex: none; }
      /* A row of buttons ending a step inside a dialog's body (the check-in) */
      .modal-foot {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: var(--chth-space-8);
        padding-top: var(--chth-space-16);
        border-top: 1px solid var(--line);
      }


      /* Rest timer: the toasts' glass pill (kit .chth-glass), centred above the tab bar
         (--chth-bottom-room, measured by the kit). It rises in and leaves the same way. */
      .rest-timer {
        position: fixed;
        inset-inline: 0;
        bottom: max(calc(1rem + env(safe-area-inset-bottom, 0px)), var(--chth-bottom-room, 0px));
        z-index: 2147482500;
        display: flex;
        justify-content: center;
        padding-inline: var(--chth-space-16);
        pointer-events: none;
        transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out);
        @starting-style { opacity: 0; transform: translateY(12px); }
      }
      .rest-timer.hidden { display: none; }
      .rest-timer.is-leaving {
        opacity: 0;
        transform: translateY(12px);
        pointer-events: none;
        transition-duration: var(--dur-fast);
        transition-timing-function: ease-in;
      }
      .rest-timer-panel {
        display: flex;
        align-items: center;
        gap: var(--chth-space-6);
        max-width: 100%;
        padding: var(--chth-space-6);
        border-radius: var(--chth-radius-full);
        font-size: var(--chth-text-13);
        font-weight: 600;
        pointer-events: auto;
      }
      .rest-ring { position: relative; display: inline-grid; place-items: center; flex: none; width: 2.5rem; height: 2.5rem; }
      .rest-ring svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
      .rest-ring-track { color: color-mix(in srgb, currentColor 14%, transparent); }
      .rest-ring-fill { color: var(--accent); }
      .rest-ring-value { position: relative; font-size: var(--chth-text-13); font-weight: 800; font-variant-numeric: tabular-nums; }
      .rest-timer-label { padding-inline: var(--chth-space-4) var(--chth-space-6); white-space: nowrap; }
      .rest-timer-chip, .rest-timer-stop {
        border: 0;
        display: inline-grid;
        place-items: center;
        flex: none;
        height: 2rem;
        border-radius: var(--chth-radius-full);
        color: inherit;
        background: color-mix(in srgb, currentColor 9%, transparent);
        transition: background-color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);
      }
      .rest-timer-chip { padding-inline: var(--chth-space-12); font-size: var(--chth-text-12); white-space: nowrap; }
      .rest-timer-stop { width: 2rem; color: var(--danger); background: color-mix(in srgb, var(--danger) 14%, transparent); }
      .rest-timer-chip:active, .rest-timer-stop:active { transform: scale(0.94); }
      @media (hover: hover) and (pointer: fine) {
        .rest-timer-chip:hover { background: color-mix(in srgb, currentColor 16%, transparent); }
        .rest-timer-stop:hover { background: color-mix(in srgb, var(--danger) 22%, transparent); }
      }
      /* While it runs, toasts stack above it */
      :root:has(#rest-timer-overlay:not(.hidden)) .chth-toasts {
        bottom: calc(max(calc(1rem + env(safe-area-inset-bottom, 0px)), var(--chth-bottom-room, 0px)) + 3.75rem);
      }
      /* The ring drains continuously between one-second ticks */
      #rest-timer-svg-path { transition: stroke-dasharray var(--chth-dur-1000) linear; }

      /* ==========================================================================
         13. App Shell
         ========================================================================== */
      /* The tab bar is the CHTH kit's glass tab bar (.chth-tabs): a floating pill on every screen.
         Its look and its minimizing on scroll (transform only, nothing re-laid out) come from the kit. */
      .app-bottomnav {
        position: fixed;
        z-index: 40;
        bottom: calc(0.75rem + env(safe-area-inset-bottom));
        left: 0.75rem;
        right: 0.75rem;
        color: var(--text);
      }
      @media (min-width: 768px) {
        .app-bottomnav { left: calc(50% - min(17rem, 50% - 1rem)); right: calc(50% - min(17rem, 50% - 1rem)); bottom: 1rem; }
      }
      .nav-mobile-btn {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--chth-space-4);
        justify-content: center;
        padding: var(--chth-space-8) var(--chth-space-4);
        font-size: var(--chth-text-12);
        color: var(--text-3);
        transition: color var(--dur-base) ease;
        position: relative;
        min-width: 0;
        white-space: nowrap;
      }
      .nav-mobile-btn .nav-m-pill {
        display: flex;
        align-items: center;
        justify-content: center;
        width: min(3.5rem, 100%);
        height: 1.75rem;
        border-radius: var(--r-full);
        transition: color var(--dur-base) ease, scale var(--dur-press) var(--ease-out), transform var(--chth-glass-dur) var(--chth-glass-ease), opacity var(--chth-dur-200) ease;
      }
      .nav-mobile-btn:active .nav-m-pill { scale: 0.94; }
      .nav-mobile-btn.is-active { color: var(--text); font-weight: 600; }
      .nav-mobile-btn.is-active .nav-m-pill, .nav-mobile-btn.is-scrub .nav-m-pill { color: var(--text); }
      .nav-mobile-btn.is-scrub { color: var(--text); }

      .brand-mark { color: var(--accent); }
      .brand-word { font-weight: 800; font-size: var(--chth-text-18); line-height: 1; letter-spacing: -0.01em; color: var(--text); }

      .account-chip {
        display: inline-flex;
        align-items: center;
        gap: var(--chth-space-8);
        height: 2.25rem;
        padding: 0 var(--chth-space-12) 0 var(--chth-space-4);
        border-radius: var(--r-full);
        border: 1px solid var(--line-strong);
        background: var(--surface);
        color: var(--text);
        font-size: var(--chth-text-13);
        font-weight: 500;
        transition: border-color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);
      }
      .account-chip:active { transform: scale(0.97); }
      [dir="rtl"] .account-chip { padding: 0 var(--chth-space-4) 0 var(--chth-space-12); }
      .account-chip:hover { border-color: var(--text-3); }
      .account-chip.is-active { border-color: var(--accent); }
      [dir="rtl"] .account-chip.p-0\\.5, .account-chip.p-0\\.5 { padding: var(--chth-space-2); }
      .account-chip.no-avatar { padding: 0 var(--chth-space-14); }

      /* ==========================================================================
         14. Weekly Barbell (dashboard hero)
         ========================================================================== */
      .hero-title {
        font-size: clamp(1.25rem, 1.05rem + 0.9vw, 1.6rem);
        line-height: 1.25;
        letter-spacing: -0.02em;
      }
      .barbell svg { width: 100%; height: auto; display: block; overflow: visible; }
      .barbell .bar { fill: var(--color-bar); }
      .barbell .collar { fill: var(--text-2); }
      .barbell .slot { fill: none; stroke: var(--line-strong); stroke-width: 1.5; stroke-dasharray: 4 4; }
      .barbell .plate { transform-box: fill-box; transform-origin: center; animation: plate-drop var(--chth-dur-300) var(--ease-out) backwards; }
      .barbell-caption { color: var(--text-2); font-size: var(--chth-text-14); }
      .barbell-caption strong { color: var(--text); font-weight: 800; font-size: var(--chth-text-20); }

      /* ==========================================================================
         15. Light-mode remaps for legacy dark utilities in rendered templates
         ========================================================================== */
      html.light .text-white { color: var(--text) !important; }
      html.light .text-zinc-100 { color: var(--text) !important; }
      html.light .text-zinc-200 { color: #26282C !important; }
      html.light .text-zinc-300 { color: #3E4045 !important; }
      html.light .text-zinc-400 { color: var(--text-2) !important; }
      html.light .text-zinc-500 { color: var(--text-3) !important; }
      html.light .text-amber-300, html.light .text-amber-400 { color: var(--gold) !important; }
      html.light [class*="border-white"] { border-color: var(--line) !important; }
      html.light [class*="bg-white/5"],
      html.light [class*="bg-white/10"] { background-color: rgba(16, 17, 19, 0.04) !important; }
      html.light [class*="bg-black/"]:not(.chth-badge--overlay) { background-color: var(--surface-2) !important; }
      html.light .border-zinc-800 { border-color: var(--line) !important; }

      /* Semantic color utilities: markup names the role, the tokens pick the color */
      html .text-accent { color: var(--accent-text); }
      html .text-gold { color: var(--gold); }
      html .text-steel { color: var(--steel); }
      html .text-done { color: var(--done); }
      html .text-danger { color: var(--danger); }
      html .bg-accent { background-color: var(--accent); }
      html .bg-danger { background-color: var(--danger); }
      html .bg-muted { background-color: var(--line-strong); }
      html .text-on-accent { color: var(--on-accent); }
      html .is-highlighted { box-shadow: 0 0 0 2px var(--accent), var(--shadow-card); transition: box-shadow var(--dur-base) ease; }

      [class*="bg-[#08090d]"] { background-color: var(--bg-sunken) !important; }
      [class*="bg-[#0d0f17]"] { background-color: var(--surface) !important; }
      [class*="bg-[#121522]"] { background-color: var(--surface-2) !important; }

      /* ==========================================================================
         16. Data viz — one series color: the accent (see tokens)
         ========================================================================== */

      .viz-card { position: relative; }

      /* Columns: <=24px, 4px rounded data-end, square at the baseline */
      .vcol { --axis: 2.5rem; container-type: inline-size; }
      /* Narrow charts: keep every other date label so they never collide (the last bin is always odd) */
      @container (max-width: 440px) {
        .vcol-x span:nth-child(even) { visibility: hidden; }
      }
      .vcol-plot { position: relative; height: 11rem; margin-top: var(--chth-space-20); }
      .vcol-grid {
        position: absolute;
        left: var(--axis);
        right: 0;
        height: 0;
        border-top: 1px solid var(--line);
      }
      .vcol-grid.is-base { border-top-color: var(--line-strong); }
      .vcol-tick {
        position: absolute;
        right: calc(100% + 0.5rem);
        top: 0;
        transform: translateY(-50%);
        font-size: var(--chth-text-11);
        color: var(--text-3);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      .vcol-cols {
        position: absolute;
        inset: 0 0 0 var(--axis);
        display: flex;
        align-items: stretch;
      }
      .vcol-col {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding: 0 1px;
        cursor: default;
        border-radius: var(--chth-radius-4);
      }
      .vcol-bar {
        position: relative;
        width: 70%;
        max-width: 24px;
        min-height: 0;
        background: var(--viz-1);
        border-radius: var(--chth-radius-4) var(--chth-radius-4) 0 0;
        transition: background-color var(--dur-fast) ease;
      }
      .vcol-col:hover .vcol-bar, .vcol-col:focus-visible .vcol-bar { background: var(--viz-1-hover); }
      .vcol-col:focus-visible { outline-offset: 0; }
      .vcol-val {
        position: absolute;
        bottom: calc(100% + 4px);
        left: 50%;
        transform: translateX(-50%);
        font-size: var(--chth-text-11);
        font-weight: 600;
        color: var(--text-2);
        white-space: nowrap;
      }
      .vcol-x {
        display: flex;
        padding-left: var(--axis);
        margin-top: var(--chth-space-8);
      }
      .vcol-x span {
        flex: 1;
        min-width: 0;
        text-align: center;
        font-size: var(--chth-text-11);
        color: var(--text-3);
        white-space: nowrap;
        overflow: visible;
      }

      /* Horizontal bars: grow from the (RTL) start edge, value at the tip */
      .hbar { display: flex; flex-direction: column; gap: var(--chth-space-4); }
      .hbar-row {
        display: grid;
        grid-template-columns: 6.5rem 1fr;
        align-items: center;
        gap: var(--chth-space-12);
        min-height: 2rem;
        padding: 0 var(--chth-space-4);
        border-radius: var(--r-sm);
        text-align: start;
        cursor: default;
        transition: background-color var(--dur-fast) ease;
      }
      .hbar-row:hover, .hbar-row:focus-visible { background: var(--surface-2); }
      .hbar-label { font-size: var(--chth-text-13); color: var(--text-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .hbar-track { display: flex; align-items: center; gap: var(--chth-space-8); min-width: 0; }
      .hbar-bar {
        height: 14px;
        min-width: 2px;
        background: var(--viz-1);
        border-start-end-radius: var(--chth-radius-4);
        border-end-end-radius: var(--chth-radius-4);
        transition: background-color var(--dur-fast) ease;
      }
      .hbar-row:hover .hbar-bar, .hbar-row:focus-visible .hbar-bar { background: var(--viz-1-hover); }
      .hbar-val { font-size: var(--chth-text-12); font-weight: 600; color: var(--text); font-variant-numeric: tabular-nums; }

      /* Tooltip: value leads, label follows */
      .viz-tip {
        position: absolute;
        z-index: 5;
        left: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        gap: var(--chth-space-2);
        padding: var(--chth-space-6) var(--chth-space-10);
        background: var(--surface);
        border: 1px solid var(--line-strong);
        border-radius: var(--r-sm);
        box-shadow: var(--shadow-pop);
        pointer-events: none;
        white-space: nowrap;
        opacity: 0;
        transform: translate(-50%, calc(-100% - 8px));
        transition: opacity var(--chth-dur-100) ease;
      }
      .viz-tip.is-visible { opacity: 1; }
      .viz-tip strong { font-size: var(--chth-text-13); font-weight: 700; color: var(--text); }
      .viz-tip span { font-size: var(--chth-text-11); color: var(--text-2); }

      /* Table view twin */
      .viz-table-wrap summary {
        cursor: pointer;
        font-size: var(--chth-text-12);
        font-weight: 500;
        color: var(--text-3);
        width: fit-content;
        list-style: none;
      }
      .viz-table-wrap summary::-webkit-details-marker { display: none; }
      .viz-table-wrap summary:hover { color: var(--text); }
      .viz-table-wrap[open] summary { margin-bottom: var(--chth-space-8); }
      .viz-table { width: 100%; border-collapse: collapse; font-size: var(--chth-text-12); font-variant-numeric: tabular-nums; }
      .viz-table th { text-align: start; font-weight: 600; color: var(--text-2); padding: var(--chth-space-6) var(--chth-space-8); border-bottom: 1px solid var(--line-strong); }
      .viz-table td { color: var(--text); padding: var(--chth-space-6) var(--chth-space-8); border-bottom: 1px solid var(--line); }

      /* Body map — muscle groups reference shared <g> defs via <use>; fill comes from data-state */
      .bm-pair { display: grid; grid-template-columns: 1fr 1fr; gap: var(--chth-space-8); }
      .bm-svg { width: 100%; height: auto; display: block; }
      .bm-outline { fill: var(--surface-3); }
      .bm-muscle { fill: var(--surface-3); stroke: var(--bg); stroke-width: 3; transition: fill var(--dur-base) var(--ease-out); outline: none; }
      .bm-muscle[data-state="fatigued"] { fill: var(--danger); }
      .bm-muscle[data-state="recovering"] { fill: var(--gold); }
      .bm-muscle[data-state="ready"] { fill: var(--done); }
      .bm-muscle[data-state="detrained"] { fill: var(--steel); }
      .bm-muscle[data-state="primary"] { fill: var(--accent); }
      .bm-muscle[data-state="secondary"] { fill: var(--accent-line); }
      .bm-muscle[tabindex]:focus-visible { stroke: var(--text); }
      @media (hover: hover) and (pointer: fine) {
        .bm-muscle[tabindex]:hover { stroke: var(--text); }
      }
      .bm-legend { display: flex; flex-wrap: wrap; gap: var(--chth-space-6) var(--chth-space-14); font-size: var(--chth-text-11); color: var(--text-2); }
      .bm-legend span { display: inline-flex; align-items: center; gap: var(--chth-space-6); }
      .bm-legend i { width: 0.625rem; height: 0.625rem; border-radius: var(--chth-radius-2); display: inline-block; }
      .bm-thumb { display: flex; justify-content: center; gap: var(--chth-space-12); width: 100%; height: 100%; padding: var(--chth-space-10); background: var(--surface-2); }
      .bm-thumb .bm-svg { width: auto; height: 100%; }

      /* Barbell tools — plates per side, drawn as a sleeve with plates of proportional height */
      .bar-sleeve { display: flex; align-items: center; gap: var(--chth-space-2); min-height: 3.25rem; direction: ltr; }
      .bar-sleeve::before { content: ''; width: 1.5rem; height: 0.5rem; background: var(--color-bar); border-radius: var(--chth-radius-2); }
      .bar-plate { width: 0.875rem; border-radius: var(--chth-radius-2); border: 1px solid var(--line-strong); }
      .bar-sleeve::after { content: ''; flex: 1; max-width: 1.5rem; height: 0.5rem; background: var(--color-bar); border-radius: var(--chth-radius-2); }
      .warmup-row { display: flex; align-items: center; justify-content: space-between; gap: var(--chth-space-8); padding: var(--chth-space-6) var(--chth-space-8); border-radius: var(--r-sm); font-size: var(--chth-text-12); color: var(--text); background: var(--surface-2); width: 100%; text-align: start; }
      .warmup-row.is-done { color: var(--text-3); text-decoration: line-through; }

      /* ==========================================================================
         17. Motion
         ========================================================================== */
      @keyframes plate-drop {
        0% { transform: translateY(-6px) scaleY(0.94); opacity: 0; }
        100% { transform: none; opacity: 1; }
      }
      @keyframes fade-up {
        0% { transform: translateY(6px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      @keyframes pop-in {
        0% { transform: scale(0.95); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      .active-todo-pulse { animation: none; }

      /* Tab content enters softly; tabs switch a few times per session, not hundreds */
      .tab-content:not(.hidden) { animation: fade-up var(--chth-dur-200) var(--ease-out); }

      /* Workout card arrives when the user starts a session (not on page load) */
      .is-entering { animation: fade-up var(--chth-dur-250) var(--ease-out); }

      /* An exercise's last set was just logged: only its done badge pops */
      .just-done .chth-badge--success, .just-done .set-ring-label { animation: pop-in var(--chth-dur-200) var(--ease-out); }

      /* Panels revealed from a hidden toggle */
      .reveal {
        transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out);
        @starting-style { opacity: 0; transform: translateY(-4px); }
      }

      @media (prefers-reduced-motion: reduce) {${renderReducedMotionRules('html')}
      }
      ${renderReducedMotionRules('html[data-motion="reduce"]')}
    </style>
  `;
}
