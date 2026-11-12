// Installing the app (PWA) and the connection/sync status pill.
// Chrome, Edge and Android offer installing through `beforeinstallprompt`, which the app keeps
// and fires from its own button. iOS has no such event: Safari users get the Share-sheet steps.

// iOS and older Android read these instead of (or alongside) the web app manifest
export function renderInstallHead(): string {
  return `
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="جسم و اندیشه">
  <!-- "black", not "black-translucent": the header has no top safe-area padding -->
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="application-name" content="جسم و اندیشه">
  <style>
    .sync-pill { position: fixed; top: calc(env(safe-area-inset-top, 0px) + 0.6rem); left: 50%; transform: translateX(-50%);
      z-index: 70; display: inline-flex; align-items: center; gap: var(--chth-space-8); max-width: calc(100vw - 2rem);
      padding: var(--chth-space-6) var(--chth-space-14); border-radius: var(--chth-radius-full); font-size: var(--chth-text-12); font-weight: 600; white-space: nowrap;
      background: var(--surface-2); color: var(--text-2); border: 1px solid var(--line); box-shadow: 0 6px 20px rgba(0,0,0,0.18); }
    .sync-pill[data-state="offline"] { color: var(--gold); background: var(--gold-soft); border-color: transparent; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
    .sync-pill .sync-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
    .sync-pill[data-state="syncing"] .sync-dot { animation: sync-pulse var(--chth-dur-1000) ease-in-out infinite alternate; }
    @keyframes sync-pulse { from { opacity: 0.25; } to { opacity: 1; } }
    .install-banner { position: fixed; z-index: 60; inset-inline: 1rem; bottom: calc(5.25rem + env(safe-area-inset-bottom, 0px));
      max-width: 26rem; margin-inline: auto; }
    @media (min-width: 768px) { .install-banner { bottom: 1.5rem; inset-inline-start: auto; inset-inline-end: 1.5rem; margin: 0; } }
    @media (prefers-reduced-motion: reduce) { .sync-pill[data-state="syncing"] .sync-dot { animation: none; } }
  </style>`;
}

export function renderSyncIndicator(): string {
  return `
  <div id="sync-indicator" class="sync-pill hidden" role="status" aria-live="polite" data-state="offline">
    <span class="sync-dot" aria-hidden="true"></span>
    <span data-sync-label>آفلاین</span>
  </div>`;
}

// A one-time suggestion, shown when the browser says the app can be installed
export function renderInstallBanner(): string {
  return `
  <div id="install-banner" class="install-banner card-glass p-3.5 flex items-center gap-3 hidden" role="dialog" aria-labelledby="install-banner-title">
    <img src="/icons/icon-192x192.png" alt="" class="w-11 h-11 rounded-xl shrink-0">
    <div class="min-w-0 flex-1">
      <h4 id="install-banner-title" class="text-xs font-bold text-white">نصب جسم و اندیشه</h4>
      <p class="text-12 text-zinc-400">اجرای سریع از صفحه‌ی اصلی، حتی بدون اینترنت.</p>
    </div>
    <button type="button" onclick="installApp()" class="chth-btn chth-btn--primary chth-btn--sm shrink-0">نصب</button>
    <button type="button" onclick="dismissInstallBanner()" class="chth-btn chth-btn--icon-sm shrink-0" aria-label="بستن" data-chth-tip="بستن">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  </div>`;
}

// Card in the profile tab; stays available after the banner is dismissed
export function renderInstallCard(): string {
  return `
      <div id="install-app-card" class="hidden card-glass p-4 space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="icon-box icon-box-emerald w-9 h-9 shrink-0">
              <i data-lucide="smartphone" class="w-4 h-4"></i>
            </div>
            <div>
              <h4 class="text-xs font-bold text-white">نصب اپلیکیشن</h4>
              <p class="text-12 text-zinc-400">جسم و اندیشه را مثل یک برنامه روی گوشی یا رایانه نصب کنید؛ تمرین‌ها بدون اینترنت هم ثبت می‌شوند.</p>
            </div>
          </div>
          <button type="button" onclick="installApp()" class="chth-btn chth-btn--primary chth-btn--sm whitespace-nowrap shrink-0">
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
            <span>نصب اپلیکیشن</span>
          </button>
        </div>
        <ol id="install-ios-steps" class="hidden text-12 text-zinc-400 space-y-1.5 list-decimal ps-5">
          <li>در Safari دکمه‌ی <b class="text-white">اشتراک‌گذاری</b> <i data-lucide="share" class="inline w-3.5 h-3.5 align-[-2px]"></i> را بزنید.</li>
          <li>گزینه‌ی <b class="text-white">Add to Home Screen</b> را انتخاب کنید.</li>
          <li>روی <b class="text-white">Add</b> بزنید؛ آیکون برنامه به صفحه‌ی اصلی اضافه می‌شود.</li>
        </ol>
      </div>`;
}

export function renderInstallScript(): string {
  return String.raw`
    var deferredInstallPrompt = null;
    var INSTALL_DISMISSED_KEY = 'jesm_install_banner_dismissed';

    function isStandaloneApp() {
      return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    }
    function isIosDevice() {
      return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }
    function canInstallApp() {
      return !isStandaloneApp() && (!!deferredInstallPrompt || isIosDevice());
    }

    function updateInstallUi() {
      var card = document.getElementById('install-app-card');
      if (card) card.classList.toggle('hidden', !canInstallApp());
      var banner = document.getElementById('install-banner');
      var dismissed = false;
      try { dismissed = !!localStorage.getItem(INSTALL_DISMISSED_KEY); } catch (e) {}
      // Only the browser's own prompt earns a banner; iOS users find the steps in the profile tab
      if (banner) banner.classList.toggle('hidden', !deferredInstallPrompt || dismissed || isStandaloneApp());
    }

    function dismissInstallBanner() {
      try { localStorage.setItem(INSTALL_DISMISSED_KEY, '1'); } catch (e) {}
      updateInstallUi();
    }

    async function installApp() {
      if (deferredInstallPrompt) {
        var promptEvent = deferredInstallPrompt;
        deferredInstallPrompt = null;
        promptEvent.prompt();
        try {
          var choice = await promptEvent.userChoice;
          if (choice && choice.outcome === 'dismissed') dismissInstallBanner();
        } catch (e) {}
        updateInstallUi();
        return;
      }
      if (isIosDevice()) {
        switchTab('profile');
        var steps = document.getElementById('install-ios-steps');
        if (steps) {
          steps.classList.remove('hidden');
          steps.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      showNotification('برای نصب، از منوی مرورگر گزینه‌ی «Install app» یا «Add to Home screen» را انتخاب کنید', 'info');
    }

    window.addEventListener('beforeinstallprompt', function(e) {
      e.preventDefault();
      deferredInstallPrompt = e;
      updateInstallUi();
    });
    window.addEventListener('appinstalled', function() {
      deferredInstallPrompt = null;
      updateInstallUi();
      showNotification('اپلیکیشن نصب شد؛ از صفحه‌ی اصلی اجرایش کنید', 'success');
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', updateInstallUi);
    else updateInstallUi();
  `;
}
