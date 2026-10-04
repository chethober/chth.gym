// ============================================================================
// Design System for جسم و اندیشه — "Iron & Ember"
// Graphite neutrals, one ember accent, one font (Vazirmatn).
//
// Rule of the system: components own their surface (background, border,
// radius, shadow); Tailwind utilities only handle layout and spacing.
// Component selectors are written as `html .x` so they win over any stray
// rounded-*/border-*/bg-* utility left on an element.
// ============================================================================

export const THEME = {
  colors: {
    ember: { 400: '#FF8A57', 500: '#FF6A2B', 600: '#EA580C', 700: '#C2410C' },
    graphite: { 950: '#0E0F11', 900: '#16181B', 800: '#1D2024', 700: '#2A2E33' },
    paper: { 50: '#FFFFFF', 100: '#F6F6F4', 200: '#EEEEEB' },
  },
  typography: {
    fontFamily: "'Vazirmatn', system-ui, sans-serif",
  },
};

export function renderThemeStyles(): string {
  return `
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
              mono: ['Vazirmatn', 'system-ui', 'sans-serif'],
              display: ['Vazirmatn', 'system-ui', 'sans-serif'],
            },
            colors: {
              // Legacy "emerald" utilities resolve to the ember accent
              emerald: {
                50: '#FFF4ED', 100: '#FFE6D5', 200: '#FECCAA', 300: '#FFA77A', 400: '#FF8A57',
                500: '#FF6A2B', 600: '#EA580C', 700: '#C2410C', 800: '#9A3412', 900: '#7C2D12', 950: '#431407'
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
        --font-sans: 'Vazirmatn', system-ui, sans-serif;

        --r-sm: 8px;      /* chips, small inner controls */
        --r-md: 10px;     /* buttons, inputs, inset wells */
        --r-lg: 14px;     /* cards */
        --r-xl: 20px;     /* hero, modals */
        --r-full: 9999px;

        --h-sm: 2rem;     /* 32px */
        --h-md: 2.5rem;   /* 40px */
        --h-lg: 3rem;     /* 48px */

        --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
        --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
        --dur-press: 160ms;
        --dur-fast: 150ms;
        --dur-base: 200ms;
      }

      /* Dark: graphite */
      :root, html.dark {
        color-scheme: dark;
        --bg: #0E0F11;
        --bg-sunken: #0A0B0D;
        --surface: #16181B;
        --surface-2: #1D2024;
        --surface-3: #24282D;
        --line: rgba(255, 255, 255, 0.07);
        --line-strong: rgba(255, 255, 255, 0.13);
        --text: #F2F2F0;
        --text-2: #A1A1A6;
        --text-3: #6E6F75;

        --accent: #FF6A2B;
        --accent-hover: #FF7D45;
        --accent-text: #FF8A57;
        --accent-soft: rgba(255, 106, 43, 0.12);
        --accent-line: rgba(255, 106, 43, 0.45);
        --on-accent: #1A0A02;

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

        --plate-red: #FF6A2B;
        --plate-blue: #E5582A;
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

        --accent: #F2601F;
        --accent-hover: #FF6E2E;
        --accent-text: #C2410C;
        --accent-soft: rgba(234, 88, 12, 0.09);
        --accent-line: rgba(234, 88, 12, 0.45);
        --on-accent: #1A0A02;

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

        --plate-red: #F2601F;
        --plate-blue: #D24E14;
        --plate-yellow: #E0A21F;
        --plate-green: #85878C;
        --plate-white: #C4C4C0;
        --color-bar: #A1A1A6;
      }

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
      html .hidden:not([class*="sm:"]):not([class*="md:"]):not([class*="lg:"]):not([class*="dark:"]) { display: none; }

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

      h1, h2, .font-display, .stat-value {
        font-family: var(--font-sans);
        font-weight: 800 !important;
        letter-spacing: -0.01em;
        line-height: 1.3;
      }
      main section > div > h2,
      main section > h2 {
        font-size: 1.125rem !important;
      }
      /* Quiet hierarchy: titles are labels, content carries the weight */
      main h3, main h4 { font-weight: 600 !important; }
      main h3.text-sm, main h3.text-base, main h3.text-xs { font-size: 0.875rem !important; }
      main h4.text-xs { font-size: 0.8125rem !important; }
      main h3 > i[data-lucide], main h4 > i[data-lucide] { width: 0.875rem; height: 0.875rem; }
      .font-black { font-weight: 800; }

      /* Persian script gets hard to read under 11px */
      .text-\\[8px\\], .text-\\[9px\\] { font-size: 10.5px !important; }
      .text-\\[10px\\] { font-size: 11px !important; }

      :focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
      ::selection { background: var(--accent); color: var(--on-accent); }

      html.theme-transition,
      html.theme-transition *,
      html.theme-transition *::before,
      html.theme-transition *::after {
        transition: background-color 200ms ease, border-color 200ms ease, color 150ms ease !important;
      }

      /* Section headings inside cards: icon + title, one look everywhere */
      main h3, main h4 { letter-spacing: -0.005em; }
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
        gap: 0.75rem;
        padding-bottom: 0.875rem;
        border-bottom: 1px solid var(--line);
      }
      .divider-top { border-top: 1px solid var(--line); }

      /* Empty states */
      .empty-state {
        text-align: center;
        padding: 1.75rem 1rem;
        border: 1px dashed var(--line-strong);
        border-radius: var(--r-md);
        color: var(--text-3);
        font-size: 0.8125rem;
      }

      /* Retired effects */
      .glow-emerald, .glow-gold, .glow-cyan, .glow-purple, .glow-rose { box-shadow: none !important; }

      /* ==========================================================================
         4. Buttons
         Three sizes by height, five variants. Press = scale(0.97).
         ========================================================================== */
      html .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        height: var(--h-md);
        padding: 0 1rem;
        font-size: 0.875rem;
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
      html .btn:active { transform: scale(0.97); }
      html .btn:disabled, html .btn[aria-disabled="true"] { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
      html .btn i[data-lucide], html .btn svg { width: 1rem; height: 1rem; flex-shrink: 0; }

      html .btn-sm { height: var(--h-sm); padding: 0 0.75rem; font-size: 0.8125rem; gap: 0.375rem; border-radius: var(--r-sm); }
      html .btn-sm i[data-lucide], html .btn-sm svg { width: 0.875rem; height: 0.875rem; }
      html .btn-md { height: var(--h-md); padding: 0 1rem; font-size: 0.875rem; }
      html .btn-lg { height: var(--h-lg); padding: 0 1.375rem; font-size: 0.9375rem; }
      html .btn-block { width: 100%; }

      html .btn-primary {
        background: var(--accent);
        color: var(--on-accent) !important;
        border-color: transparent;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 1px 2px rgba(0, 0, 0, 0.2);
      }
      html .btn-secondary {
        background: var(--surface-2);
        color: var(--text) !important;
        border-color: var(--line-strong);
        box-shadow: var(--shadow-control);
      }
      html.light .btn-secondary { background: var(--surface); }
      html .btn-ghost {
        background: transparent;
        color: var(--text-2);
        border-color: transparent;
      }
      html .btn-danger {
        background: var(--danger-soft);
        color: var(--danger) !important;
        border-color: transparent;
      }
      html .btn-outline-dashed {
        background: transparent;
        color: var(--text-2);
        border: 1px dashed var(--line-strong);
      }

      @media (hover: hover) and (pointer: fine) {
        html .btn-primary:hover { background: var(--accent-hover); }
        html .btn-secondary:hover { background: var(--surface-3); }
        html.light .btn-secondary:hover { background: var(--surface-2); }
        html .btn-ghost:hover { background: var(--surface-2); color: var(--text); }
        html .btn-danger:hover { background: var(--danger); color: #fff !important; }
        html .btn-outline-dashed:hover { border-color: var(--accent-line); color: var(--accent-text); background: var(--accent-soft); }
      }

      /* Icon buttons: square, same heights as text buttons */
      html .btn-icon, html .btn-icon-sm {
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
      html .btn-icon-sm { width: var(--h-sm); height: var(--h-sm); border-radius: var(--r-sm); }
      html .btn-icon:active, html .btn-icon-sm:active { transform: scale(0.94); }
      html .btn-icon:not(.btn-secondary):not(.btn-danger):not(.btn-primary),
      html .btn-icon-sm:not(.btn-secondary):not(.btn-danger):not(.btn-primary) { color: var(--text-2); }
      html .btn-icon.btn-danger, html .btn-icon-sm.btn-danger { color: var(--danger); }
      html .btn-icon-danger { color: var(--text-3) !important; }
      @media (hover: hover) and (pointer: fine) {
        html .btn-icon-danger:hover { background: var(--danger-soft) !important; color: var(--danger) !important; }
      }

      /* Text link button */
      html .link-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--accent-text);
        border-radius: 6px;
        transition: opacity var(--dur-fast) ease;
      }
      @media (hover: hover) and (pointer: fine) {
        html .link-btn:hover { opacity: 0.75; }
      }

      /* ==========================================================================
         5. Selection controls: segmented, chips, option cards, switch
         ========================================================================== */
      html .segmented {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding: 3px;
        background: var(--bg-sunken);
        border: 1px solid var(--line);
        border-radius: var(--r-md);
      }
      html.light .segmented { background: var(--surface-3); }
      html .segmented-item {
        height: 1.75rem;
        padding: 0 0.875rem;
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--text-2);
        border-radius: 7px;
        transition: background-color var(--dur-fast) ease, color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);
      }
      html .segmented-item:active { transform: scale(0.97); }
      html .segmented-item.is-active {
        background: var(--surface-3);
        color: var(--text);
        font-weight: 600;
        box-shadow: var(--shadow-control);
      }
      html.light .segmented-item.is-active { background: var(--surface); }
      @media (hover: hover) and (pointer: fine) {
        html .segmented-item:not(.is-active):hover { color: var(--text); }
      }

      html .chip {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        height: 1.875rem;
        padding: 0 0.75rem;
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--text-2);
        background: var(--surface);
        border: 1px solid var(--line-strong);
        border-radius: var(--r-full);
        transition: background-color var(--dur-fast) ease, border-color var(--dur-fast) ease, color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);
      }
      html .chip:active { transform: scale(0.96); }
      html .chip.is-selected {
        background: var(--text);
        border-color: var(--text);
        color: var(--bg);
        font-weight: 600;
      }
      @media (hover: hover) and (pointer: fine) {
        html .chip:not(.is-selected):hover { border-color: var(--text-3); color: var(--text); }
      }

      /* Option card: a large selectable tile (theme picker) */
      html .option-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        padding: 0.875rem 0.5rem;
        font-size: 0.8125rem;
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

      /* Switch */
      .switch { position: relative; display: inline-flex; align-items: center; cursor: pointer; }
      .switch input { position: absolute; opacity: 0; width: 1px; height: 1px; }
      .switch-track {
        width: 2.375rem;
        height: 1.375rem;
        border-radius: var(--r-full);
        background: var(--surface-3);
        border: 1px solid var(--line-strong);
        position: relative;
        transition: background-color var(--dur-base) ease, border-color var(--dur-base) ease;
      }
      .switch-track::after {
        content: '';
        position: absolute;
        top: 2px;
        inset-inline-start: 2px;
        width: 1rem;
        height: 1rem;
        border-radius: var(--r-full);
        background: #fff;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        transition: transform var(--dur-base) var(--ease-out);
      }
      .switch input:checked + .switch-track { background: var(--accent); border-color: var(--accent); }
      .switch input:checked + .switch-track::after { transform: translateX(1rem); }
      [dir="rtl"] .switch input:checked + .switch-track::after { transform: translateX(-1rem); }
      .switch input:focus-visible + .switch-track { outline: 2px solid var(--accent); outline-offset: 2px; }

      /* ==========================================================================
         6. Badges
         ========================================================================== */
      html .badge {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        height: 1.375rem;
        padding: 0 0.5rem;
        border-radius: 6px;
        font-size: 0.71875rem;
        font-weight: 600;
        line-height: 1;
        white-space: nowrap;
        border: 1px solid transparent;
        background: var(--surface-3);
        color: var(--text-2);
      }
      html .badge i[data-lucide] { width: 0.75rem; height: 0.75rem; }
      html .badge-emerald { background: var(--accent-soft); color: var(--accent-text); }
      html .badge-cyan, html .badge-blue { background: var(--steel-soft); color: var(--steel); }
      html .badge-gold, html .badge-amber { background: var(--gold-soft); color: var(--gold); }
      html .badge-rose { background: var(--danger-soft); color: var(--danger); }
      html .badge-done { background: var(--done-soft); color: var(--done); }
      html .badge-purple, html .badge-zinc { background: var(--surface-3); color: var(--text-2); }
      html .badge-live { background: var(--danger); color: #fff; }
      /* Badges sitting on top of imagery */
      html .badge-overlay {
        background: rgba(14, 15, 17, 0.72) !important;
        color: #F2F2F0 !important;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }

      /* ==========================================================================
         7. Form Controls
         One height (40px), one radius, one focus ring.
         ========================================================================== */
      .field { display: flex; flex-direction: column; gap: 0.375rem; }

      html .label-styled {
        display: block;
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--text-2);
        margin-bottom: 0.375rem;
      }

      html .input-styled, html .select-styled, html .textarea-styled {
        width: 100%;
        height: var(--h-md);
        padding: 0 0.875rem;
        font-size: 0.875rem;
        color: var(--text);
        background-color: var(--bg-sunken);
        border: 1px solid var(--line-strong);
        border-radius: var(--r-md);
        box-shadow: none;
        transition: border-color var(--dur-fast) ease, box-shadow var(--dur-fast) ease, background-color var(--dur-fast) ease;
      }
      html.light .input-styled, html.light .select-styled, html.light .textarea-styled {
        background-color: var(--surface);
        box-shadow: var(--shadow-control);
      }
      html .textarea-styled { height: auto; min-height: 5.5rem; padding: 0.625rem 0.875rem; }
      html .input-sm { height: var(--h-sm); font-size: 0.8125rem; padding: 0 0.625rem; border-radius: var(--r-sm); }

      @media (hover: hover) and (pointer: fine) {
        html .input-styled:hover:not(:focus), html .select-styled:hover:not(:focus), html .textarea-styled:hover:not(:focus) {
          border-color: var(--text-3);
        }
      }
      html .input-styled:focus, html .select-styled:focus, html .textarea-styled:focus {
        outline: none;
        border-color: var(--accent);
        box-shadow: 0 0 0 3px var(--accent-soft);
      }
      html .input-styled::placeholder, html .textarea-styled::placeholder { color: var(--text-3); }
      html .input-styled[type="number"] { font-variant-numeric: tabular-nums; }
      html .input-styled[type="number"]::-webkit-inner-spin-button,
      html .input-styled[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      html .input-styled[type="number"] { -moz-appearance: textfield; }

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
      html .input-icon > .input-styled { padding-inline-start: 2.5rem; }

      /* Native select with our own chevron, placed for RTL */
      html .select-styled, html select.input-styled {
        appearance: none;
        -webkit-appearance: none;
        cursor: pointer;
        padding-inline-end: 2.25rem;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2385878C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-size: 1rem;
        background-position: left 0.75rem center;
      }
      [dir="ltr"] .select-styled { background-position: right 0.75rem center; }

      /* Range */
      html .range {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 1.25rem;
        background: transparent;
        cursor: pointer;
      }
      html .range::-webkit-slider-runnable-track { height: 4px; border-radius: 4px; background: var(--line-strong); }
      html .range::-moz-range-track { height: 4px; border-radius: 4px; background: var(--line-strong); }
      html .range::-moz-range-progress { height: 4px; border-radius: 4px; background: var(--accent); }
      html .range::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px; height: 16px; margin-top: -6px;
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
      html .stepper {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        height: var(--h-sm);
        padding: 0 0.25rem;
        background: var(--surface);
        border: 1px solid var(--line-strong);
        border-radius: var(--r-sm);
        flex-shrink: 0;
      }
      html.light .stepper { box-shadow: var(--shadow-control); }
      html .stepper-label {
        font-size: 0.75rem;
        color: var(--text-3);
        padding-inline: 0.25rem;
      }
      html .stepper-value {
        min-width: 2rem;
        text-align: center;
        font-size: 0.875rem;
        font-weight: 700;
        color: var(--text);
        font-variant-numeric: tabular-nums;
      }
      html .stepper-unit { font-size: 0.6875rem; color: var(--text-3); padding-inline-end: 0.25rem; }
      html .stepper-btn {
        width: 1.5rem;
        height: 1.5rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        line-height: 1;
        border-radius: 6px;
        color: var(--text-2);
        background: var(--surface-3);
        transition: background-color var(--dur-fast) ease, color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);
      }
      html .stepper-btn:active { transform: scale(0.9); }
      @media (hover: hover) and (pointer: fine) {
        html .stepper-btn:hover { background: var(--accent-soft); color: var(--accent-text); }
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

      .avatar-frame {
        border-radius: var(--r-full);
        border: 1px solid var(--line-strong);
        background: var(--surface-2);
      }

      /* ==========================================================================
         9. Stats
         ========================================================================== */
      html .stat-tile {
        padding: 1rem 1.125rem;
        border-radius: var(--r-lg);
        background: var(--surface);
        border: 1px solid var(--line);
        box-shadow: var(--shadow-card);
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .stat-tile .icon-box { display: none; }
      .stat-label { font-size: 0.75rem; color: var(--text-2); }
      /* Big standalone numbers use proportional figures; tabular only in columns */
      .stat-value { font-size: 1.25rem; color: var(--text); font-feature-settings: "ss01"; font-variant-numeric: proportional-nums; }
      .stat-delta { font-size: 0.75rem; color: var(--text-3); display: flex; gap: 0.375rem; flex-wrap: wrap; }
      .stat-delta-mark { font-weight: 600; }
      .stat-delta-mark.is-good { color: var(--done); }
      .stat-delta-mark.is-bad { color: var(--danger); }
      .stat-delta-mark.is-neutral { color: var(--text-2); }

      html .metric-pill {
        background: var(--surface-2);
        padding: 0.375rem 0.75rem;
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
        transition: width 400ms var(--ease-out);
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
        gap: 0.375rem;
        height: var(--h-sm);
        padding: 0 0.625rem;
        font-size: 0.8125rem;
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
        padding: 0.5rem 0.25rem;
        text-align: center;
        background: var(--surface-2);
        border: 1px solid var(--line);
        border-radius: var(--r-md);
      }
      html .day-tile.is-done { background: var(--accent-soft); border-color: var(--accent-line); }
      html .day-tile.is-today { border-color: var(--text-3); border-style: dashed; }
      html .day-tile.is-empty { opacity: 0.55; }
      html .day-tile-sm { height: auto; gap: 0.25rem; padding: 0.5rem 0.25rem; border-radius: var(--r-sm); }

      /* 3-month heatmap: accent intensity, no glow */
      .heat-cell { display: inline-block; width: 0.875rem; height: 0.875rem; border-radius: 3px; background: var(--line); }
      .heat-0 { background: var(--line); }
      .heat-1 { background: color-mix(in srgb, var(--accent) 30%, transparent); }
      .heat-2 { background: color-mix(in srgb, var(--accent) 60%, transparent); }
      .heat-3 { background: var(--accent); }

      /* ==========================================================================
         12. Overlays: modal, toast
         ========================================================================== */
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: var(--backdrop);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        transition: opacity var(--dur-base) ease;
        @starting-style { opacity: 0; }
      }
      .modal-backdrop.hidden { display: none; }
      html .modal-panel {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: var(--r-xl);
        box-shadow: var(--shadow-pop);
        width: 100%;
        max-height: 90vh;
        transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out);
        @starting-style { opacity: 0; transform: scale(0.96) translateY(4px); }
      }
      .modal-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding-bottom: 0.875rem;
        border-bottom: 1px solid var(--line);
      }
      .modal-foot {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.5rem;
        padding-top: 1rem;
        border-top: 1px solid var(--line);
      }

      html .toast {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        padding: 0.625rem 1rem 0.625rem 0.875rem;
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--text);
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: var(--r-md);
        box-shadow: var(--shadow-pop);
      }
      html .toast i[data-lucide] { width: 1rem; height: 1rem; }
      html .toast-success i[data-lucide] { color: var(--done); }
      html .toast-error i[data-lucide] { color: var(--danger); }
      html .toast-warning i[data-lucide] { color: var(--gold); }
      html .toast-info i[data-lucide] { color: var(--steel); }

      #toast-notification {
        transition: opacity 250ms var(--ease-out), transform 250ms var(--ease-out) !important;
      }

      /* Rest timer: rises from the bottom edge it is pinned to, and leaves the same way */
      .rest-timer {
        transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out);
        @starting-style { opacity: 0; transform: translateY(12px); }
      }
      .rest-timer.is-leaving {
        opacity: 0;
        transform: translateY(12px);
        pointer-events: none;
        transition-duration: var(--dur-fast);
        transition-timing-function: ease-in;
      }
      .rest-timer-panel {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: var(--r-xl);
        box-shadow: var(--shadow-pop);
      }
      /* The ring drains continuously between one-second ticks */
      #rest-timer-svg-path { transition: stroke-dasharray 1000ms linear; }

      /* ==========================================================================
         13. App Shell
         ========================================================================== */
      .app-topbar {
        background: color-mix(in srgb, var(--bg) 82%, transparent);
        backdrop-filter: saturate(160%) blur(12px);
        -webkit-backdrop-filter: saturate(160%) blur(12px);
        border-bottom: 1px solid var(--line);
      }
      .nav-desktop-btn {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        height: 100%;
        padding: 0 0.875rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-2);
        transition: color var(--dur-fast) ease;
      }
      .nav-desktop-btn:hover { color: var(--text); }
      .nav-desktop-btn.is-active { color: var(--text); font-weight: 600; }
      .nav-desktop-btn .nav-underline {
        position: absolute;
        inset-inline: 0.875rem;
        bottom: -1px;
        height: 2px;
        border-radius: 2px;
        background: var(--accent);
        transform: scaleX(0);
        transition: transform var(--dur-base) var(--ease-out);
      }
      .nav-desktop-btn.is-active .nav-underline { transform: scaleX(1); }

      .app-bottomnav {
        background: color-mix(in srgb, var(--surface) 88%, transparent);
        backdrop-filter: saturate(160%) blur(12px);
        -webkit-backdrop-filter: saturate(160%) blur(12px);
        border-top: 1px solid var(--line);
        padding-bottom: env(safe-area-inset-bottom);
      }
      .nav-mobile-btn {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.2rem;
        padding: 0.5rem 0.25rem 0.55rem;
        font-size: 0.75rem;
        color: var(--text-3);
        position: relative;
      }
      .nav-mobile-btn .nav-m-pill {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3.5rem;
        height: 1.875rem;
        border-radius: var(--r-full);
        transition: background-color var(--dur-base) ease, color var(--dur-base) ease, transform var(--dur-press) var(--ease-out);
      }
      .nav-mobile-btn:active .nav-m-pill { transform: scale(0.94); }
      .nav-mobile-btn.is-active { color: var(--text); font-weight: 600; }
      .nav-mobile-btn.is-active .nav-m-pill { background: var(--accent-soft); color: var(--accent-text); }

      .brand-mark { color: var(--accent); }
      .brand-word { font-weight: 800; font-size: 1.125rem; line-height: 1; letter-spacing: -0.01em; color: var(--text); }

      .account-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        height: 2.25rem;
        padding: 0 0.75rem 0 0.25rem;
        border-radius: var(--r-full);
        border: 1px solid var(--line-strong);
        background: var(--surface);
        color: var(--text);
        font-size: 0.8125rem;
        font-weight: 500;
        transition: border-color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);
      }
      .account-chip:active { transform: scale(0.97); }
      [dir="rtl"] .account-chip { padding: 0 0.25rem 0 0.75rem; }
      .account-chip:hover { border-color: var(--text-3); }
      .account-chip.is-active { border-color: var(--accent); }
      [dir="rtl"] .account-chip.p-0\\.5, .account-chip.p-0\\.5 { padding: 0.125rem; }
      .account-chip.no-avatar { padding: 0 0.875rem; }

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
      .barbell .plate { transform-box: fill-box; transform-origin: center; animation: plate-drop 350ms var(--ease-out) backwards; }
      .barbell-caption { color: var(--text-2); font-size: 0.875rem; }
      .barbell-caption strong { color: var(--text); font-weight: 800; font-size: 1.25rem; }

      /* ==========================================================================
         15. Light-mode remaps for legacy dark utilities in rendered templates
         ========================================================================== */
      html.light .text-white { color: var(--text) !important; }
      html.light .text-zinc-100 { color: var(--text) !important; }
      html.light .text-zinc-200 { color: #26282C !important; }
      html.light .text-zinc-300 { color: #3E4045 !important; }
      html.light .text-zinc-400 { color: var(--text-2) !important; }
      html.light .text-zinc-500 { color: var(--text-3) !important; }
      html.light .text-emerald-300, html.light .text-emerald-400 { color: var(--accent-text) !important; }
      html.light .text-amber-300, html.light .text-amber-400 { color: var(--gold) !important; }
      html.light [class*="border-white"] { border-color: var(--line) !important; }
      html.light [class*="bg-white/5"],
      html.light [class*="bg-white/10"] { background-color: rgba(16, 17, 19, 0.04) !important; }
      html.light [class*="bg-black/"]:not(.badge-overlay) { background-color: var(--surface-2) !important; }
      html.light .border-zinc-800 { border-color: var(--line) !important; }
      html .text-emerald-400, html .text-emerald-300 { color: var(--accent-text); }

      [class*="bg-[#08090d]"] { background-color: var(--bg-sunken) !important; }
      [class*="bg-[#0d0f17]"] { background-color: var(--surface) !important; }
      [class*="bg-[#121522]"] { background-color: var(--surface-2) !important; }

      /* ==========================================================================
         16. Data viz — one series color, validated per mode
         (light #F2601F on #FFFFFF, dark #F45E20 on #16181B: band, chroma, contrast pass)
         ========================================================================== */
      :root, html.dark { --viz-1: #F45E20; --viz-1-hover: #FF7A42; }
      html.light { --viz-1: #F2601F; --viz-1-hover: #F5793F; }

      .viz-card { position: relative; }

      /* Columns: <=24px, 4px rounded data-end, square at the baseline */
      .vcol { --axis: 2.5rem; container-type: inline-size; }
      /* Narrow charts: keep every other date label so they never collide (the last bin is always odd) */
      @container (max-width: 440px) {
        .vcol-x span:nth-child(even) { visibility: hidden; }
      }
      .vcol-plot { position: relative; height: 11rem; margin-top: 1.25rem; }
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
        font-size: 0.6875rem;
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
        border-radius: 4px;
      }
      .vcol-bar {
        position: relative;
        width: 70%;
        max-width: 24px;
        min-height: 0;
        background: var(--viz-1);
        border-radius: 4px 4px 0 0;
        transition: background-color var(--dur-fast) ease;
      }
      .vcol-col:hover .vcol-bar, .vcol-col:focus-visible .vcol-bar { background: var(--viz-1-hover); }
      .vcol-col:focus-visible { outline-offset: 0; }
      .vcol-val {
        position: absolute;
        bottom: calc(100% + 4px);
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.6875rem;
        font-weight: 600;
        color: var(--text-2);
        white-space: nowrap;
      }
      .vcol-x {
        display: flex;
        padding-left: var(--axis);
        margin-top: 0.5rem;
      }
      .vcol-x span {
        flex: 1;
        min-width: 0;
        text-align: center;
        font-size: 0.6875rem;
        color: var(--text-3);
        white-space: nowrap;
        overflow: visible;
      }

      /* Horizontal bars: grow from the (RTL) start edge, value at the tip */
      .hbar { display: flex; flex-direction: column; gap: 0.25rem; }
      .hbar-row {
        display: grid;
        grid-template-columns: 6.5rem 1fr;
        align-items: center;
        gap: 0.75rem;
        min-height: 2rem;
        padding: 0 0.25rem;
        border-radius: var(--r-sm);
        text-align: start;
        cursor: default;
        transition: background-color var(--dur-fast) ease;
      }
      .hbar-row:hover, .hbar-row:focus-visible { background: var(--surface-2); }
      .hbar-label { font-size: 0.8125rem; color: var(--text-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .hbar-track { display: flex; align-items: center; gap: 0.5rem; min-width: 0; }
      .hbar-bar {
        height: 14px;
        min-width: 2px;
        background: var(--viz-1);
        border-start-end-radius: 4px;
        border-end-end-radius: 4px;
        transition: background-color var(--dur-fast) ease;
      }
      .hbar-row:hover .hbar-bar, .hbar-row:focus-visible .hbar-bar { background: var(--viz-1-hover); }
      .hbar-val { font-size: 0.75rem; font-weight: 600; color: var(--text); font-variant-numeric: tabular-nums; }

      /* Tooltip: value leads, label follows */
      .viz-tip {
        position: absolute;
        z-index: 5;
        left: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
        padding: 0.4rem 0.625rem;
        background: var(--surface);
        border: 1px solid var(--line-strong);
        border-radius: var(--r-sm);
        box-shadow: var(--shadow-pop);
        pointer-events: none;
        white-space: nowrap;
        opacity: 0;
        transform: translate(-50%, calc(-100% - 8px));
        transition: opacity 120ms ease;
      }
      .viz-tip.is-visible { opacity: 1; }
      .viz-tip strong { font-size: 0.8125rem; font-weight: 700; color: var(--text); }
      .viz-tip span { font-size: 0.6875rem; color: var(--text-2); }

      /* Table view twin */
      .viz-table-wrap summary {
        cursor: pointer;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--text-3);
        width: fit-content;
        list-style: none;
      }
      .viz-table-wrap summary::-webkit-details-marker { display: none; }
      .viz-table-wrap summary:hover { color: var(--text); }
      .viz-table-wrap[open] summary { margin-bottom: 0.5rem; }
      .viz-table { width: 100%; border-collapse: collapse; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
      .viz-table th { text-align: start; font-weight: 600; color: var(--text-2); padding: 0.375rem 0.5rem; border-bottom: 1px solid var(--line-strong); }
      .viz-table td { color: var(--text); padding: 0.375rem 0.5rem; border-bottom: 1px solid var(--line); }

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
      .tab-content:not(.hidden) { animation: fade-up 220ms var(--ease-out); }

      /* Workout card arrives when the user starts a session (not on page load) */
      .is-entering { animation: fade-up 260ms var(--ease-out); }

      /* An exercise's last set was just logged: only its done badge pops */
      .just-done .badge-done { animation: pop-in 220ms var(--ease-out); }

      /* Panels revealed from a hidden toggle */
      .reveal {
        transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out);
        @starting-style { opacity: 0; transform: translateY(-4px); }
      }

      @media (prefers-reduced-motion: reduce) {
        *, ::before, ::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          scroll-behavior: auto !important;
        }
        html .btn:active, html .btn-icon:active, html .chip:active, html .set-chip:active,
        html .option-card:active, html .segmented-item:active, html .stepper-btn:active { transform: none; }
        /* Gentler, not zero: these keep their fade but lose the movement */
        .rest-timer, .rest-timer.is-leaving, .reveal { transform: none !important; }
        #rest-timer-svg-path { transition: none; }
      }
    </style>
  `;
}
