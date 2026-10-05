// ============================================================================
// Modular UI Components for جسم و اندیشه
// App shell (top bar, bottom nav), toasts, dialogs and shared modals
// ============================================================================

export const BRAND_MARK_SVG = `<svg class="brand-mark" width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="currentColor"/><g fill="var(--on-accent)"><rect x="4" y="14.75" width="24" height="2.5" rx="1.25"/><rect x="8.5" y="9" width="3" height="14" rx="1.25"/><rect x="20.5" y="9" width="3" height="14" rx="1.25"/><rect x="5.5" y="11.5" width="2.25" height="9" rx="1"/><rect x="24.25" y="11.5" width="2.25" height="9" rx="1"/></g></svg>`;

export function renderTopNavbar(): string {
  return `
    <!-- Desktop top bar -->
    <header class="hidden md:block fixed top-0 inset-x-0 z-40 app-topbar">
      <div class="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-stretch justify-between gap-6">

        <button type="button" class="flex items-center gap-2.5 shrink-0" onclick="switchTab('dashboard')" aria-label="داشبورد">
          ${BRAND_MARK_SVG}
          <span class="brand-word">جسم و اندیشه</span>
        </button>

        <nav class="flex items-stretch" aria-label="بخش‌های اصلی">
          <button onclick="switchTab('dashboard')" id="nav-d-dashboard" class="nav-desktop-btn is-active">
            <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
            <span>داشبورد</span>
            <span id="active-badge-d" class="hidden badge badge-live">در حال تمرین</span>
            <span class="nav-underline"></span>
          </button>
          <button onclick="switchTab('movements')" id="nav-d-movements" class="nav-desktop-btn">
            <i data-lucide="clipboard-list" class="w-4 h-4"></i>
            <span>برنامه‌ها و حرکات</span>
            <span id="nav-draft-count-badge" class="hidden badge badge-emerald">۰</span>
            <span class="nav-underline"></span>
          </button>
          <button onclick="switchTab('history')" id="nav-d-history" class="nav-desktop-btn">
            <i data-lucide="history" class="w-4 h-4"></i>
            <span>تاریخچه</span>
            <span class="nav-underline"></span>
          </button>
        </nav>

        <div class="flex items-center gap-2 shrink-0">
          <button type="button" onclick="toggleTheme()" id="theme-toggle-btn-d" title="تغییر حالت روز و شب" aria-label="تغییر حالت روز و شب" class="btn-icon btn-ghost">
            <i data-lucide="sun" class="w-4 h-4 hidden dark:block"></i>
            <i data-lucide="moon" class="w-4 h-4 block dark:hidden"></i>
          </button>
          <div id="desktop-top-auth" class="flex items-center gap-2">
            <!-- Injected dynamically via JS -->
          </div>
        </div>

      </div>
    </header>
  `;
}

export function renderMobileTopHeader(): string {
  return `
    <header id="mobile-top-header" class="md:hidden sticky top-0 z-40 app-topbar px-4 h-14 flex items-center justify-between">
      <button type="button" class="flex items-center gap-2" onclick="switchTab('dashboard')" aria-label="داشبورد">
        ${BRAND_MARK_SVG}
        <span class="brand-word">جسم و اندیشه</span>
      </button>

      <div class="flex items-center gap-1.5">
        <button type="button" onclick="toggleTheme()" id="theme-toggle-btn-m" title="تغییر حالت روز و شب" aria-label="تغییر حالت روز و شب" class="btn-icon btn-ghost">
          <i data-lucide="sun" class="w-4 h-4 hidden dark:block"></i>
          <i data-lucide="moon" class="w-4 h-4 block dark:hidden"></i>
        </button>
        <div id="mobile-top-auth" class="flex items-center gap-2">
          <!-- Populated by JS -->
        </div>
      </div>
    </header>
  `;
}

export function renderMobileBottomNav(): string {
  return `
    <!-- Mobile bottom navigation (RTL order: programs, dashboard, history) -->
    <nav id="mobile-bottom-nav" class="md:hidden fixed bottom-0 inset-x-0 z-40 app-bottomnav flex items-stretch px-2" aria-label="بخش‌های اصلی">
      <button onclick="switchTab('movements')" id="nav-m-movements" class="nav-mobile-btn">
        <span class="nav-m-pill"><i data-lucide="clipboard-list" class="w-5 h-5"></i></span>
        <span>برنامه‌ها</span>
        <span id="nav-m-draft-badge" class="hidden absolute top-1.5 right-[calc(50%-1.9rem)] w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-[color:var(--color-surface)]"></span>
      </button>
      <button onclick="switchTab('dashboard')" id="nav-m-dashboard" class="nav-mobile-btn is-active">
        <span class="nav-m-pill"><i data-lucide="layout-dashboard" class="w-5 h-5"></i></span>
        <span>داشبورد</span>
        <span id="active-badge-m" class="hidden absolute top-1.5 right-[calc(50%-1.9rem)] w-2.5 h-2.5 rounded-full bg-danger ring-2 ring-[color:var(--color-surface)]"></span>
      </button>
      <button onclick="switchTab('history')" id="nav-m-history" class="nav-mobile-btn">
        <span class="nav-m-pill"><i data-lucide="history" class="w-5 h-5"></i></span>
        <span>تاریخچه</span>
      </button>
    </nav>
  `;
}

export function renderToastAndDialogs(): string {
  return `
    <!-- Toast Stack -->
    <div id="toast-notification" role="status" aria-live="polite" class="fixed top-4 md:top-20 left-1/2 -translate-x-1/2 z-[60] pointer-events-none opacity-0 -translate-y-2">
      <div id="toast-card" class="toast toast-success">
        <div id="toast-icon-wrap" class="flex">
          <i data-lucide="check-circle-2"></i>
        </div>
        <span id="toast-message">عملیات با موفقیت انجام شد</span>
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
          <input type="text" id="dialog-text-input" class="input-styled font-mono">
        </div>

        <div class="modal-foot">
          <button id="dialog-cancel-btn" onclick="handleDialogClose(false)" class="btn btn-secondary btn-md">
            انصراف
          </button>
          <button id="dialog-confirm-btn" onclick="handleDialogClose(true)" class="btn btn-primary btn-md">
            <span>تایید</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Rest Timer Floating Capsule Overlay -->
    <div id="rest-timer-overlay" class="rest-timer fixed bottom-24 md:bottom-8 left-4 md:left-8 z-50 hidden">
      <div class="rest-timer-panel p-4 flex items-center gap-4 w-auto">
        <div class="relative w-14 h-14 flex items-center justify-center">
          <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path class="text-[color:var(--line-strong)]" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path id="rest-timer-svg-path" class="text-[color:var(--accent)]" stroke-dasharray="100, 100" stroke-width="3" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <span id="rest-timer-seconds" class="absolute font-mono font-bold text-sm text-white">۶۰</span>
        </div>
        <div>
          <div class="flex items-center gap-1.5">
            <i data-lucide="timer" class="w-3.5 h-3.5 text-accent"></i>
            <p class="text-xs font-bold text-white">زمان استراحت ست</p>
          </div>
          <div class="flex items-center gap-1.5 mt-2">
            <button onclick="adjustRestTimer(15)" class="btn btn-secondary btn-sm">+۱۵ ث</button>
            <button onclick="adjustRestTimer(30)" class="btn btn-secondary btn-sm">+۳۰ ث</button>
            <button onclick="stopRestTimer()" class="btn btn-danger btn-sm">پایان</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Exercise to Active Workout Modal -->
    <div id="add-to-workout-modal" class="modal-backdrop hidden">
      <div class="modal-panel max-w-md max-h-[85vh] flex flex-col p-5 space-y-4">
        <div class="modal-head">
          <h3 class="text-base font-bold text-white">افزودن حرکت</h3>
          <button onclick="closeAddExerciseModal()" class="btn-icon btn-ghost" aria-label="بستن">
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
          class="input-styled"
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
          <button onclick="closeShareQrModal()" class="btn-icon btn-ghost" aria-label="بستن">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <div>
          <h4 id="share-qr-title" class="font-bold text-sm text-white truncate"></h4>
        </div>

        <!-- QR Code Canvas / Image Container -->
        <div class="bg-white p-3 rounded-[14px] mx-auto w-fit border border-[color:var(--line)]">
          <img id="share-qr-img" class="w-48 h-48 block mx-auto rounded-lg" src="" alt="QR Code">
        </div>

        <!-- Copy Link Section -->
        <div class="space-y-2 pt-1">
          <div class="flex items-center gap-1.5">
            <input type="text" id="share-qr-url" readonly class="input-styled input-sm font-mono select-all" dir="ltr">
            <button onclick="copyShareQrUrl()" class="btn btn-primary btn-sm shrink-0">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
              <span>کپی لینک</span>
            </button>
          </div>
        </div>

        <button onclick="closeShareQrModal()" class="btn btn-secondary btn-sm w-full">
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
          <button onclick="closeSharedRoutineModal()" class="btn-icon btn-ghost" aria-label="بستن">
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
          <button onclick="closeSharedRoutineModal()" class="btn btn-secondary btn-md w-full">
            انصراف و بستن
          </button>
        </div>
      </div>
    </div>
  `;
}
