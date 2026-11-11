// ============================================================================
// Modular UI Components for جسم و اندیشه
// App shell (the CHTH navbar slot, the tab bar), dialogs and shared modals
// ============================================================================

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

export function renderToastAndDialogs(): string {
  return `
    <!-- Ongoing exercise: the full movement card (media, muscles, guide) with its set controls.
         Before the dialog and rest timer so both stack above it. -->
    <div id="ex-sheet-modal" class="modal-backdrop hidden" onclick="if (event.target === this) closeExerciseSheet()">
      <div role="dialog" aria-modal="true" aria-labelledby="ex-sheet-title" class="modal-panel max-w-md max-h-[90vh] overflow-y-auto">
        <div id="ex-sheet-media" class="ex-sheet-media"></div>
        <div class="p-5 space-y-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h3 id="ex-sheet-title" class="text-base font-black text-white"></h3>
              <p id="ex-sheet-subtitle" class="text-11 text-zinc-400 font-mono mt-0.5 text-right" dir="ltr"></p>
            </div>
            <button onclick="closeExerciseSheet()" class="chth-btn chth-btn--icon chth-btn--ghost shrink-0" aria-label="بستن">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>
          <div id="ex-sheet-controls"></div>
          <div id="ex-sheet-info" class="space-y-3"></div>
        </div>
      </div>
    </div>

    <!-- Modular Dialogue Box Modal -->
    <div id="custom-dialog-modal" class="modal-backdrop hidden">
      <div id="custom-dialog-box" role="dialog" aria-modal="true" aria-labelledby="dialog-title" class="modal-panel max-w-md p-6 space-y-5">
        
        <div class="flex items-start gap-4">
          <div id="dialog-icon-container" class="icon-box icon-box-emerald w-11 h-11 shrink-0">
            <i id="dialog-icon" data-lucide="help-circle" class="w-5 h-5"></i>
          </div>
          <div class="space-y-1 pt-0.5">
            <h3 id="dialog-title" class="text-base font-bold text-white">پیام سیستم</h3>
            <p id="dialog-message" class="text-sm text-zinc-400 leading-relaxed"></p>
          </div>
        </div>

        <div id="dialog-input-wrap" class="hidden space-y-2 pt-1">
          <input type="text" id="dialog-text-input" class="chth-input font-mono">
        </div>

        <div class="modal-foot">
          <button id="dialog-cancel-btn" onclick="handleDialogClose(false)" class="chth-btn chth-btn--secondary chth-btn--md">
            انصراف
          </button>
          <button id="dialog-confirm-btn" onclick="handleDialogClose(true)" class="chth-btn chth-btn--primary chth-btn--md">
            <span>تایید</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Rest timer: a glass pill like the toasts, above the tab bar -->
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
        <button type="button" onclick="stopRestTimer()" class="rest-timer-stop" aria-label="پایان استراحت" title="پایان استراحت">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
    </div>

    <!-- Add Exercise to Active Workout Modal -->
    <div id="add-to-workout-modal" class="modal-backdrop hidden">
      <div class="modal-panel max-w-md max-h-[85vh] flex flex-col p-5 space-y-4">
        <div class="modal-head">
          <h3 class="text-base font-bold text-white">افزودن حرکت</h3>
          <button onclick="closeAddExerciseModal()" class="chth-btn chth-btn--icon chth-btn--ghost" aria-label="بستن">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
        
        <div class="input-icon">
        <i data-lucide="search"></i>
        <input 
          type="text" 
          id="modal-add-search" 
          oninput="filterModalExercises()" 
          placeholder="مثلاً: پرس سینه، نشر جانب، پلانک..." 
          class="chth-input"
        >
        </div>

        <div id="modal-exercises-list" class="flex-1 overflow-y-auto space-y-2 max-h-96 pr-1">
          <!-- Injected via JS -->
        </div>
      </div>
    </div>

    <!-- Share Routine QR Code Modal -->
    <div id="share-qr-modal" class="modal-backdrop hidden">
      <div class="modal-panel max-w-sm p-6 text-center space-y-4">
        <div class="modal-head">
          <div class="flex items-center gap-2">
            <div class="icon-box icon-box-emerald w-7 h-7">
              <i data-lucide="qr-code" class="w-4 h-4"></i>
            </div>
            <h3 class="text-sm font-bold text-white">اشتراک‌گذاری برنامه</h3>
          </div>
          <button onclick="closeShareQrModal()" class="chth-btn chth-btn--icon chth-btn--ghost" aria-label="بستن">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <div>
          <h4 id="share-qr-title" class="font-bold text-sm text-white truncate"></h4>
        </div>

        <!-- QR Code Canvas / Image Container -->
        <div class="bg-white p-3 rounded-[var(--r-lg)] mx-auto w-fit border border-[color:var(--line)]">
          <img id="share-qr-img" class="w-48 h-48 block mx-auto rounded-lg" src="" alt="QR Code">
        </div>

        <!-- Copy Link Section -->
        <div class="space-y-2 pt-1">
          <div class="flex items-center gap-1.5">
            <input type="text" id="share-qr-url" readonly class="chth-input chth-input--sm font-mono select-all" dir="ltr">
            <button onclick="copyShareQrUrl()" class="chth-btn chth-btn--primary chth-btn--sm shrink-0">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
              <span>کپی لینک</span>
            </button>
          </div>
        </div>

        <button onclick="closeShareQrModal()" class="chth-btn chth-btn--secondary chth-btn--sm w-full">
          بستن
        </button>
      </div>
    </div>

    <!-- Shared Routine Preview & Import Modal -->
    <div id="shared-routine-modal" class="modal-backdrop hidden">
      <div class="modal-panel max-w-lg overflow-y-auto p-6 space-y-5">
        <div class="modal-head">
          <div class="flex items-center gap-2.5">
            <div class="icon-box icon-box-emerald w-8 h-8">
              <i data-lucide="share-2" class="w-4 h-4"></i>
            </div>
            <h3 class="text-sm font-bold text-white">برنامه اشتراکی</h3>
          </div>
          <button onclick="closeSharedRoutineModal()" class="chth-btn chth-btn--icon chth-btn--ghost" aria-label="بستن">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="space-y-4">
          <div class="card-glass-subtle p-3.5 space-y-1">
            <h4 id="shared-routine-title" class="text-base font-black text-white">عنوان برنامه</h4>
            <p id="shared-routine-desc" class="text-xs text-zinc-400"></p>
          </div>

          <div>
            <h5 class="text-xs font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
              <i data-lucide="dumbbell" class="w-3.5 h-3.5 text-accent"></i>
              <span>حرکات موجود در این برنامه:</span>
            </h5>
            <div id="shared-routine-exercises" class="space-y-2 max-h-60 overflow-y-auto pr-1">
              <!-- Populated via JS -->
            </div>
          </div>
        </div>

        <div class="modal-foot flex-col items-stretch">
          <div id="shared-import-btn-container">
            <!-- Populated by JS based on login state -->
          </div>
          <button onclick="closeSharedRoutineModal()" class="chth-btn chth-btn--secondary chth-btn--md w-full">
            انصراف و بستن
          </button>
        </div>
      </div>
    </div>
  `;
}
