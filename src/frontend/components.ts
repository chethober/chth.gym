// ============================================================================
// Modular UI Components for جسم و اندیشه
// App shell (the CHTH navbar slot, the tab bar), dialogs and shared modals
// ============================================================================

import { dialogModel } from '../chth-kit/overlays.js';
import { skeletonHtml, copyButtonHtml } from '../chth-kit/ui.js';

/** Grey card shapes (the kit's skeleton) holding a list's place until the page fills it in. */
export function cardSkeletons(count: number, height = '5.5rem'): string {
  const first = skeletonHtml('fa', { shape: 'block', height });
  // Only the first says "Loading…" to screen readers; the rest are shapes
  const rest = first.replace(/<span class="chth-sr-only">[^<]*<\/span>/, '').replace(' role="status"', ' aria-hidden="true"');
  return first + rest.repeat(Math.max(0, count - 1));
}

export const BRAND_MARK_SVG = `<svg class="brand-mark" width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="currentColor"/><g fill="var(--on-accent)"><rect x="4" y="14.75" width="24" height="2.5" rx="1.25"/><rect x="8.5" y="9" width="3" height="14" rx="1.25"/><rect x="20.5" y="9" width="3" height="14" rx="1.25"/><rect x="5.5" y="11.5" width="2.25" height="9" rx="1"/><rect x="24.25" y="11.5" width="2.25" height="9" rx="1"/></g></svg>`;

// The top of the app is the shared CHTH navbar (filled in per language by finishPage): the account
// chip (#mobile-top-auth, filled by renderUserUI/renderAuthPrompt) goes before theme and language.
// The tabs live in the bottom bar, a floating dock on wider screens.
export function renderTopNavbar(): string {
  return '<!--chth-nav:app-->';
}

export function renderMobileBottomNav(): string {
  return `
    <!-- The tab bar: the CHTH kit's glass tab bar (data-chth-tabs), a floating pill on every screen.
         A highlight slides to the active tab, labels fold away when it minimizes on scroll, and a
         finger dragged across it scrubs between tabs. DOM order is right-to-left on screen (RTL),
         so visually left→right it reads: history, plan, dashboard, movements, suggestions -->
    <nav id="mobile-bottom-nav" class="fixed z-40 app-bottomnav chth-tabs" data-chth-tabs aria-label="بخش‌های اصلی">
      <button onclick="switchTab('presets')" id="nav-m-presets" class="nav-mobile-btn" data-chth-tab>
        <span class="nav-m-pill"><i data-lucide="sparkles" class="w-5 h-5"></i></span>
        <span class="chth-tabs__label">پیشنهادها</span>
      </button>
      <button onclick="switchTab('movements')" id="nav-m-movements" class="nav-mobile-btn" data-chth-tab>
        <span class="nav-m-pill"><i data-lucide="dumbbell" class="w-5 h-5"></i></span>
        <span class="chth-tabs__label">حرکات</span>
        <span id="nav-m-draft-badge" class="hidden absolute top-1.5 right-[calc(50%-1.9rem)] w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-[color:var(--color-surface)]"></span>
      </button>
      <button onclick="switchTab('dashboard')" id="nav-m-dashboard" class="nav-mobile-btn is-active" data-chth-tab aria-current="page">
        <span class="nav-m-pill"><i data-lucide="layout-dashboard" class="w-5 h-5"></i></span>
        <span class="chth-tabs__label">داشبورد</span>
        <span id="active-badge-m" class="hidden absolute top-1.5 right-[calc(50%-1.9rem)] w-2.5 h-2.5 rounded-full bg-danger ring-2 ring-[color:var(--color-surface)]"></span>
      </button>
      <button onclick="switchTab('plan')" id="nav-m-plan" class="nav-mobile-btn" data-chth-tab>
        <span class="nav-m-pill"><i data-lucide="calendar-days" class="w-5 h-5"></i></span>
        <span class="chth-tabs__label">برنامه</span>
      </button>
      <button onclick="switchTab('history')" id="nav-m-history" class="nav-mobile-btn" data-chth-tab>
        <span class="nav-m-pill"><i data-lucide="history" class="w-5 h-5"></i></span>
        <span class="chth-tabs__label">تاریخچه</span>
      </button>
    </nav>
  `;
}

// The CHTH kit's dialog (chth-kit/overlays.js): the browser's own <dialog> in the kit's glass,
// a bottom sheet on phones that can be dragged down to close. Written out here rather than with
// dialogHtml() because that wraps the content in <form method="dialog">: the check-in has its
// own form, and Enter in a search box would close the dialog. Open and close them with
// openKitDialog/closeKitDialog (html.ts); whichever way one closes (×, Escape, the backdrop, a
// drag), its `close` event runs the page's cleanup.
const DIALOG_CLOSE_SVG = dialogModel('fa', { id: 'x', title: '' }).closeSvg;

export function dialogCloseButton(label = 'بستن'): string {
  return `<button type="button" class="chth-dialog__close" data-chth-close="cancel" aria-label="${label}">${DIALOG_CLOSE_SVG}</button>`;
}

export function kitDialog(opts: {
  id: string;
  /** The heading, or the head's own markup when it is more than a title (needs titleId). */
  title?: string;
  head?: string;
  titleId?: string;
  body: string;
  actions?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  bodyClass?: string;
  actionsClass?: string;
}): string {
  const titleId = opts.titleId ?? `${opts.id}-title`;
  const head = opts.head ?? `<h2 class="chth-dialog__title" id="${titleId}">${opts.title ?? ''}</h2>`;
  return `
    <dialog id="${opts.id}" class="chth-dialog chth-glass chth-dialog--${opts.size ?? 'md'} chth-dialog--sheet${opts.className ? ' ' + opts.className : ''}" data-chth-dialog aria-labelledby="${titleId}">
      <div class="chth-dialog__frame">
        <span class="chth-dialog__handle" data-chth-sheet-handle aria-hidden="true"></span>
        <header class="chth-dialog__head">${head}${dialogCloseButton()}</header>
        <div class="chth-dialog__body${opts.bodyClass ? ' ' + opts.bodyClass : ''}">${opts.body}</div>
        ${opts.actions ? `<footer class="chth-dialog__actions${opts.actionsClass ? ' ' + opts.actionsClass : ''}">${opts.actions}</footer>` : ''}
      </div>
    </dialog>`;
}

export function renderToastAndDialogs(): string {
  return `
    <!-- Ongoing exercise: the full movement card (media, muscles, guide) with its set controls -->
    ${kitDialog({
      id: 'ex-sheet-modal',
      titleId: 'ex-sheet-title',
      head: `
        <div class="chth-dialog__title min-w-0">
          <h2 id="ex-sheet-title" class="text-base font-black"></h2>
          <p id="ex-sheet-subtitle" class="text-11 text-zinc-400 font-mono mt-0.5 text-right font-normal" dir="ltr"></p>
        </div>`,
      bodyClass: 'ex-sheet-body space-y-4',
      body: `
        <div id="ex-sheet-media" class="ex-sheet-media"></div>
        <div id="ex-sheet-controls"></div>
        <div id="ex-sheet-info" class="space-y-3"></div>`,
    })}

    <!-- Confirm / alert / prompt (showConfirmDialog in html.ts) -->
    ${kitDialog({
      id: 'custom-dialog-modal',
      titleId: 'dialog-title',
      size: 'sm',
      head: `
        <div id="dialog-icon-container" class="icon-box icon-box-emerald w-10 h-10 shrink-0">
          <i id="dialog-icon" data-lucide="help-circle" class="w-5 h-5"></i>
        </div>
        <h2 id="dialog-title" class="chth-dialog__title">پیام سیستم</h2>`,
      bodyClass: 'space-y-3',
      body: `
        <p id="dialog-message" class="text-sm text-zinc-400 leading-relaxed"></p>
        <div id="dialog-input-wrap" class="hidden">
          <input type="text" id="dialog-text-input" class="chth-input font-mono">
        </div>`,
      actions: `
        <button type="button" id="dialog-cancel-btn" onclick="handleDialogClose(false)" class="chth-btn chth-btn--secondary chth-btn--md">انصراف</button>
        <button type="button" id="dialog-confirm-btn" onclick="handleDialogClose(true)" class="chth-btn chth-btn--primary chth-btn--md"><span>تایید</span></button>`,
    })}

    <!-- Rest timer: a glass pill like the toasts, above the tab bar. It floats above any open
         dialog (chthShell.float, set up in html.ts), so it stays usable over the movement card. -->
    <div id="rest-timer-overlay" class="rest-timer hidden">
      <div class="rest-timer-panel chth-glass" role="timer" aria-label="زمان استراحت ست">
        <span class="rest-ring">
          <svg viewBox="0 0 36 36" aria-hidden="true">
            <path class="rest-ring-track" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path id="rest-timer-svg-path" class="rest-ring-fill" stroke-dasharray="100, 100" stroke-width="3.5" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <span id="rest-timer-seconds" class="rest-ring-value">۶۰</span>
        </span>
        <span class="rest-timer-label">استراحت</span>
        <button type="button" onclick="adjustRestTimer(15)" class="rest-timer-chip">+۱۵ ث</button>
        <button type="button" onclick="adjustRestTimer(30)" class="rest-timer-chip">+۳۰ ث</button>
        <button type="button" onclick="stopRestTimer()" class="rest-timer-stop" aria-label="پایان استراحت" data-chth-tip="پایان استراحت">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
    </div>

    <!-- Add an exercise to the active workout -->
    ${kitDialog({
      id: 'add-to-workout-modal',
      title: 'افزودن حرکت',
      bodyClass: 'space-y-3',
      body: `
        <div class="input-icon">
          <i data-lucide="search"></i>
          <input type="search" id="modal-add-search" oninput="filterModalExercises()" placeholder="مثلاً: پرس سینه، نشر جانب، پلانک..." class="chth-input" enterkeyhint="search">
        </div>
        <div id="modal-exercises-list" class="space-y-2">
          <!-- Injected via JS -->
        </div>`,
    })}

    <!-- Share a routine: QR code and link -->
    ${kitDialog({
      id: 'share-qr-modal',
      size: 'sm',
      title: 'اشتراک‌گذاری برنامه',
      bodyClass: 'text-center space-y-4',
      body: `
        <h3 id="share-qr-title" class="font-bold text-sm truncate"></h3>
        <div class="bg-white p-3 rounded-[var(--r-lg)] mx-auto w-fit border border-[color:var(--line)]">
          <img id="share-qr-img" class="w-48 h-48 block mx-auto rounded-lg" src="" alt="QR Code">
        </div>
        <div class="flex items-center gap-1.5">
          <input type="text" id="share-qr-url" readonly class="chth-input chth-input--sm font-mono select-all" dir="ltr" aria-label="لینک برنامه">
          ${copyButtonHtml('fa', { from: '#share-qr-url', label: 'کپی لینک', variant: 'primary', className: 'shrink-0' })}
        </div>`,
      actions: `<button type="button" data-chth-close="cancel" class="chth-btn chth-btn--secondary chth-btn--md">بستن</button>`,
    })}

    <!-- A shared routine: preview and import -->
    ${kitDialog({
      id: 'shared-routine-modal',
      title: 'برنامه اشتراکی',
      bodyClass: 'space-y-4',
      body: `
        <div class="card-glass-subtle p-3.5 space-y-1">
          <h3 id="shared-routine-title" class="text-base font-black">عنوان برنامه</h3>
          <p id="shared-routine-desc" class="text-xs text-zinc-400"></p>
        </div>
        <div>
          <h4 class="text-xs font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
            <i data-lucide="dumbbell" class="w-3.5 h-3.5 text-accent"></i>
            <span>حرکات موجود در این برنامه:</span>
          </h4>
          <div id="shared-routine-exercises" class="space-y-2">
            <!-- Populated via JS -->
          </div>
        </div>`,
      actionsClass: 'is-stacked',
      actions: `
        <div id="shared-import-btn-container">
          <!-- Populated by JS based on login state -->
        </div>
        <button type="button" data-chth-close="cancel" class="chth-btn chth-btn--secondary chth-btn--md w-full">انصراف و بستن</button>`,
    })}
  `;
}
