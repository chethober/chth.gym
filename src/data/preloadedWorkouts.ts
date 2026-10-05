// ============================================================================
// Preloaded Workout Routines & Scientific Presets Catalog
// Evidence-based programming tailored to user BMI classification and Fitness Goals
// ============================================================================

export interface PreloadedExercise {
  exercise_id: string;
  name_fa: string;
  name_en: string;
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';
  category_fa: string;
  equipment: 'barbell' | 'dumbbell' | 'cable' | 'bodyweight' | 'machine';
  equipment_fa: string;
  gif_url: string;
  target_sets: number;
  target_reps: number;
  rest_seconds: number;
  notes_fa?: string;
}

export interface PreloadedWorkout {
  id: string;
  title: string;
  title_en: string;
  description: string;
  target_bmi_category: 'underweight' | 'normal' | 'overweight' | 'obese' | 'all';
  target_bmi_category_fa: string;
  target_goal: 'hypertrophy' | 'fat_loss' | 'strength' | 'endurance' | 'general_health' | 'all';
  target_goal_fa: string;
  fitness_level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  fitness_level_fa: string;
  bmi_range_text: string;
  badge_color: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'cyan';
  rationale_fa: string;
  tags: string[];
  estimated_duration_min: number;
  exercises: PreloadedExercise[];
}

export const PRELOADED_WORKOUTS: PreloadedWorkout[] = [
  // --------------------------------------------------------------------------
  // 1. Underweight (BMI < 18.5) & Hypertrophy / Muscle Building (Ectomorph Mass Builder)
  // --------------------------------------------------------------------------
  {
    id: 'preset_underweight_mass_builder',
    title: 'برنامه حجم و ساخت عضلانی (ویژه کم‌وزن و اکتومورف)',
    title_en: 'Ectomorph Compound Mass Builder',
    description: 'طراحی ویژه افراد با شاخص توده بدنی پایین (کمتر از ۱۸.۵) با تاکید بر حرکات ترکیبی سنگین چندمفصلی جهت بیشترین تحریک هایپرتروفی و به حداقل رساندن سوخت کالری اضافی.',
    target_bmi_category: 'underweight',
    target_bmi_category_fa: 'کم‌وزن (BMI < 18.5)',
    target_goal: 'hypertrophy',
    target_goal_fa: 'هایپرتروفی و عضله‌سازی',
    fitness_level: 'beginner',
    fitness_level_fa: 'مبتدی تا متوسط',
    bmi_range_text: 'کمتر از ۱۸.۵',
    badge_color: 'blue',
    rationale_fa: 'در افراد کم‌وزن، جلسات تمرینی باید کوتاه، متمرکز و سرشار از تنش مکانیکی روی گروه‌های عضلانی بزرگ باشند. استراحت‌های ۷۵ تا ۹۰ ثانیه‌ای تضمین‌کننده ریکاوری آدنوزین تری‌فسفات (ATP) و توان برای بلند کردن وزنه‌های سنگین‌تر است.',
    tags: ['حجم عضلانی', 'تمرکز ترکیبی', 'ریکاوری بالا', 'مناسب افراد لاغر'],
    estimated_duration_min: 45,
    exercises: [
      {
        exercise_id: 'ex_barbell_squat',
        name_fa: 'اسکوات پا با هالتر از پشت',
        name_en: 'Barbell Back Squat',
        category: 'legs',
        category_fa: 'پا',
        equipment: 'barbell',
        equipment_fa: 'هالتر',
        gif_url: '/gifs/0043.gif',
        target_sets: 4,
        target_reps: 8,
        rest_seconds: 90,
        notes_fa: 'تمرکز بر عمق کامل دامنه و حفظ قوس طبیعی ستون فقرات'
      },
      {
        exercise_id: 'ex_barbell_bench_press',
        name_fa: 'پرس سینه با هالتر',
        name_en: 'Barbell Bench Press',
        category: 'chest',
        category_fa: 'سینه',
        equipment: 'barbell',
        equipment_fa: 'هالتر',
        gif_url: '/gifs/0025.gif',
        target_sets: 4,
        target_reps: 8,
        rest_seconds: 90,
        notes_fa: 'کتف‌ها به عقب قفل شده و کنترل کامل در فاز منفی'
      },
      {
        exercise_id: 'ex_bent_over_barbell_row',
        name_fa: 'زیربغل هالتر خم',
        name_en: 'Bent-Over Barbell Row',
        category: 'back',
        category_fa: 'پشت و زیربغل',
        equipment: 'barbell',
        equipment_fa: 'هالتر',
        gif_url: '/gifs/0027.gif',
        target_sets: 4,
        target_reps: 8,
        rest_seconds: 75,
        notes_fa: 'بالاتنه با زاویه ۴۵ درجه و کشش میله به سمت ناف'
      },
      {
        exercise_id: 'ex_overhead_press',
        name_fa: 'پرس سرشانه هالتر نظامی ایستاده (OHP)',
        name_en: 'Standing Barbell Military Press',
        category: 'shoulders',
        category_fa: 'سرشانه',
        equipment: 'barbell',
        equipment_fa: 'هالتر',
        gif_url: '/gifs/1456.gif',
        target_sets: 3,
        target_reps: 8,
        rest_seconds: 75,
        notes_fa: 'انقباض باسن و شکم در طول کل دامنه حرکت'
      },
      {
        exercise_id: 'ex_barbell_bicep_curl',
        name_fa: 'جلو بازو با هالتر صاف ایستاده',
        name_en: 'Barbell Bicep Curl',
        category: 'arms',
        category_fa: 'بازو',
        equipment: 'barbell',
        equipment_fa: 'هالتر',
        gif_url: '/gifs/0031.gif',
        target_sets: 3,
        target_reps: 10,
        rest_seconds: 60,
        notes_fa: 'آرنج‌ها چسبیده به پهلو و بدون ضربه زدن با کمر'
      },
      {
        exercise_id: 'ex_forearm_plank',
        name_fa: 'پلانک روی آرنج',
        name_en: 'Forearm Plank',
        category: 'core',
        category_fa: 'شکم و میان‌تنه',
        equipment: 'bodyweight',
        equipment_fa: 'وزن بدن',
        gif_url: '/gifs/2135.gif',
        target_sets: 3,
        target_reps: 45, // 45 seconds
        rest_seconds: 60,
        notes_fa: 'حفظ خط مستقیم بدن و انقباض فعال عضلات مرکزی'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 2. Normal Weight (BMI 18.5 - 24.9) & Hypertrophy (Upper Body Split)
  // --------------------------------------------------------------------------
  {
    id: 'preset_normal_hypertrophy_upper',
    title: 'برنامه بالاتنه هایپرتروفی و حجم عضلانی',
    title_en: 'Upper Body Hypertrophy Volume Split',
    description: 'برنامه علمی بالاتنه با توزیع یکنواخت حجم بین عضلات سینه، پشت، سرشانه و بازو ویژه افراد در محدوده وزن نرمال با هدف رشد بهینه تارهای عضلانی نوع دو.',
    target_bmi_category: 'normal',
    target_bmi_category_fa: 'وزن متناسب (18.5 - 24.9)',
    target_goal: 'hypertrophy',
    target_goal_fa: 'هایپرتروفی و عضله‌سازی',
    fitness_level: 'intermediate',
    fitness_level_fa: 'متوسط تا پیشرفته',
    bmi_range_text: '۱۸.۵ تا ۲۴.۹',
    badge_color: 'emerald',
    rationale_fa: 'در محدوده BMI متناسب، ظرفیت تطبیق عضلانی در بالاترین سطح است. دامنه تکرار ۸ الی ۱۲ با ۶۰ ثانیه استراحت، ترشح فاکتورهای رشد موضعی و پمپ خونی حداکثری (Sarcoplasmic Hypertrophy) را به ارمغان می‌آورد.',
    tags: ['هایپرتروفی', 'بالاتنه تفکیکی', 'پمپ عضلانی', 'تار نوع ۲'],
    estimated_duration_min: 50,
    exercises: [
      {
        exercise_id: 'ex_incline_dumbbell_press',
        name_fa: 'پرس بالاسینه با دمبل',
        name_en: 'Incline Dumbbell Press',
        category: 'chest',
        category_fa: 'سینه',
        equipment: 'dumbbell',
        equipment_fa: 'دمبل',
        gif_url: '/gifs/0314.gif',
        target_sets: 4,
        target_reps: 10,
        rest_seconds: 60,
        notes_fa: 'دامنه حرکتی کامل با انقباض متمرکز در بالای حرکت'
      },
      {
        exercise_id: 'ex_lat_pulldown',
        name_fa: 'زیربغل سیم‌کش لت از جلو',
        name_en: 'Cable Lat Pulldown',
        category: 'back',
        category_fa: 'پشت و زیربغل',
        equipment: 'cable',
        equipment_fa: 'سیم‌کش',
        gif_url: '/gifs/0150.gif',
        target_sets: 4,
        target_reps: 10,
        rest_seconds: 60,
        notes_fa: 'کشش کامل در بالا و انقباض عضلات پشتی بزرگ در پایین'
      },
      {
        exercise_id: 'ex_seated_cable_row',
        name_fa: 'زیربغل قایقی با سیم‌کش',
        name_en: 'Seated Cable Row',
        category: 'back',
        category_fa: 'پشت و زیربغل',
        equipment: 'cable',
        equipment_fa: 'سیم‌کش',
        gif_url: '/gifs/0861.gif',
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 60,
        notes_fa: 'فشردن تیغه‌های شانه به هم در انتهای کشش'
      },
      {
        exercise_id: 'ex_dumbbell_lateral_raise',
        name_fa: 'نشر از جانب با دمبل',
        name_en: 'Dumbbell Lateral Raise',
        category: 'shoulders',
        category_fa: 'سرشانه',
        equipment: 'dumbbell',
        equipment_fa: 'دمبل',
        gif_url: '/gifs/0334.gif',
        target_sets: 4,
        target_reps: 12,
        rest_seconds: 45,
        notes_fa: 'بالا آوردن دمبل‌ها تا خط شانه بدون تکان دادن تنه'
      },
      {
        exercise_id: 'ex_triceps_rope_pushdown',
        name_fa: 'پشت بازو سیم‌کش با طناب',
        name_en: 'Triceps Rope Pushdown',
        category: 'arms',
        category_fa: 'بازو',
        equipment: 'cable',
        equipment_fa: 'سیم‌کش',
        gif_url: '/gifs/0241.gif',
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 45,
        notes_fa: 'باز کردن دو سر طناب در انتهای پایین حرکت برای انقباض اوج'
      },
      {
        exercise_id: 'ex_incline_dumbbell_curl',
        name_fa: 'جلو بازو دمبل روی میز شیبدار',
        name_en: 'Incline Dumbbell Curl',
        category: 'arms',
        category_fa: 'بازو',
        equipment: 'dumbbell',
        equipment_fa: 'دمبل',
        gif_url: '/gifs/0315.gif',
        target_sets: 3,
        target_reps: 10,
        rest_seconds: 60,
        notes_fa: 'کشش عمیق سر بلند جلو بازو در پایین دامنه'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 3. Normal Weight (BMI 18.5 - 24.9) & Hypertrophy (Lower Body & Core Split)
  // --------------------------------------------------------------------------
  {
    id: 'preset_normal_hypertrophy_lower',
    title: 'برنامه تفکیکی پایین‌تنه و میان‌تنه قدرتی',
    title_en: 'Lower Body & Core Hypertrophy',
    description: 'ترکیب اسکوات سنگین، ددلیفت رومانیایی، پرس پا و تمرینات تقویتی عضلات مرکزی شکم جهت رشد متوازن عضلات ران، باسن و ساق پا.',
    target_bmi_category: 'normal',
    target_bmi_category_fa: 'وزن متناسب (18.5 - 24.9)',
    target_goal: 'hypertrophy',
    target_goal_fa: 'هایپرتروفی و عضله‌سازی',
    fitness_level: 'intermediate',
    fitness_level_fa: 'متوسط تا پیشرفته',
    bmi_range_text: '۱۸.۵ تا ۲۴.۹',
    badge_color: 'emerald',
    rationale_fa: 'تمرینات پایین‌تنه ترشح هورمون‌های آنابولیک طبیعی را افزایش داده و پایه استقامتی و بیومکانیک کل بدن را مستحکم می‌سازد.',
    tags: ['پایین‌تنه', 'چهارسر و همسترینگ', 'عضلات مرکزی', 'تقویت باسن'],
    estimated_duration_min: 45,
    exercises: [
      {
        exercise_id: 'ex_barbell_squat',
        name_fa: 'اسکوات پا با هالتر از پشت',
        name_en: 'Barbell Back Squat',
        category: 'legs',
        category_fa: 'پا',
        equipment: 'barbell',
        equipment_fa: 'هالتر',
        gif_url: '/gifs/0043.gif',
        target_sets: 4,
        target_reps: 10,
        rest_seconds: 90,
        notes_fa: 'حرکت از مفصل لگن آغاز شده و زانوها به بیرون متمایل باشند'
      },
      {
        exercise_id: 'ex_romanian_deadlift_dumbbell',
        name_fa: 'ددلیفت رومانیایی با دمبل',
        name_en: 'Romanian Dumbbell Deadlift',
        category: 'legs',
        category_fa: 'پا',
        equipment: 'dumbbell',
        equipment_fa: 'دمبل',
        gif_url: '/gifs/1459.gif',
        target_sets: 4,
        target_reps: 10,
        rest_seconds: 75,
        notes_fa: 'عقب دادن باسن با پشت صاف تا کشش مطلوب در همسترینگ'
      },
      {
        exercise_id: 'ex_leg_press',
        name_fa: 'پرس پا با دستگاه ۴۵ درجه',
        name_en: 'Leg Press Machine',
        category: 'legs',
        category_fa: 'پا',
        equipment: 'machine',
        equipment_fa: 'دستگاه',
        gif_url: '/gifs/0739.gif',
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 60,
        notes_fa: 'عدم قفل کردن مفاصل زانو در بالاترین نقطه'
      },
      {
        exercise_id: 'ex_standing_calf_raise',
        name_fa: 'ساق پا ایستاده با دستگاه',
        name_en: 'Standing Calf Raise',
        category: 'legs',
        category_fa: 'پا',
        equipment: 'machine',
        equipment_fa: 'دستگاه',
        gif_url: '/gifs/0605.gif',
        target_sets: 4,
        target_reps: 15,
        rest_seconds: 45,
        notes_fa: 'مکث ۱ ثانیه‌ای در اوج انقباض روی پنجه پا'
      },
      {
        exercise_id: 'ex_kneeling_cable_crunch',
        name_fa: 'کرانچ شکم با طناب سیم‌کش (سجده‌ای)',
        name_en: 'Kneeling Cable Crunch',
        category: 'core',
        category_fa: 'شکم و میان‌تنه',
        equipment: 'cable',
        equipment_fa: 'سیم‌کش',
        gif_url: '/gifs/0175.gif',
        target_sets: 3,
        target_reps: 15,
        rest_seconds: 45,
        notes_fa: 'جمع کردن ستون فقرات با قدرت عضلات ۶ تکه شکم'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 4. Normal / Any BMI & Pure Strength (Powerbuilding Big 3)
  // --------------------------------------------------------------------------
  {
    id: 'preset_normal_strength_power',
    title: 'برنامه قدرت محض و پاوربیلدینگ (افزایش رکورد بیگ ۳)',
    title_en: 'Big 3 Maximal Strength & Neural Drive',
    description: 'پروتکل قدرتی تمرینات پایه اسکوات، پرس سینه، ددلیفت و سرشانه با وزنه‌های سنگین و تکرارهای ۴ الی ۶ جهت حداکثر تطبیق عصبی-عضلانی و افزایش رکوردهای شخصی (PR).',
    target_bmi_category: 'normal',
    target_bmi_category_fa: 'وزن متناسب (18.5 - 24.9)',
    target_goal: 'strength',
    target_goal_fa: 'افزایش رکورد و قدرت',
    fitness_level: 'advanced',
    fitness_level_fa: 'متوسط تا پیشرفته',
    bmi_range_text: '۱۸.۵ تا ۲۶.۰',
    badge_color: 'cyan',
    rationale_fa: 'تمرینات قدرتی مبتنی بر تکرار پایین (۴ تا ۶ تکرار) و استراحت‌های طولانی (۹۰ تا ۱۲۰ ثانیه) راندمان فراخوانی واحدهای حرکتی عصبی را به اوج رسانده و چگالی استخوانی و مفصلی را تقویت می‌کنند.',
    tags: ['افزایش رکورد', 'پاورلیفتینگ', 'تکرار پایین', 'سیستم عصبی CNS'],
    estimated_duration_min: 55,
    exercises: [
      {
        exercise_id: 'ex_barbell_deadlift',
        name_fa: 'ددلیفت کلاسیک با هالتر',
        name_en: 'Barbell Deadlift',
        category: 'back',
        category_fa: 'پشت و زیربغل',
        equipment: 'barbell',
        equipment_fa: 'هالتر',
        gif_url: '/gifs/0032.gif',
        target_sets: 5,
        target_reps: 5,
        rest_seconds: 120,
        notes_fa: 'شروع با فشار پاشنه‌ها و قفل محکم عضلات فیله و پشتی'
      },
      {
        exercise_id: 'ex_barbell_bench_press',
        name_fa: 'پرس سینه با هالتر',
        name_en: 'Barbell Bench Press',
        category: 'chest',
        category_fa: 'سینه',
        equipment: 'barbell',
        equipment_fa: 'هالتر',
        gif_url: '/gifs/0025.gif',
        target_sets: 5,
        target_reps: 5,
        rest_seconds: 120,
        notes_fa: 'استفاده از لگ درایو (Leg Drive) و پرس انفجاری به بالا'
      },
      {
        exercise_id: 'ex_barbell_squat',
        name_fa: 'اسکوات پا با هالتر از پشت',
        name_en: 'Barbell Back Squat',
        category: 'legs',
        category_fa: 'پا',
        equipment: 'barbell',
        equipment_fa: 'هالتر',
        gif_url: '/gifs/0043.gif',
        target_sets: 5,
        target_reps: 5,
        rest_seconds: 120,
        notes_fa: 'نفس عمیق شکمی (مانور والسالوا) و حفظ فشار مرکزی'
      },
      {
        exercise_id: 'ex_overhead_press',
        name_fa: 'پرس سرشانه هالتر نظامی ایستاده (OHP)',
        name_en: 'Standing Barbell Military Press',
        category: 'shoulders',
        category_fa: 'سرشانه',
        equipment: 'barbell',
        equipment_fa: 'هالتر',
        gif_url: '/gifs/1456.gif',
        target_sets: 4,
        target_reps: 6,
        rest_seconds: 90,
        notes_fa: 'صاف شدن کامل دست‌ها در بالای سر با انقباض ذوزنقه'
      },
      {
        exercise_id: 'ex_wide_pull_up',
        name_fa: 'بارفیکس دست باز',
        name_en: 'Wide-Grip Pull-Up',
        category: 'back',
        category_fa: 'پشت و زیربغل',
        equipment: 'bodyweight',
        equipment_fa: 'وزن بدن',
        gif_url: '/gifs/0652.gif',
        target_sets: 4,
        target_reps: 6,
        rest_seconds: 90,
        notes_fa: 'بالا کشیدن سینه تا میله بدون تاب خوردن بدن'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 5. Overweight (BMI 25.0 - 29.9) & Fat Loss / Body Recomposition
  // --------------------------------------------------------------------------
  {
    id: 'preset_overweight_fatloss_circuit',
    title: 'برنامه متابولیک فول‌بادی چربی‌سوزی و حفظ عضله',
    title_en: 'Full-Body Metabolic Fat Loss Circuit',
    description: 'ترکیب حرکات پرمصرف ترکیبی با استراحت‌های کوتاه و تکرارهای ۱۲ الی ۱۵ جهت حداکثر سوزاندن چربی‌های مازاد و ارتقای سرعت متابولیسم در زمان استراحت (EPOC).',
    target_bmi_category: 'overweight',
    target_bmi_category_fa: 'اضافه وزن (25.0 - 29.9)',
    target_goal: 'fat_loss',
    target_goal_fa: 'چربی‌سوزی و کاهش وزن',
    fitness_level: 'intermediate',
    fitness_level_fa: 'همه سطوح',
    bmi_range_text: '۲۵.۰ تا ۲۹.۹',
    badge_color: 'amber',
    rationale_fa: 'در شاخص توده بدنی ۲۵ تا ۳۰، هدف اصلی تخلیه ذخایر گلیکوژنی و تحریک اکسیداسیون لیپیدها همزمان با حفظ توده عضلانی است. بازه‌های استراحت ۴۵ ثانیه‌ای ضربان قلب را در محدوده چربی‌سوزی فعال نگه می‌دارد.',
    tags: ['چربی‌سوزی سریع', 'کالری‌سوزی EPOC', 'فول‌بادی پویا', 'حفظ عضلات'],
    estimated_duration_min: 45,
    exercises: [
      {
        exercise_id: 'ex_goblet_squat',
        name_fa: 'گابلت اسکوات با دمبل',
        name_en: 'Goblet Squat',
        category: 'legs',
        category_fa: 'پا',
        equipment: 'dumbbell',
        equipment_fa: 'دمبل',
        gif_url: '/gifs/1760.gif',
        target_sets: 3,
        target_reps: 15,
        rest_seconds: 45,
        notes_fa: 'دمبل چسبیده به سینه و پایین آمدن با ریتم روان'
      },
      {
        exercise_id: 'ex_push_up',
        name_fa: 'شنا سوئدی استاندارد',
        name_en: 'Standard Push-Up',
        category: 'chest',
        category_fa: 'سینه',
        equipment: 'bodyweight',
        equipment_fa: 'وزن بدن',
        gif_url: '/gifs/0662.gif',
        target_sets: 3,
        target_reps: 15,
        rest_seconds: 45,
        notes_fa: 'سینه تا نزدیکی زمین و حفظ خط یکپارچه ستون فقرات'
      },
      {
        exercise_id: 'ex_one_arm_dumbbell_row',
        name_fa: 'زیربغل دمبل تک‌خم (اره‌ای)',
        name_en: 'One-Arm Dumbbell Row',
        category: 'back',
        category_fa: 'پشت و زیربغل',
        equipment: 'dumbbell',
        equipment_fa: 'دمبل',
        gif_url: '/gifs/0292.gif',
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 45,
        notes_fa: 'کشش کنترل‌شده و بالا کشیدن دمبل به سمت پهلو'
      },
      {
        exercise_id: 'ex_dumbbell_walking_lunge',
        name_fa: 'لانج راه‌رفتنی با دمبل',
        name_en: 'Dumbbell Walking Lunge',
        category: 'legs',
        category_fa: 'پا',
        equipment: 'dumbbell',
        equipment_fa: 'دمبل',
        gif_url: '/gifs/0336.gif',
        target_sets: 3,
        target_reps: 12, // 12 per leg
        rest_seconds: 60,
        notes_fa: 'گام‌های محکم و استوار جهت درگیری کامل چهارسر و باسن'
      },
      {
        exercise_id: 'ex_seated_dumbbell_shoulder_press',
        name_fa: 'پرس سرشانه با دمبل نشسته',
        name_en: 'Seated Dumbbell Shoulder Press',
        category: 'shoulders',
        category_fa: 'سرشانه',
        equipment: 'dumbbell',
        equipment_fa: 'دمبل',
        gif_url: '/gifs/0405.gif',
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 45,
        notes_fa: 'پرس با ریتم یکنواخت بدون قفل مفصلی در بالا'
      },
      {
        exercise_id: 'ex_russian_twist',
        name_fa: 'چرخش روسی (راشن توئیست)',
        name_en: 'Russian Twist',
        category: 'core',
        category_fa: 'شکم و میان‌تنه',
        equipment: 'bodyweight',
        equipment_fa: 'وزن بدن',
        gif_url: '/gifs/0687.gif',
        target_sets: 3,
        target_reps: 20,
        rest_seconds: 45,
        notes_fa: 'چرخش کامل قفسه سینه به طرفین برای درگیری پهلوها'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 6. High BMI / Obese (BMI >= 30.0) & Joint-Friendly / Low-Impact Safe Routine
  // --------------------------------------------------------------------------
  {
    id: 'preset_high_bmi_joint_friendly',
    title: 'برنامه فول‌بادی کم‌فشار و حامی مفاصل (ویژه وزن بالا و زانودرد)',
    title_en: 'Joint-Friendly Low-Impact Metabolic Circuit',
    description: 'طراحی ویژه افراد با شاخص توده بدنی بالای ۳۰ بر پایه دستگاه‌ها و سیم‌کش‌ها جهت حذف کامل بار ضربه‌ای و فشار محوری بر دیسک‌های کمر و کشکک زانو، همراه با حداکثر کالری‌سوزی ایمن.',
    target_bmi_category: 'obese',
    target_bmi_category_fa: 'وزن بالا / چاقی (BMI ≥ 30)',
    target_goal: 'fat_loss',
    target_goal_fa: 'چربی‌سوزی و کاهش وزن',
    fitness_level: 'beginner',
    fitness_level_fa: 'مبتدی تا پیشرفته',
    bmi_range_text: '۳۰.۰ و بالاتر',
    badge_color: 'purple',
    rationale_fa: 'بر اساس راهنماهای کالج پزشکی ورزشی آمریکا (ACSM)، تمرین با دستگاه‌ها و سیم‌کش‌ها تکیه‌گاه ستون فقرات را تامین کرده و از سایش مفصل زانو جلوگیری می‌نماید. تکرارهای ۱۲ تا ۱۵ با وزنه کنترل‌شده، عروق‌سازی و چربی‌سوزی را بدون درد مفاصل به حداکثر می‌رساند.',
    tags: ['حامی مفاصل', 'کم‌فشار', 'بدون آسیب زانو', 'دستگاه و سیم‌کش', 'ایمن'],
    estimated_duration_min: 40,
    exercises: [
      {
        exercise_id: 'ex_machine_chest_press',
        name_fa: 'پرس سینه با دستگاه',
        name_en: 'Machine Chest Press',
        category: 'chest',
        category_fa: 'سینه',
        equipment: 'machine',
        equipment_fa: 'دستگاه',
        gif_url: '/gifs/0577.gif',
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 60,
        notes_fa: 'تنظیم صندلی تا دسته‌ها در خط میانه سینه باشند، ایمنی کامل سرشانه'
      },
      {
        exercise_id: 'ex_seated_cable_row',
        name_fa: 'زیربغل قایقی با سیم‌کش',
        name_en: 'Seated Cable Row',
        category: 'back',
        category_fa: 'پشت و زیربغل',
        equipment: 'cable',
        equipment_fa: 'سیم‌کش',
        gif_url: '/gifs/0861.gif',
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 60,
        notes_fa: 'پشت کاملاً صاف و تکیه بر پاها بدون فشار روی مهره‌های کمر'
      },
      {
        exercise_id: 'ex_leg_press',
        name_fa: 'پرس پا با دستگاه ۴۵ درجه',
        name_en: 'Leg Press Machine',
        category: 'legs',
        category_fa: 'پا',
        equipment: 'machine',
        equipment_fa: 'دستگاه',
        gif_url: '/gifs/0739.gif',
        target_sets: 3,
        target_reps: 15,
        rest_seconds: 60,
        notes_fa: 'کمر به پشتی کاملاً چسبیده باشد، زاویه زانو بیش از ۹۰ درجه نشود'
      },
      {
        exercise_id: 'ex_close_grip_lat_pulldown',
        name_fa: 'زیربغل سیم‌کش لت دست جمع',
        name_en: 'Close-Grip Lat Pulldown',
        category: 'back',
        category_fa: 'پشت و زیربغل',
        equipment: 'cable',
        equipment_fa: 'سیم‌کش',
        gif_url: '/gifs/2616.gif',
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 60,
        notes_fa: 'دسته V شکل ارگونومیک، کاهش فشار روی مفاصل مچ و شانه'
      },
      {
        exercise_id: 'ex_seated_dumbbell_shoulder_press',
        name_fa: 'پرس سرشانه با دمبل نشسته',
        name_en: 'Seated Dumbbell Shoulder Press',
        category: 'shoulders',
        category_fa: 'سرشانه',
        equipment: 'dumbbell',
        equipment_fa: 'دمبل',
        gif_url: '/gifs/0405.gif',
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 60,
        notes_fa: 'تکیه‌گاه عمودی صندلی بار وزن را از روی کمر برمی‌دارد'
      },
      {
        exercise_id: 'ex_floor_crunch',
        name_fa: 'کرانچ شکم کلاسیک روی زمین',
        name_en: 'Standard Floor Crunch',
        category: 'core',
        category_fa: 'شکم و میان‌تنه',
        equipment: 'bodyweight',
        equipment_fa: 'وزن بدن',
        gif_url: '/gifs/0274.gif',
        target_sets: 3,
        target_reps: 15,
        rest_seconds: 45,
        notes_fa: 'بلند کردن تیغه‌های شانه به آرامی بدون کشیدن گردن با دست'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 7. Any BMI & Endurance / Conditioning (Metabolic Aerobic Circuit)
  // --------------------------------------------------------------------------
  {
    id: 'preset_endurance_circuit',
    title: 'برنامه استقامت عضلانی و توان قلبی-تنفسی',
    title_en: 'Muscular Endurance & Cardiorespiratory Circuit',
    description: 'ترکیب تمرینات تناوبی با استراحت‌های کوتاه (۳۰ الی ۴۵ ثانیه) و تکرارهای بالا (۱۵ تا ۲۰) جهت تقویت سیستم مویرگی، استقامت عضلانی و ظرفیت هوازی.',
    target_bmi_category: 'all',
    target_bmi_category_fa: 'تمام شاخص‌ها',
    target_goal: 'endurance',
    target_goal_fa: 'استقامت و چابکی',
    fitness_level: 'intermediate',
    fitness_level_fa: 'متوسط',
    bmi_range_text: 'همه شاخص‌ها',
    badge_color: 'rose',
    rationale_fa: 'تکرارهای بالاتر از ۱۵ با مقاومت سبک تا متوسط باعث افزایش دانسیته میتوکندری در فیبرهای عضلانی نوع یک شده و استقامت در برابر خستگی را دوچندان می‌کند.',
    tags: ['استقامت بالا', 'هوازی-مقاومتی', 'تکرار بالا', 'چابکی'],
    estimated_duration_min: 40,
    exercises: [
      {
        exercise_id: 'ex_push_up',
        name_fa: 'شنا سوئدی استاندارد',
        name_en: 'Standard Push-Up',
        category: 'chest',
        category_fa: 'سینه',
        equipment: 'bodyweight',
        equipment_fa: 'وزن بدن',
        gif_url: '/gifs/0662.gif',
        target_sets: 3,
        target_reps: 20,
        rest_seconds: 30,
        notes_fa: 'حفظ ضربان و ریتم مداوم حرکت'
      },
      {
        exercise_id: 'ex_lat_pulldown',
        name_fa: 'زیربغل سیم‌کش لت از جلو',
        name_en: 'Cable Lat Pulldown',
        category: 'back',
        category_fa: 'پشت و زیربغل',
        equipment: 'cable',
        equipment_fa: 'سیم‌کش',
        gif_url: '/gifs/0150.gif',
        target_sets: 3,
        target_reps: 15,
        rest_seconds: 40,
        notes_fa: 'کشش مداوم بدون رها کردن ناگهانی وزنه'
      },
      {
        exercise_id: 'ex_bulgarian_split_squat',
        name_fa: 'اسکوات بلغاری با دمبل',
        name_en: 'Bulgarian Split Squat',
        category: 'legs',
        category_fa: 'پا',
        equipment: 'dumbbell',
        equipment_fa: 'دمبل',
        gif_url: '/gifs/0410.gif',
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 45,
        notes_fa: 'تمرکز بر تعادل تک‌پایی و استقامت عضلات چهارسر و باسن'
      },
      {
        exercise_id: 'ex_cable_face_pull',
        name_fa: 'فیس‌پول با طناب سیم‌کش',
        name_en: 'Cable Face Pull',
        category: 'shoulders',
        category_fa: 'سرشانه',
        equipment: 'cable',
        equipment_fa: 'سیم‌کش',
        gif_url: '/gifs/0203.gif',
        target_sets: 3,
        target_reps: 18,
        rest_seconds: 30,
        notes_fa: 'چرخش شانه به عقب برای سلامت مفصل و استقامت دلتوئید خلفی'
      },
      {
        exercise_id: 'ex_air_bike',
        name_fa: 'کرانچ دوچرخه (بایسیکل کرانچ)',
        name_en: 'Air Bike Crunch',
        category: 'core',
        category_fa: 'شکم و میان‌تنه',
        equipment: 'bodyweight',
        equipment_fa: 'وزن بدن',
        gif_url: '/gifs/0003.gif',
        target_sets: 3,
        target_reps: 20,
        rest_seconds: 30,
        notes_fa: 'نزدیک کردن آرنج به زانوی مخالف با سرعت یکنواخت'
      },
      {
        exercise_id: 'ex_forearm_plank',
        name_fa: 'پلانک روی آرنج',
        name_en: 'Forearm Plank',
        category: 'core',
        category_fa: 'شکم و میان‌تنه',
        equipment: 'bodyweight',
        equipment_fa: 'وزن بدن',
        gif_url: '/gifs/2135.gif',
        target_sets: 3,
        target_reps: 60, // 60 seconds
        rest_seconds: 45,
        notes_fa: 'استقامت ایزومتریک کل زنجیره قدامی بدن'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 8. General Health & Posture (Functional Fitness & Longevity)
  // --------------------------------------------------------------------------
  {
    id: 'preset_general_health_fitness',
    title: 'برنامه تناسب اندام، بهبود قامت و تعادل حرکتی',
    title_en: 'Functional Health & Posture Conditioning',
    description: 'برنامه جامع برای ارتقای سلامت عمومی، بهبود پاسچر ستون فقرات و پیشگیری از دردهای پشت و گردن متناسب با فعالیت‌های اداری و روزمره.',
    target_bmi_category: 'all',
    target_bmi_category_fa: 'تمام شاخص‌ها',
    target_goal: 'general_health',
    target_goal_fa: 'سلامتی و تناسب اندام',
    fitness_level: 'beginner',
    fitness_level_fa: 'مبتدی و عمومی',
    bmi_range_text: 'همه رده‌ها',
    badge_color: 'emerald',
    rationale_fa: 'تمرکز بر تقویت عضلات خلفی (پشت، باسن، فیله کمر) جهت اصلاح اثرات منفی نشستن طولانی و تقویت ثبات بدنی با حرکات ایمن و متعادل.',
    tags: ['سلامت عمومی', 'اصلاح قامت', 'کاهش درد کمر', 'تعادل و ثبات'],
    estimated_duration_min: 40,
    exercises: [
      {
        exercise_id: 'ex_dumbbell_bench_press',
        name_fa: 'پرس سینه با دمبل',
        name_en: 'Dumbbell Bench Press',
        category: 'chest',
        category_fa: 'سینه',
        equipment: 'dumbbell',
        equipment_fa: 'دمبل',
        gif_url: '/gifs/0289.gif',
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 60,
        notes_fa: 'افزایش تعادل بین سمت راست و چپ بالاتنه'
      },
      {
        exercise_id: 'ex_seated_cable_row',
        name_fa: 'زیربغل قایقی با سیم‌کش',
        name_en: 'Seated Cable Row',
        category: 'back',
        category_fa: 'پشت و زیربغل',
        equipment: 'cable',
        equipment_fa: 'سیم‌کش',
        gif_url: '/gifs/0861.gif',
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 60,
        notes_fa: 'عقب کشیدن شانه‌ها برای رفع قوز پشتی'
      },
      {
        exercise_id: 'ex_goblet_squat',
        name_fa: 'گابلت اسکوات با دمبل',
        name_en: 'Goblet Squat',
        category: 'legs',
        category_fa: 'پا',
        equipment: 'dumbbell',
        equipment_fa: 'دمبل',
        gif_url: '/gifs/1760.gif',
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 60,
        notes_fa: 'روان‌سازی مفصل لگن و تقویت چهارسر ران'
      },
      {
        exercise_id: 'ex_dumbbell_lateral_raise',
        name_fa: 'نشر از جانب با دمبل',
        name_en: 'Dumbbell Lateral Raise',
        category: 'shoulders',
        category_fa: 'سرشانه',
        equipment: 'dumbbell',
        equipment_fa: 'دمبل',
        gif_url: '/gifs/0334.gif',
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 60,
        notes_fa: 'تقویت سلامت کمربند شانه‌ای'
      },
      {
        exercise_id: 'ex_hyperextension',
        name_fa: 'فیله کمر روی نیمکت ۴۵ درجه',
        name_en: 'Back Hyperextension',
        category: 'back',
        category_fa: 'پشت و زیربغل',
        equipment: 'bodyweight',
        equipment_fa: 'وزن بدن',
        gif_url: '/gifs/0489.gif',
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 60,
        notes_fa: 'تقویت عضلات ارکتور اسپاین جهت پشتیبانی از دیسک‌های کمری'
      },
      {
        exercise_id: 'ex_forearm_plank',
        name_fa: 'پلانک روی آرنج',
        name_en: 'Forearm Plank',
        category: 'core',
        category_fa: 'شکم و میان‌تنه',
        equipment: 'bodyweight',
        equipment_fa: 'وزن بدن',
        gif_url: '/gifs/2135.gif',
        target_sets: 3,
        target_reps: 40,
        rest_seconds: 60,
        notes_fa: 'تثبیت استخوان لگن و میان‌تنه'
      }
    ]
  }
];

// Helper: Determine BMI Category from numeric BMI
export function classifyBmi(bmi: number): {
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
  category_fa: string;
  badge_color: 'blue' | 'emerald' | 'amber' | 'purple';
  description_fa: string;
} {
  if (bmi < 18.5) {
    return {
      category: 'underweight',
      category_fa: 'کم‌وزن',
      badge_color: 'blue',
      description_fa: 'شاخص توده بدنی شما کمتر از ۱۸.۵ است. تمرکز بر حجم عضلانی تدریجی با حرکات پایه‌ای چندمفصلی، استراحت کافی و رژیم غذایی مثبت کالری توصیه می‌شود.'
    };
  } else if (bmi < 25.0) {
    return {
      category: 'normal',
      category_fa: 'وزن متناسب و نرمال',
      badge_color: 'emerald',
      description_fa: 'شاخص توده بدنی شما در بازه ایده‌آل ۱۸.۵ تا ۲۴.۹ قرار دارد. تمام انواع برنامه‌های هایپرتروفی، قدرتی و تفکیکی عضلات برای شما بسیار موثر خواهد بود.'
    };
  } else if (bmi < 30.0) {
    return {
      category: 'overweight',
      category_fa: 'اضافه وزن ملایم',
      badge_color: 'amber',
      description_fa: 'شاخص توده بدنی شما بین ۲۵.۰ تا ۲۹.۹ است. ترکیب تمرینات فول‌بادی متابولیک، استراحت‌های کوتاه و حفظ توده عضلانی برای تسریع چربی‌سوزی عالی است.'
    };
  } else {
    return {
      category: 'obese',
      category_fa: 'وزن بالا (حامی مفاصل)',
      badge_color: 'purple',
      description_fa: 'شاخص توده بدنی شما ۳۰ یا بالاتر است. اولویت اصلی محافظت از مفاصل زانو و ستون فقرات با بهره‌گیری از دستگاه‌ها و سیم‌کش‌ها و ایجاد کسری کالری پایدار است.'
    };
  }
}

// Helper: Calculate Recommendations based on BMI and Fitness Goal
export function getWorkoutSuggestions(
  bmi?: number,
  goal?: string,
  level?: string
): {
  user_metrics: {
    bmi: number;
    category: 'underweight' | 'normal' | 'overweight' | 'obese';
    category_fa: string;
    badge_color: string;
    goal: string;
    goal_fa: string;
    description_fa: string;
  };
  primary_matches: PreloadedWorkout[];
  secondary_matches: PreloadedWorkout[];
  all_presets: PreloadedWorkout[];
  scientific_tips: string[];
} {
  const resolvedBmi = typeof bmi === 'number' && bmi > 10 && bmi < 70 ? bmi : 23.5;
  const bmiInfo = classifyBmi(resolvedBmi);

  const goalFaMap: Record<string, string> = {
    hypertrophy: 'عضله‌سازی و هایپرتروفی',
    fat_loss: 'چربی‌سوزی و کاهش وزن',
    strength: 'افزایش رکورد و قدرت',
    endurance: 'استقامت و چابکی',
    general_health: 'سلامت عمومی و تناسب اندام'
  };

  const resolvedGoal = goal && goalFaMap[goal] ? goal : 'hypertrophy';
  const goalFa = goalFaMap[resolvedGoal];

  // Primary matches: match both BMI category (or 'all') and goal (or 'all')
  const primaryMatches = PRELOADED_WORKOUTS.filter(preset => {
    const bmiMatch = preset.target_bmi_category === bmiInfo.category || preset.target_bmi_category === 'all';
    const goalMatch = preset.target_goal === resolvedGoal || preset.target_goal === 'all';
    return bmiMatch && goalMatch;
  });

  // Secondary matches: matches either the BMI category or the goal, but not already in primary
  const primaryIds = new Set(primaryMatches.map(p => p.id));
  const secondaryMatches = PRELOADED_WORKOUTS.filter(preset => {
    if (primaryIds.has(preset.id)) return false;
    const bmiMatch = preset.target_bmi_category === bmiInfo.category;
    const goalMatch = preset.target_goal === resolvedGoal;
    return bmiMatch || goalMatch;
  });

  // Scientific tips based on user condition
  const scientificTips: string[] = [];
  if (bmiInfo.category === 'obese') {
    scientificTips.push('در حرکات پایین‌تنه از دستگاه پرس پا به جای اسکوات آزاد سنگین استفاده شده تا فشار بر کشکک زانو و لومبار ستون فقرات به صفر برسد.');
    scientificTips.push('دامنه تکرار ۱۲ الی ۱۵، عروق‌زایی مویرگی را در بافت چربی تحریک کرده و سوزاندن چربی‌ها را تسهیل می‌کند.');
  } else if (bmiInfo.category === 'overweight') {
    scientificTips.push('استراحت ۴۵ ثانیه‌ای، سطح مصرف اکسیژن پس از تمرین (EPOC) را بالا نگه داشته و تا ۲۴ ساعت پس از تمرین سوخت‌وساز را فعال نگه می‌دارد.');
    scientificTips.push('تمرینات فول‌بادی بیشترین مقدار بافت عضلانی را همزمان درگیر کرده و کالری‌سوزی را دوچندان می‌کنند.');
  } else if (bmiInfo.category === 'underweight') {
    scientificTips.push('استراحت‌های ۹۰ ثانیه‌ای اجازه ریکاوری کامل کراتین فسفات را داده تا در هر ست بتوانید بیشترین وزنه ممکن را جابجا کنید.');
    scientificTips.push('حرکات تک‌مفصلی بیش از حد حذف شده‌اند تا تمام انرژی بدن صرف رشد عضلات اصلی (اسکوات، پرس، بارفیکس) شود.');
  } else {
    scientificTips.push('تنوع بین حرکات ترکیبی سنگین و ایزولاسیون با سیم‌کش، رشد متوازن و تقارن عضلانی بدون آسیب ایجاد می‌کند.');
  }

  return {
    user_metrics: {
      bmi: Number(resolvedBmi.toFixed(1)),
      category: bmiInfo.category,
      category_fa: bmiInfo.category_fa,
      badge_color: bmiInfo.badge_color,
      goal: resolvedGoal,
      goal_fa: goalFa,
      description_fa: bmiInfo.description_fa
    },
    primary_matches: primaryMatches.length > 0 ? primaryMatches : PRELOADED_WORKOUTS.slice(0, 2),
    secondary_matches: secondaryMatches,
    all_presets: PRELOADED_WORKOUTS,
    scientific_tips: scientificTips
  };
}

// Helper: Get preset by ID
export function getPresetById(presetId: string): PreloadedWorkout | null {
  return PRELOADED_WORKOUTS.find(p => p.id === presetId) || null;
}
