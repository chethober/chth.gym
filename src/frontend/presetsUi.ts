// ============================================================================
// Smart Preloaded Workout Presets & BMI/Goal Suggestions UI Components
// Evidence-based programming, Real-Time Calibrator, and Dynamic Presets Catalog
// ============================================================================

export function renderSmartSuggestionsSection(): string {
  return `
    <!-- SMART WORKOUT SUGGESTIONS (BMI & FITNESS GOAL) -->
    <div id="dash-smart-suggestions-section" class="card-glass p-5 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-[color:var(--line)]">
        <div class="flex items-center gap-2.5">
          <div class="icon-box icon-box-emerald w-9 h-9 shrink-0">
            <i data-lucide="sparkles" class="w-5 h-5 text-emerald-400"></i>
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-sm font-bold text-white">پیشنهاد برای شما</h3>
              <span id="dash-suggest-badge-bmi" class="badge badge-emerald">شاخص BMI: --</span>
              <span id="dash-suggest-badge-goal" class="badge badge-cyan">هدف: --</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          <button type="button" onclick="toggleQuickCalibrator()" class="btn btn-secondary btn-sm">
            <i data-lucide="sliders" class="w-3.5 h-3.5 text-emerald-400"></i>
            <span>شبیه‌ساز و تغییر سریع شاخص</span>
          </button>
          <button type="button" onclick="openPreloadedPresetsSection()" class="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition">
            <span>بانک کامل برنامه‌ها</span>
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <!-- Quick Interactive BMI & Goal Calibrator Panel (Collapsible) -->
      <div id="dash-quick-calibrator-panel" class="hidden card-glass-subtle p-4 space-y-3.5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-white flex items-center gap-1.5">
            <i data-lucide="sliders-horizontal" class="w-3.5 h-3.5 text-emerald-400"></i>
            <span>شبیه‌ساز آنی فیزیولوژی و هدف تمرینی</span>
          </span>
          <span id="quick-calibrator-bmi-tag" class="badge badge-emerald font-mono">BMI: --</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <!-- Height Slider / Input -->
          <div class="space-y-1">
            <div class="flex justify-between text-zinc-300 text-[11px]">
              <span>قد:</span>
              <span id="quick-calibrator-height-val" class="font-mono text-emerald-400">۱۷۵ cm</span>
            </div>
            <input type="range" id="quick-calibrator-height" min="140" max="215" value="175" oninput="updateQuickCalibratorBmi()" class="range">
          </div>

          <!-- Weight Slider / Input -->
          <div class="space-y-1">
            <div class="flex justify-between text-zinc-300 text-[11px]">
              <span>وزن:</span>
              <span id="quick-calibrator-weight-val" class="font-mono text-emerald-400">۷۵ kg</span>
            </div>
            <input type="range" id="quick-calibrator-weight" min="40" max="150" value="75" oninput="updateQuickCalibratorBmi()" class="range">
          </div>

          <!-- Goal Dropdown -->
          <div class="space-y-1">
            <label class="text-[11px] text-zinc-300 block">هدف ورزشی:</label>
            <select id="quick-calibrator-goal" onchange="updateQuickCalibratorBmi()" class="input-styled">
              <option value="hypertrophy">هایپرتروفی و عضله‌سازی</option>
              <option value="fat_loss">چربی‌سوزی و کات</option>
              <option value="strength">افزایش رکورد و قدرت</option>
              <option value="endurance">استقامت و چابکی</option>
              <option value="general_health">سلامت عمومی و قامت</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-1 divider-top">
          <button type="button" onclick="resetQuickCalibrator()" class="btn btn-ghost btn-sm">بازنشانی به پروفایل من</button>
          <button type="button" onclick="applyQuickCalibrator()" class="btn btn-primary btn-sm">
            <i data-lucide="check" class="w-3.5 h-3.5"></i>
            <span>تحلیل و مشاهده آنی پیشنهادات</span>
          </button>
        </div>
      </div>

      <!-- Scientific Rationale Insight Box -->
      <div id="dash-suggest-insight-box" class="callout p-3 flex items-start gap-2.5 text-[13px]">
        <i data-lucide="info" class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"></i>
        <p id="dash-suggest-insight-text" class="leading-relaxed">در حال تحلیل شاخص بدنی و بارگذاری برنامه‌های متناسب با فیزیولوژی شما...</p>
      </div>

      <!-- Primary Suggestions Cards Container -->
      <div id="dash-suggest-cards-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="col-span-full py-6 text-center text-xs text-zinc-500">
          <i data-lucide="loader-2" class="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400"></i>
          در حال دریافت پیشنهادات اختصاصی...
        </div>
      </div>
    </div>
  `;
}

export function renderPreloadedPresetsExplorer(): string {
  return `
    <!-- PRELOADED SMART WORKOUT PRESETS EXPLORER -->
    <div id="preloaded-presets-explorer" class="space-y-4 pt-1">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <div class="icon-box icon-box-emerald w-8 h-8 shrink-0">
            <i data-lucide="sparkles" class="w-4 h-4 text-emerald-400"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <span>برنامه‌های آماده</span>
            </h3>
          </div>
        </div>
      </div>

      <!-- Interactive Filter & Search Bar for Presets -->
      <div class="card-glass p-4 space-y-3.5">
        
        <!-- Live Search Input -->
        <div class="input-icon">
          <i data-lucide="search"></i>
          <input 
            type="text" 
            id="preset-search-input" 
            oninput="onPresetSearchChange(this.value)" 
            placeholder="جستجو در نام برنامه، حرکات، عضلات یا تگ‌ها (مثلاً: اسکوات، دمبل، حامی مفاصل، فول‌بادی)..." 
            class="input-styled"
          >
        </div>

        <!-- Filter 1: BMI Category -->
        <div class="space-y-1.5 pt-1">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
              <i data-lucide="scale" class="w-3.5 h-3.5 text-emerald-400"></i>
              <span>BMI</span>
            </span>
            <span id="presets-active-bmi-label" class="text-[10px] text-emerald-400 font-mono"></span>
          </div>
          <div id="preset-bmi-filters" class="flex flex-wrap items-center gap-1.5">
            <button type="button" onclick="setPresetBmiFilter('all')" data-bmi="all" class="preset-bmi-btn chip is-selected">همه شاخص‌ها</button>
            <button type="button" onclick="setPresetBmiFilter('underweight')" data-bmi="underweight" class="preset-bmi-btn chip">کم‌وزن (BMI &lt; 18.5)</button>
            <button type="button" onclick="setPresetBmiFilter('normal')" data-bmi="normal" class="preset-bmi-btn chip">وزن متناسب (18.5 - 24.9)</button>
            <button type="button" onclick="setPresetBmiFilter('overweight')" data-bmi="overweight" class="preset-bmi-btn chip">اضافه وزن (25.0 - 29.9)</button>
            <button type="button" onclick="setPresetBmiFilter('obese')" data-bmi="obese" class="preset-bmi-btn chip">وزن بالا / حامی مفاصل (≥ 30)</button>
          </div>
        </div>

        <!-- Filter 2: Fitness Goal -->
        <div class="space-y-1.5 pt-2 divider-top">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
              <i data-lucide="target" class="w-3.5 h-3.5 text-cyan-400"></i>
              <span>هدف</span>
            </span>
            <span id="presets-active-goal-label" class="text-[10px] text-cyan-400 font-mono"></span>
          </div>
          <div id="preset-goal-filters" class="flex flex-wrap items-center gap-1.5">
            <button type="button" onclick="setPresetGoalFilter('all')" data-goal="all" class="preset-goal-btn chip is-selected">همه اهداف</button>
            <button type="button" onclick="setPresetGoalFilter('hypertrophy')" data-goal="hypertrophy" class="preset-goal-btn chip">هایپرتروفی و حجم</button>
            <button type="button" onclick="setPresetGoalFilter('fat_loss')" data-goal="fat_loss" class="preset-goal-btn chip">چربی‌سوزی و کات</button>
            <button type="button" onclick="setPresetGoalFilter('strength')" data-goal="strength" class="preset-goal-btn chip">افزایش رکورد و قدرت</button>
            <button type="button" onclick="setPresetGoalFilter('endurance')" data-goal="endurance" class="preset-goal-btn chip">استقامت عضلانی</button>
            <button type="button" onclick="setPresetGoalFilter('general_health')" data-goal="general_health" class="preset-goal-btn chip">سلامت عمومی و قامت</button>
          </div>
        </div>

        <!-- Filter 3: Equipment Filter -->
        <div class="space-y-1.5 pt-2 divider-top">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
              <i data-lucide="dumbbell" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>تجهیزات</span>
            </span>
          </div>
          <div id="preset-equipment-filters" class="flex flex-wrap items-center gap-1.5">
            <button type="button" onclick="setPresetEquipmentFilter('all')" data-eq="all" class="preset-eq-btn chip is-selected">همه تجهیزات</button>
            <button type="button" onclick="setPresetEquipmentFilter('dumbbell')" data-eq="dumbbell" class="preset-eq-btn chip">تمرکز بر دمبل</button>
            <button type="button" onclick="setPresetEquipmentFilter('barbell')" data-eq="barbell" class="preset-eq-btn chip">تمرکز بر هالتر</button>
            <button type="button" onclick="setPresetEquipmentFilter('machine_cable')" data-eq="machine_cable" class="preset-eq-btn chip">دستگاه و سیم‌کش</button>
            <button type="button" onclick="setPresetEquipmentFilter('bodyweight')" data-eq="bodyweight" class="preset-eq-btn chip">وزن بدن (بدون تجهیزات)</button>
          </div>
        </div>

      </div>

      <!-- Presets Cards Grid -->
      <div id="preloaded-presets-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Populated via renderPreloadedPresets() -->
      </div>
    </div>
  `;
}

export function renderProfileSuggestionsBanner(): string {
  return `
    <!-- Personalized Workout Recommendations Callout Banner -->
    <div id="profile-suggested-workouts-banner" class="card-glass p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-accent">
      <div class="flex items-center gap-3">
        <div class="icon-box icon-box-emerald w-10 h-10 shrink-0">
          <i data-lucide="sparkles" class="w-5 h-5 text-emerald-400"></i>
        </div>
        <div>
          <h4 class="text-xs font-bold text-white flex items-center gap-2">
            <span>برنامه‌های تمرینی توصیه شده برای شما</span>
            <span id="prof-suggest-bmi-tag" class="badge badge-emerald">--</span>
          </h4>
          <p id="prof-suggest-banner-desc" class="text-[11px] text-zinc-300 mt-0.5">
            الگوهای تمرینی اختصاصی بر اساس مشخصات بدنی و هدف ثبت شده شما آماده شده‌اند.
          </p>
        </div>
      </div>
      <button type="button" onclick="openPreloadedPresetsSection()" class="btn btn-primary btn-sm whitespace-nowrap shrink-0">
        <i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i>
        <span>مشاهده و شروع برنامه</span>
      </button>
    </div>
  `;
}

export function renderPresetsClientScript(): string {
  return `
    // =========================================================================
    // SMART PRELOADED WORKOUTS & BMI/GOAL SUGGESTIONS LOGIC
    // =========================================================================
    let preloadedPresetsCache = [];
    let currentPresetBmiFilter = 'all';
    let currentPresetGoalFilter = 'all';
    let currentPresetEquipmentFilter = 'all';
    let presetSearchQuery = '';
    let expandedPresetCards = {};
    let latestSuggestionsData = null;

    async function loadSmartSuggestions(customBmi, customGoal) {
      try {
        let url = '/api/routines/suggestions';
        const params = [];
        
        if (customBmi !== undefined && customGoal !== undefined) {
          params.push('bmi=' + customBmi);
          params.push('goal=' + customGoal);
        } else if (!currentUser) {
          const guestProfile = JSON.parse(localStorage.getItem('guest_profile') || '{}');
          const height = guestProfile.height_cm || 175;
          const weight = guestProfile.current_weight_kg || 75;
          const goal = guestProfile.fitness_goal || 'hypertrophy';
          const bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);
          params.push('bmi=' + bmi);
          params.push('goal=' + goal);
        }

        if (params.length > 0) {
          url += '?' + params.join('&');
        }

        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        latestSuggestionsData = data;

        if (data.all_presets) {
          preloadedPresetsCache = data.all_presets;
        }

        // Update Dashboard Badges & Insight
        const bmiBadge = document.getElementById('dash-suggest-badge-bmi');
        if (bmiBadge && data.user_metrics) {
          bmiBadge.innerText = 'شاخص BMI: ' + toPersianDigits(data.user_metrics.bmi) + ' (' + data.user_metrics.category_fa + ')';
        }

        const goalBadge = document.getElementById('dash-suggest-badge-goal');
        if (goalBadge && data.user_metrics) {
          goalBadge.innerText = 'هدف: ' + data.user_metrics.goal_fa;
        }

        const insightText = document.getElementById('dash-suggest-insight-text');
        if (insightText && data.scientific_tips && data.scientific_tips.length > 0) {
          insightText.innerHTML = '<strong>نکته علمی فیزیولوژی:</strong> ' + data.scientific_tips[0];
        }

        // Update Profile Tab Callout Tag
        const profTag = document.getElementById('prof-suggest-bmi-tag');
        if (profTag && data.user_metrics) {
          profTag.innerText = 'شاخص ' + toPersianDigits(data.user_metrics.bmi) + ' • ' + data.user_metrics.category_fa;
        }
        const profDesc = document.getElementById('prof-suggest-banner-desc');
        if (profDesc && data.user_metrics) {
          profDesc.innerText = data.user_metrics.description_fa;
        }

        renderSmartDashboardSuggestions(data.primary_matches || []);
      } catch (err) {}
    }

    function renderSmartDashboardSuggestions(presets) {
      const container = document.getElementById('dash-suggest-cards-container');
      if (!container) return;

      if (!presets || presets.length === 0) {
        container.innerHTML = '<p class="text-xs text-zinc-500 col-span-full py-4 text-center">برنامه‌ای برای نمایش یافت نشد.</p>';
        return;
      }

      container.innerHTML = presets.slice(0, 2).map(function(preset) {
        return renderPresetCard(preset, true);
      }).join('');
      lucide.createIcons();
    }

    // --- Quick BMI & Goal Calibrator Panel Controls ---
    function toggleQuickCalibrator() {
      const panel = document.getElementById('dash-quick-calibrator-panel');
      if (!panel) return;
      panel.classList.toggle('hidden');
      if (!panel.classList.contains('hidden')) {
        // Initialize values from current user profile
        let height = 175;
        let weight = 75;
        let goal = 'hypertrophy';
        if (currentUser && currentProfile) {
          height = currentProfile.height_cm || 175;
          weight = currentProfile.current_weight_kg || 75;
          goal = currentProfile.fitness_goal || 'hypertrophy';
        } else {
          const gp = JSON.parse(localStorage.getItem('guest_profile') || '{}');
          height = gp.height_cm || 175;
          weight = gp.current_weight_kg || 75;
          goal = gp.fitness_goal || 'hypertrophy';
        }

        const hIn = document.getElementById('quick-calibrator-height');
        const wIn = document.getElementById('quick-calibrator-weight');
        const gIn = document.getElementById('quick-calibrator-goal');
        if (hIn) hIn.value = height;
        if (wIn) wIn.value = weight;
        if (gIn) gIn.value = goal;
        updateQuickCalibratorBmi();
      }
    }

    function updateQuickCalibratorBmi() {
      const hIn = document.getElementById('quick-calibrator-height');
      const wIn = document.getElementById('quick-calibrator-weight');
      const hVal = document.getElementById('quick-calibrator-height-val');
      const wVal = document.getElementById('quick-calibrator-weight-val');
      const tag = document.getElementById('quick-calibrator-bmi-tag');

      if (!hIn || !wIn) return;
      const h = parseFloat(hIn.value);
      const w = parseFloat(wIn.value);
      if (hVal) hVal.innerText = toPersianDigits(h) + ' cm';
      if (wVal) wVal.innerText = toPersianDigits(w) + ' kg';

      const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
      let cat = 'وزن متناسب';
      let cls = 'badge badge-emerald';
      if (bmi < 18.5) {
        cat = 'کم‌وزن';
        cls = 'badge badge-blue';
      } else if (bmi >= 25.0 && bmi < 30.0) {
        cat = 'اضافه وزن';
        cls = 'badge badge-amber';
      } else if (bmi >= 30.0) {
        cat = 'وزن بالا (حامی مفاصل)';
        cls = 'badge badge-purple';
      }

      if (tag) {
        tag.className = cls + ' font-mono text-[10px]';
        tag.innerText = 'BMI: ' + toPersianDigits(bmi) + ' (' + cat + ')';
      }
    }

    async function applyQuickCalibrator() {
      const hIn = document.getElementById('quick-calibrator-height');
      const wIn = document.getElementById('quick-calibrator-weight');
      const gIn = document.getElementById('quick-calibrator-goal');
      if (!hIn || !wIn || !gIn) return;

      const h = parseFloat(hIn.value);
      const w = parseFloat(wIn.value);
      const goal = gIn.value;
      const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);

      showNotification('پیشنهادها بر اساس شاخص ' + toPersianDigits(bmi) + ' بروزرسانی شدند', 'success');
      await loadSmartSuggestions(bmi, goal);
    }

    async function resetQuickCalibrator() {
      toggleQuickCalibrator();
      await loadSmartSuggestions();
    }

    async function loadPreloadedPresets() {
      if (preloadedPresetsCache.length === 0) {
        try {
          const res = await fetch('/api/routines/suggestions');
          if (res.ok) {
            const data = await res.json();
            preloadedPresetsCache = data.all_presets || [];
            latestSuggestionsData = data;
          }
        } catch (e) {}
      }

      renderPreloadedPresets();
    }

    function onPresetSearchChange(val) {
      presetSearchQuery = (val || '').toLowerCase().trim();
      renderPreloadedPresets();
    }

    function renderPreloadedPresets() {
      const grid = document.getElementById('preloaded-presets-grid');
      if (!grid) return;

      let filtered = preloadedPresetsCache;
      
      // Filter by BMI
      if (currentPresetBmiFilter !== 'all') {
        filtered = filtered.filter(function(p) {
          return p.target_bmi_category === currentPresetBmiFilter || p.target_bmi_category === 'all';
        });
      }
      
      // Filter by Goal
      if (currentPresetGoalFilter !== 'all') {
        filtered = filtered.filter(function(p) {
          return p.target_goal === currentPresetGoalFilter || p.target_goal === 'all';
        });
      }

      // Filter by Equipment
      if (currentPresetEquipmentFilter !== 'all') {
        filtered = filtered.filter(function(p) {
          const exercises = p.exercises || [];
          if (currentPresetEquipmentFilter === 'dumbbell') {
            return exercises.some(function(e) { return e.equipment === 'dumbbell'; });
          } else if (currentPresetEquipmentFilter === 'barbell') {
            return exercises.some(function(e) { return e.equipment === 'barbell'; });
          } else if (currentPresetEquipmentFilter === 'machine_cable') {
            return exercises.some(function(e) { return e.equipment === 'machine' || e.equipment === 'cable'; });
          } else if (currentPresetEquipmentFilter === 'bodyweight') {
            return exercises.some(function(e) { return e.equipment === 'bodyweight'; });
          }
          return true;
        });
      }

      // Filter by Search Query
      if (presetSearchQuery) {
        filtered = filtered.filter(function(p) {
          const matchTitle = (p.title || '').toLowerCase().includes(presetSearchQuery) ||
                             (p.title_en || '').toLowerCase().includes(presetSearchQuery);
          const matchDesc = (p.description || '').toLowerCase().includes(presetSearchQuery) ||
                            (p.rationale_fa || '').toLowerCase().includes(presetSearchQuery);
          const matchTags = (p.tags || []).some(function(t) { return t.toLowerCase().includes(presetSearchQuery); });
          const matchEx = (p.exercises || []).some(function(ex) {
            return (ex.name_fa || '').toLowerCase().includes(presetSearchQuery) ||
                   (ex.name_en || '').toLowerCase().includes(presetSearchQuery) ||
                   (ex.notes_fa || '').toLowerCase().includes(presetSearchQuery);
          });
          return matchTitle || matchDesc || matchTags || matchEx;
        });
      }

      if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full card-glass p-6 text-center space-y-2">' +
          '<i data-lucide="filter" class="w-6 h-6 mx-auto text-zinc-500"></i>' +
          '<p class="text-xs text-zinc-400 font-medium">برنامه‌ای منطبق با جستجو یا فیلترهای انتخابی یافت نشد.</p>' +
          '<button type="button" onclick="setPresetBmiFilter(\\'all\\'); setPresetGoalFilter(\\'all\\'); setPresetEquipmentFilter(\\'all\\'); document.getElementById(\\'preset-search-input\\').value=\\'\\'; onPresetSearchChange(\\'\\');" class="btn btn-secondary btn-sm">پاکسازی همه فیلترها</button>' +
          '</div>';
        lucide.createIcons();
        return;
      }

      grid.innerHTML = filtered.map(function(preset) {
        return renderPresetCard(preset, false);
      }).join('');
      lucide.createIcons();
    }

    function setPresetBmiFilter(bmiCat) {
      currentPresetBmiFilter = bmiCat;
      document.querySelectorAll('.preset-bmi-btn').forEach(function(btn) {
        btn.classList.toggle('is-selected', btn.getAttribute('data-bmi') === bmiCat);
      });
      renderPreloadedPresets();
    }

    function setPresetGoalFilter(goal) {
      currentPresetGoalFilter = goal;
      document.querySelectorAll('.preset-goal-btn').forEach(function(btn) {
        btn.classList.toggle('is-selected', btn.getAttribute('data-goal') === goal);
      });
      renderPreloadedPresets();
    }

    function setPresetEquipmentFilter(eq) {
      currentPresetEquipmentFilter = eq;
      document.querySelectorAll('.preset-eq-btn').forEach(function(btn) {
        btn.classList.toggle('is-selected', btn.getAttribute('data-eq') === eq);
      });
      renderPreloadedPresets();
    }

    function togglePresetExercisesExpand(presetId) {
      expandedPresetCards[presetId] = !expandedPresetCards[presetId];
      if (document.getElementById('dash-suggest-cards-container')) {
        renderSmartDashboardSuggestions(latestSuggestionsData?.primary_matches || []);
      }
    }

    function renderPresetCard(preset, isCompact) {
      const isJointFriendly = preset.id.indexOf('joint_friendly') !== -1 || preset.target_bmi_category === 'obese';
      const badgeStyle = isJointFriendly ? 'badge badge-purple' : 'badge badge-emerald';

      const exercises = preset.exercises || [];
      const isExpanded = !!expandedPresetCards[preset.id];
      const displayExercises = (isCompact && !isExpanded) ? exercises.slice(0, 4) : exercises;

      const totalSets = exercises.reduce(function(sum, ex) {
        return sum + (Number(ex.target_sets) || 0);
      }, 0);

      const exercisesHtml = displayExercises.map(function(ex, i) {
        const notesHtml = ex.notes_fa ? (
          '<div class="text-[10px] text-zinc-400 leading-tight pt-1 flex items-start gap-1 divider-top mt-1">' +
            '<i data-lucide="lightbulb" class="w-3 h-3 text-amber-400 shrink-0 mt-0.5"></i>' +
            '<span>' + ex.notes_fa + '</span>' +
          '</div>'
        ) : '';

        return '<div class="card-glass-subtle p-2.5 space-y-1">' +
          '<div class="flex items-center justify-between gap-2">' +
            '<div class="flex items-center gap-2 min-w-0">' +
              '<img src="' + ex.gif_url + '" loading="lazy" class="w-8 h-8 rounded-lg object-cover bg-zinc-200 dark:bg-zinc-900 border border-white/10 shrink-0" alt="" onerror="this.src=\\'/icons/icon-192x192.png\\'">' +
              '<div class="min-w-0">' +
                '<div class="flex items-center gap-1.5">' +
                  '<span class="text-zinc-500 font-mono text-[10px]">' + toPersianDigits(i + 1) + '.</span>' +
                  '<span class="text-zinc-800 dark:text-zinc-200 font-bold text-xs truncate">' + ex.name_fa + '</span>' +
                '</div>' +
                '<span class="badge badge-zinc">' + ex.equipment_fa + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="flex items-center gap-1.5 shrink-0 text-left">' +
              '<span class="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs">' + toPersianDigits(ex.target_sets) + '×' + toPersianDigits(ex.target_reps) + '</span>' +
              '<span class="text-[10px] text-zinc-500 font-mono bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">' + toPersianDigits(ex.rest_seconds) + 'ث</span>' +
            '</div>' +
          '</div>' +
          notesHtml +
        '</div>';
      }).join('');

      let moreExercisesAction = '';
      if (isCompact && exercises.length > 4) {
        if (!isExpanded) {
          moreExercisesAction = '<button type="button" onclick="togglePresetExercisesExpand(\\'' + preset.id + '\\')" class="text-[11px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-bold text-center w-full pt-1 flex items-center justify-center gap-1 transition">' +
            '<span>+ ' + toPersianDigits(exercises.length - 4) + ' حرکت دیگر (مشاهده لیست کامل)</span>' +
            '<i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>' +
          '</button>';
        } else {
          moreExercisesAction = '<button type="button" onclick="togglePresetExercisesExpand(\\'' + preset.id + '\\')" class="text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-white font-medium text-center w-full pt-1 flex items-center justify-center gap-1 transition">' +
            '<span>بستن لیست کامل</span>' +
            '<i data-lucide="chevron-up" class="w-3.5 h-3.5"></i>' +
          '</button>';
        }
      }

      const jointFriendlyBadge = isJointFriendly ? '<span class="badge badge-done"><i data-lucide="shield-check"></i>حامی مفاصل</span>' : '';

      return '<div class="card-glass-interactive p-4 sm:p-5 space-y-3 flex flex-col justify-between">' +
        '<div class="space-y-3">' +
          '<div class="flex items-center justify-between flex-wrap gap-1.5">' +
            '<div class="flex items-center gap-1.5 flex-wrap">' +
              '<span class="' + badgeStyle + '">' + preset.target_bmi_category_fa + '</span>' +
              '<span class="badge badge-cyan">' + preset.target_goal_fa + '</span>' +
              jointFriendlyBadge +
            '</div>' +
            '<div class="flex items-center gap-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">' +
              '<span class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3 text-zinc-400"></i>' + toPersianDigits(preset.estimated_duration_min) + ' دقیقه</span>' +
              '<span>•</span>' +
              '<span class="badge badge-zinc">مجموع ' + toPersianDigits(totalSets) + ' ست</span>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<h4 class="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">' + preset.title + '</h4>' +
            '<p class="text-[10px] text-zinc-400 font-mono mt-0.5">' + preset.title_en + '</p>' +
          '</div>' +
          '<p class="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">' + preset.description + '</p>' +
          '<div class="card-glass-subtle p-2.5 text-[11px] text-zinc-700 dark:text-zinc-300 leading-normal">' +
            '<strong class="text-emerald-600 dark:text-emerald-400">منطق علمی:</strong> ' + preset.rationale_fa +
          '</div>' +
          '<div class="space-y-1.5 pt-1">' +
            '<div class="flex items-center justify-between text-[11px] text-zinc-400 px-1">' +
              '<span>حرکات برنامه (' + toPersianDigits(exercises.length) + ' حرکت):</span>' +
              '<span>ست × تکرار (استراحت)</span>' +
            '</div>' +
            exercisesHtml +
            moreExercisesAction +
          '</div>' +
        '</div>' +
        '<div class="pt-3 divider-top flex flex-wrap items-center justify-between gap-2">' +
          '<div class="flex items-center gap-1.5">' +
            '<button type="button" onclick="importPresetToMyRoutines(\\'' + preset.id + '\\')" title="افزودن به برنامه‌های من" class="btn btn-secondary btn-sm">' +
              '<i data-lucide="bookmark-plus" class="w-3.5 h-3.5 text-emerald-400"></i>' +
              '<span>ذخیره در برنامه‌ها</span>' +
            '</button>' +
            '<button type="button" onclick="loadPresetIntoBuilder(\\'' + preset.id + '\\')" title="ویرایش و شخصی‌سازی در طراح" class="btn btn-ghost btn-sm">' +
              '<i data-lucide="edit-3" class="w-3.5 h-3.5"></i>' +
              '<span class="hidden sm:inline">شخصی‌سازی</span>' +
            '</button>' +
            '<button type="button" onclick="sharePreset(\\'' + preset.id + '\\')" title="اشتراک‌گذاری و کد QR" class="btn btn-ghost btn-sm">' +
              '<i data-lucide="qr-code" class="w-3.5 h-3.5"></i>' +
            '</button>' +
          '</div>' +
          '<button type="button" onclick="startPresetWorkout(\\'' + preset.id + '\\')" class="btn btn-primary btn-sm">' +
            '<i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i>' +
            '<span>اجرای تمرین</span>' +
          '</button>' +
        '</div>' +
      '</div>';
    }

    async function startPresetWorkout(presetId) {
      const preset = preloadedPresetsCache.find(function(p) { return p.id === presetId; });
      if (!preset) {
        showNotification('برنامه تمرینی یافت نشد', 'error');
        return;
      }

      // Check if an active workout session is currently ongoing
      if (activeSession) {
        const confirmed = await showConfirmDialog({
          title: 'تمرین فعال در حال اجرا',
          message: 'شما در حال حاضر یک جلسه تمرین فعال دارید («' + (activeSession.title || 'تمرین جاری') + '»). آیا مایلید جلسه قبلی را کنار گذاشته و برنامه «' + preset.title + '» را آغاز نمایید؟',
          confirmText: 'شروع برنامه جدید',
          cancelText: 'ادامه تمرین فعلی',
          color: 'emerald',
          icon: 'play'
        });
        if (!confirmed) return;

        if (currentUser && activeSession.user_id !== 'guest') {
          try {
            await fetch('/api/workouts/discard', { method: 'POST' });
          } catch (e) {}
        } else {
          localStorage.removeItem('jesm_guest_active_session');
        }
        activeSession = null;
      }

      if (currentUser) {
        try {
          const res = await fetch('/api/workouts/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ preset_id: presetId, title: preset.title })
          });
          const data = await res.json();
          if (data.success) {
            activeSession = data.session;
            switchTab('dashboard');
            showActiveWorkoutInDashboard(true);
            showNotification('برنامه «' + preset.title + '» آغاز شد! حرکات آماده ثبت هستند.', 'success');
          } else {
            showNotification(data.error || 'خطا در شروع تمرین', 'error');
          }
        } catch (e) {
          showNotification('خطا در اجرای برنامه تمرینی', 'error');
        }
      } else {
        // Guest mode direct start with planned exercises including form coaching tips
        try {
          const plannedExercises = (preset.exercises || []).map(function(ex) {
            return {
              exercise_id: ex.exercise_id,
              name_fa: ex.name_fa,
              name_en: ex.name_en,
              gif_url: ex.gif_url,
              category_fa: ex.category_fa,
              target_sets: Number(ex.target_sets) || 4,
              target_reps: Number(ex.target_reps) || 10,
              rest_seconds: Number(ex.rest_seconds) || 60,
              notes_fa: ex.notes_fa || ''
            };
          });

          activeSession = {
            id: 'guest-session-' + Date.now(),
            user_id: 'guest',
            title: preset.title,
            start_time: new Date().toISOString(),
            total_volume_kg: 0,
            planned_exercises: plannedExercises,
            set_logs: []
          };

          localStorage.setItem('jesm_guest_active_session', JSON.stringify(activeSession));
          switchTab('dashboard');
          showActiveWorkoutInDashboard(true);
          showNotification('برنامه «' + preset.title + '» فعال شد! حرکات آماده ثبت هستند.', 'success');
        } catch (err) {
          showNotification('خطا در شروع تمرین مهمان', 'error');
        }
      }
    }

    async function importPresetToMyRoutines(presetId) {
      const preset = preloadedPresetsCache.find(function(p) { return p.id === presetId; });
      if (!preset) {
        showNotification('برنامه یافت نشد', 'error');
        return;
      }

      if (currentUser) {
        try {
          const res = await fetch('/api/routines/suggestions/import/' + presetId, {
            method: 'POST'
          });
          const data = await res.json();
          if (data.success) {
            confetti({ colors: PLATE_COLORS, particleCount: 120, spread: 70, origin: { y: 0.6 } });
            showNotification(data.message || 'برنامه «' + preset.title + '» ذخیره شد!', 'success');
            await loadRoutines();
            await loadDashboardRoutines();
          } else {
            showNotification(data.error || 'خطا در ذخیره برنامه', 'error');
          }
        } catch (e) {
          showNotification('خطا در ارتباط با سرور', 'error');
        }
      } else {
        // Guest mode save
        const guestRoutines = JSON.parse(localStorage.getItem('guest_routines') || '[]');
        if (guestRoutines.some(function(r) { return r.title === preset.title; })) {
          showNotification('برنامه «' + preset.title + '» قبلاً در برنامه‌های شما ذخیره شده است.', 'info');
          return;
        }

        const newRoutine = {
          id: 'guest_routine_' + Date.now(),
          user_id: 'guest',
          title: preset.title,
          description: preset.description,
          created_at: new Date().toISOString(),
          exercises: (preset.exercises || []).map(function(ex) {
            return {
              exercise_id: ex.exercise_id,
              name_fa: ex.name_fa,
              name_en: ex.name_en,
              gif_url: ex.gif_url,
              category_fa: ex.category_fa,
              target_sets: ex.target_sets,
              target_reps: ex.target_reps,
              rest_seconds: ex.rest_seconds
            };
          })
        };

        guestRoutines.unshift(newRoutine);
        localStorage.setItem('guest_routines', JSON.stringify(guestRoutines));
        confetti({ colors: PLATE_COLORS, particleCount: 120, spread: 70, origin: { y: 0.6 } });
        showNotification('برنامه «' + preset.title + '» با موفقیت به برنامه‌های شما اضافه شد!', 'success');
        loadRoutines();
        loadDashboardRoutines();
      }
    }

    function loadPresetIntoBuilder(presetId) {
      const preset = preloadedPresetsCache.find(function(p) { return p.id === presetId; });
      if (!preset) {
        showNotification('برنامه یافت نشد', 'error');
        return;
      }

      draftProgramExercises = (preset.exercises || []).map(function(ex) {
        return {
          exercise_id: ex.exercise_id,
          id: ex.exercise_id,
          name_fa: ex.name_fa,
          name_en: ex.name_en,
          category: ex.category,
          category_fa: ex.category_fa,
          equipment: ex.equipment,
          equipment_fa: ex.equipment_fa,
          gif_url: ex.gif_url,
          target_sets: ex.target_sets,
          target_reps: ex.target_reps,
          rest_seconds: ex.rest_seconds
        };
      });

      const titleInput = document.getElementById('inline-routine-title');
      const descInput = document.getElementById('inline-routine-desc');
      if (titleInput) titleInput.value = preset.title;
      if (descInput) descInput.value = preset.description;

      renderInlineDraftExercises();
      switchTab('movements');
      
      // Delay scroll to prevent override by switchTab smooth scroll
      setTimeout(function() {
        const builderCard = document.getElementById('inline-program-builder-card');
        if (builderCard) {
          builderCard.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);

      showNotification('حرکات برنامه «' + preset.title + '» در پیش‌نویس طراح بارگذاری شدند!', 'success');
    }

    async function sharePreset(presetId) {
      const preset = preloadedPresetsCache.find(function(p) { return p.id === presetId; });
      if (!preset) return;

      const shareUrl = window.location.origin + '/?preset=' + encodeURIComponent(preset.id);

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(shareUrl);
        } catch (e) {}
      }

      showNotification('✓ لینک برنامه «' + preset.title + '» در کلیپ‌بورد کپی شد!', 'success');

      const titleElem = document.getElementById('share-qr-title');
      const urlInput = document.getElementById('share-qr-url');
      const imgElem = document.getElementById('share-qr-img');
      const modal = document.getElementById('share-qr-modal');

      if (titleElem) titleElem.innerText = 'الگوی علمی: ' + preset.title;
      if (urlInput) urlInput.value = shareUrl;
      if (imgElem) {
        imgElem.src = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(shareUrl) + '&margin=1';
      }
      if (modal) {
        modal.classList.remove('hidden');
        if (typeof lockBodyScroll === 'function') lockBodyScroll();
        lucide.createIcons();
      }
    }

    function openPreloadedPresetsSection() {
      switchTab('movements');
      setTimeout(function() {
        const el = document.getElementById('preloaded-presets-explorer');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
  `;
}
