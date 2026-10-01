// ============================================================================
// Design Tokens & Styled Components for جسم و اندیشه
// "Loaded Bar" system: rubber-floor graphite (dark) & chalk (light),
// accents taken from IWF competition plates (blue 20 / yellow 15 / red 25 / green 10)
// ============================================================================

export const THEME = {
  colors: {
    plate: {
      red: '#DE4A3A',
      blue: '#3D7BE0',
      yellow: '#F0C33C',
      green: '#45A56A',
      white: '#E9E7E2',
    },
    rubber: {
      950: '#1B1D20',
      900: '#24272B',
      800: '#2C3035',
      700: '#43474D',
    },
    chalk: {
      50: '#FFFFFF',
      100: '#ECEEF0',
      200: '#D5D9DE',
    }
  },
  typography: {
    fontFamily: "'Readex Pro', 'Vazirmatn', system-ui, sans-serif",
    displayFamily: "'Lalezar', 'Readex Pro', system-ui, sans-serif",
  }
};

export function renderThemeStyles(): string {
  return `
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              sans: ['Readex Pro', 'Vazirmatn', 'system-ui', 'sans-serif'],
              mono: ['Readex Pro', 'Vazirmatn', 'system-ui', 'sans-serif'],
              display: ['Lalezar', 'Readex Pro', 'system-ui', 'sans-serif'],
            },
            colors: {
              // Legacy "emerald" utilities now resolve to the primary plate blue
              emerald: {
                50: '#EEF4FD', 100: '#D8E6FA', 200: '#B3CDF5', 300: '#84ADEE', 400: '#5A90E8',
                500: '#3D7BE0', 600: '#2A64C8', 700: '#2250A3', 800: '#1F4483', 900: '#1D3A6C', 950: '#14254A'
              },
              // Neutrals: rubber graphite, no blue tint
              zinc: {
                50: '#F6F6F5', 100: '#EDEBE6', 200: '#D9DADC', 300: '#BFC2C6', 400: '#A9ADB3',
                500: '#7D8288', 600: '#5E636A', 700: '#43474D', 800: '#2C3035', 900: '#24272B', 950: '#1B1D20'
              },
              amber: {
                300: '#F6D774', 400: '#F0C33C', 500: '#E0AE1C', 600: '#B88A0E'
              },
              rose: {
                300: '#F09A8F', 400: '#E86B5C', 500: '#DE4A3A', 600: '#C23A2B'
              },
              plate: {
                red: '#DE4A3A', blue: '#3D7BE0', yellow: '#F0C33C', green: '#45A56A', white: '#E9E7E2'
              }
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
        --font-sans: 'Readex Pro', 'Vazirmatn', system-ui, sans-serif;
        --font-display: 'Lalezar', 'Readex Pro', system-ui, sans-serif;
        --radius-control: 10px;
        --radius-panel: 16px;
        --radius-full: 9999px;
        --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
        --transition-fast: 0.15s var(--ease);
        --transition-normal: 0.25s var(--ease);

        --plate-red: #DE4A3A;
        --plate-blue: #3D7BE0;
        --plate-yellow: #F0C33C;
        --plate-green: #45A56A;
        --plate-white: #E9E7E2;
      }

      /* Dark: rubber gym floor */
      :root, html.dark {
        color-scheme: dark;
        --color-bg-base: #1B1D20;
        --color-bg-sunken: #16181A;
        --color-surface: #24272B;
        --color-surface-2: #2C3035;
        --color-line: #383C42;
        --color-line-strong: #4A4F56;
        --color-text-primary: #EDEBE6;
        --color-text-secondary: #A9ADB3;
        --color-text-muted: #7D8288;
        --color-primary: #3D7BE0;
        --color-primary-hover: #5A90E8;
        --color-primary-soft: rgba(61, 123, 224, 0.14);
        --color-primary-line: rgba(90, 144, 232, 0.45);
        --color-done: #45A56A;
        --color-done-soft: rgba(69, 165, 106, 0.14);
        --color-pr: #F0C33C;
        --color-danger: #E86B5C;
        --color-danger-soft: rgba(222, 74, 58, 0.14);
        --color-bar: #8C9097;
        --color-modal-backdrop: rgba(12, 13, 15, 0.72);
      }

      /* Light: chalk */
      html.light {
        color-scheme: light;
        --color-bg-base: #ECEEF0;
        --color-bg-sunken: #E2E5E8;
        --color-surface: #FFFFFF;
        --color-surface-2: #F4F5F7;
        --color-line: #D5D9DE;
        --color-line-strong: #BCC2C9;
        --color-text-primary: #15171A;
        --color-text-secondary: #4A5058;
        --color-text-muted: #6B727B;
        --color-primary: #1F5FCC;
        --color-primary-hover: #2A6CDD;
        --color-primary-soft: rgba(31, 95, 204, 0.09);
        --color-primary-line: rgba(31, 95, 204, 0.4);
        --color-done: #2F8A52;
        --color-done-soft: rgba(47, 138, 82, 0.1);
        --color-pr: #B88A0E;
        --color-danger: #C23A2B;
        --color-danger-soft: rgba(194, 58, 43, 0.08);
        --color-bar: #7D8288;
        --color-modal-backdrop: rgba(21, 23, 26, 0.45);
      }

      /* ==========================================================================
         2. Base & Typography
         ========================================================================== */
      html {
        font-family: var(--font-sans);
        scrollbar-gutter: stable;
        overflow-y: scroll;
      }

      body {
        font-family: var(--font-sans);
        background-color: var(--color-bg-base);
        color: var(--color-text-primary);
        -webkit-tap-highlight-color: transparent;
        font-feature-settings: "ss01";
        line-height: 1.6;
      }

      button, input, optgroup, select, textarea, dialog {
        font-family: var(--font-sans);
      }

      .font-mono, code, pre, kbd {
        font-family: var(--font-sans) !important;
        font-variant-numeric: tabular-nums;
      }

      /* Lalezar ships a single heavy weight: never let the browser fake-bold it */
      h1, h2, .font-display, .stat-value {
        font-family: var(--font-display);
        font-weight: 400 !important;
        font-synthesis: none;
        letter-spacing: 0;
        line-height: 1.25;
      }
      main section > div > h2,
      main section > h2 {
        font-size: clamp(1.5rem, 1.2rem + 1.2vw, 2rem);
      }
      h3, h4, h5 { letter-spacing: 0; }

      /* Persian script gets hard to read under 11px */
      .text-\\[9px\\] { font-size: 10.5px !important; }
      .text-\\[10px\\] { font-size: 11px !important; }

      :focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }

      ::selection { background: var(--color-primary); color: #fff; }

      html { scrollbar-color: var(--color-line-strong) transparent; scrollbar-width: thin; }

      html.theme-transition,
      html.theme-transition *,
      html.theme-transition *::before,
      html.theme-transition *::after {
        transition: background-color 0.25s var(--ease), border-color 0.25s var(--ease), color 0.2s var(--ease) !important;
      }

      /* ==========================================================================
         3. Surfaces
         ========================================================================== */
      .card-glass, .glass-card,
      .card-glass-elevated, .glass-card-elevated,
      .card-glass-interactive {
        background: var(--color-surface);
        border: 1px solid var(--color-line);
        border-radius: var(--radius-panel);
      }
      .card-glass-subtle, .glass-card-subtle {
        background: var(--color-surface-2);
        border: 1px solid var(--color-line);
      }
      .card-glass-interactive {
        transition: border-color var(--transition-fast);
      }
      .card-glass-interactive:hover {
        border-color: var(--color-primary-line);
      }
      html.light .card-glass,
      html.light .card-glass-interactive {
        box-shadow: 0 1px 0 rgba(21, 23, 26, 0.04);
      }

      /* Glows are retired: plain hierarchy instead of halos */
      .glow-emerald, .glow-gold, .glow-cyan, .glow-purple, .glow-rose {
        box-shadow: none !important;
      }

      /* ==========================================================================
         4. Buttons
         ========================================================================== */
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-weight: 600;
        border-radius: var(--radius-control);
        transition: background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast), transform 0.1s var(--ease);
        cursor: pointer;
        user-select: none;
        border: 1px solid transparent;
        line-height: 1.25;
        min-height: 2.25rem;
      }
      .btn:active { transform: translateY(1px); }
      .btn:disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }

      .btn-sm { padding: 0.35rem 0.8rem; font-size: 0.8125rem; min-height: 2rem; }
      .btn-md { padding: 0.55rem 1.1rem; font-size: 0.875rem; }
      .btn-lg { padding: 0.75rem 1.4rem; font-size: 0.9375rem; min-height: 2.875rem; }

      .btn-primary {
        background: var(--color-primary);
        color: #ffffff !important;
      }
      .btn-primary:hover { background: var(--color-primary-hover); }

      .btn-secondary {
        background: var(--color-surface-2);
        color: var(--color-text-primary);
        border-color: var(--color-line);
      }
      .btn-secondary:hover { border-color: var(--color-line-strong); }

      .btn-danger {
        background: var(--color-danger-soft);
        color: var(--color-danger);
        border-color: transparent;
      }
      .btn-danger:hover { background: var(--plate-red); color: #fff; }

      .btn-ghost {
        background: transparent;
        color: var(--color-text-secondary);
      }
      .btn-ghost:hover {
        background: var(--color-surface-2);
        color: var(--color-text-primary);
      }

      .btn-outline-dashed {
        background: transparent;
        border: 1.5px dashed var(--color-line-strong);
        color: var(--color-text-secondary);
      }
      .btn-outline-dashed:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
      }

      .btn-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        border-radius: var(--radius-control);
        transition: background-color var(--transition-fast), color var(--transition-fast);
        cursor: pointer;
      }
      .btn-icon-sm { padding: 0.4rem; border-radius: 8px; }

      /* ==========================================================================
         5. Badges
         ========================================================================== */
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.25rem 0.65rem;
        border-radius: var(--radius-full);
        font-size: 0.75rem;
        font-weight: 600;
        line-height: 1.2;
        border: 1px solid transparent;
      }
      .badge-emerald, .badge-cyan { background: var(--color-primary-soft); color: var(--color-primary); }
      html.dark .badge-emerald, html.dark .badge-cyan { color: #84ADEE; }
      .badge-gold { background: rgba(240, 195, 60, 0.16); color: var(--color-pr); }
      .badge-purple { background: var(--color-surface-2); color: var(--color-text-secondary); border-color: var(--color-line); }
      .badge-rose { background: var(--color-danger-soft); color: var(--color-danger); }
      .badge-zinc { background: var(--color-surface-2); color: var(--color-text-secondary); border-color: var(--color-line); }
      .badge-live {
        background: var(--plate-red);
        color: #fff;
      }

      /* ==========================================================================
         6. Form Controls
         ========================================================================== */
      .input-styled, .select-styled, .textarea-styled {
        width: 100%;
        background-color: var(--color-bg-sunken);
        border: 1px solid var(--color-line);
        border-radius: var(--radius-control);
        color: var(--color-text-primary);
        font-size: 0.875rem;
        padding: 0.6rem 0.85rem;
        transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
      }
      html.light .input-styled, html.light .select-styled, html.light .textarea-styled {
        background-color: #fff;
      }
      .input-styled:focus, .select-styled:focus, .textarea-styled:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-soft);
      }
      .input-styled::placeholder, .textarea-styled::placeholder { color: var(--color-text-muted); }
      .label-styled {
        display: block;
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--color-text-secondary);
        margin-bottom: 0.375rem;
      }

      /* ==========================================================================
         7. Icon Boxes & Avatars
         ========================================================================== */
      .icon-box {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border-radius: var(--radius-control);
        background: var(--color-surface-2);
        color: var(--color-text-secondary);
      }
      .icon-box-emerald, .icon-box-cyan { background: var(--color-primary-soft); color: var(--color-primary); }
      html.dark .icon-box-emerald, html.dark .icon-box-cyan { color: #84ADEE; }
      .icon-box-gold { background: rgba(240, 195, 60, 0.16); color: var(--color-pr); }
      .icon-box-purple { background: var(--color-surface-2); color: var(--color-text-secondary); }
      .icon-box-rose { background: var(--color-danger-soft); color: var(--color-danger); }

      .avatar-frame {
        border-radius: var(--radius-full);
        border: 2px solid var(--color-line);
        background: var(--color-surface-2);
      }

      /* ==========================================================================
         8. Stats
         ========================================================================== */
      .stat-tile {
        padding: 1rem 1.1rem;
        border-radius: var(--radius-panel);
        background: var(--color-surface);
        border: 1px solid var(--color-line);
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
      }
      .stat-tile .icon-box { display: none; }
      .stat-label {
        font-size: 0.8125rem;
        color: var(--color-text-secondary);
      }
      .stat-value {
        font-size: 1.625rem;
        color: var(--color-text-primary);
      }
      .metric-pill {
        background: var(--color-surface-2);
        padding: 0.5rem 0.875rem;
        border-radius: var(--radius-control);
        border: 1px solid var(--color-line);
        text-align: center;
        min-width: 75px;
      }

      /* ==========================================================================
         9. Progress
         ========================================================================== */
      .progress-track {
        width: 100%;
        height: 0.5rem;
        border-radius: var(--radius-full);
        background: var(--color-line);
        overflow: hidden;
      }
      .progress-bar-emerald, .progress-bar-gold {
        height: 100%;
        border-radius: var(--radius-full);
        transition: width 0.4s var(--ease);
      }
      .progress-bar-emerald { background: var(--color-primary); }
      .progress-bar-gold { background: var(--plate-yellow); }

      /* ==========================================================================
         10. Workout Sets: completion is green, like a loaded 10kg plate
         ========================================================================== */
      .todo-card {
        background: var(--color-surface);
        border: 1px solid var(--color-line);
        border-radius: 12px;
        padding: 0.875rem;
        transition: border-color var(--transition-fast), background-color var(--transition-fast);
      }
      .todo-card-completed {
        border-color: var(--color-done);
        background: var(--color-done-soft);
      }

      .set-row {
        display: grid;
        grid-template-columns: 2.2rem 1fr 1fr 1fr 2.4rem;
        gap: 0.5rem;
        align-items: center;
        padding: 0.35rem 0.5rem;
        border-radius: var(--radius-control);
        background: var(--color-surface-2);
        border: 1px solid var(--color-line);
      }
      .set-row-completed {
        background: var(--color-done-soft);
        border-color: var(--color-done);
      }

      .check-btn {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: var(--radius-full);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1.5px solid var(--color-line-strong);
        background: transparent;
        color: var(--color-text-muted);
        cursor: pointer;
        transition: background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
      }
      .check-btn:hover { border-color: var(--color-done); color: var(--color-done); }
      .check-btn.completed {
        background: var(--color-done);
        border-color: var(--color-done);
        color: #ffffff;
        animation: plate-drop 0.28s var(--ease);
      }

      /* ==========================================================================
         11. Modals
         ========================================================================== */
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: var(--color-modal-backdrop);
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }
      .modal-panel {
        background: var(--color-surface);
        border: 1px solid var(--color-line);
        border-radius: 20px;
        box-shadow: 0 24px 48px -16px rgba(0, 0, 0, 0.35);
        width: 100%;
        max-height: 90vh;
      }

      /* ==========================================================================
         12. App Shell
         ========================================================================== */
      .app-topbar {
        background: var(--color-bg-base);
        border-bottom: 1px solid var(--color-line);
      }
      .nav-desktop-btn {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        height: 100%;
        padding: 0 0.9rem;
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--color-text-secondary);
        transition: color var(--transition-fast);
      }
      .nav-desktop-btn:hover { color: var(--color-text-primary); }
      .nav-desktop-btn.is-active { color: var(--color-text-primary); font-weight: 600; }
      .nav-desktop-btn .nav-underline {
        position: absolute;
        inset-inline: 0.9rem;
        bottom: -1px;
        height: 3px;
        background: var(--color-primary);
        transform: scaleX(0);
        transition: transform var(--transition-normal);
      }
      .nav-desktop-btn.is-active .nav-underline { transform: scaleX(1); }

      .app-bottomnav {
        background: var(--color-surface);
        border-top: 1px solid var(--color-line);
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
        color: var(--color-text-muted);
        position: relative;
      }
      .nav-mobile-btn .nav-m-pill {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3.5rem;
        height: 1.9rem;
        border-radius: var(--radius-full);
        transition: background-color var(--transition-normal), color var(--transition-normal);
      }
      .nav-mobile-btn.is-active { color: var(--color-text-primary); font-weight: 600; }
      .nav-mobile-btn.is-active .nav-m-pill { background: var(--color-primary); color: #fff; }

      .brand-mark { color: var(--color-primary); }
      .brand-word { font-family: var(--font-display); font-size: 1.35rem; line-height: 1; color: var(--color-text-primary); }

      .account-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.75rem 0.25rem 0.25rem;
        border-radius: var(--radius-full);
        border: 1px solid var(--color-line);
        background: var(--color-surface);
        color: var(--color-text-primary);
        font-size: 0.8125rem;
        font-weight: 500;
        transition: border-color var(--transition-fast);
      }
      [dir="rtl"] .account-chip { padding: 0.25rem 0.25rem 0.25rem 0.75rem; }
      .account-chip:hover { border-color: var(--color-line-strong); }
      .account-chip.is-active { border-color: var(--color-primary); }
      .account-chip.no-avatar { padding: 0.4rem 0.8rem; }

      /* ==========================================================================
         13. Weekly Barbell (dashboard hero)
         ========================================================================== */
      .hero-panel {
        background: var(--color-surface);
        border: 1px solid var(--color-line);
        border-radius: 20px;
      }
      .hero-title {
        font-size: clamp(1.9rem, 1.3rem + 2.4vw, 2.9rem);
        line-height: 1.15;
      }
      .barbell svg { width: 100%; height: auto; display: block; overflow: visible; }
      .barbell .bar { fill: var(--color-bar); }
      .barbell .collar { fill: var(--color-text-secondary); }
      .barbell .slot { fill: none; stroke: var(--color-line-strong); stroke-width: 1.5; stroke-dasharray: 4 4; }
      .barbell .plate { transform-box: fill-box; transform-origin: center; animation: plate-drop 0.45s var(--ease) backwards; }
      .barbell-caption { color: var(--color-text-secondary); font-size: 0.875rem; }
      .barbell-caption strong { color: var(--color-text-primary); font-family: var(--font-display); font-weight: 400; font-size: 1.25rem; }

      /* ==========================================================================
         14. Light Mode Remaps for Legacy Dark Utilities
         ========================================================================== */
      html.light .text-white { color: var(--color-text-primary) !important; }
      html.light .text-zinc-100 { color: #15171A !important; }
      html.light .text-zinc-200 { color: #2C3035 !important; }
      html.light .text-zinc-300 { color: #43474D !important; }
      html.light .text-zinc-400 { color: #5E636A !important; }
      html.light .text-zinc-500 { color: #7D8288 !important; }
      html.light .text-emerald-300, html.light .text-emerald-400 { color: var(--color-primary) !important; }
      html.light .text-amber-300, html.light .text-amber-400 { color: #B88A0E !important; }
      html.light [class*="border-white"] { border-color: var(--color-line) !important; }
      html.light [class*="bg-white/5"],
      html.light [class*="bg-white/10"] { background-color: rgba(21, 23, 26, 0.04) !important; }
      html.light [class*="bg-black/"] { background-color: var(--color-surface-2) !important; }
      html.light .border-zinc-800 { border-color: var(--color-line) !important; }

      /* Legacy hard-coded obsidian fills map onto the current theme */
      [class*="bg-[#08090d]"] { background-color: var(--color-bg-sunken) !important; }
      [class*="bg-[#0d0f17]"] { background-color: var(--color-surface) !important; }
      [class*="bg-[#121522]"] { background-color: var(--color-surface-2) !important; }

      .theme-option-btn.active {
        border-color: var(--color-primary) !important;
        background-color: var(--color-primary-soft) !important;
        color: var(--color-text-primary) !important;
      }

      /* ==========================================================================
         15. Motion
         ========================================================================== */
      @keyframes plate-drop {
        0% { transform: translateY(-6px) scaleY(0.92); opacity: 0; }
        100% { transform: none; opacity: 1; }
      }
      @keyframes pulse-subtle {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.85; }
      }
      .active-todo-pulse { animation: none; }
      @keyframes pop-in {
        0% { transform: scale(0.85); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes fade-up {
        0% { transform: translateY(6px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }

      @media (prefers-reduced-motion: reduce) {
        *, ::before, ::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    </style>
  `;
}
