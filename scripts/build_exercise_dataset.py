import os
import urllib.request
import concurrent.futures

# Destination directory for local GIF storage
GIF_DIR = "public/gifs"
os.makedirs(GIF_DIR, exist_ok=True)

# List of 60+ essential gym exercises categorized by muscle group & equipment
# id maps directly to https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/{id}.gif
EXERCISES = [
    # --- CHEST (سینه) ---
    {
        "id": "0025",
        "key": "ex_barbell_bench_press",
        "name_fa": "پرس سینه با هالتر",
        "name_en": "Barbell Bench Press",
        "category": "chest",
        "category_fa": "سینه",
        "equipment": "barbell",
        "equipment_fa": "هالتر",
        "target_muscles": "عضله سینه‌ای بزرگ (پکتورالیس ماژور)",
        "secondary_muscles": "پشت بازو (سه‌سر بازویی)، دلتوئید قدامی",
        "instructions_fa": "۱. روی نیمکت تخت دراز بکشید و پاها را محکم روی زمین بگذارید.\n۲. هالتر را با فاصله‌ای کمی بازتر از عرض شانه بگیرید.\n۳. میله را با کنترل کامل تا وسط قفسه سینه پایین بیاورید.\n۴. با انقباض عضلات سینه میله را با قدرت به بالا پرس کنید."
    },
    {
        "id": "0047",
        "key": "ex_incline_barbell_bench_press",
        "name_fa": "پرس بالاسینه با هالتر",
        "name_en": "Incline Barbell Bench Press",
        "category": "chest",
        "category_fa": "سینه",
        "equipment": "barbell",
        "equipment_fa": "هالتر",
        "target_muscles": "بخش بالایی سینه (سر کلاویکولار)",
        "secondary_muscles": "دلتوئید جلویی، پشت بازو",
        "instructions_fa": "۱. شیب نیمکت را روی ۳۰ الی ۴۵ درجه تنظیم کنید.\n۲. هالتر را اندازه عرض شانه بگیرید و با کنترل تا بالای ترقوه پایین بیاورید.\n۳. میله را مستقیم به سمت بالا پرس کنید."
    },
    {
        "id": "0033",
        "key": "ex_decline_barbell_bench_press",
        "name_fa": "پرس زیرسینه با هالتر",
        "name_en": "Decline Barbell Bench Press",
        "category": "chest",
        "category_fa": "سینه",
        "equipment": "barbell",
        "equipment_fa": "هالتر",
        "target_muscles": "بخش زیرین سینه (سر استرنال)",
        "secondary_muscles": "پشت بازو، بخش تحتانی سینه",
        "instructions_fa": "۱. روی نیمکت شیب‌منفی قرار بگیرید و پاها را محکم در گیره قفل کنید.\n۲. هالتر را تا خط زیرین سینه پایین آورده و با تمرکز بالا ببرید."
    },
    {
        "id": "0289",
        "key": "ex_dumbbell_bench_press",
        "name_fa": "پرس سینه با دمبل",
        "name_en": "Dumbbell Bench Press",
        "category": "chest",
        "category_fa": "سینه",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "عضله سینه‌ای بزرگ و افزایش تعادل عضلانی",
        "secondary_muscles": "پشت بازو، تثبیت‌کننده‌های شانه",
        "instructions_fa": "۱. دمبل‌ها را با کمک زانوها روی سینه هدایت کرده و دراز بکشید.\n۲. دمبل‌ها را تا کنار سینه با کشش مناسب پایین بیاورید.\n۳. به صورت موازی به بالا فشار داده و در اوج انقباض مکث کنید."
    },
    {
        "id": "0314",
        "key": "ex_incline_dumbbell_press",
        "name_fa": "پرس بالاسینه با دمبل",
        "name_en": "Incline Dumbbell Press",
        "category": "chest",
        "category_fa": "سینه",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "بخش بالایی عضلات سینه",
        "secondary_muscles": "سرشانه قدامی، پشت بازو",
        "instructions_fa": "۱. روی نیمکت با زاویه ۳۰ تا ۴۵ درجه بنشینید.\n۲. دمبل‌ها را با هدایت آرنج‌ها به سمت بالا ببرید.\n۳. در بالای دامنه از برخورد شدید دمبل‌ها به هم خودداری کنید."
    },
    {
        "id": "0308",
        "key": "ex_dumbbell_fly",
        "name_fa": "قفسه سینه با دمبل (فلای)",
        "name_en": "Dumbbell Chest Fly",
        "category": "chest",
        "category_fa": "سینه",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "عضلات سینه با تاکید بر کشش عرضی",
        "secondary_muscles": "دلتوئید قدامی",
        "instructions_fa": "۱. روی نیمکت خوابیده و دمبل‌ها را با آرنج‌های کمی خمیده به طرفین باز کنید.\n۲. تا ایجاد کشش مطلوب در سینه پایین بروید.\n۳. مثل در آغوش گرفتن یک تنه درخت دست‌ها را به هم نزدیک کنید."
    },
    {
        "id": "0319",
        "key": "ex_incline_dumbbell_fly",
        "name_fa": "قفسه بالاسینه با دمبل",
        "name_en": "Incline Dumbbell Fly",
        "category": "chest",
        "category_fa": "سینه",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "بخش فوقانی عضلات سینه",
        "secondary_muscles": "شانه قدامی",
        "instructions_fa": "۱. نیمکت را شیب‌دار کرده و دمبل‌ها را با قوس ملایم آرنج باز کنید.\n۲. در اوج کشش مکث کرده و به سمت بالای سینه جمع کنید."
    },
    {
        "id": "0179",
        "key": "ex_cable_crossover",
        "name_fa": "کراس اور با سیم‌کش از بالا",
        "name_en": "High Cable Crossover",
        "category": "chest",
        "category_fa": "سینه",
        "equipment": "cable",
        "equipment_fa": "سیم‌کش",
        "target_muscles": "خط وسط و بخش تحتانی سینه",
        "secondary_muscles": "دلتوئید قدامی",
        "instructions_fa": "۱. دسته‌های سیم‌کش را در بالاترین ارتفاع قرار دهید.\n۲. یک گام به جلو بگذارید و دست‌ها را به سمت جلوی ناف و پایین فشرده کنید."
    },
    {
        "id": "0197",
        "key": "ex_cable_low_fly",
        "name_fa": "کراس اور از پایین با سیم‌کش",
        "name_en": "Low Cable Crossover",
        "category": "chest",
        "category_fa": "سینه",
        "equipment": "cable",
        "equipment_fa": "سیم‌کش",
        "target_muscles": "بخش بالایی و خط داخلی سینه",
        "secondary_muscles": "دلتوئید قدامی",
        "instructions_fa": "۱. دسته‌ها را در پایین‌ترین قرقره قرار دهید.\n۲. دست‌ها را با قوس ملایم به سمت بالای سینه و روبروی چانه بالا بکشید."
    },
    {
        "id": "0662",
        "key": "ex_push_up",
        "name_fa": "شنا سوئدی استاندارد",
        "name_en": "Standard Push-Up",
        "category": "chest",
        "category_fa": "سینه",
        "equipment": "bodyweight",
        "equipment_fa": "وزن بدن",
        "target_muscles": "عضله سینه و استقامت کلی بالاتنه",
        "secondary_muscles": "پشت بازو، عضلات مرکزی (Core)",
        "instructions_fa": "۱. دست‌ها را به اندازه عرض شانه روی زمین بگذارید.\n۲. بدن را در یک خط مستقیم نگه داشته و تا نزدیک زمین پایین بیایید.\n۳. با قدرت به بالا برگردید."
    },
    {
        "id": "0279",
        "key": "ex_decline_push_up",
        "name_fa": "شنا سوئدی شیب منفی (پا بالا)",
        "name_en": "Decline Push-Up",
        "category": "chest",
        "category_fa": "سینه",
        "equipment": "bodyweight",
        "equipment_fa": "وزن بدن",
        "target_muscles": "بخش بالایی سینه و سرشانه‌ها",
        "secondary_muscles": "پشت بازو، میان‌تنه",
        "instructions_fa": "۱. پاها را روی نیمکت یا سکوی بلند قرار دهید.\n۲. دست‌ها روی زمین و سینه را با تمرکز تا سطح زمین پایین بیاورید."
    },
    {
        "id": "0251",
        "key": "ex_chest_dip",
        "name_fa": "دیپ پارالل سینه",
        "name_en": "Chest Dip",
        "category": "chest",
        "category_fa": "سینه",
        "equipment": "bodyweight",
        "equipment_fa": "وزن بدن",
        "target_muscles": "بخش تحتانی سینه و خط زیر سینه",
        "secondary_muscles": "پشت بازو، شانه قدامی",
        "instructions_fa": "۱. میله‌های پارالل را گرفته و بالاتنه را ۳۰ درجه به جلو متمایل کنید.\n۲. تا زاویه ۹۰ درجه آرنج پایین رفته و سپس به بالا فشار دهید."
    },
    {
        "id": "0022",
        "key": "ex_machine_chest_press",
        "name_fa": "پرس سینه با دستگاه",
        "name_en": "Machine Chest Press",
        "category": "chest",
        "category_fa": "سینه",
        "equipment": "machine",
        "equipment_fa": "دستگاه",
        "target_muscles": "کل عضلات سینه با حداکثر ایمنی مفصلی",
        "secondary_muscles": "پشت بازو",
        "instructions_fa": "۱. ارتفاع نشیمن را تنظیم کنید تا دسته‌ها در خط میانه سینه باشند.\n۲. با بازدم دسته‌ها را به جلو هدایت کرده و با کنترل بازگردانید."
    },

    # --- BACK & LATS (پشت و زیربغل) ---
    {
        "id": "0032",
        "key": "ex_barbell_deadlift",
        "name_fa": "ددلیفت کلاسیک با هالتر",
        "name_en": "Barbell Deadlift",
        "category": "back",
        "category_fa": "پشت و زیربغل",
        "equipment": "barbell",
        "equipment_fa": "هالتر",
        "target_muscles": "فیله کمر، عضلات پشتی بزرگ (لاتیسیموس)",
        "secondary_muscles": "همسترینگ، باسن، ساعد",
        "instructions_fa": "۱. روبروی هالتر بایستید و پاها به عرض لگن باشد.\n۲. با ستون فقرات کاملاً خنثی و بدون قوز میله را بگیرید.\n۳. با فشار پاشنه‌ها و باز کردن لگن وزنه را به بالا هدایت کنید."
    },
    {
        "id": "0027",
        "key": "ex_bent_over_barbell_row",
        "name_fa": "زیربغل هالتر خم",
        "name_en": "Bent-Over Barbell Row",
        "category": "back",
        "category_fa": "پشت و زیربغل",
        "equipment": "barbell",
        "equipment_fa": "هالتر",
        "target_muscles": "عضلات متوازی‌الاضلاع (رومبوئید) و لت‌ها",
        "secondary_muscles": "جلو بازو، فیله کمر",
        "instructions_fa": "۱. بالاتنه را با زاویه ۴۵ درجه خم کرده و زانوها را اندکی خم کنید.\n۲. میله را به سمت زیر ناف بکشید و کتف‌ها را در اوج به هم فشار دهید."
    },
    {
        "id": "0292",
        "key": "ex_one_arm_dumbbell_row",
        "name_fa": "زیربغل دمبل تک‌خم (اره‌ای)",
        "name_en": "One-Arm Dumbbell Row",
        "category": "back",
        "category_fa": "پشت و زیربغل",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "عضله پشتی بزرگ یک‌طرفه و افزایش تقارن",
        "secondary_muscles": "جلوبازو، دلتوئید خلفی",
        "instructions_fa": "۱. یک زانو و دست را روی نیمکت قرار داده و پشت را صاف کنید.\n۲. دمبل را با هدایت آرنج به سمت پهلو بالا بکشید و آرام بازگردانید."
    },
    {
        "id": "0150",
        "key": "ex_lat_pulldown",
        "name_fa": "زیربغل سیم‌کش لت از جلو",
        "name_en": "Cable Lat Pulldown",
        "category": "back",
        "category_fa": "پشت و زیربغل",
        "equipment": "cable",
        "equipment_fa": "سیم‌کش",
        "target_muscles": "عضله پشتی بزرگ و پهن کردن بالاتنه",
        "secondary_muscles": "جلو بازو، بخش میانی پشت",
        "instructions_fa": "۱. ران‌ها را زیر بالشتک دستگاه قفل کنید و میله را با دستان باز بگیرید.\n۲. میله را به سمت بالای سینه پایین بکشید و کتف‌ها را منقبض کنید."
    },
    {
        "id": "0210",
        "key": "ex_close_grip_lat_pulldown",
        "name_fa": "زیربغل سیم‌کش لت دست جمع",
        "name_en": "Close-Grip Lat Pulldown",
        "category": "back",
        "category_fa": "پشت و زیربغل",
        "equipment": "cable",
        "equipment_fa": "سیم‌کش",
        "target_muscles": "بخش تحتانی عضلات زیربغل",
        "secondary_muscles": "جلو بازو، ساعد",
        "instructions_fa": "۱. از دسته V شکل (دست جمع) استفاده کنید.\n۲. با تکیه ملایم به عقب، دسته را تا وسط سینه پایین بکشید."
    },
    {
        "id": "0198",
        "key": "ex_seated_cable_row",
        "name_fa": "زیربغل قایقی با سیم‌کش",
        "name_en": "Seated Cable Row",
        "category": "back",
        "category_fa": "پشت و زیربغل",
        "equipment": "cable",
        "equipment_fa": "سیم‌کش",
        "target_muscles": "ضخامت بخش میانی عضلات پشت",
        "secondary_muscles": "جلو بازو، دلتوئید خلفی",
        "instructions_fa": "۱. پاها را روی تکیه‌گاه گذاشته و پشت را صاف نگه دارید.\n۲. دسته را به سمت شکم بکشید و شانه‌ها را به عقب رول کنید."
    },
    {
        "id": "0652",
        "key": "ex_wide_pull_up",
        "name_fa": "بارفیکس دست باز",
        "name_en": "Wide-Grip Pull-Up",
        "category": "back",
        "category_fa": "پشت و زیربغل",
        "equipment": "bodyweight",
        "equipment_fa": "وزن بدن",
        "target_muscles": "عضلات پشتی بزرگ و بالاتنه V-Shape",
        "secondary_muscles": "جلو بازو، فیله کمر",
        "instructions_fa": "۱. میله را با دست‌های بازتر از عرض شانه بگیرید.\n۲. بدن را بالا بکشید تا چانه بالای میله قرار گیرد و با کنترل پایین بیایید."
    },
    {
        "id": "0253",
        "key": "ex_chin_up",
        "name_fa": "بارفیکس دست جمع مچ برعکس (چین‌آپ)",
        "name_en": "Chin-Up",
        "category": "back",
        "category_fa": "پشت و زیربغل",
        "equipment": "bodyweight",
        "equipment_fa": "وزن بدن",
        "target_muscles": "عضلات زیربغل و جلو بازو",
        "secondary_muscles": "ساعد، میان‌تنه",
        "instructions_fa": "۱. میله را با کف دستان رو به خود بگیرید.\n۲. با فشار همزمان زیربغل و جلوبازو بالا رفته و مکث کنید."
    },
    {
        "id": "1349",
        "key": "ex_tbar_row",
        "name_fa": "زیربغل تی‌بار با دستگاه",
        "name_en": "Lever T-Bar Row",
        "category": "back",
        "category_fa": "پشت و زیربغل",
        "equipment": "machine",
        "equipment_fa": "دستگاه",
        "target_muscles": "بخش میانی و فوقانی پشت",
        "secondary_muscles": "جلو بازو، فیله",
        "instructions_fa": "۱. روی دستگاه قرار گرفته و دسته‌ها را محکم بگیرید.\n۲. وزنه را به سمت سینه بکشید و در اوج دامنه انقباض ایجاد کنید."
    },
    {
        "id": "0238",
        "key": "ex_straight_arm_pulldown",
        "name_fa": "پلاور سیم‌کش ایستاده (دست صاف)",
        "name_en": "Straight-Arm Cable Pulldown",
        "category": "back",
        "category_fa": "پشت و زیربغل",
        "equipment": "cable",
        "equipment_fa": "سیم‌کش",
        "target_muscles": "ایزولاسیون کامل عضله پشتی بزرگ",
        "secondary_muscles": "پشت بازو، سر سینه",
        "instructions_fa": "۱. روبروی قرقره بالا بایستید و میله را با بازوهای صاف نگه دارید.\n۲. بدون خم کردن آرنج‌ها، میله را با انقباض زیربغل تا ران‌ها پایین بیاورید."
    },
    {
        "id": "0489",
        "key": "ex_hyperextension",
        "name_fa": "فیله کمر روی نیمکت ۴۵ درجه",
        "name_en": "Back Hyperextension",
        "category": "back",
        "category_fa": "پشت و زیربغل",
        "equipment": "bodyweight",
        "equipment_fa": "وزن بدن",
        "target_muscles": "عضلات راست‌کننده ستون فقرات (فیله کمر)",
        "secondary_muscles": "باسن، همسترینگ",
        "instructions_fa": "۱. روی نیمکت فیله قرار بگیرید و دست‌ها را روی سینه ضربدری بگیرید.\n۲. به آرامی از ناحیه کمر خم شده و سپس با انقباض کمر صاف شوید."
    },
    {
        "id": "0095",
        "key": "ex_barbell_shrug",
        "name_fa": "شراگ هالتر (عضلات کول)",
        "name_en": "Barbell Shrug",
        "category": "back",
        "category_fa": "پشت و زیربغل",
        "equipment": "barbell",
        "equipment_fa": "هالتر",
        "target_muscles": "عضله ذوزنقه‌ای بالایی (کول)",
        "secondary_muscles": "ساعد، گردن",
        "instructions_fa": "۱. هالتر را جلوی ران‌ها نگه دارید و شانه‌ها را مستقیماً به سمت گوش‌ها بالا بکشید.\n۲. از چرخاندن شانه‌ها خودداری کرده و در اوج ۲ ثانیه مکث کنید."
    },
    {
        "id": "0411",
        "key": "ex_dumbbell_shrug",
        "name_fa": "شراگ با دمبل",
        "name_en": "Dumbbell Shrug",
        "category": "back",
        "category_fa": "پشت و زیربغل",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "عضلات کول و ذوزنقه‌ای",
        "secondary_muscles": "ساعد",
        "instructions_fa": "۱. دمبل‌ها را در کنار پهلوها نگه دارید.\n۲. شانه‌ها را فقط در جهت عمودی بالا ببرید و به آرامی پایین بیاورید."
    },

    # --- LEGS (پا و ساق) ---
    {
        "id": "0043",
        "key": "ex_barbell_squat",
        "name_fa": "اسکوات پا با هالتر از پشت",
        "name_en": "Barbell Back Squat",
        "category": "legs",
        "category_fa": "پا",
        "equipment": "barbell",
        "equipment_fa": "هالتر",
        "target_muscles": "عضلات چهارسر ران و سرینی (باسن)",
        "secondary_muscles": "همسترینگ، ساق، عضلات مرکزی",
        "instructions_fa": "۱. هالتر را روی کول قرار داده و پاها را به اندازه عرض شانه باز کنید.\n۲. با عقب دادن لگن تا موازی شدن ران‌ها با زمین بنشینید.\n۳. با هدایت فشار به پاشنه به حالت ایستاده برگردید."
    },
    {
        "id": "0042",
        "key": "ex_barbell_front_squat",
        "name_fa": "اسکوات از جلو با هالتر",
        "name_en": "Barbell Front Squat",
        "category": "legs",
        "category_fa": "پا",
        "equipment": "barbell",
        "equipment_fa": "هالتر",
        "target_muscles": "تمرکز مستقیم بر چهارسر ران و حفظ قامت",
        "secondary_muscles": "عضلات شکم و کر",
        "instructions_fa": "۱. هالتر را روی بخش جلویی شانه‌ها و ترقوه مهار کنید.\n۲. بالاتنه را کاملاً عمود نگه داشته و اسکوات بروید."
    },
    {
        "id": "0585",
        "key": "ex_leg_press",
        "name_fa": "پرس پا با دستگاه ۴۵ درجه",
        "name_en": "Leg Press Machine",
        "category": "legs",
        "category_fa": "پا",
        "equipment": "machine",
        "equipment_fa": "دستگاه",
        "target_muscles": "چهارسر ران و عضلات سرینی",
        "secondary_muscles": "همسترینگ، ساق",
        "instructions_fa": "۱. کمر را به صندلی بچسبانید و پاها را وسط صفحه بگذارید.\n۲. وزنه را تا زاویه ۹۰ درجه زانو پایین آورده و بدون قفل مفصل به بالا برانید."
    },
    {
        "id": "0085",
        "key": "ex_romanian_deadlift_barbell",
        "name_fa": "ددلیفت رومانیایی با هالتر (RDL)",
        "name_en": "Romanian Barbell Deadlift",
        "category": "legs",
        "category_fa": "پا",
        "equipment": "barbell",
        "equipment_fa": "هالتر",
        "target_muscles": "عضلات همسترینگ (پشت پا) و سرینی",
        "secondary_muscles": "فیله کمر",
        "instructions_fa": "۱. با زانوهای کمی خم و پشت صاف، با عقب دادن باسن خم شوید.\n۲. میله را تا زیر زانو پایین برده و با انقباض همسترینگ صاف شوید."
    },
    {
        "id": "0380",
        "key": "ex_romanian_deadlift_dumbbell",
        "name_fa": "ددلیفت رومانیایی با دمبل",
        "name_en": "Romanian Dumbbell Deadlift",
        "category": "legs",
        "category_fa": "پا",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "همسترینگ و فرم‌دهی باسن",
        "secondary_muscles": "فیله کمر",
        "instructions_fa": "۱. دمبل‌ها را جلوی ران نگه دارید و با لولای لگن خم شوید تا کشش پشت پا احساس شود."
    },
    {
        "id": "0367",
        "key": "ex_dumbbell_walking_lunge",
        "name_fa": "لانج راه‌رفتنی با دمبل",
        "name_en": "Dumbbell Walking Lunge",
        "category": "legs",
        "category_fa": "پا",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "چهارسر ران، باسن و تعادل یک‌طرفه",
        "secondary_muscles": "ساق، میان‌تنه",
        "instructions_fa": "۱. یک گام بلند به جلو بردارید و زانوی عقب را به زمین نزدیک کنید.\n۲. با فشار پای جلو گام بعدی را بردارید."
    },
    {
        "id": "0588",
        "key": "ex_leg_extension",
        "name_fa": "جلو پا با دستگاه (اکستنشن)",
        "name_en": "Leg Extension Machine",
        "category": "legs",
        "category_fa": "پا",
        "equipment": "machine",
        "equipment_fa": "دستگاه",
        "target_muscles": "ایزولاسیون کامل عضله چهارسر ران",
        "secondary_muscles": "تاندون کشکک",
        "instructions_fa": "۱. ساق را پشت بالشتک قرار داده و پا را تا صاف شدن زانو بالا بیاورید.\n۲. یک ثانیه در اوج منقبض کنید و آرام پایین بیاورید."
    },
    {
        "id": "0599",
        "key": "ex_lying_leg_curl",
        "name_fa": "پشت پا خوابیده با دستگاه (لگ کرل)",
        "name_en": "Lying Leg Curl Machine",
        "category": "legs",
        "category_fa": "پا",
        "equipment": "machine",
        "equipment_fa": "دستگاه",
        "target_muscles": "عضلات دو سر رانی و همسترینگ",
        "secondary_muscles": "ساق پا",
        "instructions_fa": "۱. روی شکم دراز بکشید و بالشتک را پشت مچ پا مهار کنید.\n۲. پاها را به سمت باسن جمع کرده و آرام رها کنید."
    },
    {
        "id": "0772",
        "key": "ex_standing_calf_raise",
        "name_fa": "ساق پا ایستاده با دستگاه",
        "name_en": "Standing Calf Raise",
        "category": "legs",
        "category_fa": "پا",
        "equipment": "machine",
        "equipment_fa": "دستگاه",
        "target_muscles": "عضله دوقلو ساق (گاستروکنمیوس)",
        "secondary_muscles": "سولئوس (نعلی)",
        "instructions_fa": "۱. پنجه‌ها روی لبه سکو و پاشنه‌ها آزاد باشد.\n۲. پاشنه را کاملاً پایین برده و سپس با نهایت توان روی پنجه بلند شوید."
    },
    {
        "id": "0088",
        "key": "ex_seated_calf_raise",
        "name_fa": "ساق پا نشسته با هالتر/دستگاه",
        "name_en": "Seated Calf Raise",
        "category": "legs",
        "category_fa": "پا",
        "equipment": "barbell",
        "equipment_fa": "هالتر",
        "target_muscles": "عضله نعلی ساق (سولئوس)",
        "secondary_muscles": "مچ پا",
        "instructions_fa": "۱. در حالت نشسته وزنه را روی زانوها مهار کنید.\n۲. با انقباض ساق، پاشنه‌ها را بالا بیاورید."
    },
    {
        "id": "0284",
        "key": "ex_bulgarian_split_squat",
        "name_fa": "اسکوات بلغاری با دمبل",
        "name_en": "Bulgarian Split Squat",
        "category": "legs",
        "category_fa": "پا",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "عضلات باسن و چهارسر تک‌پا",
        "secondary_muscles": "همسترینگ",
        "instructions_fa": "۱. پای عقب را روی نیمکت قرار داده و با پای جلو اسکوات عمیق اجرا کنید."
    },
    {
        "id": "0311",
        "key": "ex_goblet_squat",
        "name_fa": "گابلت اسکوات با دمبل",
        "name_en": "Goblet Squat",
        "category": "legs",
        "category_fa": "پا",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "چهارسر ران و بهبود انعطاف‌پذیری لگن",
        "secondary_muscles": "عضلات شکم و بازو",
        "instructions_fa": "۱. یک دمبل را عمودی جلوی سینه نگه دارید و عمیق بنشینید."
    },

    # --- SHOULDERS (سرشانه) ---
    {
        "id": "0091",
        "key": "ex_overhead_press",
        "name_fa": "پرس سرشانه هالتر نظامی ایستاده (OHP)",
        "name_en": "Standing Barbell Military Press",
        "category": "shoulders",
        "category_fa": "سرشانه",
        "equipment": "barbell",
        "equipment_fa": "هالتر",
        "target_muscles": "دلتوئید قدامی و میانی",
        "secondary_muscles": "پشت بازو، عضلات مرکزی",
        "instructions_fa": "۱. میله را در سطح ترقوه نگه دارید.\n۲. با منقبض کردن شکم و باسن میله را مستقیم بالای سر ببرید."
    },
    {
        "id": "0405",
        "key": "ex_seated_dumbbell_shoulder_press",
        "name_fa": "پرس سرشانه با دمبل نشسته",
        "name_en": "Seated Dumbbell Shoulder Press",
        "category": "shoulders",
        "category_fa": "سرشانه",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "دلتوئید قدامی و پهن کردن سرشانه",
        "secondary_muscles": "پشت بازو",
        "instructions_fa": "۱. روی نیمکت با پشتی عمودی بنشینید.\n۲. دمبل‌ها را از کنار گوش‌ها به سمت بالا پرس کنید."
    },
    {
        "id": "0334",
        "key": "ex_dumbbell_lateral_raise",
        "name_fa": "نشر از جانب با دمبل",
        "name_en": "Dumbbell Lateral Raise",
        "category": "shoulders",
        "category_fa": "سرشانه",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "دلتوئید جانبی (بخش میانی شانه)",
        "secondary_muscles": "کول (تراپزیوس)",
        "instructions_fa": "۱. دمبل‌ها را کنار ران‌ها نگه داشته و بدون تاب دادن تنه تا ارتفاع شانه بالا بیاورید."
    },
    {
        "id": "0188",
        "key": "ex_cable_lateral_raise",
        "name_fa": "نشر جانب با سیم‌کش تک‌دست",
        "name_en": "Cable Lateral Raise",
        "category": "shoulders",
        "category_fa": "سرشانه",
        "equipment": "cable",
        "equipment_fa": "سیم‌کش",
        "target_muscles": "تنش پیوسته بر دلتوئید جانبی",
        "secondary_muscles": "سرشانه میانی",
        "instructions_fa": "۱. سیم‌کش را در پایین‌ترین نقطه بگذارید و دست را تا خط شانه به طرفین بالا بیاورید."
    },
    {
        "id": "0310",
        "key": "ex_dumbbell_front_raise",
        "name_fa": "نشر جلو با دمبل جفت",
        "name_en": "Dumbbell Front Raise",
        "category": "shoulders",
        "category_fa": "سرشانه",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "دلتوئید قدامی (جلوی شانه)",
        "secondary_muscles": "بخش بالایی سینه",
        "instructions_fa": "۱. دمبل‌ها را تا ارتفاع چشم بالا آورده و با کنترل پایین ببرید."
    },
    {
        "id": "0041",
        "key": "ex_barbell_front_raise",
        "name_fa": "نشر جلو با هالتر",
        "name_en": "Barbell Front Raise",
        "category": "shoulders",
        "category_fa": "سرشانه",
        "equipment": "barbell",
        "equipment_fa": "هالتر",
        "target_muscles": "دلتوئید قدامی",
        "secondary_muscles": "سینه فوقانی",
        "instructions_fa": "۱. هالتر را با دستان به عرض شانه تا ارتفاع دید چشم بالا بکشید."
    },
    {
        "id": "0184",
        "key": "ex_cable_face_pull",
        "name_fa": "فیس‌پول با طناب سیم‌کش",
        "name_en": "Cable Face Pull",
        "category": "shoulders",
        "category_fa": "سرشانه",
        "equipment": "cable",
        "equipment_fa": "سیم‌کش",
        "target_muscles": "دلتوئید خلفی (پشت سرشانه) و سلامت روتاتور کاف",
        "secondary_muscles": "بخش بالایی پشت",
        "instructions_fa": "۱. طناب را در سطح پیشانی تنظیم کرده و دو سر طناب را به سمت گوش‌ها بکشید."
    },
    {
        "id": "0377",
        "key": "ex_dumbbell_rear_delt_fly",
        "name_fa": "نشر خم دمبل (دلتوئید خلفی)",
        "name_en": "Dumbbell Rear Delt Fly",
        "category": "shoulders",
        "category_fa": "سرشانه",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "بخش پشتی سرشانه",
        "secondary_muscles": "عضلات رومبوئید",
        "instructions_fa": "۱. بالاتنه را خم کرده و دمبل‌ها را به طرفین مثل بال پرنده باز کنید."
    },
    {
        "id": "0013",
        "key": "ex_arnold_press",
        "name_fa": "پرس سرشانه آرنولدی با دمبل",
        "name_en": "Arnold Dumbbell Press",
        "category": "shoulders",
        "category_fa": "سرشانه",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "درگیری همزمان سرشانه قدامی و جانبی",
        "secondary_muscles": "پشت بازو",
        "instructions_fa": "۱. حرکت را با مچ‌های رو به بدن آغاز کرده و همزمان با بالا بردن مچ‌ها را به بیرون بچرخانید."
    },

    # --- ARMS (بازو و ساعد) ---
    {
        "id": "0031",
        "key": "ex_barbell_bicep_curl",
        "name_fa": "جلو بازو با هالتر صاف ایستاده",
        "name_en": "Barbell Bicep Curl",
        "category": "arms",
        "category_fa": "بازو",
        "equipment": "barbell",
        "equipment_fa": "هالتر",
        "target_muscles": "عضله دو سر بازویی (بایسپس)",
        "secondary_muscles": "ساعد",
        "instructions_fa": "۱. هالتر را اندازه عرض شانه بگیرید و با قفل کردن آرنج‌ها میله را تا سینه بالا ببرید."
    },
    {
        "id": "0040",
        "key": "ex_ez_bar_curl",
        "name_fa": "جلو بازو با میله خم EZ",
        "name_en": "EZ-Bar Bicep Curl",
        "category": "arms",
        "category_fa": "بازو",
        "equipment": "barbell",
        "equipment_fa": "هالتر",
        "target_muscles": "جلو بازو و کاهش فشار روی مچ دست",
        "secondary_muscles": "براکیالیس",
        "instructions_fa": "۱. روی خمش‌های میله EZ دست بگذارید و با انقباض کامل بالا بیاورید."
    },
    {
        "id": "0315",
        "key": "ex_incline_dumbbell_curl",
        "name_fa": "جلو بازو دمبل روی میز شیبدار",
        "name_en": "Incline Dumbbell Curl",
        "category": "arms",
        "category_fa": "بازو",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "سر بلند عضله جلو بازو (پیک بایسپس)",
        "secondary_muscles": "ساعد",
        "instructions_fa": "۱. روی نیمکت شیبدار تکیه دهید و دست‌ها را در حالت آویزان جمع کنید."
    },
    {
        "id": "0313",
        "key": "ex_dumbbell_hammer_curl",
        "name_fa": "جلو بازو دمبل چکشی",
        "name_en": "Dumbbell Hammer Curl",
        "category": "arms",
        "category_fa": "بازو",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "عضله براکیورادیالیس و ضخامت بازو و ساعد",
        "secondary_muscles": "بایسپس",
        "instructions_fa": "۱. دمبل‌ها را به حالت عمودی (کف دست رو به هم) به سمت شانه بالا بکشید."
    },
    {
        "id": "0070",
        "key": "ex_preacher_curl",
        "name_fa": "جلو بازو لاری با میله EZ",
        "name_en": "EZ-Bar Preacher Curl",
        "category": "arms",
        "category_fa": "بازو",
        "equipment": "barbell",
        "equipment_fa": "هالتر",
        "target_muscles": "ایزولاسیون کامل بخش پایینی جلو بازو",
        "secondary_muscles": "ساعد",
        "instructions_fa": "۱. بازوها را روی بالشتک میز لاری قرار داده و با تمرکز بالا ببرید."
    },
    {
        "id": "0868",
        "key": "ex_cable_bicep_curl",
        "name_fa": "جلو بازو با سیم‌کش ایستاده",
        "name_en": "Standing Cable Bicep Curl",
        "category": "arms",
        "category_fa": "بازو",
        "equipment": "cable",
        "equipment_fa": "سیم‌کش",
        "target_muscles": "تنش یکنواخت در تمام طول دامنه جلو بازو",
        "secondary_muscles": "ساعد",
        "instructions_fa": "۱. دسته سیم‌کش را گرفته و با آرنج ثابت به سمت چانه جمع کنید."
    },
    {
        "id": "0241",
        "key": "ex_triceps_rope_pushdown",
        "name_fa": "پشت بازو سیم‌کش با طناب",
        "name_en": "Triceps Rope Pushdown",
        "category": "arms",
        "category_fa": "بازو",
        "equipment": "cable",
        "equipment_fa": "سیم‌کش",
        "target_muscles": "سر خارجی و میانی عضله سه سر بازویی",
        "secondary_muscles": "ساعد",
        "instructions_fa": "۱. طناب را گرفته و در انتهای پایین کشیدن، دو سر طناب را از هم باز کنید."
    },
    {
        "id": "0240",
        "key": "ex_triceps_bar_pushdown",
        "name_fa": "پشت بازو سیم‌کش با میله صاف",
        "name_en": "Triceps Straight-Bar Pushdown",
        "category": "arms",
        "category_fa": "بازو",
        "equipment": "cable",
        "equipment_fa": "سیم‌کش",
        "target_muscles": "عضله سه سر بازویی (پشت بازو)",
        "secondary_muscles": "مچ دست",
        "instructions_fa": "۱. با حفظ آرنج‌ها در کنار بدن میله را به سمت پایین صاف کنید."
    },
    {
        "id": "0060",
        "key": "ex_skull_crusher",
        "name_fa": "پشت بازو هالتر خوابیده (جمجمه‌شکن)",
        "name_en": "Barbell Skull Crusher",
        "category": "arms",
        "category_fa": "بازو",
        "equipment": "barbell",
        "equipment_fa": "هالتر",
        "target_muscles": "سر بلند و میانی پشت بازو",
        "secondary_muscles": "مفصل آرنج",
        "instructions_fa": "۱. روی نیمکت خوابیده و میله را با خم کردن آرنج‌ها تا بالای پیشانی بیاورید."
    },
    {
        "id": "0400",
        "key": "ex_overhead_dumbbell_triceps",
        "name_fa": "پشت بازو دمبل تک جفت‌دست از پشت سر",
        "name_en": "Overhead Dumbbell Triceps Extension",
        "category": "arms",
        "category_fa": "بازو",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "کشش عمیق سر بلند پشت بازو",
        "secondary_muscles": "شانه",
        "instructions_fa": "۱. دمبل را با دو دست پشت سر نگه داشته و با باز کردن آرنج‌ها بالا ببرید."
    },
    {
        "id": "0140",
        "key": "ex_parallel_bar_triceps_dip",
        "name_fa": "دیپ پارالل عمودی (پشت بازو)",
        "name_en": "Parallel Bar Triceps Dip",
        "category": "arms",
        "category_fa": "بازو",
        "equipment": "bodyweight",
        "equipment_fa": "وزن بدن",
        "target_muscles": "پشت بازو و قدرت پرسی",
        "secondary_muscles": "سینه، سرشانه",
        "instructions_fa": "۱. بدن را کاملاً عمود نگه دارید و با خم کردن آرنج‌ها پایین بروید."
    },
    {
        "id": "0328",
        "key": "ex_dumbbell_kickback",
        "name_fa": "پشت بازو دمبل کیک‌بک",
        "name_en": "Dumbbell Triceps Kickback",
        "category": "arms",
        "category_fa": "بازو",
        "equipment": "dumbbell",
        "equipment_fa": "دمبل",
        "target_muscles": "انقباض قله پشت بازو",
        "secondary_muscles": "دلتوئید خلفی",
        "instructions_fa": "۱. تنه را خم کرده و دمبل را به سمت عقب با صاف کردن دست پرتاب کنید."
    },
    {
        "id": "0125",
        "key": "ex_barbell_wrist_curl",
        "name_fa": "ساعد مچ با هالتر نشسته",
        "name_en": "Barbell Wrist Curl",
        "category": "arms",
        "category_fa": "بازو",
        "equipment": "barbell",
        "equipment_fa": "هالتر",
        "target_muscles": "عضلات خم‌کننده مچ و ساعد",
        "secondary_muscles": "پنجه دست",
        "instructions_fa": "۱. ساعدها را روی ران قرار داده و هالتر را با مچ‌ها به بالا خم کنید."
    },

    # --- CORE (شکم و میان‌تنه) ---
    {
        "id": "0472",
        "key": "ex_hanging_leg_raise",
        "name_fa": "زیر شکم خلبانی آویزان از بارفیکس",
        "name_en": "Hanging Leg Raise",
        "category": "core",
        "category_fa": "شکم و میان‌تنه",
        "equipment": "bodyweight",
        "equipment_fa": "وزن بدن",
        "target_muscles": "بخش تحتانی عضلات شکم و فلکسورهای لگن",
        "secondary_muscles": "ساعد، عضلات شانه",
        "instructions_fa": "۱. از بارفیکس آویزان شده و بدون تاب پاها را تا زاویه ۹۰ درجه بالا بیاورید."
    },
    {
        "id": "0630",
        "key": "ex_forearm_plank",
        "name_fa": "پلانک روی آرنج",
        "name_en": "Forearm Plank",
        "category": "core",
        "category_fa": "شکم و میان‌تنه",
        "equipment": "bodyweight",
        "equipment_fa": "وزن بدن",
        "target_muscles": "عضله عرضی شکم و ثبات کل بدن",
        "secondary_muscles": "فیله کمر، باسن",
        "instructions_fa": "۱. بدن را در یک خط افقی صاف روی آرنج‌ها و پنجه پا قفل و منقبض نگه دارید."
    },
    {
        "id": "0274",
        "key": "ex_floor_crunch",
        "name_fa": "کرانچ شکم کلاسیک روی زمین",
        "name_en": "Standard Floor Crunch",
        "category": "core",
        "category_fa": "شکم و میان‌تنه",
        "equipment": "bodyweight",
        "equipment_fa": "وزن بدن",
        "target_muscles": "بخش بالایی عضلات ۶ تکه شکم (Rectus Abdominis)",
        "secondary_muscles": "میان‌تنه",
        "instructions_fa": "۱. زانوها را خم کرده و با انقباض شکم، تیغه‌های شانه را از زمین بلند کنید."
    },
    {
        "id": "0221",
        "key": "ex_kneeling_cable_crunch",
        "name_fa": "کرانچ شکم با طناب سیم‌کش (سجده‌ای)",
        "name_en": "Kneeling Cable Crunch",
        "category": "core",
        "category_fa": "شکم و میان‌تنه",
        "equipment": "cable",
        "equipment_fa": "سیم‌کش",
        "target_muscles": "افزایش حجم و عمق عضلات شکم با وزنه",
        "secondary_muscles": "پهلوها",
        "instructions_fa": "۱. زانو بزنید و طناب را کنار سر مهار کرده و با جمع کردن ستون فقرات خم شوید."
    },
    {
        "id": "0687",
        "key": "ex_russian_twist",
        "name_fa": "چرخش روسی (راشن توئیست)",
        "name_en": "Russian Twist",
        "category": "core",
        "category_fa": "شکم و میان‌تنه",
        "equipment": "bodyweight",
        "equipment_fa": "وزن بدن",
        "target_muscles": "عضلات مورب شکمی (پهلوها)",
        "secondary_muscles": "عضله راست شکمی",
        "instructions_fa": "۱. در حالت V بنشینید و بالاتنه را به صورت متناوب به چپ و راست بچرخانید."
    },
    {
        "id": "0001",
        "key": "ex_ab_wheel_rollout",
        "name_fa": "رول‌اوت شکم با چرخ تمرین (Ab Wheel)",
        "name_en": "Ab Wheel Rollout",
        "category": "core",
        "category_fa": "شکم و میان‌تنه",
        "equipment": "bodyweight",
        "equipment_fa": "وزن بدن",
        "target_muscles": "کل زنجیره قدامی شکم و میان‌تنه ضد اکستنشن",
        "secondary_muscles": "سرشانه، زیربغل",
        "instructions_fa": "۱. زانو زده و چرخ را تا کشش کامل به جلو برانید و با انقباض شکم بازگردید."
    },
    {
        "id": "0245",
        "key": "ex_cable_woodchopper",
        "name_fa": "هیزم‌شکن چرخشی با سیم‌کش",
        "name_en": "Cable Woodchopper",
        "category": "core",
        "category_fa": "شکم و میان‌تنه",
        "equipment": "cable",
        "equipment_fa": "سیم‌کش",
        "target_muscles": "قدرت چرخشی پهلوها و هسته بدن",
        "secondary_muscles": "سرشانه",
        "instructions_fa": "۱. دسته سیم‌کش را با چرخش تنه از بالا به سمت زانوی مخالف هدایت کنید."
    },
    {
        "id": "0003",
        "key": "ex_air_bike",
        "name_fa": "کرانچ دوچرخه (بایسیکل کرانچ)",
        "name_en": "Air Bike Crunch",
        "category": "core",
        "category_fa": "شکم و میان‌تنه",
        "equipment": "bodyweight",
        "equipment_fa": "وزن بدن",
        "target_muscles": "درگیری همزمان شکم و پهلوها",
        "secondary_muscles": "فلکسور ران",
        "instructions_fa": "۱. روی کمر خوابیده و آرنج مخالف را به سمت زانوی مخالف هدایت کنید."
    }
]

def download_gif(item):
    gif_id = item["id"]
    dest_path = os.path.join(GIF_DIR, f"{gif_id}.gif")
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1000:
        return gif_id, True

    url = f"https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/{gif_id}.gif"
    try:
        urllib.request.urlretrieve(url, dest_path)
        print(f"Downloaded {gif_id}.gif ({os.path.getsize(dest_path)} bytes)")
        return gif_id, True
    except Exception as e:
        print(f"Failed {gif_id}: {e}")
        return gif_id, False

def main():
    print(f"Starting download of {len(EXERCISES)} workout GIFs...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        results = list(executor.map(download_gif, EXERCISES))

    success_count = sum(1 for _, ok in results if ok)
    print(f"Downloaded {success_count}/{len(EXERCISES)} GIFs successfully into {GIF_DIR}/")

    # Generate SQL Migration
    sql_lines = [
        "-- ============================================================================",
        "-- Migration: 0002_seed_exercises.sql",
        "-- Real animated gym workout GIFs served locally from /gifs/*.gif",
        "-- Total Curated Exercises: " + str(len(EXERCISES)),
        "-- Target: Cloudflare D1 (SQLite)",
        "-- ============================================================================",
        "",
        "DELETE FROM exercises;",
        ""
    ]

    for ex in EXERCISES:
        ex_id = ex["key"]
        name_fa = ex["name_fa"].replace("'", "''")
        name_en = ex["name_en"].replace("'", "''")
        category = ex["category"]
        category_fa = ex["category_fa"].replace("'", "''")
        equipment = ex["equipment"]
        equipment_fa = ex["equipment_fa"].replace("'", "''")
        target = ex["target_muscles"].replace("'", "''")
        sec = ex.get("secondary_muscles", "").replace("'", "''")
        inst = ex["instructions_fa"].replace("'", "''")
        local_gif = f"/gifs/{ex['id']}.gif"

        sql_lines.append(
            f"INSERT INTO exercises (id, name_fa, name_en, category, category_fa, equipment, equipment_fa, target_muscles, secondary_muscles, instructions_fa, gif_url) "
            f"VALUES ('{ex_id}', '{name_fa}', '{name_en}', '{category}', '{category_fa}', '{equipment}', '{equipment_fa}', '{target}', '{sec}', '{inst}', '{local_gif}');"
        )

    with open("migrations/0002_seed_exercises.sql", "w", encoding="utf-8") as f:
        f.write("\n".join(sql_lines) + "\n")

    print("Wrote updated migrations/0002_seed_exercises.sql")

if __name__ == "__main__":
    main()
