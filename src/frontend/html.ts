// ============================================================================
// Single Page Application (SPA) HTML / JS / CSS for جسم و اندیشه
// Unified Modular Classy Dark Obsidian Design System
// Interactive To-Do Workout Tracker & Same-Page Inline Program Builder
// ============================================================================

import { renderThemeStyles } from './theme';
import { 
  renderTopNavbar, 
  renderMobileTopHeader, 
  renderMobileBottomNav, 
  renderToastAndDialogs 
} from './components';
import { 
  renderSmartSuggestionsSection, 
  renderPreloadedPresetsExplorer, 
  renderProfileSuggestionsBanner, 
  renderPresetsClientScript 
} from './presetsUi';

export function renderAppHtml(): string {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>جسم و اندیشه | سامانه هوشمند تمرین و بدنسازی</title>
  <meta name="description" content="سامانه مدیریت پیشرفته تمرین، برنامه‌ریزی هوشمند، ثبت رکوردهای شخصی، پروفایل اهداف و بانک جامع حرکات بدنسازی">

  <!-- Early Theme Initialization to Prevent FOUC -->
  <script>
    (function() {
      try {
        var t = localStorage.getItem('jesm_theme') || 'dark';
        var isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark) {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        }
      } catch(e) {}
    })();
  </script>
  
  <!-- Favicon: weight plate -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%233D7BE0'/><circle cx='16' cy='16' r='9.5' fill='none' stroke='white' stroke-opacity='.35' stroke-width='1.5'/><circle cx='16' cy='16' r='3.2' fill='%231B1D20'/></svg>">
  <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%233D7BE0'/><circle cx='16' cy='16' r='9.5' fill='none' stroke='white' stroke-opacity='.35' stroke-width='1.5'/><circle cx='16' cy='16' r='3.2' fill='%231B1D20'/></svg>">

  <!-- Fonts: Lalezar (Persian display) + Readex Pro (text), Vazirmatn as glyph fallback -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lalezar&family=Readex+Pro:wght@300..700&family=Vazirmatn:wght@400;600&display=swap" rel="stylesheet">
  <meta name="theme-color" content="#1B1D20" media="(prefers-color-scheme: dark)">
  <meta name="theme-color" content="#ECEEF0" media="(prefers-color-scheme: light)">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Unified Theme Configuration & Styled Components CSS -->
  ${renderThemeStyles()}

  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <!-- Chart.js for Volume Progression -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- Canvas Confetti for PR and Goal Finish celebrations -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
</head>
<body class="min-h-screen flex flex-col antialiased">

  <!-- Top Desktop Navigation Bar -->
  ${renderTopNavbar()}

  <!-- Top Mobile Header -->
  ${renderMobileTopHeader()}

  <!-- Modular Modals, Dialogs, Toasts, Timers -->
  ${renderToastAndDialogs()}

  <!-- ================= MAIN CONTENT CONTAINER ================= -->
  <main class="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-5 md:pt-24 pb-28 md:pb-16 space-y-6">
    
    <!-- Daily Check-in Reminder Banner (Conditional) -->
    <div id="daily-reminder-banner" class="hidden card-glass rounded-2xl p-4 border border-emerald-500/30 glow-emerald flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-500/10">
      <div class="flex items-center gap-3">
        <div class="icon-box icon-box-emerald w-9 h-9 rounded-xl">
          <i data-lucide="bell-ring" class="w-4 h-4"></i>
        </div>
        <h4 class="text-xs md:text-sm font-bold text-white">ثبت روزانه وضعیت و وزن امروز!</h4>
      </div>
      <button onclick="switchTab('profile')" class="btn btn-primary btn-sm glow-emerald shrink-0">
        ثبت وضعیت در پروفایل
      </button>
    </div>

    <!-- ======================================================= -->
    <!-- TAB 1: MAIN DASHBOARD                                   -->
    <!-- ======================================================= -->
    <section id="tab-dashboard" class="tab-content space-y-6">
      
      <!-- Hero: this week's bar, loaded one plate pair per finished session -->
      <div class="hero-panel p-5 md:p-8 grid md:grid-cols-[1.1fr_1fr] gap-6 md:gap-10 items-center">
        <div class="space-y-4">
          <h2 id="hero-greeting" class="hero-title text-white">سلام قهرمان، آماده تمرین امروز هستی؟</h2>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="badge badge-gold">
              <i data-lucide="flame" class="w-3.5 h-3.5"></i>
              <span id="hero-streak-text">استریک: ۰ روز</span>
            </span>
            <button onclick="switchTab('profile')" class="badge badge-zinc hover:border-[color:var(--color-line-strong)] transition cursor-pointer">
              <i data-lucide="target" class="w-3.5 h-3.5"></i>
              <span id="hero-goal-badge">هدف: تنظیم نشده</span>
            </button>
          </div>
          <div class="flex flex-wrap items-center gap-2.5 pt-1">
            <button onclick="startQuickWorkout()" class="btn btn-primary btn-lg">
              <i data-lucide="play" class="w-4 h-4 fill-current"></i>
              <span>شروع تمرین آزاد</span>
            </button>
            <button onclick="switchTab('movements')" class="btn btn-secondary btn-lg">
              <span>انتخاب از برنامه‌ها</span>
            </button>
          </div>
        </div>

        <figure class="barbell space-y-3" aria-labelledby="barbell-caption">
          <div id="hero-barbell"></div>
          <figcaption id="barbell-caption" class="barbell-caption text-center">
            <strong id="barbell-done">۰</strong> از <span id="barbell-target">۴</span> جلسه هدف این هفته
          </figcaption>
        </figure>
      </div>

      <!-- ================= ONGOING WORKOUT CARD ================= -->
      <div id="dashboard-active-workout-container" class="hidden space-y-6">
        <div class="card-glass rounded-2xl p-5 md:p-6 border border-emerald-500/30 shadow-2xl glow-emerald space-y-5">
          
          <!-- Active Workout Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div class="flex items-center gap-3.5">
              <div class="icon-box icon-box-emerald w-11 h-11 rounded-xl">
                <i data-lucide="list-checks" class="w-5 h-5 text-emerald-400"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                  <h3 id="active-session-title" class="text-base md:text-lg font-black text-white">تمرین زنده</h3>
                </div>
                <div class="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
                  <span>زمان: <strong id="active-timer-display" class="text-emerald-400 font-mono font-bold">۰۰:۰۰:۰۰</strong></span>
                  <span>حجم کل: <strong id="active-session-volume" class="text-emerald-400 font-mono font-bold">۰</strong> کیلوگرم</span>
                </div>
              </div>
            </div>

            <!-- Action Controls -->
            <div class="flex flex-wrap items-center gap-2">
              <button onclick="openAddExerciseToSessionModal()" class="btn btn-secondary btn-md">
                <i data-lucide="plus" class="w-4 h-4 text-emerald-400"></i>
                <span>افزودن حرکت</span>
              </button>
              <button onclick="finishActiveWorkout()" class="btn btn-primary btn-md glow-emerald">
                <i data-lucide="check-circle-2" class="w-4 h-4"></i>
                <span>پایان و ثبت تمرین</span>
              </button>
              <button onclick="discardActiveWorkout()" title="لغو تمرین" class="btn btn-danger btn-icon">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <!-- Progress Bar Indicator -->
          <div class="space-y-1.5 bg-[#08090d]/60 p-3 rounded-xl border border-white/5">
            <div class="flex items-center justify-between text-xs">
              <span id="todo-progress-text" class="text-zinc-300 font-medium">پیشرفت تمرین: ۰ از ۰ ست انجام شد</span>
              <span id="todo-progress-percent" class="text-emerald-400 font-mono font-bold">۰٪</span>
            </div>
            <div class="progress-track">
              <div id="todo-progress-bar" class="progress-bar-emerald" style="width: 0%"></div>
            </div>
          </div>

          <!-- Ongoing Routine Modular Exercises List -->
          <div id="active-exercises-list" class="space-y-3">
            <!-- Populated dynamically via renderActiveWorkoutTodoList -->
          </div>
        </div>
      </div>

      <!-- 4 Work Progress Stat Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <!-- Streak -->
        <div class="stat-tile">
          <p class="stat-label">استریک تمرین</p>
          <h3 id="stat-streak" class="stat-value">۰ روز</h3>
        </div>

        <!-- Total Workouts -->
        <div class="stat-tile">
          <p class="stat-label">جلسات تکمیل شده</p>
          <h3 id="stat-total-workouts" class="stat-value">۰ جلسه</h3>
        </div>

        <!-- Total Volume Tonnage -->
        <div class="stat-tile">
          <p class="stat-label">حجم کل جابجایی</p>
          <h3 id="stat-total-volume" class="stat-value">۰ تن</h3>
        </div>

        <!-- PRs Count -->
        <div class="stat-tile">
          <p class="stat-label">رکوردهای شخصی (PR)</p>
          <h3 id="stat-prs-count" class="stat-value">۰ حرکت</h3>
        </div>
      </div>

      ${renderSmartSuggestionsSection()}

      <!-- Work Progress & Quick Start Programs Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Start Program Quick-Launcher -->
        <div class="lg:col-span-1 card-glass rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <i data-lucide="play-circle" class="w-4 h-4 text-emerald-400"></i>
                <span>شروع برنامه‌های تمرینی</span>
              </h3>
              <button onclick="switchTab('movements')" class="text-xs text-emerald-400 hover:underline">طراحی برنامه</button>
            </div>
            
            <div id="dash-routines-list" class="space-y-2.5">
              <!-- Loaded via JS -->
            </div>
          </div>

          <button onclick="switchTab('movements')" class="btn btn-outline-dashed btn-md w-full">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>طراحی برنامه جدید</span>
          </button>
        </div>

        <!-- Dashboard Progress Bar & Calendar Hub (Weekly / Monthly / 3-Month) -->
        <div class="lg:col-span-2 card-glass rounded-2xl p-5 border border-white/10 space-y-4 glow-emerald">
          
          <!-- Header with View Mode Switcher -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div class="flex items-center gap-2.5">
              <div class="icon-box icon-box-emerald w-8 h-8 rounded-xl">
                <i data-lucide="calendar" class="w-4 h-4 text-emerald-400"></i>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white">تقویم و پیگیری پیشرفت تمرین</h3>
                <p id="cal-period-subtitle" class="text-[10px] text-zinc-400">نمای فعالیت و تداوم تمرینات</p>
              </div>
            </div>

            <!-- View Switcher Tabs: Weekly, Monthly, 3 Months -->
            <div class="flex items-center bg-[#08090d] p-1 rounded-xl border border-white/10 gap-1 self-start sm:self-auto">
              <button onclick="switchCalendarView('weekly')" id="cal-btn-weekly" class="btn btn-primary btn-sm text-[11px] py-1 px-2.5 rounded-lg transition-all">
                هفتگی
              </button>
              <button onclick="switchCalendarView('monthly')" id="cal-btn-monthly" class="btn btn-ghost btn-sm text-[11px] py-1 px-2.5 text-zinc-400 hover:text-white rounded-lg transition-all">
                ماهانه
              </button>
              <button onclick="switchCalendarView('3month')" id="cal-btn-3month" class="btn btn-ghost btn-sm text-[11px] py-1 px-2.5 text-zinc-400 hover:text-white rounded-lg transition-all">
                ۳ ماهه
              </button>
            </div>
          </div>

          <!-- Dynamic Goal Progress Bar & Metrics -->
          <div class="bg-[#08090d]/60 p-3 rounded-xl border border-white/5 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span id="cal-progress-label" class="text-zinc-300 font-medium">پیشرفت هدف هفتگی</span>
              <span id="cal-progress-percent" class="text-emerald-400 font-mono font-bold">۰٪</span>
            </div>
            <div class="progress-track">
              <div id="cal-progress-bar" class="progress-bar-emerald" style="width: 0%"></div>
            </div>
            <div class="flex items-center justify-between text-[10px] text-zinc-400">
              <span id="cal-progress-details">۰ از ۴ جلسه تمرین انجام شده</span>
              <span id="cal-period-volume">حجم: ۰ کیلوگرم</span>
            </div>
          </div>

          <!-- Calendar Display Container -->
          <div id="cal-view-container" class="min-h-[100px]">
            <!-- Injected via JS based on selected view (Weekly/Monthly/3Month) -->
          </div>

          <!-- Volume Progression Chart for Current View -->
          <div class="pt-3 border-t border-white/10 space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <i data-lucide="trending-up" class="w-3.5 h-3.5 text-emerald-400"></i>
                <span id="chart-timeframe-title">نمودار حجم تمرینی ۷ روز اخیر</span>
              </h4>
            </div>
            <div class="h-44 w-full relative">
              <canvas id="volumeChart"></canvas>
            </div>
          </div>

        </div>
      </div>

      <!-- Recent Completed Workouts Preview -->
      <div class="card-glass rounded-2xl p-5 border border-white/10 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <i data-lucide="calendar" class="w-4 h-4 text-emerald-400"></i>
            <span>آخرین جلسات تمرین ثبت شده</span>
          </h3>
          <button onclick="switchTab('history')" class="text-xs text-emerald-400 hover:underline">مشاهده کامل تاریخچه</button>
        </div>

        <div id="dash-recent-workouts" class="space-y-3">
          <!-- Populated via JS -->
        </div>
      </div>
    </section>

    <!-- ======================================================= -->
    <!-- TAB 2: HISTORY & PRs                                    -->
    <!-- ======================================================= -->
    <section id="tab-history" class="tab-content hidden space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-black text-white">تاریخچه تمرینات و رکوردهای شخصی</h2>
      </div>

      <div id="history-auth-view" class="space-y-6">
        <!-- PR Trophies Showcase -->
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <i data-lucide="trophy" class="w-4 h-4 text-emerald-400"></i>
            <span>تالار رکوردهای شخصی (Personal Records)</span>
          </h3>
          <div id="prs-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <!-- Populated via JS -->
          </div>
        </div>

        <!-- Full Workout Logs Timeline -->
        <div class="card-glass rounded-2xl p-5 border border-white/10 space-y-4">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <i data-lucide="calendar-check" class="w-4 h-4 text-emerald-400"></i>
            <span>دفترچه ثبت جلسات تمرین</span>
          </h3>
          <div id="full-history-list" class="space-y-4">
            <!-- Populated via JS -->
          </div>
        </div>
      </div>

      <!-- Guest Prompt -->
      <div id="history-guest-view" class="hidden card-glass rounded-2xl p-10 border border-white/10 text-center space-y-5 max-w-lg mx-auto my-12">
        <div class="icon-box icon-box-emerald w-14 h-14 rounded-2xl mx-auto glow-emerald">
          <i data-lucide="lock" class="w-7 h-7"></i>
        </div>
        <div>
          <h3 class="text-base font-black text-white">برای مشاهده تاریخچه وارد شوید</h3>
          <p class="text-xs text-zinc-400 mt-1">با ورود به حساب گوگل، سوابق و رکوردهای شما ذخیره می‌شوند.</p>
        </div>
        <div class="pt-2 flex justify-center">
          <a href="/api/auth/google" class="btn btn-primary btn-lg glow-emerald">
            <i data-lucide="log-in" class="w-4 h-4"></i>
            <span>ورود با حساب گوگل</span>
          </a>
        </div>
      </div>
    </section>

    <!-- ======================================================= -->
    <!-- TAB 3: MOVEMENTS & INLINE PROGRAM BUILDER               -->
    <!-- ======================================================= -->
    <section id="tab-movements" class="tab-content hidden space-y-8">
      
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-black text-white">بانک حرکات و برنامه‌های تمرینی</h2>
      </div>

      <!-- ================= SAME-PAGE INLINE PROGRAM BUILDER ================= -->
      <div id="inline-program-builder-card" class="card-glass rounded-2xl p-5 border border-emerald-500/30 glow-emerald space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="icon-box icon-box-emerald w-9 h-9 rounded-xl">
              <i data-lucide="clipboard-list" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">طراحی برنامه تمرینی (پیش‌نویس در همین صفحه)</h3>
              <p class="text-[11px] text-zinc-400">با دکمه «افزودن به برنامه» در کارت هر حرکت، حرکت مورد نظر مستقیم به این لیست اضافه می‌شود.</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <span id="builder-count-badge" class="badge badge-emerald">۰ حرکت انتخاب شده</span>
            <button onclick="clearDraftProgram()" class="btn-ghost btn-sm text-xs text-rose-400 hover:text-rose-300">پاکسازی</button>
          </div>
        </div>

        <!-- Program Title & Description Input Form -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label class="label-styled">نام برنامه تمرینی *</label>
            <input type="text" id="inline-routine-title" placeholder="مثلاً: بالا تنه قدرتی" class="input-styled">
          </div>
          <div>
            <label class="label-styled">توضیحات یا هدف برنامه (اختیاری)</label>
            <input type="text" id="inline-routine-desc" placeholder="مثلاً: برنامه ۴ روزه برای افزایش حجم سینه و بازو" class="input-styled">
          </div>
        </div>

        <!-- Selected Exercises List in Same-Page Builder -->
        <div id="inline-draft-exercises-list" class="space-y-2.5 pt-1">
          <p id="inline-empty-hint" class="text-xs text-zinc-500 text-center py-6 border border-dashed border-zinc-800 rounded-xl">
            هنوز حرکتی به برنامه اضافه نشده است. از لیست حرکات زیر، روی دکمه «افزودن به برنامه» کلیک کنید.
          </p>
        </div>

        <!-- Builder Actions -->
        <div id="inline-builder-actions" class="hidden pt-2 border-t border-white/10 flex items-center justify-between">
          <span class="text-xs text-zinc-400">تعداد ست و تکرار هر حرکت را به دلخواه تنظیم کنید</span>
          <button onclick="saveInlineProgram()" class="btn btn-primary btn-md glow-emerald">
            <i data-lucide="check" class="w-4 h-4"></i>
            <span>ذخیره و ایجاد نهایی برنامه</span>
          </button>
        </div>
      </div>

      ${renderPreloadedPresetsExplorer()}

      <!-- SECTION A: SAVED WORKOUT PROGRAMS -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <i data-lucide="folder-check" class="w-4 h-4 text-emerald-400"></i>
            <span>برنامه‌های تمرینی من</span>
          </h3>
        </div>

        <div id="routines-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Populated via JS -->
        </div>
      </div>

      <!-- SECTION B: MOVEMENTS & GIF LIBRARY -->
      <div class="space-y-4 pt-4 border-t border-zinc-800">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <i data-lucide="flame" class="w-4 h-4 text-emerald-400"></i>
            <span>بانک حرکات و گیف‌های آموزشی</span>
          </h3>
        </div>

        <!-- Search & Filter Controls -->
        <div class="card-glass rounded-2xl p-4 border border-white/10 space-y-3">
          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400"></i>
            <input 
              type="text" 
              id="exercise-search-input" 
              oninput="handleExerciseSearch()" 
              placeholder="مثلاً: پرس سینه، اسکوات، زیربغل..." 
              class="input-styled pr-10 pl-4 py-2.5"
            >
          </div>

          <!-- Muscle & Tool (Equipment) Selectors in One Line -->
          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label for="muscle-filter-select" class="label-styled text-[11px] text-zinc-400 mb-1">عضله هدف:</label>
              <select 
                id="muscle-filter-select" 
                onchange="setMuscleFilter(this.value)" 
                class="select-styled px-3 py-2 cursor-pointer text-xs"
              >
                <option value="all">همه عضلات</option>
                <option value="chest">سینه</option>
                <option value="back">پشت و زیربغل</option>
                <option value="legs">پا و ساق</option>
                <option value="shoulders">سرشانه و کول</option>
                <option value="arms">بازو و ساعد</option>
                <option value="core">شکم و میان‌تنه</option>
              </select>
            </div>

            <div>
              <label for="equipment-filter-select" class="label-styled text-[11px] text-zinc-400 mb-1">ابزار / تجهیزات:</label>
              <select 
                id="equipment-filter-select" 
                onchange="setEquipmentFilter(this.value)" 
                class="select-styled px-3 py-2 cursor-pointer text-xs"
              >
                <option value="all">همه ابزارها</option>
                <option value="barbell">هالتر</option>
                <option value="dumbbell">دمبل</option>
                <option value="cable">سیم‌کش</option>
                <option value="bodyweight">وزن بدن</option>
                <option value="machine">دستگاه بدنسازی</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Exercise Cards Grid -->
        <div id="exercises-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Populated via JS with GIFs -->
        </div>
      </div>
    </section>

    <!-- ======================================================= -->
    <!-- TAB 4: SIMPLIFIED PROFILE & GOALS                       -->
    <!-- ======================================================= -->
    <section id="tab-profile" class="tab-content hidden max-w-4xl mx-auto space-y-5">
      
      <!-- Profile Header & Quick Stats (Same Line) -->
      <div class="card-glass rounded-2xl p-3.5 sm:p-5 border border-white/10 flex items-center justify-between gap-2.5 sm:gap-4 overflow-x-auto">
        <div class="flex items-center gap-2.5 sm:gap-3.5 min-w-0 shrink">
          <img id="prof-header-avatar" src="https://api.dicebear.com/7.x/bottts/svg?seed=user" class="avatar-frame w-10 h-10 sm:w-14 sm:h-14 shrink-0" alt="Avatar">
          <div class="min-w-0">
            <h2 id="prof-header-name" class="text-xs sm:text-base font-black text-white truncate">پروفایل کاربری</h2>
            <p id="prof-header-email" class="text-[10px] sm:text-xs text-emerald-400 font-mono truncate hidden sm:block"></p>
          </div>
        </div>

        <!-- Metric KPI Cards (Always in Same Line as Avatar) -->
        <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <div class="metric-pill px-2 sm:px-3 py-1 sm:py-1.5 bg-white/5 rounded-xl border border-white/10 text-center">
            <p class="text-[9px] sm:text-[10px] text-zinc-400 whitespace-nowrap">وزن فعلی</p>
            <h4 id="prof-disp-weight" class="text-xs sm:text-sm font-black text-white font-mono mt-0.5 whitespace-nowrap">--</h4>
          </div>
          <div class="metric-pill px-2 sm:px-3 py-1 sm:py-1.5 bg-white/5 rounded-xl border border-white/10 text-center">
            <p class="text-[9px] sm:text-[10px] text-zinc-400 whitespace-nowrap">وزن هدف</p>
            <h4 id="prof-disp-target" class="text-xs sm:text-sm font-black text-emerald-400 font-mono mt-0.5 whitespace-nowrap">--</h4>
          </div>
          <div class="metric-pill px-2 sm:px-3 py-1 sm:py-1.5 bg-white/5 rounded-xl border border-white/10 text-center">
            <p class="text-[9px] sm:text-[10px] text-zinc-400 whitespace-nowrap">شاخص BMI</p>
            <h4 id="prof-disp-bmi" class="text-xs sm:text-sm font-black text-emerald-400 font-mono mt-0.5 whitespace-nowrap">--</h4>
          </div>
        </div>
      </div>

      <!-- Guest Cloud Sync Banner -->
      <div id="profile-guest-sync-banner" class="hidden card-glass rounded-2xl p-4 border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="icon-box icon-box-emerald w-9 h-9 rounded-xl shrink-0">
            <i data-lucide="cloud" class="w-4 h-4 text-emerald-400"></i>
          </div>
          <div>
            <h4 class="text-xs font-bold text-white">حالت آفلاین (مهمان)</h4>
            <p class="text-[11px] text-zinc-400">اطلاعات شما در مرورگر ذخیره می‌شود. برای همگام‌سازی ابری و دسترسی روی دستگاه‌های دیگر وارد شوید.</p>
          </div>
        </div>
        <a href="/api/auth/google" class="btn btn-primary btn-sm glow-emerald whitespace-nowrap justify-center shrink-0">
          <i data-lucide="log-in" class="w-3.5 h-3.5"></i>
          <span>ورود با گوگل</span>
        </a>
      </div>

      ${renderProfileSuggestionsBanner()}

      <!-- Theme Appearance Selector Card -->
      <div class="card-glass rounded-2xl p-4 sm:p-5 border border-white/10 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="icon-box icon-box-cyan w-8 h-8 rounded-xl shrink-0">
              <i data-lucide="palette" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="text-xs sm:text-sm font-bold text-white">پوسته و ظاهر سامانه</h3>
              <p class="text-[11px] text-zinc-400">انتخاب تم مورد نظر شما (روشن، تاریک یا خودکار بر اساس سیستم)</p>
            </div>
          </div>
          <span id="theme-active-label" class="badge badge-emerald text-[10px]">تاریک</span>
        </div>

        <div class="grid grid-cols-3 gap-2.5 pt-1">
          <button type="button" onclick="setTheme('dark')" id="theme-opt-dark" class="theme-option-btn p-3 rounded-xl border border-white/10 card-glass-subtle flex flex-col items-center justify-center gap-1.5 transition text-xs hover:border-emerald-500/40">
            <i data-lucide="moon" class="w-5 h-5 text-indigo-400"></i>
            <span class="font-bold">تاریک</span>
            <span class="text-[10px] text-zinc-400">گرافیت لاستیکی</span>
          </button>

          <button type="button" onclick="setTheme('light')" id="theme-opt-light" class="theme-option-btn p-3 rounded-xl border border-white/10 card-glass-subtle flex flex-col items-center justify-center gap-1.5 transition text-xs hover:border-emerald-500/40">
            <i data-lucide="sun" class="w-5 h-5 text-amber-400"></i>
            <span class="font-bold">روشن</span>
            <span class="text-[10px] text-zinc-400">گچی روشن</span>
          </button>

          <button type="button" onclick="setTheme('system')" id="theme-opt-system" class="theme-option-btn p-3 rounded-xl border border-white/10 card-glass-subtle flex flex-col items-center justify-center gap-1.5 transition text-xs hover:border-emerald-500/40">
            <i data-lucide="laptop" class="w-5 h-5 text-emerald-400"></i>
            <span class="font-bold">سیستم</span>
            <span class="text-[10px] text-zinc-400">هماهنگ با دستگاه</span>
          </button>
        </div>
      </div>

      <!-- Main Profile & Goals Card -->
      <div class="card-glass rounded-2xl p-4 sm:p-6 border border-white/10 space-y-4">
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <i data-lucide="target" class="w-4 h-4 text-emerald-400"></i>
            <span>مشخصات و اهداف ورزشی</span>
          </h3>
          <span class="text-[11px] text-zinc-400">اطلاعات پایه شما</span>
        </div>

        <form id="profile-info-form" onsubmit="event.preventDefault(); saveProfileData();" class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="label-styled text-[11px]">قد (سانتی‌متر)</label>
              <input type="number" id="prof-height" min="100" max="250" placeholder="مثلاً: ۱۷۸" class="input-styled font-mono">
            </div>

            <div>
              <label class="label-styled text-[11px]">وزن فعلی (کیلوگرم)</label>
              <input type="number" step="0.1" id="prof-weight" min="30" max="250" placeholder="مثلاً: ۷۸" class="input-styled font-mono">
            </div>

            <div>
              <label class="label-styled text-[11px]">وزن هدف (کیلوگرم)</label>
              <input type="number" step="0.1" id="prof-target-weight" min="30" max="250" placeholder="مثلاً: ۸۲" class="input-styled font-mono">
            </div>

            <div>
              <label class="label-styled text-[11px]">هدف اصلی فیتنس</label>
              <select id="prof-goal" class="select-styled">
                <option value="hypertrophy">هایپرتروفی و عضله‌سازی</option>
                <option value="fat_loss">چربی‌سوزی و کاهش وزن</option>
                <option value="strength">افزایش رکورد و قدرت</option>
                <option value="endurance">استقامت و چابکی</option>
                <option value="general_health">سلامتی و تناسب اندام</option>
              </select>
            </div>

            <div>
              <label class="label-styled text-[11px]">تعداد جلسات تمرین در هفته</label>
              <select id="prof-weekly-workouts" class="select-styled">
                <option value="2">۲ جلسه در هفته</option>
                <option value="3">۳ جلسه در هفته</option>
                <option value="4" selected>۴ جلسه در هفته</option>
                <option value="5">۵ جلسه در هفته</option>
                <option value="6">۶ جلسه در هفته</option>
              </select>
            </div>

            <div>
              <label class="label-styled text-[11px]">سطح تجربه</label>
              <select id="prof-level" class="select-styled">
                <option value="beginner">مبتدی (زیر ۱ سال)</option>
                <option value="intermediate">متوسط (۱ تا ۳ سال)</option>
                <option value="advanced">پیشرفته (بیش از ۳ سال)</option>
              </select>
            </div>
          </div>

          <!-- Subtle Extra Fields -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-white/5">
            <div>
              <label class="label-styled text-[11px]">سن (سال)</label>
              <input type="number" id="prof-age" min="10" max="100" placeholder="مثلاً: ۲۵" class="input-styled font-mono">
            </div>

            <div>
              <label class="label-styled text-[11px]">جنسیت</label>
              <select id="prof-gender" class="select-styled">
                <option value="male">مرد</option>
                <option value="female">زن</option>
                <option value="other">سایر</option>
              </select>
            </div>
          </div>

          <div class="pt-3 border-t border-white/10 flex justify-end">
            <button type="submit" class="btn btn-primary btn-md glow-emerald">
              <i data-lucide="check" class="w-4 h-4"></i>
              <span>ذخیره تغییرات</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Quick Daily Log & Reminder (Unified Card) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Daily Check-in -->
        <div class="card-glass rounded-2xl p-4 sm:p-5 border border-white/10 space-y-3">
          <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
            <h4 class="text-xs font-bold text-white flex items-center gap-1.5">
              <i data-lucide="scale" class="w-4 h-4 text-emerald-400"></i>
              <span>ثبت روزانه وزن</span>
            </h4>
            <span id="daily-status-tag" class="badge badge-zinc text-[10px]">در انتظار ثبت</span>
          </div>

          <form id="daily-log-form" onsubmit="event.preventDefault(); submitDailyLog();" class="space-y-3 text-xs">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="label-styled text-[10px]">وزن امروز (kg)</label>
                <input type="number" step="0.1" id="daily-weight-input" placeholder="مثلاً: ۷۸.۵" class="input-styled font-mono py-1.5 text-xs">
              </div>
              <div>
                <label class="label-styled text-[10px]">آب مصرفی (L)</label>
                <input type="number" step="0.1" id="daily-water-input" placeholder="مثلاً: ۳" class="input-styled font-mono py-1.5 text-xs">
              </div>
            </div>

            <div>
              <label class="label-styled text-[10px]">یادداشت روزانه (اختیاری)</label>
              <input type="text" id="daily-notes-input" placeholder="مثلاً: انرژی بالا، خواب عالی..." class="input-styled py-1.5 text-xs">
            </div>

            <button type="submit" class="btn btn-primary btn-sm w-full glow-emerald">
              <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
              <span>ثبت وضعیت امروز</span>
            </button>
          </form>

          <!-- History Accordion/List -->
          <div class="pt-2 border-t border-white/5 space-y-1.5">
            <p class="text-[10px] text-zinc-400 font-bold">آخرین ثبت‌ها:</p>
            <div id="recent-daily-logs-list" class="space-y-1.5 max-h-28 overflow-y-auto pr-1">
              <!-- Populated via JS -->
            </div>
          </div>
        </div>

        <!-- Daily Reminder -->
        <div class="card-glass rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col justify-between space-y-3 text-xs">
          <div class="space-y-3">
            <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h4 class="text-xs font-bold text-white flex items-center gap-1.5">
                <i data-lucide="bell" class="w-4 h-4 text-emerald-400"></i>
                <span>یادآور روزانه</span>
              </h4>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="prof-reminder-enabled" onchange="saveProfileData()" class="sr-only peer" checked>
                <div class="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-zinc-300 text-xs">ساعت اعلان:</span>
              <input type="time" id="prof-reminder-time" onchange="saveProfileData()" value="20:00" class="input-styled w-auto font-mono py-1 px-2.5 text-xs">
            </div>

            <p class="text-[11px] text-zinc-400 leading-relaxed">
              یادآوری ملایم هر روز در ساعت مشخص برای ثبت وزن و پیگیری تمرینات ورزشی شما.
            </p>
          </div>

          <button onclick="requestNotificationPermission()" class="btn btn-secondary btn-sm w-full border-emerald-500/30 text-emerald-300 hover:text-white">
            <i data-lucide="bell-ring" class="w-3.5 h-3.5"></i>
            <span id="notif-perm-btn-text">فعال‌سازی اعلان در مرورگر</span>
          </button>
        </div>

      </div>

    </section>

  </main>

  <!-- Mobile Bottom Navigation Bar -->
  ${renderMobileBottomNav()}

  <!-- ================= JAVASCRIPT APPLICATION CORE ================= -->
  <script>
    // Configure Chart.js global defaults
    if (typeof Chart !== 'undefined') {
      Chart.defaults.font.family = "'Readex Pro', 'Vazirmatn', system-ui, sans-serif";
    }

    // --- Global State ---
    let currentUser = null;
    let currentProfile = null;
    let exercisesCache = [];
    let activeSession = null;
    let activeTimerInterval = null;
    let restTimerInterval = null;
    let restRemainingSeconds = 60;
    let restTotalSeconds = 60;
    let currentMuscleFilter = 'all';
    let currentEquipmentFilter = 'all';
    let draftProgramExercises = []; // Inline program draft items
    let volumeChartInstance = null;
    let currentSelectedExerciseId = null;
    let currentSharedRoutine = null;
    let activeDialogResolve = null;
    let sessionPlannedExercises = []; // Planned to-do movements for active session

    const GOAL_TRANSLATIONS = {
      'hypertrophy': 'هایپرتروفی و عضله‌سازی',
      'fat_loss': 'چربی‌سوزی و کات',
      'strength': 'افزایش رکورد و قدرت',
      'endurance': 'استقامت و چابکی',
      'general_health': 'سلامتی عمومی'
    };

    // --- Modular Toast Notifications ---
    function showNotification(message, type = 'success') {
      const toast = document.getElementById('toast-notification');
      const msgEl = document.getElementById('toast-message');
      const card = document.getElementById('toast-card');
      const iconWrap = document.getElementById('toast-icon-wrap');

      if (!toast || !msgEl || !card) return;

      msgEl.innerText = message;

      if (type === 'error') {
        card.className = 'card-glass px-5 py-3 rounded-2xl border border-rose-500/40 text-rose-400 font-bold text-xs shadow-2xl flex items-center gap-2.5 glow-rose';
        iconWrap.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4 text-rose-400"></i>';
      } else if (type === 'warning') {
        card.className = 'card-glass px-5 py-3 rounded-2xl border border-amber-500/40 text-amber-400 font-bold text-xs shadow-2xl flex items-center gap-2.5 glow-gold';
        iconWrap.innerHTML = '<i data-lucide="alert-triangle" class="w-4 h-4 text-amber-400"></i>';
      } else if (type === 'info') {
        card.className = 'card-glass px-5 py-3 rounded-2xl border border-cyan-500/40 text-cyan-400 font-bold text-xs shadow-2xl flex items-center gap-2.5 glow-cyan';
        iconWrap.innerHTML = '<i data-lucide="info" class="w-4 h-4 text-cyan-400"></i>';
      } else {
        card.className = 'card-glass px-5 py-3 rounded-2xl border border-emerald-500/40 text-emerald-400 font-bold text-xs shadow-2xl flex items-center gap-2.5 glow-emerald';
        iconWrap.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>';
      }

      lucide.createIcons();

      toast.classList.remove('opacity-0', 'translate-y-[-20px]');
      toast.classList.add('opacity-100', 'translate-y-0');
      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-[-20px]');
        toast.classList.remove('opacity-100', 'translate-y-0');
      }, 3200);
    }

    function showToast(message, type = 'success') {
      showNotification(message, type);
    }

    // --- Body Scroll Lock for Dialogs and Popups ---
    let openModalsCount = 0;
    function lockBodyScroll() {
      openModalsCount++;
      document.body.classList.add('overflow-hidden');
      document.documentElement.classList.add('overflow-hidden');
    }

    function unlockBodyScroll() {
      openModalsCount = Math.max(0, openModalsCount - 1);
      if (openModalsCount === 0) {
        document.body.classList.remove('overflow-hidden');
        document.documentElement.classList.remove('overflow-hidden');
      }
    }

    // --- Modular Dialogue Box Engine ---
    function showConfirmDialog(options) {
      return new Promise((resolve) => {
        activeDialogResolve = resolve;
        const modal = document.getElementById('custom-dialog-modal');
        const titleEl = document.getElementById('dialog-title');
        const msgEl = document.getElementById('dialog-message');
        const confirmBtn = document.getElementById('dialog-confirm-btn');
        const cancelBtn = document.getElementById('dialog-cancel-btn');
        const iconContainer = document.getElementById('dialog-icon-container');
        const iconEl = document.getElementById('dialog-icon');
        const inputWrap = document.getElementById('dialog-input-wrap');

        titleEl.innerText = options.title || 'پیام سیستم';
        msgEl.innerText = options.message || '';
        confirmBtn.innerHTML = '<span>' + (options.confirmText || 'تایید') + '</span>';
        cancelBtn.innerText = options.cancelText || 'انصراف';

        inputWrap.classList.add('hidden');

        if (options.isAlertOnly) {
          cancelBtn.classList.add('hidden');
        } else {
          cancelBtn.classList.remove('hidden');
        }

        const color = options.color || 'emerald';
        if (color === 'rose') {
          iconContainer.className = 'icon-box icon-box-rose w-12 h-12 rounded-2xl shrink-0';
          confirmBtn.className = 'btn btn-danger btn-md';
          iconEl.setAttribute('data-lucide', options.icon || 'trash-2');
        } else if (color === 'amber') {
          iconContainer.className = 'icon-box icon-box-gold w-12 h-12 rounded-2xl shrink-0';
          confirmBtn.className = 'btn btn-primary btn-md bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black';
          iconEl.setAttribute('data-lucide', options.icon || 'alert-triangle');
        } else if (color === 'purple') {
          iconContainer.className = 'icon-box icon-box-purple w-12 h-12 rounded-2xl shrink-0';
          confirmBtn.className = 'btn btn-primary btn-md bg-purple-600 hover:bg-purple-500';
          iconEl.setAttribute('data-lucide', options.icon || 'share-2');
        } else {
          iconContainer.className = 'icon-box icon-box-emerald w-12 h-12 rounded-2xl shrink-0';
          confirmBtn.className = 'btn btn-primary btn-md glow-emerald';
          iconEl.setAttribute('data-lucide', options.icon || 'check-circle-2');
        }

        lucide.createIcons();
        modal.classList.remove('hidden');
        lockBodyScroll();
      });
    }

    function handleDialogClose(confirmed) {
      document.getElementById('custom-dialog-modal').classList.add('hidden');
      unlockBodyScroll();
      if (activeDialogResolve) {
        activeDialogResolve(confirmed);
        activeDialogResolve = null;
      }
    }

    function playChime() {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } catch (e) {}
    }

    function toPersianDigits(num) {
      if (num === null || num === undefined) return '';
      const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      return num.toString().replace(/\\d/g, x => persianNumbers[parseInt(x)]);
    }

    // --- Theme Engine (Dark / Light / System Mode) ---
    function initTheme() {
      const stored = localStorage.getItem('jesm_theme') || 'dark';
      applyTheme(stored, false);
      
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (localStorage.getItem('jesm_theme') === 'system') {
          applyTheme('system', false);
        }
      });
    }

    function applyTheme(mode, save = true) {
      const root = document.documentElement;
      root.classList.add('theme-transition');

      let isDark = true;
      if (mode === 'light') {
        isDark = false;
      } else if (mode === 'dark') {
        isDark = true;
      } else if (mode === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }

      if (save) {
        localStorage.setItem('jesm_theme', mode);
      }

      updateThemeUI(mode, isDark);
      updateChartTheme(isDark);

      setTimeout(() => {
        root.classList.remove('theme-transition');
        lucide.createIcons();
      }, 250);
    }

    function toggleTheme() {
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      const nextMode = isCurrentlyDark ? 'light' : 'dark';
      applyTheme(nextMode, true);
      showNotification(nextMode === 'light' ? 'پوسته روشن فعال شد' : 'پوسته تاریک فعال شد', 'success');
    }

    function setTheme(mode) {
      applyTheme(mode, true);
      const names = { dark: 'تاریک', light: 'روشن', system: 'هماهنگ با سیستم' };
      showNotification('پوسته ' + (names[mode] || mode) + ' انتخاب شد', 'success');
    }

    function updateThemeUI(mode, isDark) {
      ['dark', 'light', 'system'].forEach(m => {
        const btn = document.getElementById('theme-opt-' + m);
        if (btn) {
          if (m === mode) {
            btn.classList.add('active', 'border-emerald-500/80');
          } else {
            btn.classList.remove('active', 'border-emerald-500/80');
          }
        }
      });

      const label = document.getElementById('theme-active-label');
      if (label) {
        const names = { dark: 'تاریک', light: 'روشن', system: 'سیستم (' + (isDark ? 'تاریک' : 'روشن') + ')' };
        label.innerText = names[mode] || 'تاریک';
      }
    }

    function updateChartTheme(isDark) {
      if (!volumeChartInstance) return;
      const gridColor = isDark ? 'rgba(237,235,230,0.06)' : 'rgba(21,23,26,0.07)';
      const tickColor = isDark ? '#7D8288' : '#6B727B';
      if (volumeChartInstance.options && volumeChartInstance.options.scales) {
        if (volumeChartInstance.options.scales.x) {
          volumeChartInstance.options.scales.x.grid.color = gridColor;
          volumeChartInstance.options.scales.x.ticks.color = tickColor;
        }
        if (volumeChartInstance.options.scales.y) {
          volumeChartInstance.options.scales.y.grid.color = gridColor;
          volumeChartInstance.options.scales.y.ticks.color = tickColor;
        }
      }
      volumeChartInstance.update('none');
    }

    // --- App Initialization ---
    document.addEventListener('DOMContentLoaded', async () => {
      initTheme();
      lucide.createIcons();
      await checkAuth();
      await loadExercises();
      
      const savedTab = localStorage.getItem('active_tab') || 'dashboard';
      switchTab(savedTab);
      
      await checkUrlParams();
      checkBrowserNotificationState();
    });

    async function checkUrlParams() {
      const urlParams = new URLSearchParams(window.location.search);
      
      if (urlParams.get('auth') === 'success') {
        window.history.replaceState({}, document.title, window.location.pathname);
        showNotification('با موفقیت وارد حساب کاربری شدید', 'success');

        const pendingImport = sessionStorage.getItem('pending_import_routine');
        if (pendingImport) {
          sessionStorage.removeItem('pending_import_routine');
          await importRoutine(pendingImport);
        }
      }

      if (urlParams.get('auth_error')) {
        showConfirmDialog({
          title: 'خطای ورود',
          message: decodeURIComponent(urlParams.get('auth_error')),
          isAlertOnly: true,
          color: 'rose',
          icon: 'alert-circle',
          confirmText: 'متوجه شدم'
        });
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const shareRoutineId = urlParams.get('share_routine');
      if (shareRoutineId) {
        await openSharedRoutinePreview(shareRoutineId);
      }

      const presetParam = urlParams.get('preset');
      if (presetParam) {
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(async () => {
          if (typeof loadPreloadedPresets === 'function') {
            await loadPreloadedPresets();
          }
          if (typeof openPreloadedPresetsSection === 'function') {
            openPreloadedPresetsSection();
          }
          setTimeout(() => {
            const targetBtn = document.querySelector(\`button[onclick*="'\${presetParam}'"]\`);
            const targetCard = targetBtn ? targetBtn.closest('.card-glass-interactive') : null;
            if (targetCard) {
              targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
              targetCard.classList.add('ring-2', 'ring-emerald-400');
              setTimeout(() => targetCard.classList.remove('ring-2', 'ring-emerald-400'), 3000);
            }
          }, 350);
        }, 150);
      }
    }

    // --- Tab Switching Engine (Preserves Active Tab on Refresh) ---
    function switchTab(tabId) {
      localStorage.setItem('active_tab', tabId);

      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      const target = document.getElementById('tab-' + tabId);
      if (target) target.classList.remove('hidden');

      document.querySelectorAll('.nav-desktop-btn, .nav-mobile-btn').forEach(btn => {
        const isActive = btn.id === 'nav-d-' + tabId || btn.id === 'nav-m-' + tabId;
        btn.classList.toggle('is-active', isActive);
        if (isActive) btn.setAttribute('aria-current', 'page'); else btn.removeAttribute('aria-current');
      });

      ['nav-d-profile', 'nav-m-profile'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('is-active', tabId === 'profile');
      });

      if (tabId === 'dashboard') {
        loadDashboardData();
        checkActiveWorkout();
      } else if (tabId === 'history') {
        loadHistoryTab();
      } else if (tabId === 'movements') {
        loadRoutines();
        loadPreloadedPresets();
        if (exercisesCache.length === 0) {
          loadExercises();
        } else if (!exercisesRenderedOnce) {
          renderExercisesGrid();
        }
        renderInlineDraftExercises();
      } else if (tabId === 'profile') {
        loadProfileData();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
      lucide.createIcons();
    }

    // --- Auth Management ---
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          currentUser = data.user;
          renderUserUI(currentUser);
        } else {
          currentUser = null;
          renderAuthPrompt();
        }
      } catch (e) {
        currentUser = null;
        renderAuthPrompt();
      }
    }

    function renderUserUI(user) {
      const desktopTopAuth = document.getElementById('desktop-top-auth');
      const mobileTopAuth = document.getElementById('mobile-top-auth');
      const avatar = user.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(user.email || user.name || 'user');
      const activeTab = localStorage.getItem('active_tab') || 'dashboard';
      const activeCls = activeTab === 'profile' ? ' is-active' : '';

      if (desktopTopAuth) {
        desktopTopAuth.innerHTML = \`
          <button onclick="switchTab('profile')" id="nav-d-profile" title="پروفایل و اهداف" class="account-chip\${activeCls}">
            <img src="\${avatar}" class="w-7 h-7 rounded-full object-cover shrink-0" alt="">
            <span class="max-w-[110px] truncate">\${user.name || 'حساب کاربری'}</span>
          </button>
          <button onclick="logout()" title="خروج از حساب" aria-label="خروج از حساب" class="btn-icon btn-ghost hover:text-rose-400">
            <i data-lucide="log-out" class="w-4 h-4"></i>
          </button>
        \`;
      }

      if (mobileTopAuth) {
        mobileTopAuth.innerHTML = \`
          <button onclick="switchTab('profile')" id="nav-m-profile" title="پروفایل و اهداف" aria-label="پروفایل و اهداف" class="account-chip p-0.5\${activeCls}">
            <img src="\${avatar}" class="w-8 h-8 rounded-full object-cover" alt="">
          </button>
          <button onclick="logout()" title="خروج از حساب" aria-label="خروج از حساب" class="btn-icon btn-ghost hover:text-rose-400">
            <i data-lucide="log-out" class="w-4 h-4"></i>
          </button>
        \`;
      }

      const headerAvatar = document.getElementById('prof-header-avatar');
      const headerName = document.getElementById('prof-header-name');
      const headerEmail = document.getElementById('prof-header-email');
      if (headerAvatar) headerAvatar.src = avatar;
      if (headerName) headerName.innerText = user.name || 'حساب کاربری';
      if (headerEmail) headerEmail.innerText = user.email || '';

      const guestBanner = document.getElementById('profile-guest-sync-banner');
      if (guestBanner) guestBanner.classList.add('hidden');

      lucide.createIcons();
    }

    function renderAuthPrompt() {
      const desktopTopAuth = document.getElementById('desktop-top-auth');
      const mobileTopAuth = document.getElementById('mobile-top-auth');
      const activeTab = localStorage.getItem('active_tab') || 'dashboard';
      const activeCls = activeTab === 'profile' ? ' is-active' : '';

      const chip = (id) => \`
        <button onclick="switchTab('profile')" id="\${id}" title="پروفایل و اهداف" class="account-chip no-avatar\${activeCls}">
          <i data-lucide="user" class="w-4 h-4"></i>
          <span>پروفایل</span>
        </button>
      \`;
      if (desktopTopAuth) desktopTopAuth.innerHTML = chip('nav-d-profile');
      if (mobileTopAuth) mobileTopAuth.innerHTML = chip('nav-m-profile');

      const headerName = document.getElementById('prof-header-name');
      const headerEmail = document.getElementById('prof-header-email');
      if (headerName) headerName.innerText = 'حساب کاربری مهمان';
      if (headerEmail) headerEmail.innerText = 'حالت محلی (آفلاین)';

      const guestBanner = document.getElementById('profile-guest-sync-banner');
      if (guestBanner) guestBanner.classList.remove('hidden');

      lucide.createIcons();
    }

    function loginWithGoogle() {
      window.location.href = '/api/auth/google';
    }

    async function logout() {
      const confirmed = await showConfirmDialog({
        title: 'خروج از حساب',
        message: 'آیا مایلید از حساب کاربری خود خارج شوید؟',
        confirmText: 'خروج از حساب',
        color: 'rose',
        icon: 'log-out'
      });
      if (!confirmed) return;

      await fetch('/api/auth/logout', { method: 'POST' });
      currentUser = null;
      window.location.reload();
    }

    // ============================================================================
    // WORKOUT FLOW: INTERACTIVE TO-DO CHECKLIST FOR ONGOING WORKOUTS
    // ============================================================================
    async function loadDashboardData() {
      if (!currentUser) {
        // Guest User Dashboard Stats from LocalStorage History
        const history = JSON.parse(localStorage.getItem('guest_workout_history') || '[]');
        const totalWorkouts = history.length;
        const totalVolumeKg = history.reduce((sum, h) => sum + (h.total_volume_kg || 0), 0);
        const tonnage = (totalVolumeKg / 1000).toFixed(1);

        const statStreak = document.getElementById('stat-streak');
        if (statStreak) statStreak.innerText = toPersianDigits(totalWorkouts > 0 ? 1 : 0) + ' روز';
        const heroStreak = document.getElementById('hero-streak-text');
        if (heroStreak) heroStreak.innerText = 'استریک: ' + toPersianDigits(totalWorkouts > 0 ? 1 : 0) + ' روز';
        const statTotalWorkouts = document.getElementById('stat-total-workouts');
        if (statTotalWorkouts) statTotalWorkouts.innerText = toPersianDigits(totalWorkouts) + ' جلسه';
        const statTotalVolume = document.getElementById('stat-total-volume');
        if (statTotalVolume) statTotalVolume.innerText = toPersianDigits(tonnage) + ' تن';
        const statPrsCount = document.getElementById('stat-prs-count');
        if (statPrsCount) statPrsCount.innerText = '۰ حرکت';

        renderRecentWorkouts(history);
        renderHeroBarbell(
          countSessionsInLastDays(history.map(h => h.start_time || h.end_time || h.date), 7),
          Number(currentProfile?.target_weekly_workouts) || 4
        );
        checkActiveWorkout();
        loadDashboardRoutines();
        loadSmartSuggestions();
        return;
      }

      try {
        const res = await fetch('/api/analytics/dashboard');
        if (!res.ok) return;
        const data = await res.json();

        document.getElementById('stat-streak').innerText = toPersianDigits(data.streakDays) + ' روز';
        document.getElementById('hero-streak-text').innerText = 'استریک: ' + toPersianDigits(data.streakDays) + ' روز';
        document.getElementById('stat-total-workouts').innerText = toPersianDigits(data.totalWorkouts) + ' جلسه';
        
        const tonnage = (data.totalVolumeKg / 1000).toFixed(1);
        document.getElementById('stat-total-volume').innerText = toPersianDigits(tonnage) + ' تن';
        document.getElementById('stat-prs-count').innerText = toPersianDigits(data.latestPRs ? data.latestPRs.length : 0) + ' حرکت';

        renderRecentWorkouts(data.recentWorkouts || []);
        await loadDashboardCalendarAndProgress();

        if (data.activeSession) {
          activeSession = data.activeSession;
          showActiveWorkoutInDashboard(true);
        } else {
          showActiveWorkoutInDashboard(false);
        }

        loadDashboardRoutines();
        loadSmartSuggestions();
      } catch (err) {}
    }

    function showActiveWorkoutInDashboard(hasActive) {
      const activeContainer = document.getElementById('dashboard-active-workout-container');
      const deskBadge = document.getElementById('active-badge-d');
      const mobBadge = document.getElementById('active-badge-m');

      if (hasActive && activeSession) {
        activeContainer?.classList.remove('hidden');
        deskBadge?.classList.remove('hidden');
        mobBadge?.classList.remove('hidden');
        renderActiveWorkoutTodoList();
        startActiveStopwatch();
      } else {
        activeContainer?.classList.add('hidden');
        deskBadge?.classList.add('hidden');
        mobBadge?.classList.add('hidden');
        if (activeTimerInterval) clearInterval(activeTimerInterval);
      }
      lucide.createIcons();
    }

    async function checkActiveWorkout() {
      if (currentUser) {
        try {
          const res = await fetch('/api/workouts/active');
          const data = await res.json();
          activeSession = data.session;
          showActiveWorkoutInDashboard(!!activeSession);
        } catch (err) {}
      } else {
        try {
          const savedGuest = localStorage.getItem('jesm_guest_active_session');
          if (savedGuest) {
            activeSession = JSON.parse(savedGuest);
            showActiveWorkoutInDashboard(!!activeSession);
          } else {
            showActiveWorkoutInDashboard(false);
          }
        } catch (err) {
          showActiveWorkoutInDashboard(false);
        }
      }
    }

    async function startQuickWorkout() {
      if (currentUser) {
        try {
          const res = await fetch('/api/workouts/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'تمرین آزاد' })
          });
          const data = await res.json();
          if (data.success) {
            activeSession = data.session;
            switchTab('dashboard');
            showActiveWorkoutInDashboard(true);
            showNotification('تمرین آزاد شروع شد! حرکات را اضافه کنید', 'success');
          } else {
            showNotification(data.error || 'خطا در شروع تمرین', 'error');
          }
        } catch (e) {
          showNotification('خطا در شروع تمرین', 'error');
        }
      } else {
        // Guest Quick Workout
        activeSession = {
          id: 'guest-session-' + Date.now(),
          user_id: 'guest',
          title: 'تمرین آزاد',
          routine_id: null,
          start_time: new Date().toISOString(),
          total_volume_kg: 0,
          planned_exercises: [],
          set_logs: []
        };
        localStorage.setItem('jesm_guest_active_session', JSON.stringify(activeSession));
        switchTab('dashboard');
        showActiveWorkoutInDashboard(true);
        showNotification('تمرین آزاد شروع شد! حرکات را اضافه کنید', 'success');
      }
    }

    async function startRoutineWorkout(routineId) {
      if (currentUser) {
        try {
          const res = await fetch('/api/workouts/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ routine_id: routineId })
          });
          const data = await res.json();
          if (data.success) {
            activeSession = data.session;
            switchTab('dashboard');
            showActiveWorkoutInDashboard(true);
            showNotification('برنامه با موفقیت فعال شد! حرکات در دسترس هستند.', 'success');
          } else {
            showNotification(data.error || 'خطا در اجرای برنامه', 'error');
          }
        } catch (e) {
          showNotification('خطا در اجرای برنامه', 'error');
        }
      } else {
        // Guest Routine Workout
        try {
          let routine = null;
          const guestRoutines = JSON.parse(localStorage.getItem('guest_routines') || '[]');
          routine = guestRoutines.find(r => r.id === routineId);

          if (!routine) {
            try {
              const res = await fetch('/api/routines/' + routineId);
              if (res.ok) {
                const data = await res.json();
                routine = data.routine;
              }
            } catch (e) {}
          }

          const plannedExercises = (routine?.exercises || []).map((ex, idx) => ({
            exercise_id: ex.exercise_id || ex.id || ('ex-' + idx),
            name_fa: ex.name_fa || ex.exercise_name_fa || ex.name_en || 'حرکت تمرینی',
            name_en: ex.name_en || ex.exercise_name_en || '',
            gif_url: ex.gif_url || ex.exercise_gif_url || '',
            category_fa: ex.category_fa || ex.exercise_category_fa || '',
            target_sets: Number(ex.target_sets || ex.sets) || 4,
            target_reps: Number(ex.target_reps || ex.reps) || 10,
            rest_seconds: Number(ex.rest_seconds) || 60
          }));

          activeSession = {
            id: 'guest-session-' + Date.now(),
            user_id: 'guest',
            title: routine?.title || 'تمرین بر اساس برنامه',
            routine_id: routineId,
            start_time: new Date().toISOString(),
            total_volume_kg: 0,
            planned_exercises: plannedExercises,
            set_logs: []
          };

          localStorage.setItem('jesm_guest_active_session', JSON.stringify(activeSession));
          switchTab('dashboard');
          showActiveWorkoutInDashboard(true);
          showNotification('برنامه تمرینی فعال شد! حرکات آماده ثبت هستند.', 'success');
        } catch (err) {
          showNotification('خطا در اجرای برنامه تمرینی', 'error');
        }
      }
    }

    function startActiveStopwatch() {
      if (activeTimerInterval) clearInterval(activeTimerInterval);
      
      const timerDisplay = document.getElementById('active-timer-display');
      if (!timerDisplay || !activeSession) return;

      const startTime = new Date(activeSession.start_time).getTime();

      function update() {
        const now = Date.now();
        const diffSec = Math.max(0, Math.floor((now - startTime) / 1000));
        
        const h = String(Math.floor(diffSec / 3600)).padStart(2, '0');
        const m = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0');
        const s = String(diffSec % 60).padStart(2, '0');
        
        timerDisplay.innerText = toPersianDigits(h + ':' + m + ':' + s);
      }

      update();
      activeTimerInterval = setInterval(update, 1000);
    }

    // --- Extra Sets & Input Cache State (Per session/exercise) ---
    let extraSetsCount = {};
    let currentExerciseWeights = {};
    let currentExerciseReps = {};

    function adjustOngoingWeight(exerciseId, delta) {
      const currentVal = parseFloat(currentExerciseWeights[exerciseId] !== undefined ? currentExerciseWeights[exerciseId] : 0) || 0;
      const newVal = Math.max(0, Math.round((currentVal + delta) * 10) / 10);
      currentExerciseWeights[exerciseId] = newVal;
      const valEl = document.getElementById(\`w-val-\${exerciseId}\`);
      if (valEl) valEl.innerText = toPersianDigits(newVal);
    }

    function adjustOngoingReps(exerciseId, delta) {
      const currentVal = parseInt(currentExerciseReps[exerciseId] !== undefined ? currentExerciseReps[exerciseId] : 10) || 10;
      const newVal = Math.max(1, Math.min(100, currentVal + delta));
      currentExerciseReps[exerciseId] = newVal;
      const valEl = document.getElementById(\`r-val-\${exerciseId}\`);
      if (valEl) valEl.innerText = toPersianDigits(newVal);
    }

    // Modular Sets & Reps Component for Ongoing Routine Items
    function renderOngoingExerciseItem(item, exIdx) {
      const extra = extraSetsCount[item.id] || 0;
      const totalSets = Math.max(item.target_sets + extra, item.logs.length);
      const completedSetsCount = item.logs.length;
      const isAllDone = completedSetsCount >= totalSets && totalSets > 0;

      // Get latest weight from last logged set or cache
      const latestLog = item.logs.length > 0 ? item.logs[item.logs.length - 1] : null;
      const defaultWeight = currentExerciseWeights[item.id] !== undefined 
        ? currentExerciseWeights[item.id] 
        : (latestLog && latestLog.weight_kg > 0 ? latestLog.weight_kg : 0);
      const defaultReps = currentExerciseReps[item.id] !== undefined 
        ? currentExerciseReps[item.id] 
        : (item.target_reps || 10);

      currentExerciseWeights[item.id] = defaultWeight;
      currentExerciseReps[item.id] = defaultReps;

      // Build Set Checkboxes in a single row
      let setsCheckboxesHtml = '';
      for (let sNum = 1; sNum <= totalSets; sNum++) {
        const log = item.logs.find(l => l.set_number === sNum) || item.logs[sNum - 1];
        const isDone = !!log;

        if (isDone) {
          setsCheckboxesHtml += \`
            <button type="button" onclick="toggleSetCheckbox('\${item.id}', \${sNum}, '\${log.id}')" title="ست \${toPersianDigits(sNum)} انجام شد (کلیک برای حذف)" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/70 text-emerald-300 font-bold text-xs transition cursor-pointer shadow-[0_0_8px_rgba(16,185,129,0.25)]">
              <i data-lucide="check-square" class="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]"></i>
              <span>ست \${toPersianDigits(sNum)}</span>
              \${log.weight_kg > 0 ? \`<span class="text-[10px] opacity-80 font-mono font-normal">(\${toPersianDigits(log.weight_kg)}k)</span>\` : ''}
              \${log.is_pr ? \`<span class="badge badge-gold text-[8px] py-0 px-1">PR</span>\` : ''}
            </button>
          \`;
        } else {
          setsCheckboxesHtml += \`
            <button type="button" onclick="toggleSetCheckbox('\${item.id}', \${sNum}, null)" title="ثبت انجام ست \${toPersianDigits(sNum)}" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 hover:border-emerald-500/60 text-zinc-300 hover:text-white font-medium text-xs transition cursor-pointer">
              <i data-lucide="square" class="w-3.5 h-3.5 text-zinc-400"></i>
              <span>ست \${toPersianDigits(sNum)}</span>
            </button>
          \`;
        }
      }

      return \`
        <div id="ongoing-item-\${item.id}" class="card-glass rounded-xl p-3.5 sm:p-4 border \${isAllDone ? 'border-emerald-500/30 bg-emerald-500/[0.03]' : 'border-white/10'} space-y-3 transition-colors">
          
          <!-- Top Row: Exercise Info & Status -->
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              \${item.gif_url ? \`<img src="\${item.gif_url}" class="w-9 h-9 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0" alt="">\` : \`<div class="icon-box icon-box-emerald w-9 h-9 rounded-lg shrink-0"><i data-lucide="dumbbell" class="w-4 h-4"></i></div>\`}
              <div class="min-w-0">
                <h4 class="text-xs md:text-sm font-bold truncate \${isAllDone ? 'line-through text-zinc-500' : 'text-white'}">
                  \${item.name_fa} \${item.name_en ? \`<span class="text-[10px] text-zinc-400 font-mono font-normal hidden sm:inline">(\${item.name_en})</span>\` : ''}
                </h4>
                <p class="text-[11px] text-zinc-400 mt-0.5">
                  <span>هدف: <strong class="\${isAllDone ? 'text-zinc-500' : 'text-zinc-300'}">\${toPersianDigits(item.target_sets)} ست × \${toPersianDigits(item.target_reps)} تکرار</strong></span>
                  \${item.rest_seconds ? \`<span class="mx-1 text-zinc-600">•</span><span>استراحت: \${toPersianDigits(item.rest_seconds)}ث</span>\` : ''}
                </p>
              </div>
            </div>

            <!-- Status Badge -->
            <div class="shrink-0">
              \${isAllDone 
                ? \`<span class="badge badge-emerald"><i data-lucide="check" class="w-3 h-3 stroke-[3]"></i><span>تکمیل شد (\${toPersianDigits(completedSetsCount)}/\${toPersianDigits(totalSets)})</span></span>\`
                : (completedSetsCount > 0 
                    ? \`<span class="badge badge-gold"><span>\${toPersianDigits(completedSetsCount)} از \${toPersianDigits(totalSets)} ست</span></span>\`
                    : \`<span class="badge badge-zinc"><span>۰/\${toPersianDigits(totalSets)} ست</span></span>\`
                  )
              }
            </div>
          </div>

          <!-- Modular All-in-One-Line Sets & Reps Bar (Weight Log, Rep Count & Checkboxes) -->
          <div class="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-white/5 bg-[#08090d]/60 p-2.5 rounded-xl">
            
            <!-- Weight & Reps Digital Stepper Counters (No Text Inputs) -->
            <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              
              <!-- Weight Counter -->
              <div class="flex items-center gap-1.5 bg-white/[0.04] px-2 py-1 rounded-lg border border-white/5 shrink-0">
                <span class="text-zinc-400 font-medium text-[11px]">وزن:</span>
                <button type="button" onclick="adjustOngoingWeight('\${item.id}', -2.5)" class="w-6 h-6 rounded-md bg-white/5 hover:bg-white/15 active:scale-95 text-zinc-300 font-bold flex items-center justify-center transition">−</button>
                <span id="w-val-\${item.id}" class="w-8 text-center font-mono font-bold text-white text-xs">\${toPersianDigits(defaultWeight)}</span>
                <button type="button" onclick="adjustOngoingWeight('\${item.id}', 2.5)" class="w-6 h-6 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-95 text-emerald-400 font-bold flex items-center justify-center transition">+</button>
                <span class="text-[10px] text-zinc-500 font-mono">kg</span>
              </div>

              <!-- Reps Counter -->
              <div class="flex items-center gap-1.5 bg-white/[0.04] px-2 py-1 rounded-lg border border-white/5 shrink-0">
                <span class="text-zinc-400 font-medium text-[11px]">تکرار:</span>
                <button type="button" onclick="adjustOngoingReps('\${item.id}', -1)" class="w-6 h-6 rounded-md bg-white/5 hover:bg-white/15 active:scale-95 text-zinc-300 font-bold flex items-center justify-center transition">−</button>
                <span id="r-val-\${item.id}" class="w-6 text-center font-mono font-bold text-emerald-400 text-xs">\${toPersianDigits(defaultReps)}</span>
                <button type="button" onclick="adjustOngoingReps('\${item.id}', 1)" class="w-6 h-6 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-95 text-emerald-400 font-bold flex items-center justify-center transition">+</button>
              </div>

            </div>

            <!-- Set Checkboxes & Add Set in Same Line -->
            <div class="flex items-center gap-1.5 flex-wrap">
              \${setsCheckboxesHtml}
              <button 
                type="button" 
                onclick="addExtraSet('\${item.id}')" 
                title="افزودن یک ست دیگر به این حرکت" 
                class="btn btn-ghost btn-sm text-[11px] py-1 px-2 text-zinc-400 hover:text-emerald-400 border border-dashed border-white/15 rounded-lg flex items-center gap-1"
              >
                <i data-lucide="plus" class="w-3 h-3"></i>
                <span>ست</span>
              </button>
            </div>

          </div>

        </div>
      \`;
    }

    // Render Ongoing Workout
    function renderActiveWorkoutTodoList() {
      if (!activeSession) return;

      document.getElementById('active-session-title').innerText = activeSession.title || 'تمرین در حال انجام';
      document.getElementById('active-session-volume').innerText = toPersianDigits(activeSession.total_volume_kg || 0);

      const listContainer = document.getElementById('active-exercises-list');
      const loggedSets = activeSession.set_logs || [];

      // Collect all exercises from planned routine and logged sets
      const exMap = new Map();

      // 1. Add all planned exercises from routine
      if (activeSession.planned_exercises && activeSession.planned_exercises.length > 0) {
        activeSession.planned_exercises.forEach(pe => {
          exMap.set(pe.exercise_id, {
            id: pe.exercise_id,
            name_fa: pe.name_fa || pe.exercise_name_fa || 'حرکت تمرینی',
            name_en: pe.name_en || pe.exercise_name_en || '',
            gif_url: pe.gif_url || pe.exercise_gif_url || '',
            category_fa: pe.category_fa || pe.exercise_category_fa || '',
            target_sets: Number(pe.target_sets || pe.sets) || 4,
            target_reps: Number(pe.target_reps || pe.reps) || 10,
            rest_seconds: Number(pe.rest_seconds) || 60,
            logs: []
          });
        });
      }

      // 2. Add/merge logged sets
      loggedSets.forEach(log => {
        if (!exMap.has(log.exercise_id)) {
          exMap.set(log.exercise_id, {
            id: log.exercise_id,
            name_fa: log.exercise_name_fa,
            name_en: log.exercise_name_en,
            gif_url: log.exercise_gif_url,
            category_fa: log.exercise_category_fa,
            target_sets: 3,
            target_reps: 10,
            rest_seconds: 60,
            logs: []
          });
        }
        exMap.get(log.exercise_id).logs.push(log);
      });

      const exercisesArray = Array.from(exMap.values());

      if (exercisesArray.length === 0) {
        listContainer.innerHTML = \`
          <div class="card-glass rounded-2xl p-6 border border-white/10 text-center space-y-3">
            <i data-lucide="dumbbell" class="w-8 h-8 mx-auto text-emerald-400"></i>
            <p class="text-xs text-zinc-400">هنوز حرکتی در این جلسه اضافه نشده است. با دکمه «افزودن حرکت» حرکات دلخواه را اضافه کنید.</p>
            <button onclick="openAddExerciseToSessionModal()" class="btn btn-primary btn-md glow-emerald">
              افزودن حرکت به تمرین
            </button>
          </div>
        \`;
        lucide.createIcons();
        return;
      }

      let totalPlannedSets = 0;
      let totalCompletedSets = 0;

      const renderedItems = exercisesArray.map((item, exIdx) => {
        const extra = extraSetsCount[item.id] || 0;
        const totalSets = Math.max(item.target_sets + extra, item.logs.length);
        const completedSetsCount = item.logs.length;

        totalPlannedSets += totalSets;
        totalCompletedSets += completedSetsCount;

        return renderOngoingExerciseItem(item, exIdx);
      }).join('');

      listContainer.innerHTML = \`<div class="flex w-full flex-col gap-3">\${renderedItems}</div>\`;

      // Update Overall Progress Bar
      const percent = totalPlannedSets > 0 ? Math.round((totalCompletedSets / totalPlannedSets) * 100) : 0;
      document.getElementById('todo-progress-text').innerText = \`پیشرفت تمرین: \${toPersianDigits(totalCompletedSets)} از \${toPersianDigits(totalPlannedSets)} ست انجام شد\`;
      document.getElementById('todo-progress-percent').innerText = toPersianDigits(percent) + '٪';
      document.getElementById('todo-progress-bar').style.width = percent + '%';

      lucide.createIcons();
    }

    function addExtraSet(exerciseId) {
      extraSetsCount[exerciseId] = (extraSetsCount[exerciseId] || 0) + 1;
      renderActiveWorkoutTodoList();
    }

    async function toggleSetCheckbox(exerciseId, setNum, logId) {
      if (!activeSession) return;

      if (logId) {
        // Uncheck / delete this set
        await deleteLoggedSet(logId);
      } else {
        // Check / log this set
        const planned = (activeSession.planned_exercises || []).find(pe => pe.exercise_id === exerciseId);
        const weight = currentExerciseWeights[exerciseId] !== undefined ? currentExerciseWeights[exerciseId] : 0;
        const reps = currentExerciseReps[exerciseId] !== undefined ? currentExerciseReps[exerciseId] : (planned?.target_reps || 10);

        await submitLogSet(exerciseId, setNum, reps, weight);
      }
    }

    async function submitLogSet(exerciseId, setNumber, reps = 10, weight = 0) {
      if (!activeSession) return;

      if (currentUser && activeSession.user_id !== 'guest') {
        try {
          const res = await fetch(\`/api/workouts/\${activeSession.id}/sets\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              exercise_id: exerciseId,
              set_number: setNumber,
              reps: reps,
              weight_kg: weight,
              rpe: 8
            })
          });

          const data = await res.json();
          if (data.success) {
            activeSession.set_logs = activeSession.set_logs || [];
            const setLog = data.set_log || data.log;
            const existingIdx = activeSession.set_logs.findIndex(s => s.exercise_id === exerciseId && s.set_number === setNumber);
            if (existingIdx >= 0) {
              activeSession.set_logs[existingIdx] = setLog;
            } else {
              activeSession.set_logs.push(setLog);
            }

            // Recalculate total volume
            activeSession.total_volume_kg = activeSession.set_logs.reduce((sum, s) => sum + (s.weight_kg * s.reps), 0);

            if (data.is_pr || data.isPr) {
              confetti({ colors: PLATE_COLORS, particleCount: 80, spread: 50, origin: { y: 0.7 } });
              showNotification('🏆 رکورد شخصی جدید ثبت شد (PR)!', 'success');
            } else {
              showNotification(\`ست \${toPersianDigits(setNumber)} با موفقیت ثبت شد\`, 'success');
            }

            const planned = (activeSession.planned_exercises || []).find(pe => pe.exercise_id === exerciseId);
            renderActiveWorkoutTodoList();
            startRestTimer(planned?.rest_seconds || 60);
          } else {
            showNotification(data.error || 'خطا در ثبت ست', 'error');
          }
        } catch (e) {
          showNotification('خطا در ارتباط با سرور', 'error');
        }
      } else {
        // Guest Set Logging in LocalStorage
        activeSession.set_logs = activeSession.set_logs || [];
        const planned = (activeSession.planned_exercises || []).find(pe => pe.exercise_id === exerciseId);
        const exFromCatalog = (exercisesCache || []).find(e => e.id === exerciseId);

        const setLog = {
          id: 'guest-set-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          session_id: activeSession.id,
          exercise_id: exerciseId,
          exercise_name_fa: planned?.name_fa || exFromCatalog?.name_fa || 'حرکت تمرینی',
          exercise_name_en: planned?.name_en || exFromCatalog?.name_en || '',
          exercise_gif_url: planned?.gif_url || exFromCatalog?.gif_url || '',
          exercise_category_fa: planned?.category_fa || exFromCatalog?.category_fa || '',
          set_number: setNumber,
          reps: reps,
          weight_kg: weight,
          rpe: 8,
          is_pr: false
        };

        const existingIdx = activeSession.set_logs.findIndex(s => s.exercise_id === exerciseId && s.set_number === setNumber);
        if (existingIdx >= 0) {
          activeSession.set_logs[existingIdx] = setLog;
        } else {
          activeSession.set_logs.push(setLog);
        }

        activeSession.total_volume_kg = activeSession.set_logs.reduce((sum, s) => sum + (s.weight_kg * s.reps), 0);
        localStorage.setItem('jesm_guest_active_session', JSON.stringify(activeSession));

        showNotification(\`ست \${toPersianDigits(setNumber)} با موفقیت ثبت شد\`, 'success');
        renderActiveWorkoutTodoList();
        startRestTimer(planned?.rest_seconds || 60);
      }
    }

    async function deleteLoggedSet(setId) {
      if (!activeSession) return;

      const confirmed = await showConfirmDialog({
        title: 'حذف ست تمرین',
        message: 'آیا مایلید این ست ثبت‌شده را حذف کنید؟',
        confirmText: 'حذف ست',
        color: 'rose',
        icon: 'trash-2'
      });
      if (!confirmed) return;

      if (currentUser && activeSession.user_id !== 'guest') {
        try {
          const res = await fetch(\`/api/workouts/\${activeSession.id}/sets/\${setId}\`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            activeSession.set_logs = (activeSession.set_logs || []).filter(s => s.id !== setId);
            activeSession.total_volume_kg = activeSession.set_logs.reduce((sum, s) => sum + (s.weight_kg * s.reps), 0);
            showNotification('ست مورد نظر حذف شد', 'info');
            renderActiveWorkoutTodoList();
          }
        } catch (e) {
          showNotification('خطا در حذف ست', 'error');
        }
      } else {
        // Guest Set Deletion
        activeSession.set_logs = (activeSession.set_logs || []).filter(s => s.id !== setId);
        activeSession.total_volume_kg = activeSession.set_logs.reduce((sum, s) => sum + (s.weight_kg * s.reps), 0);
        localStorage.setItem('jesm_guest_active_session', JSON.stringify(activeSession));
        showNotification('ست مورد نظر حذف شد', 'info');
        renderActiveWorkoutTodoList();
      }
    }

    async function finishActiveWorkout() {
      if (!activeSession) return;

      const totalSets = (activeSession.set_logs || []).length;
      if (totalSets === 0) {
        const forceFinish = await showConfirmDialog({
          title: 'پایان تمرین بدون ثبت ست',
          message: 'هنوز هیچ ستی برای این تمرین ثبت نکرده‌اید. آیا مایل به پایان تمرین هستید؟',
          confirmText: 'پایان تمرین',
          color: 'amber',
          icon: 'alert-triangle'
        });
        if (!forceFinish) return;
      } else {
        const confirmed = await showConfirmDialog({
          title: 'پایان و ذخیره نهایی تمرین',
          message: \`آفرین قهرمان! شما \${toPersianDigits(totalSets)} ست با حجم کل \${toPersianDigits(activeSession.total_volume_kg || 0)} کیلوگرم را به پایان رساندید. آیا تمرین ثبت نهایی شود؟\`,
          confirmText: 'ثبت و پایان تمرین',
          color: 'emerald',
          icon: 'trophy'
        });
        if (!confirmed) return;
      }

      if (currentUser && activeSession.user_id !== 'guest') {
        try {
          const res = await fetch(\`/api/workouts/\${activeSession.id}/finish\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes: '' })
          });
          const data = await res.json();
          if (data.success) {
            confetti({ colors: PLATE_COLORS, particleCount: 150, spread: 80, origin: { y: 0.6 } });
            showNotification('خسته نباشید! جلسه تمرین با موفقیت ذخیره شد.', 'success');
            activeSession = null;
            showActiveWorkoutInDashboard(false);
            await loadDashboardData();
          }
        } catch (e) {
          showNotification('خطا در ثبت نهایی تمرین', 'error');
        }
      } else {
        // Guest Workout Finish
        confetti({ colors: PLATE_COLORS, particleCount: 150, spread: 80, origin: { y: 0.6 } });
        const history = JSON.parse(localStorage.getItem('guest_workout_history') || '[]');
        history.unshift({
          ...activeSession,
          end_time: new Date().toISOString(),
          duration_seconds: Math.floor((Date.now() - new Date(activeSession.start_time).getTime()) / 1000)
        });
        localStorage.setItem('guest_workout_history', JSON.stringify(history.slice(0, 30)));
        localStorage.removeItem('jesm_guest_active_session');

        if (activeTimerInterval) {
          clearInterval(activeTimerInterval);
          activeTimerInterval = null;
        }
        stopRestTimer();
        activeSession = null;
        sessionPlannedExercises = [];
        extraSetsCount = {};
        currentExerciseWeights = {};
        currentExerciseReps = {};
        showActiveWorkoutInDashboard(false);
        showNotification('خسته نباشید! جلسه تمرین با موفقیت ذخیره شد.', 'success');
        await loadDashboardData();
      }
    }

    async function discardActiveWorkout() {
      if (!activeSession) return;

      const confirmed = await showConfirmDialog({
        title: 'لغو و حذف جلسه تمرین',
        message: 'آیا مطمئن هستید که می‌خواهید جلسه تمرین فعلی را لغو و تمام ست‌های ثبت شده در آن را پاک کنید؟ این عملیات غیرقابل بازگشت است.',
        confirmText: 'بله، لغو تمرین',
        color: 'rose',
        icon: 'trash-2'
      });
      if (!confirmed) return;

      if (currentUser && activeSession.user_id !== 'guest') {
        try {
          const sessionId = activeSession.id;
          await fetch(\`/api/workouts/\${sessionId}/discard\`, { method: 'POST' });
        } catch (e) {}
      } else {
        localStorage.removeItem('jesm_guest_active_session');
      }

      if (activeTimerInterval) {
        clearInterval(activeTimerInterval);
        activeTimerInterval = null;
      }
      stopRestTimer();
      activeSession = null;
      sessionPlannedExercises = [];
      extraSetsCount = {};
      currentExerciseWeights = {};
      currentExerciseReps = {};
      showActiveWorkoutInDashboard(false);
      showNotification('جلسه تمرین با موفقیت لغو شد', 'info');
      await loadDashboardData();
    }

    // --- Rest Timer Floating Controls ---
    function startRestTimer(seconds = 60) {
      if (restTimerInterval) clearInterval(restTimerInterval);

      restTotalSeconds = seconds;
      restRemainingSeconds = seconds;

      const overlay = document.getElementById('rest-timer-overlay');
      const textEl = document.getElementById('rest-timer-seconds');
      const svgPath = document.getElementById('rest-timer-svg-path');

      if (!overlay || !textEl || !svgPath) return;

      overlay.classList.remove('hidden');

      function tick() {
        textEl.innerText = toPersianDigits(restRemainingSeconds);
        const percent = (restRemainingSeconds / restTotalSeconds) * 100;
        svgPath.setAttribute('stroke-dasharray', \`\${percent}, 100\`);

        if (restRemainingSeconds <= 0) {
          clearInterval(restTimerInterval);
          playChime();
          setTimeout(() => stopRestTimer(), 1000);
        }
        restRemainingSeconds--;
      }

      tick();
      restTimerInterval = setInterval(tick, 1000);
    }

    function adjustRestTimer(delta) {
      restRemainingSeconds = Math.max(0, restRemainingSeconds + delta);
      restTotalSeconds = Math.max(restRemainingSeconds, restTotalSeconds + delta);
      const textEl = document.getElementById('rest-timer-seconds');
      if (textEl) textEl.innerText = toPersianDigits(restRemainingSeconds);
    }

    function stopRestTimer() {
      if (restTimerInterval) clearInterval(restTimerInterval);
      document.getElementById('rest-timer-overlay')?.classList.add('hidden');
    }

    // ============================================================================
    // SAME-PAGE INLINE PROGRAM BUILDER & MOVEMENT SELECTOR
    // ============================================================================
    function addMovementToInlineProgram(exerciseId) {
      const ex = exercisesCache.find(e => e.id === exerciseId);
      if (!ex) return;

      const existing = draftProgramExercises.find(i => i.exercise_id === exerciseId);
      if (existing) {
        showNotification(\`حرکت «\${ex.name_fa}» قبلاً به برنامه اضافه شده است\`, 'warning');
        return;
      }

      draftProgramExercises.push({
        exercise_id: ex.id,
        name_fa: ex.name_fa,
        name_en: ex.name_en,
        gif_url: ex.gif_url,
        target_sets: 4,
        target_reps: 10,
        rest_seconds: 60
      });

      renderInlineDraftExercises();
      showNotification(\`حرکت «\${ex.name_fa}» به برنامه تمرینی در بالای صفحه اضافه شد\`, 'success');
      
      const builderCard = document.getElementById('inline-program-builder-card');
      if (builderCard) {
        builderCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function renderInlineDraftExercises() {
      const container = document.getElementById('inline-draft-exercises-list');
      const badge = document.getElementById('builder-count-badge');
      const navBadge = document.getElementById('nav-draft-count-badge');
      const mobBadge = document.getElementById('nav-m-draft-badge');
      const actions = document.getElementById('inline-builder-actions');

      if (!container) return;

      const count = draftProgramExercises.length;
      if (badge) badge.innerText = toPersianDigits(count) + ' حرکت انتخاب شده';
      
      if (count > 0) {
        if (navBadge) { navBadge.classList.remove('hidden'); navBadge.innerText = toPersianDigits(count); }
        if (mobBadge) mobBadge.classList.remove('hidden');
        if (actions) actions.classList.remove('hidden');
      } else {
        if (navBadge) navBadge.classList.add('hidden');
        if (mobBadge) mobBadge.classList.add('hidden');
        if (actions) actions.classList.add('hidden');
        container.innerHTML = \`
          <p id="inline-empty-hint" class="text-xs text-zinc-500 text-center py-6 border border-dashed border-zinc-800 rounded-xl">
            هنوز حرکتی به برنامه اضافه نشده است. از لیست حرکات زیر، روی دکمه «افزودن به برنامه» کلیک کنید.
          </p>
        \`;
        return;
      }

      container.innerHTML = draftProgramExercises.map((item, idx) => \`
        <div class="card-glass-subtle p-3 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">\${toPersianDigits(idx + 1)}</span>
            <img src="\${item.gif_url}" class="w-9 h-9 rounded-lg object-cover bg-zinc-900 border border-white/10 shrink-0" alt="">
            <div class="min-w-0 truncate">
              <h5 class="font-bold text-white text-xs truncate">
                <span>\${item.name_fa}</span>
                \${item.name_en ? \`<span class="text-[10px] text-zinc-400 font-mono font-normal mr-1">(\${item.name_en})</span>\` : ''}
              </h5>
            </div>
          </div>

          <!-- Sets & Reps Digital Counters + Delete Button (Guaranteed Same Line) -->
          <div class="flex items-center flex-nowrap gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5 shrink-0 self-end sm:self-auto">
            
            <!-- Sets Counter -->
            <div class="flex items-center gap-1.5 bg-white/[0.04] px-2 py-1 rounded-lg border border-white/5 shrink-0">
              <span class="text-zinc-400 font-medium text-[11px]">ست:</span>
              <button type="button" onclick="adjustDraftSets(\${idx}, -1)" class="w-6 h-6 rounded-md bg-white/5 hover:bg-white/15 active:scale-95 text-zinc-300 font-bold flex items-center justify-center transition">−</button>
              <span class="w-5 text-center font-mono font-bold text-white text-xs">\${toPersianDigits(item.target_sets || 4)}</span>
              <button type="button" onclick="adjustDraftSets(\${idx}, 1)" class="w-6 h-6 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-95 text-emerald-400 font-bold flex items-center justify-center transition">+</button>
            </div>

            <!-- Reps Counter -->
            <div class="flex items-center gap-1.5 bg-white/[0.04] px-2 py-1 rounded-lg border border-white/5 shrink-0">
              <span class="text-zinc-400 font-medium text-[11px]">تکرار:</span>
              <button type="button" onclick="adjustDraftReps(\${idx}, -1)" class="w-6 h-6 rounded-md bg-white/5 hover:bg-white/15 active:scale-95 text-zinc-300 font-bold flex items-center justify-center transition">−</button>
              <span class="w-7 text-center font-mono font-bold text-emerald-400 text-xs">\${toPersianDigits(item.target_reps || 10)}</span>
              <button type="button" onclick="adjustDraftReps(\${idx}, 1)" class="w-6 h-6 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-95 text-emerald-400 font-bold flex items-center justify-center transition">+</button>
            </div>

            <!-- Delete Button (ALWAYS on same line) -->
            <button type="button" onclick="removeDraftMovement(\${idx})" title="حذف از برنامه" class="btn-icon-sm btn-ghost text-rose-400 hover:bg-rose-500/20 shrink-0">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>

        </div>
      \`).join('');

      lucide.createIcons();
    }

    function adjustDraftSets(idx, delta) {
      if (draftProgramExercises[idx]) {
        draftProgramExercises[idx].target_sets = Math.max(1, Math.min(20, (Number(draftProgramExercises[idx].target_sets) || 4) + delta));
        renderInlineDraftExercises();
      }
    }

    function adjustDraftReps(idx, delta) {
      if (draftProgramExercises[idx]) {
        draftProgramExercises[idx].target_reps = Math.max(1, Math.min(100, (Number(draftProgramExercises[idx].target_reps) || 10) + delta));
        renderInlineDraftExercises();
      }
    }

    function removeDraftMovement(idx) {
      draftProgramExercises.splice(idx, 1);
      renderInlineDraftExercises();
    }

    function clearDraftProgram() {
      draftProgramExercises = [];
      document.getElementById('inline-routine-title').value = '';
      document.getElementById('inline-routine-desc').value = '';
      renderInlineDraftExercises();
      showNotification('پیش‌نویس برنامه پاکسازی شد', 'info');
    }

    async function saveInlineProgram() {
      const titleInput = document.getElementById('inline-routine-title');
      const descInput = document.getElementById('inline-routine-desc');

      const title = titleInput?.value.trim();
      const desc = descInput?.value.trim();

      if (!title) {
        showNotification('لطفاً نام برنامه تمرینی را وارد کنید', 'warning');
        titleInput?.focus();
        return;
      }

      if (draftProgramExercises.length === 0) {
        showNotification('حداقل یک حرکت به برنامه اضافه کنید', 'warning');
        return;
      }

      try {
        const res = await fetch('/api/routines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description: desc,
            exercises: draftProgramExercises.map(item => ({
              exercise_id: item.exercise_id,
              target_sets: item.target_sets,
              target_reps: item.target_reps,
              rest_seconds: item.rest_seconds || 60
            }))
          })
        });

        const data = await res.json();
        if (data.success && data.routine) {
          if (!currentUser) {
            const localRoutines = JSON.parse(localStorage.getItem('guest_routines') || '[]');
            const fullRoutine = {
              ...data.routine,
              exercises: (data.routine.exercises && data.routine.exercises.length > 0)
                ? data.routine.exercises
                : draftProgramExercises.map(d => ({
                    exercise_id: d.exercise_id || d.id,
                    name_fa: d.name_fa,
                    name_en: d.name_en,
                    gif_url: d.gif_url,
                    target_sets: Number(d.target_sets) || 4,
                    target_reps: Number(d.target_reps) || 10,
                    rest_seconds: Number(d.rest_seconds) || 60
                  }))
            };
            localRoutines.unshift(fullRoutine);
            localStorage.setItem('guest_routines', JSON.stringify(localRoutines));
          }
          confetti({ colors: PLATE_COLORS, particleCount: 100, spread: 60, origin: { y: 0.6 } });
          showNotification(\`برنامه «\${title}» با موفقیت ساخته شد و آماده اشتراک است!\`, 'success');
          clearDraftProgram();
          loadRoutines();
          loadDashboardRoutines();
        } else {
          showNotification(data.error || 'خطا در ذخیره برنامه', 'error');
        }
      } catch (e) {
        showNotification('خطا در ذخیره برنامه', 'error');
      }
    }

    // --- Routine Manager (Works for Authenticated & Guest Clients) ---
    async function loadRoutines() {
      const grid = document.getElementById('routines-grid');
      if (!grid) return;

      let routines = [];
      try {
        if (currentUser) {
          const res = await fetch('/api/routines');
          const data = await res.json();
          routines = data.routines || [];
        } else {
          routines = JSON.parse(localStorage.getItem('guest_routines') || '[]');
        }
      } catch (e) {
        routines = JSON.parse(localStorage.getItem('guest_routines') || '[]');
      }

      if (routines.length === 0) {
        grid.innerHTML = \`
          <div class="col-span-full card-glass p-6 rounded-2xl border border-white/10 text-center space-y-2">
            <i data-lucide="clipboard-list" class="w-7 h-7 mx-auto text-emerald-400"></i>
            <h4 class="font-bold text-white text-xs">هنوز برنامه‌ای نساخته‌اید</h4>
            <p class="text-[11px] text-zinc-400">حرکات دلخواه را از بانک زیر انتخاب و در پیش‌نویس ذخیره کنید.</p>
          </div>
        \`;
        lucide.createIcons();
        return;
      }

      grid.innerHTML = routines.map(r => \`
        <div class="card-glass-interactive rounded-2xl p-4 border border-white/10 space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-sm text-white">\${r.title}</h3>
              <span class="badge badge-emerald">
                \${toPersianDigits(r.exercises ? r.exercises.length : 0)} حرکت
              </span>
            </div>
            <p class="text-xs text-zinc-400">\${r.description || ''}</p>

            <div class="space-y-1 pt-1">
              \${(r.exercises || []).map((ex, i) => {
                const nameFa = ex.name_fa || ex.exercise_name_fa || ex.name_en || ex.exercise_name_en || 'حرکت تمرینی';
                const sets = Number(ex.target_sets || ex.sets) || 4;
                const reps = Number(ex.target_reps || ex.reps) || 10;
                return \`
                <div class="bg-[#08090d] px-2.5 py-1.5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                  <span class="text-zinc-200 font-medium">\${toPersianDigits(i + 1)}. \${nameFa}</span>
                  <span class="text-zinc-400 font-mono text-[11px]">\${toPersianDigits(sets)}×\${toPersianDigits(reps)}</span>
                </div>
              \`;}).join('')}
            </div>
          </div>

          <!-- Routine Bottom Action Controls -->
          <div class="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5">
              <button onclick="shareRoutine('\${r.id}', '\${r.title}')" title="اشتراک‌گذاری این برنامه" class="btn btn-secondary btn-icon-sm">
                <i data-lucide="share-2" class="w-4 h-4"></i>
              </button>
              <button onclick="deleteRoutine('\${r.id}')" title="حذف برنامه" class="btn-icon-sm btn-ghost text-zinc-500 hover:text-rose-400">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>

            <button onclick="startRoutineWorkout('\${r.id}')" class="btn btn-primary btn-sm glow-emerald">
              <i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i>
              <span>اجرای برنامه</span>
            </button>
          </div>
        </div>
      \`).join('');

      lucide.createIcons();
    }

    async function deleteRoutine(routineId) {
      const confirmed = await showConfirmDialog({
        title: 'حذف برنامه تمرینی',
        message: 'آیا مایلید این برنامه تمرینی را حذف کنید؟',
        confirmText: 'حذف برنامه',
        color: 'rose',
        icon: 'trash-2'
      });
      if (!confirmed) return;

      if (currentUser) {
        await fetch('/api/routines/' + routineId, { method: 'DELETE' });
      } else {
        let guestRoutines = JSON.parse(localStorage.getItem('guest_routines') || '[]');
        guestRoutines = guestRoutines.filter(r => r.id !== routineId);
        localStorage.setItem('guest_routines', JSON.stringify(guestRoutines));
      }

      showNotification('برنامه حذف شد', 'info');
      loadRoutines();
      loadDashboardRoutines();
    }

    // --- Movements Grid & Cards With High-Performance Progressive Rendering ---
    let exerciseRenderLimit = 24;
    let exerciseSearchTimeout = null;
    let exercisesRenderedOnce = false;

    async function loadExercises() {
      try {
        const res = await fetch('/api/exercises');
        const data = await res.json();
        exercisesCache = data.exercises || [];
        renderExercisesGrid();
      } catch (err) {}
    }

    function renderExercisesGrid() {
      const grid = document.getElementById('exercises-grid');
      if (!grid) return;
      exercisesRenderedOnce = true;
      const query = (document.getElementById('exercise-search-input')?.value || '').toLowerCase().trim();

      const filtered = exercisesCache.filter(ex => {
        const matchCategory = currentMuscleFilter === 'all' || ex.category === currentMuscleFilter;
        const matchEquip = currentEquipmentFilter === 'all' || ex.equipment === currentEquipmentFilter;
        const matchQuery = !query || 
          ex.name_fa.toLowerCase().includes(query) || 
          ex.name_en.toLowerCase().includes(query) ||
          ex.target_muscles.toLowerCase().includes(query);
        return matchCategory && matchEquip && matchQuery;
      });

      if (filtered.length === 0) {
        grid.innerHTML = \`
          <div class="col-span-full py-12 text-center text-zinc-400">
            <svg class="w-8 h-8 mx-auto text-zinc-600 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/></svg>
            <p class="text-xs">حرکتی با این مشخصات یافت نشد.</p>
          </div>
        \`;
        return;
      }

      const visible = filtered.slice(0, exerciseRenderLimit);
      const hasMore = filtered.length > exerciseRenderLimit;

      const cardsHtml = visible.map(ex => \`
        <div class="card-glass-interactive rounded-2xl overflow-hidden border border-white/10 group flex flex-col justify-between" style="content-visibility: auto; contain-intrinsic-size: 380px;">
          
          <!-- Exercise Thumbnail with Category & Equipment Badges -->
          <div class="relative bg-white aspect-video border-b border-[color:var(--color-line)] flex items-center justify-center overflow-hidden">
            <img 
              src="\${ex.gif_url}" 
              loading="lazy" 
              decoding="async"
              alt="\${ex.name_fa}" 
              class="w-full h-full object-contain group-hover:scale-105 transition duration-300"
              onerror="this.src='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg'"
            >
            <span class="absolute top-2 right-2 badge badge-emerald bg-black/60 backdrop-blur-md">
              \${ex.category_fa}
            </span>
            <span class="absolute top-2 left-2 badge badge-zinc bg-black/60 backdrop-blur-md">
              \${ex.equipment_fa}
            </span>
          </div>

          <!-- Movement Info & Step-by-Step Guidance Directly on the Card (No Popups) -->
          <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
            <div class="space-y-2.5">
              
              <!-- Names Side-by-Side -->
              <div>
                <h4 class="font-bold text-xs md:text-sm text-white group-hover:text-emerald-400 transition flex items-baseline gap-1.5 flex-wrap">
                  <span>\${ex.name_fa}</span>
                  <span class="text-[11px] text-zinc-400 font-mono font-normal">(\${ex.name_en})</span>
                </h4>
              </div>

              <!-- Muscles Info -->
              <div class="text-[11px] text-zinc-400 leading-snug bg-white/[0.02] p-2.5 rounded-xl border border-white/5 space-y-1">
                <p><span class="text-emerald-400 font-medium">عضله اصلی:</span> <span class="text-zinc-200">\${ex.target_muscles}</span></p>
                \${ex.secondary_muscles ? \`<p><span class="text-zinc-400 font-medium">عضلات کمکی:</span> <span class="text-zinc-300">\${ex.secondary_muscles}</span></p>\` : ''}
              </div>

              <!-- Step-by-Step Guidance Box Directly on Card -->
              <details class="text-[11px] text-zinc-300 bg-[#08090d]/80 rounded-xl p-2.5 border border-white/5 group/guide">
                <summary class="cursor-pointer font-bold text-emerald-400 text-xs flex items-center justify-between select-none">
                  <span class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                    <span>راهنمای اجرای حرکت</span>
                  </span>
                  <svg class="w-3.5 h-3.5 transition group-open/guide:rotate-180 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </summary>
                <div class="pt-2 text-zinc-300 whitespace-pre-line leading-relaxed border-t border-white/5 mt-2 max-h-36 overflow-y-auto pr-1">
                  \${ex.instructions_fa}
                </div>
              </details>
            </div>

            <!-- Card Bottom Action: Add to Program -->
            <div class="pt-2 border-t border-white/10">
              <button onclick="addMovementToInlineProgram('\${ex.id}')" class="btn btn-primary btn-md w-full glow-emerald">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                <span>افزودن به برنامه</span>
              </button>
            </div>
          </div>
        </div>
      \`).join('');

      const loadMoreBtn = hasMore ? \`
        <div class="col-span-full pt-4 flex justify-center">
          <button onclick="loadMoreExercises()" class="btn btn-secondary btn-md border-emerald-500/20 text-emerald-400 hover:text-white">
            <span>نمایش حرکات بیشتر (\${toPersianDigits(filtered.length - exerciseRenderLimit)} حرکت دیگر)</span>
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>
      \` : '';

      grid.innerHTML = cardsHtml + loadMoreBtn;
    }

    function loadMoreExercises() {
      exerciseRenderLimit += 24;
      renderExercisesGrid();
    }

    function setMuscleFilter(cat) {
      currentMuscleFilter = cat || 'all';
      exerciseRenderLimit = 24;
      const sel = document.getElementById('muscle-filter-select');
      if (sel && sel.value !== currentMuscleFilter) {
        sel.value = currentMuscleFilter;
      }
      renderExercisesGrid();
    }

    function setEquipmentFilter(eq) {
      currentEquipmentFilter = eq || 'all';
      exerciseRenderLimit = 24;
      const sel = document.getElementById('equipment-filter-select');
      if (sel && sel.value !== currentEquipmentFilter) {
        sel.value = currentEquipmentFilter;
      }
      renderExercisesGrid();
    }

    function handleExerciseSearch() {
      clearTimeout(exerciseSearchTimeout);
      exerciseSearchTimeout = setTimeout(() => {
        exerciseRenderLimit = 24;
        renderExercisesGrid();
      }, 120);
    }

    // --- Active Workout Helpers ---
    function openAddExerciseToSessionModal() {
      document.getElementById('add-to-workout-modal').classList.remove('hidden');
      lockBodyScroll();
      filterModalExercises();
      lucide.createIcons();
    }

    function closeAddExerciseModal() {
      document.getElementById('add-to-workout-modal').classList.add('hidden');
      unlockBodyScroll();
    }

    function filterModalExercises() {
      const q = (document.getElementById('modal-add-search')?.value || '').toLowerCase().trim();
      const list = document.getElementById('modal-exercises-list');

      const filtered = exercisesCache.filter(e => 
        !q || e.name_fa.toLowerCase().includes(q) || e.name_en.toLowerCase().includes(q)
      );

      list.innerHTML = filtered.map(ex => \`
        <div class="card-glass-subtle p-2.5 rounded-xl border border-white/10 flex items-center justify-between hover:border-emerald-500/40 transition">
          <div class="flex items-center gap-2.5">
            <img src="\${ex.gif_url}" class="w-9 h-9 rounded-lg object-cover bg-zinc-900" alt="">
            <div>
              <h5 class="font-bold text-xs text-white">\${ex.name_fa}</h5>
              <p class="text-[10px] text-zinc-400 font-mono">\${ex.name_en}</p>
            </div>
          </div>
          <button onclick="addSelectedExToWorkout('\${ex.id}')" class="btn btn-primary btn-sm glow-emerald">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>افزودن</span>
          </button>
        </div>
      \`).join('');
      lucide.createIcons();
    }

    async function addSelectedExToWorkout(exId) {
      closeAddExerciseModal();
      if (!activeSession) return;
      
      const ex = (exercisesCache || []).find(e => e.id === exId);
      if (ex) {
        activeSession.planned_exercises = activeSession.planned_exercises || [];
        if (!activeSession.planned_exercises.some(pe => pe.exercise_id === exId)) {
          activeSession.planned_exercises.push({
            exercise_id: ex.id,
            name_fa: ex.name_fa,
            name_en: ex.name_en,
            gif_url: ex.gif_url,
            category_fa: ex.category_fa,
            target_sets: 3,
            target_reps: 10,
            rest_seconds: 60
          });
        }
      }

      if (!currentUser || activeSession.user_id === 'guest') {
        localStorage.setItem('jesm_guest_active_session', JSON.stringify(activeSession));
      }

      renderActiveWorkoutTodoList();
      showNotification('حرکت با موفقیت به جلسه تمرین افزوده شد', 'success');
    }

    // --- Calendar and Progress Tracker Hub (Weekly, Monthly, 3-Month) ---
    let currentCalendarView = 'weekly';
    let cachedVolumeProgression = [];

    async function switchCalendarView(view) {
      currentCalendarView = view;
      ['weekly', 'monthly', '3month'].forEach(v => {
        const btn = document.getElementById('cal-btn-' + v);
        if (btn) {
          if (v === view) {
            btn.className = 'btn btn-primary btn-sm py-1 px-3 rounded-lg';
          } else {
            btn.className = 'btn btn-ghost btn-sm py-1 px-3 rounded-lg';
          }
        }
      });

      const days = view === 'weekly' ? 7 : (view === 'monthly' ? 30 : 90);
      await loadVolumeProgressionChart(days);
      renderCalendarProgressWidget();
    }

    async function loadDashboardCalendarAndProgress() {
      const days = currentCalendarView === 'weekly' ? 7 : (currentCalendarView === 'monthly' ? 30 : 90);
      await loadVolumeProgressionChart(days);
      renderCalendarProgressWidget();
    }

    function renderCalendarProgressWidget() {
      const calContainer = document.getElementById('cal-view-container');
      if (!calContainer) return;

      const volumeMap = new Map();
      let totalVolumeSum = 0;
      cachedVolumeProgression.forEach(item => {
        volumeMap.set(item.date, item.volume);
        totalVolumeSum += (item.volume || 0);
      });

      const daysCount = currentCalendarView === 'weekly' ? 7 : (currentCalendarView === 'monthly' ? 30 : 90);
      const dayList = [];
      let activeWorkoutsCount = 0;

      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dayNum = String(d.getDate()).padStart(2, '0');
        const dateStr = y + '-' + m + '-' + dayNum;

        const vol = volumeMap.get(dateStr) || 0;
        const isToday = (i === 0);
        if (vol > 0) activeWorkoutsCount++;

        dayList.push({
          date: d,
          dateStr: dateStr,
          volume: vol,
          isToday: isToday
        });
      }

      const userTargetWeekly = Number(currentProfile?.target_weekly_workouts) || 4;
      if (currentUser) renderHeroBarbell(dayList.slice(-7).filter(d => d.volume > 0).length, userTargetWeekly);
      const subtitleEl = document.getElementById('cal-period-subtitle');
      const labelEl = document.getElementById('cal-progress-label');
      const percentEl = document.getElementById('cal-progress-percent');
      const barEl = document.getElementById('cal-progress-bar');
      const detailsEl = document.getElementById('cal-progress-details');
      const volumeEl = document.getElementById('cal-period-volume');
      const chartTitleEl = document.getElementById('chart-timeframe-title');

      if (currentCalendarView === 'weekly') {
        const percent = Math.min(100, Math.round((activeWorkoutsCount / userTargetWeekly) * 100));
        if (subtitleEl) subtitleEl.innerText = '۷ روز اخیر (هفته جاری)';
        if (labelEl) labelEl.innerText = 'پیشرفت هدف هفتگی';
        if (percentEl) percentEl.innerText = toPersianDigits(percent) + '٪';
        if (barEl) barEl.style.width = percent + '%';
        if (detailsEl) detailsEl.innerText = toPersianDigits(activeWorkoutsCount) + ' از ' + toPersianDigits(userTargetWeekly) + ' جلسه تمرین هدف انجام شد';
        if (volumeEl) volumeEl.innerText = 'حجم: ' + toPersianDigits(Math.round(totalVolumeSum).toLocaleString('fa-IR')) + ' kg';
        if (chartTitleEl) chartTitleEl.innerText = 'نمودار بار تمرینی ۷ روز اخیر';

        const dayNamesFa = ['۱ش', '۲ش', '۳ش', '۴ش', '۵ش', 'جمعه', 'شنبه'];

        calContainer.innerHTML = \`
          <div class="grid grid-cols-7 gap-1.5 md:gap-2 pt-1">
            \${dayList.map(item => {
              const dObj = item.date;
              const dayName = dayNamesFa[dObj.getDay()];
              const dayNum = toPersianDigits(dObj.toLocaleDateString('fa-IR', { day: 'numeric', month: 'short' }));
              const hasWorkout = item.volume > 0;
              const isToday = item.isToday;

              if (hasWorkout) {
                return \`
                  <div class="card-glass-interactive p-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-center flex flex-col items-center justify-between h-20 shadow-lg glow-emerald">
                    <span class="text-[11px] font-bold text-emerald-400">\${dayName}</span>
                    <div class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <i data-lucide="check" class="w-3.5 h-3.5 stroke-[3]"></i>
                    </div>
                    <span class="text-[9px] font-mono font-bold text-emerald-300">\${toPersianDigits(Math.round(item.volume / 100) / 10)}k</span>
                  </div>
                \`;
              } else if (isToday) {
                return \`
                  <div class="card-glass-subtle p-2 rounded-xl border border-emerald-400/40 bg-emerald-400/5 text-center flex flex-col items-center justify-between h-20">
                    <span class="text-[11px] font-bold text-white">\${dayName}</span>
                    <span class="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-full">امروز</span>
                    <span class="text-[9px] text-zinc-400">\${dayNum}</span>
                  </div>
                \`;
              } else {
                return \`
                  <div class="card-glass-subtle p-2 rounded-xl border border-white/5 opacity-50 text-center flex flex-col items-center justify-between h-20">
                    <span class="text-[11px] font-medium text-zinc-400">\${dayName}</span>
                    <div class="w-2 h-2 rounded-full bg-zinc-700"></div>
                    <span class="text-[9px] text-zinc-500">\${dayNum}</span>
                  </div>
                \`;
              }
            }).join('')}
          </div>
        \`;
      } else if (currentCalendarView === 'monthly') {
        const monthlyTarget = userTargetWeekly * 4;
        const percent = Math.min(100, Math.round((activeWorkoutsCount / monthlyTarget) * 100));
        if (subtitleEl) subtitleEl.innerText = '۳۰ روز گذشته';
        if (labelEl) labelEl.innerText = 'تداوم تمرین در ۳۰ روز گذشته';
        if (percentEl) percentEl.innerText = toPersianDigits(percent) + '٪';
        if (barEl) barEl.style.width = percent + '%';
        if (detailsEl) detailsEl.innerText = toPersianDigits(activeWorkoutsCount) + ' جلسه تمرین در ۳۰ روز اخیر (هدف ماهانه: ' + toPersianDigits(monthlyTarget) + ' جلسه)';
        if (volumeEl) volumeEl.innerText = 'حجم ماهانه: ' + toPersianDigits((totalVolumeSum / 1000).toFixed(1)) + ' تن';
        if (chartTitleEl) chartTitleEl.innerText = 'نمودار بار تمرینی ۳۰ روز گذشته';

        calContainer.innerHTML = \`
          <div class="space-y-2 pt-1">
            <div class="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
              \${dayList.map(item => {
                const dayNum = toPersianDigits(item.date.toLocaleDateString('fa-IR', { day: 'numeric' }));
                const hasWorkout = item.volume > 0;
                const isToday = item.isToday;

                if (hasWorkout) {
                  return \`
                    <div title="\${item.dateStr}: \${toPersianDigits(item.volume)} kg" class="p-2 rounded-lg border border-emerald-500/40 bg-emerald-500/20 text-center flex flex-col items-center justify-center gap-1 shadow-sm glow-emerald cursor-pointer hover:scale-105 transition">
                      <span class="text-[11px] font-bold text-white font-mono">\${dayNum}</span>
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    </div>
                  \`;
                } else if (isToday) {
                  return \`
                    <div title="امروز: هنوز ثبت نشده" class="p-2 rounded-lg border border-emerald-400/40 bg-white/5 text-center flex flex-col items-center justify-center gap-1 cursor-pointer">
                      <span class="text-[11px] font-bold text-emerald-400 font-mono">\${dayNum}</span>
                      <span class="text-[8px] text-zinc-400">امروز</span>
                    </div>
                  \`;
                } else {
                  return \`
                    <div class="p-2 rounded-lg border border-white/5 bg-black/20 opacity-40 text-center flex flex-col items-center justify-center gap-1">
                      <span class="text-[11px] font-mono text-zinc-500">\${dayNum}</span>
                      <span class="w-1 h-1 rounded-full bg-zinc-700"></span>
                    </div>
                  \`;
                }
              }).join('')}
            </div>
          </div>
        \`;
      } else {
        // 3-Month View (90 Days)
        const seasonTarget = userTargetWeekly * 12;
        const percent = Math.min(100, Math.round((activeWorkoutsCount / seasonTarget) * 100));
        if (subtitleEl) subtitleEl.innerText = '۳ ماه گذشته (فصلی)';
        if (labelEl) labelEl.innerText = 'ماتریس پایداری و پشتکار ۳ ماهه (۹۰ روز)';
        if (percentEl) percentEl.innerText = toPersianDigits(percent) + '٪';
        if (barEl) barEl.style.width = percent + '%';
        if (detailsEl) detailsEl.innerText = toPersianDigits(activeWorkoutsCount) + ' روز فعال تمرینی از ۹۰ روز گذشته (هدف فصل: ' + toPersianDigits(seasonTarget) + ' جلسه)';
        if (volumeEl) volumeEl.innerText = 'حجم کل فصل: ' + toPersianDigits((totalVolumeSum / 1000).toFixed(1)) + ' تن';
        if (chartTitleEl) chartTitleEl.innerText = 'نمودار بار تمرینی ۳ ماه اخیر';

        calContainer.innerHTML = \`
          <div class="space-y-3 pt-1">
            <div class="flex flex-wrap gap-1 items-center justify-center bg-black/30 p-3 rounded-xl border border-white/5 max-h-36 overflow-y-auto">
              \${dayList.map(item => {
                const vol = item.volume || 0;
                let bgClass = 'bg-white/[0.04] border border-white/5 opacity-40';
                if (vol > 0 && vol < 4000) {
                  bgClass = 'bg-emerald-900/60 border border-emerald-700/40';
                } else if (vol >= 4000 && vol < 12000) {
                  bgClass = 'bg-emerald-600 border border-emerald-500 shadow-sm';
                } else if (vol >= 12000) {
                  bgClass = 'bg-emerald-400 border border-emerald-300 shadow-md glow-emerald';
                }

                return \`
                  <div 
                    title="\${item.dateStr} | حجم: \${toPersianDigits(vol)} kg" 
                    class="w-3.5 h-3.5 rounded-sm \${bgClass} transition hover:scale-125 cursor-pointer"
                  ></div>
                \`;
              }).join('')}
            </div>

            <div class="flex items-center justify-between text-[10px] text-zinc-400 px-1">
              <span>کمتر</span>
              <div class="flex items-center gap-1">
                <span class="w-2.5 h-2.5 rounded-xs bg-white/[0.04] border border-white/5"></span>
                <span class="w-2.5 h-2.5 rounded-xs bg-emerald-900/60 border border-emerald-700/40"></span>
                <span class="w-2.5 h-2.5 rounded-xs bg-emerald-600 border border-emerald-500"></span>
                <span class="w-2.5 h-2.5 rounded-xs bg-emerald-400 border border-emerald-300 glow-emerald"></span>
              </div>
              <span>بیشتر</span>
            </div>
          </div>
        \`;
      }

      lucide.createIcons();
    }

    // --- Hero Barbell: weekly goal as plates loaded on a bar ---
    // Heaviest plates sit closest to the collar, like a real loaded bar (25 red, 20 blue, 15 yellow, 10 green, 5 white)
    const PLATE_COLORS = ['#DE4A3A', '#3D7BE0', '#F0C33C', '#45A56A', '#E9E7E2'];
    const BARBELL_PLATES = [
      { h: 84, fill: 'var(--plate-red)' },
      { h: 78, fill: 'var(--plate-blue)' },
      { h: 70, fill: 'var(--plate-yellow)' },
      { h: 62, fill: 'var(--plate-green)' },
      { h: 52, fill: 'var(--plate-white)' },
      { h: 44, fill: 'var(--plate-white)' },
      { h: 38, fill: 'var(--plate-white)' }
    ];

    function renderHeroBarbell(done, target) {
      const wrap = document.getElementById('hero-barbell');
      if (!wrap) return;
      target = Math.max(1, Math.min(BARBELL_PLATES.length, target || 4));
      const loaded = Math.min(done, target);
      const W = 360, H = 100, cy = H / 2;
      const plateW = 13, gap = 3;
      const collarL = 118, collarR = W - 118;
      let svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + toPersianDigits(done) + ' از ' + toPersianDigits(target) + ' جلسه این هفته">';
      svg += '<rect class="bar" x="4" y="' + (cy - 3) + '" width="' + (W - 8) + '" height="6" rx="3"/>';
      svg += '<rect class="bar" x="' + (collarL + 6) + '" y="' + (cy - 5) + '" width="' + (collarR - collarL - 12) + '" height="10" rx="2" opacity=".55"/>';
      for (let i = 0; i < target; i++) {
        const p = BARBELL_PLATES[i];
        const offset = i * (plateW + gap);
        const xl = collarL - plateW - offset;
        const xr = collarR + offset;
        const y = cy - p.h / 2;
        if (i < loaded) {
          const delay = (i * 0.08).toFixed(2) + 's';
          [xl, xr].forEach(x => {
            svg += '<rect class="plate" style="animation-delay:' + delay + '" x="' + x + '" y="' + y + '" width="' + plateW + '" height="' + p.h + '" rx="3" fill="' + p.fill + '"/>';
          });
        } else {
          [xl, xr].forEach(x => {
            svg += '<rect class="slot" x="' + (x + 0.75) + '" y="' + (y + 0.75) + '" width="' + (plateW - 1.5) + '" height="' + (p.h - 1.5) + '" rx="3"/>';
          });
        }
      }
      svg += '<rect class="collar" x="' + (collarL) + '" y="' + (cy - 11) + '" width="6" height="22" rx="1.5"/>';
      svg += '<rect class="collar" x="' + (collarR - 6) + '" y="' + (cy - 11) + '" width="6" height="22" rx="1.5"/>';
      svg += '</svg>';
      wrap.innerHTML = svg;

      const doneEl = document.getElementById('barbell-done');
      const targetEl = document.getElementById('barbell-target');
      if (doneEl) doneEl.innerText = toPersianDigits(done);
      if (targetEl) targetEl.innerText = toPersianDigits(target);
    }

    function countSessionsInLastDays(dates, days) {
      const cutoff = new Date();
      cutoff.setHours(0, 0, 0, 0);
      cutoff.setDate(cutoff.getDate() - (days - 1));
      const seen = new Set();
      dates.forEach(d => {
        const dt = new Date(d);
        if (!isNaN(dt) && dt >= cutoff) seen.add(dt.toDateString());
      });
      return seen.size;
    }

    // --- Volume Progression Chart (7 / 30 / 90 Days) ---
    async function loadVolumeProgressionChart(days = 7) {
      try {
        const res = await fetch('/api/analytics/volume-progression?days=' + days);
        const json = await res.json();
        const data = json.data || [];
        cachedVolumeProgression = data;

        const ctx = document.getElementById('volumeChart');
        if (!ctx) return;

        const labels = data.map(d => {
          const parts = d.date.split('-');
          return toPersianDigits(parts[1] + '/' + parts[2]);
        });
        const volumes = data.map(d => d.volume);

        if (volumeChartInstance) {
          volumeChartInstance.destroy();
        }

        const isDark = document.documentElement.classList.contains('dark');
        const gridColor = isDark ? 'rgba(237,235,230,0.06)' : 'rgba(21,23,26,0.07)';
        const tickColor = isDark ? '#7D8288' : '#6B727B';

        volumeChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels.length > 0 ? labels : ['بدون سابقه'],
            datasets: [{
              label: 'حجم تمرین (کیلوگرم)',
              data: volumes.length > 0 ? volumes : [0],
              borderColor: isDark ? '#5A90E8' : '#1F5FCC',
              backgroundColor: isDark ? 'rgba(61, 123, 224, 0.14)' : 'rgba(31, 95, 204, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.3,
              pointBackgroundColor: isDark ? '#5A90E8' : '#1F5FCC',
              pointRadius: days === 90 ? 2 : (days === 30 ? 3 : 5)
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              x: {
                grid: { color: gridColor },
                ticks: { color: tickColor, font: { family: 'Readex Pro' } }
              },
              y: {
                grid: { color: gridColor },
                ticks: { color: tickColor, font: { family: 'Readex Pro' } }
              }
            }
          }
        });
      } catch (e) {}
    }

    function renderRecentWorkouts(workouts) {
      const container = document.getElementById('dash-recent-workouts');
      if (!workouts || workouts.length === 0) {
        container.innerHTML = '<p class="text-xs text-zinc-500 text-center py-4">هنوز تمرینی ثبت نشده است.</p>';
        return;
      }

      container.innerHTML = workouts.slice(0, 3).map(w => {
        const dateStr = new Date(w.start_time).toLocaleDateString('fa-IR');
        const durationMin = Math.round(w.duration_seconds / 60);
        return \`
          <div class="card-glass-subtle p-3 rounded-xl border border-white/10 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="icon-box icon-box-emerald w-9 h-9 rounded-lg">
                <i data-lucide="check" class="w-4 h-4"></i>
              </div>
              <div>
                <h4 class="font-bold text-xs md:text-sm text-white">\${w.title}</h4>
                <p class="text-[10px] text-zinc-400">\${dateStr} • \${toPersianDigits(durationMin)} دقیقه</p>
              </div>
            </div>
            <div class="text-left">
              <span class="text-xs font-mono font-bold text-emerald-400">\${toPersianDigits(w.total_volume_kg)} kg</span>
              <p class="text-[10px] text-zinc-400">\${toPersianDigits(w.set_logs ? w.set_logs.length : 0)} ست</p>
            </div>
          </div>
        \`;
      }).join('');
      lucide.createIcons();
    }

    async function loadDashboardRoutines() {
      try {
        let routines = [];
        if (currentUser) {
          const res = await fetch('/api/routines');
          if (res.ok) {
            const data = await res.json();
            routines = data.routines || [];
          }
        } else {
          routines = JSON.parse(localStorage.getItem('guest_routines') || '[]');
        }

        const list = document.getElementById('dash-routines-list');
        if (!list) return;

        if (routines.length === 0) {
          list.innerHTML = '<p class="text-xs text-zinc-500 py-3 text-center">برنامه‌ای تعریف نشده است.</p>';
          return;
        }

        list.innerHTML = routines.slice(0, 3).map(r => \`
          <div class="card-glass-subtle p-3 rounded-xl border border-white/10 hover:border-emerald-500/30 transition flex items-center justify-between">
            <div>
              <h4 class="font-bold text-xs text-white">\${r.title}</h4>
              <p class="text-[10px] text-zinc-400">\${toPersianDigits(r.exercises ? r.exercises.length : 0)} حرکت</p>
            </div>
            <div class="flex items-center gap-1.5">
              <button onclick="shareRoutine('\${r.id}', '\${r.title}')" title="اشتراک‌گذاری" class="btn btn-secondary btn-icon-sm">
                <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="startRoutineWorkout('\${r.id}')" class="btn btn-primary btn-sm glow-emerald text-[11px]">
                <i data-lucide="play" class="w-3 h-3 fill-current"></i>
                <span>اجرا</span>
              </button>
            </div>
          </div>
        \`).join('');
        lucide.createIcons();
      } catch (e) {}
    }

    // --- Tab 2: History & PRs Logic ---
    async function loadHistoryTab() {
      if (!currentUser) {
        document.getElementById('history-auth-view')?.classList.add('hidden');
        document.getElementById('history-guest-view')?.classList.remove('hidden');
        return;
      }

      document.getElementById('history-auth-view')?.classList.remove('hidden');
      document.getElementById('history-guest-view')?.classList.add('hidden');

      try {
        const resPr = await fetch('/api/analytics/prs');
        const dataPr = await resPr.json();
        const prs = dataPr.prs || [];
        const prsGrid = document.getElementById('prs-grid');

        if (prs.length === 0) {
          prsGrid.innerHTML = '<p class="text-xs text-zinc-500 col-span-full py-4 text-center">هنوز رکوردی ثبت نشده است.</p>';
        } else {
          prsGrid.innerHTML = prs.map(pr => \`
            <div class="card-glass-interactive p-3.5 rounded-2xl border border-emerald-500/30 flex items-center justify-between glow-emerald">
              <div class="space-y-1">
                <span class="badge badge-emerald">\${pr.category_fa}</span>
                <h4 class="font-bold text-xs md:text-sm text-white flex items-baseline gap-1.5 flex-wrap">
                  <span>\${pr.exercise_name_fa}</span>
                  <span class="text-[10px] text-zinc-400 font-mono font-normal">(\${pr.exercise_name_en})</span>
                </h4>
              </div>
              <div class="text-left">
                <span class="text-base md:text-lg font-black font-mono text-emerald-400">\${toPersianDigits(pr.max_weight_kg)} kg</span>
                <p class="text-[10px] text-zinc-400">\${toPersianDigits(pr.reps_at_max)} تکرار</p>
              </div>
            </div>
          \`).join('');
        }

        const resHistory = await fetch('/api/workouts/history?limit=50');
        const dataHistory = await resHistory.json();
        const history = dataHistory.history || [];
        const histContainer = document.getElementById('full-history-list');

        if (history.length === 0) {
          histContainer.innerHTML = '<p class="text-xs text-zinc-500 text-center py-6">تاریخچه تمرینی وجود ندارد.</p>';
        } else {
          histContainer.innerHTML = history.map(w => {
            const dateStr = new Date(w.start_time).toLocaleDateString('fa-IR');
            const durationMin = Math.round(w.duration_seconds / 60);

            return \`
              <div class="card-glass-subtle p-4 rounded-2xl border border-white/10 space-y-2.5">
                <div class="flex items-center justify-between border-b border-white/10 pb-2">
                  <div>
                    <h4 class="font-bold text-xs md:text-sm text-white">\${w.title}</h4>
                    <p class="text-[10px] text-zinc-400">\${dateStr} • \${toPersianDigits(durationMin)} دقیقه</p>
                  </div>
                  <div class="text-left">
                    <span class="text-xs md:text-sm font-bold font-mono text-emerald-400">\${toPersianDigits(w.total_volume_kg)} kg</span>
                  </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
                  \${(w.set_logs || []).map(s => \`
                    <div class="bg-[#121522] p-2 rounded-xl border border-white/10 text-[11px] flex items-center justify-between">
                      <span class="text-zinc-300 truncate max-w-[85px]">\${s.exercise_name_fa}</span>
                      <span class="font-mono font-bold text-emerald-400">\${toPersianDigits(s.weight_kg)}kg × \${toPersianDigits(s.reps)}</span>
                    </div>
                  \`).join('')}
                </div>
              </div>
            \`;
          }).join('');
        }

        lucide.createIcons();
      } catch (e) {}
    }

    // --- Tab 4: Profile & Goals ---
    async function loadProfileData() {
      if (!currentUser) {
        const guestProfile = JSON.parse(localStorage.getItem('guest_profile') || '{}');
        currentProfile = {
          gender: guestProfile.gender || 'male',
          age: guestProfile.age || 25,
          height_cm: guestProfile.height_cm || 175,
          current_weight_kg: guestProfile.current_weight_kg || 75,
          target_weight_kg: guestProfile.target_weight_kg || 80,
          fitness_goal: guestProfile.fitness_goal || 'hypertrophy',
          fitness_level: guestProfile.fitness_level || 'intermediate',
          target_weekly_workouts: guestProfile.target_weekly_workouts || 4,
          daily_reminder_enabled: guestProfile.daily_reminder_enabled !== undefined ? guestProfile.daily_reminder_enabled : 1,
          daily_reminder_time: guestProfile.daily_reminder_time || '20:00'
        };

        const gEl = (id) => document.getElementById(id);
        if (gEl('prof-gender')) gEl('prof-gender').value = currentProfile.gender;
        if (gEl('prof-age')) gEl('prof-age').value = currentProfile.age;
        if (gEl('prof-height')) gEl('prof-height').value = currentProfile.height_cm;
        if (gEl('prof-weight')) gEl('prof-weight').value = currentProfile.current_weight_kg;
        if (gEl('prof-target-weight')) gEl('prof-target-weight').value = currentProfile.target_weight_kg;
        if (gEl('prof-goal')) gEl('prof-goal').value = currentProfile.fitness_goal;
        if (gEl('prof-level')) gEl('prof-level').value = currentProfile.fitness_level;
        if (gEl('prof-weekly-workouts')) gEl('prof-weekly-workouts').value = currentProfile.target_weekly_workouts;
        if (gEl('prof-reminder-enabled')) gEl('prof-reminder-enabled').checked = !!currentProfile.daily_reminder_enabled;
        if (gEl('prof-reminder-time')) gEl('prof-reminder-time').value = currentProfile.daily_reminder_time;

        if (gEl('prof-disp-weight')) gEl('prof-disp-weight').innerText = toPersianDigits(currentProfile.current_weight_kg) + ' kg';
        if (gEl('prof-disp-target')) gEl('prof-disp-target').innerText = toPersianDigits(currentProfile.target_weight_kg) + ' kg';

        const hM = currentProfile.height_cm / 100;
        const bmi = (currentProfile.current_weight_kg / (hM * hM)).toFixed(1);
        if (gEl('prof-disp-bmi')) gEl('prof-disp-bmi').innerText = toPersianDigits(bmi);

        const goalFa = GOAL_TRANSLATIONS[currentProfile.fitness_goal] || 'عضله‌سازی';
        if (gEl('hero-goal-badge')) gEl('hero-goal-badge').innerText = 'هدف: ' + goalFa;

        const guestLogs = JSON.parse(localStorage.getItem('guest_daily_logs') || '[]');
        const todayStr = new Date().toISOString().split('T')[0];
        const todayLog = guestLogs.find(l => l.log_date === todayStr);

        const tag = gEl('daily-status-tag');
        if (todayLog) {
          if (tag) {
            tag.className = 'badge badge-emerald';
            tag.innerText = 'امروز ثبت شده ✓';
          }
          if (gEl('daily-weight-input')) gEl('daily-weight-input').value = todayLog.weight_kg || '';
          if (gEl('daily-water-input')) gEl('daily-water-input').value = todayLog.water_liters || '';
          if (gEl('daily-notes-input')) gEl('daily-notes-input').value = todayLog.notes || '';
        } else {
          if (tag) {
            tag.className = 'badge badge-zinc';
            tag.innerText = 'در انتظار ثبت امروز';
          }
          if (gEl('daily-weight-input')) gEl('daily-weight-input').value = currentProfile.current_weight_kg || '';
          if (gEl('daily-water-input')) gEl('daily-water-input').value = '';
          if (gEl('daily-notes-input')) gEl('daily-notes-input').value = '';
        }

        renderDailyLogsList(guestLogs);
        return;
      }

      try {
        const res = await fetch('/api/profile');
        if (!res.ok) return;
        const data = await res.json();
        currentProfile = data.profile;

        document.getElementById('prof-gender').value = currentProfile.gender || 'male';
        document.getElementById('prof-age').value = currentProfile.age || 25;
        document.getElementById('prof-height').value = currentProfile.height_cm || 175;
        document.getElementById('prof-weight').value = currentProfile.current_weight_kg || 75;
        document.getElementById('prof-target-weight').value = currentProfile.target_weight_kg || 80;
        document.getElementById('prof-goal').value = currentProfile.fitness_goal || 'hypertrophy';
        document.getElementById('prof-level').value = currentProfile.fitness_level || 'intermediate';
        document.getElementById('prof-weekly-workouts').value = currentProfile.target_weekly_workouts || 4;
        document.getElementById('prof-reminder-enabled').checked = !!currentProfile.daily_reminder_enabled;
        document.getElementById('prof-reminder-time').value = currentProfile.daily_reminder_time || '20:00';

        document.getElementById('prof-disp-weight').innerText = toPersianDigits(currentProfile.current_weight_kg) + ' kg';
        document.getElementById('prof-disp-target').innerText = toPersianDigits(currentProfile.target_weight_kg) + ' kg';

        const hM = currentProfile.height_cm / 100;
        const bmi = (currentProfile.current_weight_kg / (hM * hM)).toFixed(1);
        document.getElementById('prof-disp-bmi').innerText = toPersianDigits(bmi);

        const goalFa = GOAL_TRANSLATIONS[currentProfile.fitness_goal] || 'عضله‌سازی';
        document.getElementById('hero-goal-badge').innerText = 'هدف: ' + goalFa;

        const banner = document.getElementById('daily-reminder-banner');
        const tag = document.getElementById('daily-status-tag');
        if (data.hasLoggedToday && data.todayLog) {
          banner?.classList.add('hidden');
          if (tag) {
            tag.className = 'badge badge-emerald';
            tag.innerText = 'امروز ثبت شده ✓';
          }
          document.getElementById('daily-weight-input').value = data.todayLog.weight_kg || '';
          document.getElementById('daily-water-input').value = data.todayLog.water_liters || '';
          document.getElementById('daily-notes-input').value = data.todayLog.notes || '';
        } else {
          if (currentProfile.daily_reminder_enabled) {
            banner?.classList.remove('hidden');
          }
          if (tag) {
            tag.className = 'badge badge-zinc';
            tag.innerText = 'در انتظار ثبت امروز';
          }
          document.getElementById('daily-weight-input').value = currentProfile.current_weight_kg || '';
          document.getElementById('daily-water-input').value = '';
          document.getElementById('daily-notes-input').value = '';
        }

        renderDailyLogsList(data.dailyLogs || []);
        scheduleDailyReminderCheck(currentProfile);

      } catch (err) {}
    }

    function renderDailyLogsList(logs) {
      const container = document.getElementById('recent-daily-logs-list');
      if (!container) return;

      if (logs.length === 0) {
        container.innerHTML = '<p class="text-[11px] text-zinc-500 py-3 text-center">هنوز ثبت روزانه‌ای انجام نشده است.</p>';
        return;
      }

      container.innerHTML = logs.map(l => {
        const dateStr = new Date(l.log_date).toLocaleDateString('fa-IR');
        return \`
          <div class="card-glass-subtle p-2.5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
            <div>
              <p class="font-bold text-white text-[11px]">\${dateStr}</p>
              <p class="text-[10px] text-zinc-400 truncate max-w-[150px]">\${l.notes || 'بدون یادداشت'}</p>
            </div>
            <div class="text-left">
              <span class="font-mono font-bold text-emerald-400 text-xs">\${toPersianDigits(l.weight_kg || '--')} kg</span>
              <p class="text-[10px] text-emerald-400">\${toPersianDigits(l.water_liters || 0)} L آب</p>
            </div>
          </div>
        \`;
      }).join('');
    }

    async function saveProfileData() {
      const gender = document.getElementById('prof-gender').value;
      const age = parseInt(document.getElementById('prof-age').value) || 25;
      const height = parseFloat(document.getElementById('prof-height').value) || 175;
      const weight = parseFloat(document.getElementById('prof-weight').value) || 75;
      const targetWeight = parseFloat(document.getElementById('prof-target-weight').value) || 80;
      const goal = document.getElementById('prof-goal').value;
      const level = document.getElementById('prof-level').value;
      const weekly = parseInt(document.getElementById('prof-weekly-workouts').value) || 4;
      const reminderEnabled = document.getElementById('prof-reminder-enabled').checked ? 1 : 0;
      const reminderTime = document.getElementById('prof-reminder-time').value || '20:00';

      if (!currentUser) {
        const guestProfile = {
          gender,
          age,
          height_cm: height,
          current_weight_kg: weight,
          target_weight_kg: targetWeight,
          fitness_goal: goal,
          fitness_level: level,
          target_weekly_workouts: weekly,
          daily_reminder_enabled: reminderEnabled,
          daily_reminder_time: reminderTime
        };
        localStorage.setItem('guest_profile', JSON.stringify(guestProfile));
        showNotification('مشخصات و اهداف ذخیره شدند', 'success');
        await loadProfileData();
        if (typeof loadSmartSuggestions === 'function') {
          await loadSmartSuggestions();
        }
        return;
      }

      try {
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gender,
            age,
            height_cm: height,
            current_weight_kg: weight,
            target_weight_kg: targetWeight,
            fitness_goal: goal,
            fitness_level: level,
            target_weekly_workouts: weekly,
            daily_reminder_enabled: reminderEnabled,
            daily_reminder_time: reminderTime
          })
        });

        const data = await res.json();
        if (data.success) {
          showNotification('اطلاعات و اهداف با موفقیت بروزرسانی شدند', 'success');
          await loadProfileData();
          if (typeof loadSmartSuggestions === 'function') {
            await loadSmartSuggestions();
          }
        }
      } catch (e) {
        showNotification('خطا در ذخیره اطلاعات پروفایل', 'error');
      }
    }

    async function submitDailyLog() {
      const weight = parseFloat(document.getElementById('daily-weight-input').value);
      const water = parseFloat(document.getElementById('daily-water-input').value) || 0;
      const notes = document.getElementById('daily-notes-input').value.trim();

      if (!weight || weight <= 0) {
        showNotification('لطفاً وزن امروز را وارد نمایید', 'warning');
        return;
      }

      if (!currentUser) {
        const todayStr = new Date().toISOString().split('T')[0];
        const guestLogs = JSON.parse(localStorage.getItem('guest_daily_logs') || '[]');
        const existingIdx = guestLogs.findIndex(l => l.log_date === todayStr);
        const newLog = {
          id: 'guest-log-' + Date.now(),
          log_date: todayStr,
          weight_kg: weight,
          water_liters: water,
          notes: notes
        };
        if (existingIdx >= 0) {
          guestLogs[existingIdx] = newLog;
        } else {
          guestLogs.unshift(newLog);
        }
        localStorage.setItem('guest_daily_logs', JSON.stringify(guestLogs));

        // Update current guest weight
        const guestProfile = JSON.parse(localStorage.getItem('guest_profile') || '{}');
        guestProfile.current_weight_kg = weight;
        localStorage.setItem('guest_profile', JSON.stringify(guestProfile));

        confetti({ colors: PLATE_COLORS, particleCount: 100, spread: 60, origin: { y: 0.6 } });
        showNotification('ثبت روزانه با موفقیت انجام شد!', 'success');
        await loadProfileData();
        if (typeof loadSmartSuggestions === 'function') {
          await loadSmartSuggestions();
        }
        return;
      }

      try {
        const res = await fetch('/api/profile/daily-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            weight_kg: weight,
            water_liters: water,
            notes: notes
          })
        });

        const data = await res.json();
        if (data.success) {
          confetti({ colors: PLATE_COLORS, particleCount: 100, spread: 60, origin: { y: 0.6 } });
          showNotification('ثبت روزانه با موفقیت انجام شد!', 'success');
          await loadProfileData();
          if (typeof loadSmartSuggestions === 'function') {
            await loadSmartSuggestions();
          }
        }
      } catch (e) {
        showNotification('خطا در ثبت روزانه', 'error');
      }
    }

    // --- Browser Notifications & Daily Reminders ---
    function checkBrowserNotificationState() {
      const btnText = document.getElementById('notif-perm-btn-text');
      if (!('Notification' in window)) {
        if (btnText) btnText.innerText = 'عدم پشتیبانی مرورگر از اعلان';
        return;
      }
      if (Notification.permission === 'granted') {
        if (btnText) btnText.innerText = 'اعلان مرورگر فعال است ✓';
      }
    }

    async function requestNotificationPermission() {
      if (!('Notification' in window)) {
        showConfirmDialog({
          title: 'عدم پشتیبانی مرورگر',
          message: 'مرورگر شما از سیستم اعلان وب پشتیبانی نمی‌کند.',
          isAlertOnly: true,
          color: 'emerald',
          icon: 'bell',
          confirmText: 'متوجه شدم'
        });
        return;
      }

      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          showNotification('اعلان‌های مرورگر فعال شدند!', 'success');
          checkBrowserNotificationState();
          new Notification('جسم و اندیشه', {
            body: 'یادآور روزانه فعال شد. آماده تمرین و ثبت پیشرفت باشید!',
            icon: 'https://cdn-icons-png.flaticon.com/512/2936/2936886.png'
          });
        } else {
          showNotification('دسترسی اعلان تایید نشد', 'warning');
        }
      } catch (e) {}
    }

    function scheduleDailyReminderCheck(profile) {
      if (!profile || !profile.daily_reminder_enabled) return;
      if (!('Notification' in window) || Notification.permission !== 'granted') return;

      const now = new Date();
      const currentHour = String(now.getHours()).padStart(2, '0');
      const currentMin = String(now.getMinutes()).padStart(2, '0');
      const currentHourMin = currentHour + ':' + currentMin;
      const reminderTime = profile.daily_reminder_time || '20:00';

      const lastNotifDate = localStorage.getItem('last_daily_reminder_notified');
      const todayDate = now.toISOString().split('T')[0];

      if (currentHourMin >= reminderTime && lastNotifDate !== todayDate) {
        localStorage.setItem('last_daily_reminder_notified', todayDate);
        new Notification('جسم و اندیشه | یادآور روزانه', {
          body: 'قهرمان، وقتشه وضعیت امروزت رو در سامانه ثبت کنی!',
          icon: 'https://cdn-icons-png.flaticon.com/512/2936/2936886.png'
        });
      }
    }

    // --- Program Share & QR Code Generation ---
    async function shareRoutine(routineId, title) {
      const shareUrl = window.location.origin + '/?share_routine=' + encodeURIComponent(routineId);
      
      // 1. Copy link automatically to clipboard
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(shareUrl);
        } catch (e) {}
      }

      // 2. Show copy notifier toast
      showNotification('✓ لینک برنامه در کلیپ‌بورد کپی شد!', 'success');

      // 3. Open QR Code modal
      const titleElem = document.getElementById('share-qr-title');
      const urlInput = document.getElementById('share-qr-url');
      const imgElem = document.getElementById('share-qr-img');
      const modal = document.getElementById('share-qr-modal');

      if (titleElem) titleElem.innerText = 'برنامه: ' + (title || 'تمرینی');
      if (urlInput) urlInput.value = shareUrl;
      if (imgElem) {
        imgElem.src = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(shareUrl) + '&margin=1';
      }
      if (modal) {
        modal.classList.remove('hidden');
        lockBodyScroll();
        lucide.createIcons();
      }
    }

    async function copyShareQrUrl() {
      const urlInput = document.getElementById('share-qr-url');
      if (urlInput && urlInput.value) {
        try {
          await navigator.clipboard.writeText(urlInput.value);
          showNotification('✓ لینک برنامه مجدداً در کلیپ‌بورد کپی شد!', 'success');
        } catch (e) {
          urlInput.select();
          document.execCommand('copy');
          showNotification('✓ لینک کپی شد!', 'success');
        }
      }
    }

    function closeShareQrModal() {
      document.getElementById('share-qr-modal')?.classList.add('hidden');
      unlockBodyScroll();
    }

    async function openSharedRoutinePreview(routineId) {
      try {
        const res = await fetch('/api/routines/share/' + routineId);
        if (!res.ok) {
          showNotification('برنامه تمرینی مورد نظر یافت نشد', 'error');
          return;
        }
        const data = await res.json();
        currentSharedRoutine = data.routine;

        document.getElementById('shared-routine-title').innerText = currentSharedRoutine.title;
        document.getElementById('shared-routine-desc').innerText = currentSharedRoutine.description || '';

        const exContainer = document.getElementById('shared-routine-exercises');
        const exercises = currentSharedRoutine.exercises || [];

        if (exercises.length === 0) {
          exContainer.innerHTML = '<p class="text-xs text-zinc-500">حرکتی در این برنامه ثبت نشده است.</p>';
        } else {
          exContainer.innerHTML = exercises.map((ex, idx) => {
            const nameFa = ex.name_fa || ex.exercise_name_fa || ex.name_en || ex.exercise_name_en || 'حرکت';
            const nameEn = ex.name_en || ex.exercise_name_en || '';
            const sets = Number(ex.target_sets || ex.sets) || 4;
            const reps = Number(ex.target_reps || ex.reps) || 10;
            return \`
            <div class="card-glass-subtle p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <img src="\${ex.gif_url || ''}" class="w-9 h-9 rounded-lg object-cover bg-zinc-900 border border-white/10" alt="">
                <div>
                  <h6 class="font-bold text-xs text-white flex items-baseline gap-1.5 flex-wrap">
                    <span>\${toPersianDigits(idx + 1)}. \${nameFa}</span>
                    \${nameEn ? \`<span class="text-[10px] text-zinc-400 font-mono font-normal">(\${nameEn})</span>\` : ''}
                  </h6>
                </div>
              </div>
              <span class="badge badge-emerald font-mono">
                \${toPersianDigits(sets)}×\${toPersianDigits(reps)}
              </span>
            </div>
          \`;}).join('');
        }

        const btnContainer = document.getElementById('shared-import-btn-container');
        if (currentUser) {
          btnContainer.innerHTML = \`
            <button onclick="importRoutine('\${currentSharedRoutine.id}')" class="btn btn-primary btn-md w-full glow-emerald">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>افزودن این برنامه به برنامه‌های من</span>
            </button>
          \`;
        } else {
          btnContainer.innerHTML = \`
            <div class="space-y-2">
              <button onclick="importGuestRoutine('\${currentSharedRoutine.id}')" class="btn btn-primary btn-md w-full glow-emerald">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                <span>ذخیره در برنامه‌های من</span>
              </button>
              <button onclick="loginAndImportPending('\${currentSharedRoutine.id}')" class="btn btn-secondary btn-md w-full">
                <i data-lucide="log-in" class="w-3.5 h-3.5"></i>
                <span>ورود با گوگل برای همگام‌سازی ابری</span>
              </button>
            </div>
          \`;
        }

        document.getElementById('shared-routine-modal').classList.remove('hidden');
        lockBodyScroll();
        lucide.createIcons();
      } catch (err) {}
    }

    function closeSharedRoutineModal() {
      document.getElementById('shared-routine-modal').classList.add('hidden');
      unlockBodyScroll();
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    function importGuestRoutine(routineId) {
      if (!currentSharedRoutine) return;
      const local = JSON.parse(localStorage.getItem('guest_routines') || '[]');
      if (!local.find(r => r.id === currentSharedRoutine.id)) {
        local.unshift(currentSharedRoutine);
        localStorage.setItem('guest_routines', JSON.stringify(local));
      }
      confetti({ colors: PLATE_COLORS, particleCount: 120, spread: 70, origin: { y: 0.6 } });
      closeSharedRoutineModal();
      showNotification('برنامه با موفقیت در دستگاه شما ذخیره شد!', 'success');
      loadRoutines();
      loadDashboardRoutines();
      switchTab('movements');
    }

    function loginAndImportPending(routineId) {
      sessionStorage.setItem('pending_import_routine', routineId);
      window.location.href = '/api/auth/google';
    }

    async function importRoutine(routineId) {
      try {
        const res = await fetch('/api/routines/import/' + routineId, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.success) {
          confetti({ colors: PLATE_COLORS, particleCount: 120, spread: 70, origin: { y: 0.6 } });
          closeSharedRoutineModal();
          showNotification(data.message || 'برنامه با موفقیت اضافه شد!', 'success');
          await loadRoutines();
          await loadDashboardRoutines();
          switchTab('movements');
        } else {
          showNotification(data.error || 'خطا در افزودن برنامه', 'error');
        }
      } catch (e) {
        showNotification('خطا در افزودن برنامه به پروفایل', 'error');
      }
    }

    ${renderPresetsClientScript()}
  </script>
</body>
</html>
`;
}
