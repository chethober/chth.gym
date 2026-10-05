import json
import os
import sys
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
        "id": "0227",
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
        "id": "0179",
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
        "id": "0577",
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
        "id": "2616",
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
        "id": "0861",
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
        "id": "0406",
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
        "id": "0739",
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
        "id": "1459",
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
        "id": "0336",
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
        "id": "0585",
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
        "id": "0586",
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
        "id": "0605",
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
        "id": "0410",
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
        "id": "1760",
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
        "id": "1456",
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
        "id": "0178",
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
        "id": "0203",
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
        "id": "0378",
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
        "id": "2137",
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
        "id": "0447",
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
        "id": "0201",
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
        "id": "0430",
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
        "id": "0814",
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
        "id": "0333",
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
        "id": "2135",
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
        "id": "0175",
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
        "id": "0857",
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
        "id": "0862",
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

# ----------------------------------------------------------------------------
# Extended library: migrations/0004_exercise_library.sql
#
# Source: hasaneyldrm/exercises-dataset (MIT for text & data; its media is NOT
# covered and is deliberately not downloaded here). Pinned to a commit so the
# generated migration is reproducible. Exercise ids are the same 4-digit
# ExerciseDB ids the curated GIFs above already use.
# ----------------------------------------------------------------------------

DATASET_SHA = "7455efae41b330c265e7cd4b78dfa848e7ce5ebd"
DATASET_URL = f"https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/{DATASET_SHA}/data/exercises.json"

CATEGORY_MAP = {
    "chest": "chest",
    "back": "back",
    "upper legs": "legs",
    "lower legs": "legs",
    "shoulders": "shoulders",
    "upper arms": "arms",
    "lower arms": "arms",
    "waist": "core",
}

CATEGORY_FA = {
    "chest": "سینه",
    "back": "پشت و زیربغل",
    "legs": "پا",
    "shoulders": "سرشانه",
    "arms": "بازو",
    "core": "شکم و میان‌تنه",
}

EQUIPMENT_MAP = {
    "barbell": "barbell",
    "olympic barbell": "barbell",
    "dumbbell": "dumbbell",
    "cable": "cable",
    "leverage machine": "machine",
    "smith machine": "machine",
    "sled machine": "machine",
    "body weight": "bodyweight",
    "assisted": "bodyweight",
    "weighted": "bodyweight",
}

EQUIPMENT_FA = {
    "barbell": "هالتر",
    "dumbbell": "دمبل",
    "cable": "سیم‌کش",
    "machine": "دستگاه",
    "bodyweight": "وزن بدن",
    "other": "سایر",
}

# ExerciseDB muscle vocabulary -> MuscleMap body slugs (src/frontend/bodyPaths.ts).
# None = deliberately not drawn (no matching region on the body map).
MUSCLE_MAP = {
    "abs": "abs", "abdominals": "abs", "lower abs": "abs", "core": "abs",
    "obliques": "obliques",
    "pectorals": "chest", "chest": "chest", "upper chest": "chest",
    "serratus anterior": "serratus",
    "delts": "deltoids", "deltoids": "deltoids", "shoulders": "deltoids",
    "rear deltoids": "deltoids", "rotator cuff": "deltoids",
    "biceps": "biceps", "brachialis": "biceps",
    "triceps": "triceps",
    "forearms": "forearm", "wrist flexors": "forearm", "wrist extensors": "forearm",
    "wrists": "forearm", "grip muscles": "forearm",
    "traps": "trapezius", "trapezius": "trapezius", "levator scapulae": "trapezius",
    "lats": "upper-back", "latissimus dorsi": "upper-back", "upper back": "upper-back",
    "rhomboids": "upper-back", "back": "upper-back",
    "spine": "lower-back", "lower back": "lower-back",
    "glutes": "gluteal", "abductors": "gluteal",
    "quads": "quadriceps", "quadriceps": "quadriceps",
    "hamstrings": "hamstring",
    "adductors": "adductors", "inner thighs": "adductors", "groin": "adductors",
    "hip flexors": "hip-flexors",
    "calves": "calves", "soleus": "calves",
    "shins": "tibialis",
    "ankles": None, "ankle stabilizers": None, "feet": None, "hands": None,
    "sternocleidomastoid": None, "cardiovascular system": None,
}


# Curated rows whose GIF id points at a *different* dataset exercise (e.g. the
# "Dumbbell Shrug" GIF 0411 is really a single-leg squat). Their muscles are
# tagged by hand from the curated name instead of from the dataset record.
# (primary slugs, secondary slugs)
CURATED_MUSCLE_OVERRIDES = {
    "ex_cable_low_fly": (["chest"], ["deltoids"]),
    "ex_machine_chest_press": (["chest"], ["deltoids", "triceps"]),
    "ex_close_grip_lat_pulldown": (["upper-back"], ["biceps"]),
    "ex_seated_cable_row": (["upper-back"], ["biceps", "trapezius"]),
    "ex_dumbbell_shrug": (["trapezius"], []),
    "ex_leg_press": (["quadriceps"], ["gluteal", "hamstring"]),
    "ex_romanian_deadlift_dumbbell": (["hamstring"], ["gluteal", "lower-back"]),
    "ex_dumbbell_walking_lunge": (["quadriceps"], ["gluteal", "hamstring", "calves"]),
    "ex_leg_extension": (["quadriceps"], []),
    "ex_standing_calf_raise": (["calves"], []),
    "ex_bulgarian_split_squat": (["quadriceps"], ["gluteal", "hamstring"]),
    "ex_goblet_squat": (["quadriceps"], ["gluteal", "abs"]),
    "ex_cable_lateral_raise": (["deltoids"], ["trapezius"]),
    "ex_cable_face_pull": (["deltoids"], ["upper-back", "trapezius"]),
    "ex_arnold_press": (["deltoids"], ["triceps"]),
    "ex_ez_bar_curl": (["biceps"], ["forearm"]),
    "ex_triceps_bar_pushdown": (["triceps"], []),
    "ex_overhead_dumbbell_triceps": (["triceps"], []),
    "ex_parallel_bar_triceps_dip": (["triceps"], ["chest", "deltoids"]),
    "ex_dumbbell_kickback": (["triceps"], []),
    "ex_forearm_plank": (["abs"], ["obliques", "deltoids"]),
    "ex_kneeling_cable_crunch": (["abs"], ["obliques"]),
    "ex_ab_wheel_rollout": (["abs"], ["upper-back", "deltoids"]),
    "ex_cable_woodchopper": (["obliques"], ["abs", "deltoids"]),
}


def sql_str(value):
    if value is None:
        return "NULL"
    return "'" + str(value).replace("'", "''") + "'"


def map_muscles(names, unmapped):
    slugs = []
    for name in names:
        key = name.strip().lower()
        if key not in MUSCLE_MAP:
            unmapped[key] = unmapped.get(key, 0) + 1
            continue
        slug = MUSCLE_MAP[key]
        if slug and slug not in slugs:
            slugs.append(slug)
    return slugs


def english_steps(item):
    steps = (item.get("instruction_steps") or {}).get("en") or []
    if steps:
        return "\n".join(f"{i}. {s.strip()}" for i, s in enumerate(steps, 1))
    return ((item.get("instructions") or {}).get("en") or "").strip()


def build_library():
    print(f"Fetching exercise dataset @ {DATASET_SHA[:7]}...")
    with urllib.request.urlopen(DATASET_URL) as res:
        dataset = json.load(res)

    curated_by_source = {ex["id"]: ex for ex in EXERCISES if ex["key"] not in CURATED_MUSCLE_OVERRIDES}
    unmapped = {}
    updates, inserts, skipped = [], [], 0

    for key, (primary, secondary) in CURATED_MUSCLE_OVERRIDES.items():
        updates.append(
            f"UPDATE exercises SET muscles_primary = {sql_str(','.join(primary))}, "
            f"muscles_secondary = {sql_str(','.join(secondary))} WHERE id = {sql_str(key)};"
        )

    matched = set()
    for item in dataset:
        primary = map_muscles([item["target"]], unmapped)
        secondary = [m for m in map_muscles(item.get("secondary_muscles") or [], unmapped) if m not in primary]
        instructions_en = english_steps(item)

        curated = curated_by_source.get(item["id"])
        if curated:
            matched.add(item["id"])
            updates.append(
                f"UPDATE exercises SET muscles_primary = {sql_str(','.join(primary))}, "
                f"muscles_secondary = {sql_str(','.join(secondary))}, "
                f"instructions_en = {sql_str(instructions_en)}, source_id = {sql_str(item['id'])} "
                f"WHERE id = {sql_str(curated['key'])};"
            )
            continue

        category = CATEGORY_MAP.get(item["body_part"])
        if not category:
            skipped += 1
            continue

        equipment = EQUIPMENT_MAP.get(item["equipment"], "other")
        name_en = item["name"][:1].upper() + item["name"][1:]
        inserts.append(
            "INSERT OR IGNORE INTO exercises (id, name_fa, name_en, category, category_fa, equipment, equipment_fa, "
            "target_muscles, secondary_muscles, instructions_fa, gif_url, muscles_primary, muscles_secondary, instructions_en, source_id) "
            f"VALUES ({sql_str('ex_db_' + item['id'])}, {sql_str(name_en)}, {sql_str(name_en)}, {sql_str(category)}, "
            f"{sql_str(CATEGORY_FA[category])}, {sql_str(equipment)}, {sql_str(EQUIPMENT_FA[equipment])}, "
            f"{sql_str(item['target'])}, {sql_str(', '.join(item.get('secondary_muscles') or []))}, "
            f"'', '', {sql_str(','.join(primary))}, {sql_str(','.join(secondary))}, "
            f"{sql_str(instructions_en)}, {sql_str(item['id'])});"
        )

    missing = sorted(set(curated_by_source) - matched)
    sql_lines = [
        "-- ============================================================================",
        "-- Migration: 0004_exercise_library.sql",
        "-- Generated by scripts/build_exercise_dataset.py --library",
        f"-- Source: hasaneyldrm/exercises-dataset @ {DATASET_SHA} (MIT, see NOTICE.md)",
        f"-- Curated rows tagged: {len(updates)} / New library rows: {len(inserts)}",
        "-- New rows ship without media (gif_url = '') and without Persian text yet",
        "-- (instructions_fa = ''; the UI falls back to instructions_en).",
        "-- ============================================================================",
        "",
        "ALTER TABLE exercises ADD COLUMN muscles_primary TEXT;",
        "ALTER TABLE exercises ADD COLUMN muscles_secondary TEXT;",
        "ALTER TABLE exercises ADD COLUMN instructions_en TEXT;",
        "ALTER TABLE exercises ADD COLUMN source_id TEXT;",
        "",
        *updates,
        "",
        *inserts,
        "",
    ]
    with open("migrations/0004_exercise_library.sql", "w", encoding="utf-8") as f:
        f.write("\n".join(sql_lines))

    print(f"Tagged {len(updates)} curated exercises, added {len(inserts)}, skipped {skipped} (cardio/neck).")
    if missing:
        print(f"WARNING: curated ids not found in dataset: {', '.join(missing)}")
    if unmapped:
        print("WARNING: unmapped muscle names: " + ", ".join(f"{k} ({v})" for k, v in sorted(unmapped.items())))
    print("Wrote migrations/0004_exercise_library.sql")


# ----------------------------------------------------------------------------
# Persian library + media: migrations/0005_persian_library.sql
#
# Gives every exercise the same shape as the curated ones: Persian name (the UI
# shows the English name in parentheses), Persian target/secondary muscles,
# numbered Persian instructions, and an animated GIF. Translations live in
# scripts/i18n/exercises_fa.json. Library GIFs are served from jsDelivr at a
# pinned commit of the same GIF repo the curated /gifs/*.gif come from.
# ----------------------------------------------------------------------------

GIFS_SHA = "ebf642cd90fdf73a6c73e7127e93b607b12c229e"
GIF_CDN = f"https://cdn.jsdelivr.net/gh/omercotkd/exercises-gifs@{GIFS_SHA}/assets"
GIFS_MISSING = {"0609"}  # not present in the GIF repo; the UI falls back to the body map

MUSCLE_FA = {
    "abs": "شکم", "abdominals": "شکم", "lower abs": "پایین شکم", "core": "میان‌تنه",
    "obliques": "پهلوها", "pectorals": "سینه", "chest": "سینه", "upper chest": "بالاسینه",
    "serratus anterior": "دندانه‌ای قدامی", "delts": "سرشانه", "deltoids": "سرشانه",
    "shoulders": "شانه‌ها", "rear deltoids": "دلتوئید خلفی", "rotator cuff": "روتاتور کاف",
    "biceps": "جلو بازو", "brachialis": "بازویی", "triceps": "پشت بازو",
    "forearms": "ساعد", "wrist flexors": "خم‌کننده‌های مچ", "wrist extensors": "بازکننده‌های مچ",
    "wrists": "مچ دست", "grip muscles": "عضلات پنجه", "hands": "دست‌ها",
    "traps": "کول (ذوزنقه)", "trapezius": "کول (ذوزنقه)", "levator scapulae": "بالابرنده کتف",
    "lats": "زیربغل", "latissimus dorsi": "زیربغل", "upper back": "بالای پشت",
    "rhomboids": "متوازی‌الاضلاع", "back": "پشت", "spine": "فیله کمر", "lower back": "پایین کمر",
    "glutes": "سرینی (باسن)", "abductors": "دورکننده ران", "adductors": "نزدیک‌کننده ران",
    "inner thighs": "داخل ران", "groin": "کشاله ران", "hip flexors": "خم‌کننده ران",
    "quads": "چهارسر ران", "quadriceps": "چهارسر ران", "hamstrings": "همسترینگ (پشت ران)",
    "calves": "ساق پا", "soleus": "نعلی", "shins": "ساق جلویی", "ankles": "مچ پا",
    "ankle stabilizers": "تثبیت‌کننده‌های مچ پا", "feet": "پاها",
    "sternocleidomastoid": "جناغی‌چنبری", "cardiovascular system": "قلبی‌عروقی",
}

FA_DIGITS = str.maketrans("0123456789", "۰۱۲۳۴۵۶۷۸۹")


def muscles_fa(names):
    out = []
    for n in names:
        fa = MUSCLE_FA[n.strip().lower()]
        if fa not in out:
            out.append(fa)
    return "، ".join(out)


def persian_steps(item, sentences):
    steps = [s.strip() for s in item["instruction_steps"]["en"]]
    return "\n".join(f"{str(i).translate(FA_DIGITS)}. {sentences[s]}" for i, s in enumerate(steps, 1))


def clean_name_en(name):
    name = name.replace("в°", "°")
    return name[:1].upper() + name[1:]


def build_persian():
    with open("scripts/i18n/exercises_fa.json", encoding="utf-8") as f:
        fa = json.load(f)
    print(f"Fetching exercise dataset @ {DATASET_SHA[:7]}...")
    with urllib.request.urlopen(DATASET_URL) as res:
        dataset = {item["id"]: item for item in json.load(res)}

    unmapped = {}
    curated_ids = {ex["id"] for ex in EXERCISES}
    lines = []

    # Curated rows: correct GIF + dataset muscle tags; keep their hand-written Persian name/instructions
    for ex in EXERCISES:
        item = dataset[ex["id"]]
        primary = map_muscles([item["target"]], unmapped)
        secondary = [m for m in map_muscles(item.get("secondary_muscles") or [], unmapped) if m not in primary]
        lines.append(
            f"UPDATE exercises SET gif_url = {sql_str('/gifs/' + ex['id'] + '.gif')}, "
            f"target_muscles = {sql_str(muscles_fa([item['target']]))}, "
            f"secondary_muscles = {sql_str(muscles_fa(item.get('secondary_muscles') or []))}, "
            f"muscles_primary = {sql_str(','.join(primary))}, muscles_secondary = {sql_str(','.join(secondary))}, "
            f"instructions_en = {sql_str(english_steps(item))}, source_id = {sql_str(item['id'])} "
            f"WHERE id = {sql_str(ex['key'])};"
        )
        # A library row that duplicates a (re-pointed) curated exercise goes, unless someone already used it
        dup = sql_str("ex_db_" + ex["id"])
        lines.append(
            f"DELETE FROM exercises WHERE id = {dup} "
            f"AND id NOT IN (SELECT exercise_id FROM workout_set_logs) "
            f"AND id NOT IN (SELECT exercise_id FROM routine_exercises);"
        )

    upserts = 0
    for item in dataset.values():
        category = CATEGORY_MAP.get(item["body_part"])
        if not category or item["id"] in curated_ids:
            continue
        primary = map_muscles([item["target"]], unmapped)
        secondary = [m for m in map_muscles(item.get("secondary_muscles") or [], unmapped) if m not in primary]
        equipment = EQUIPMENT_MAP.get(item["equipment"], "other")
        gif = "" if item["id"] in GIFS_MISSING else f"{GIF_CDN}/{item['id']}.gif"
        values = {
            "id": "ex_db_" + item["id"],
            "name_fa": fa["names"][item["id"]],
            "name_en": clean_name_en(item["name"]),
            "category": category,
            "category_fa": CATEGORY_FA[category],
            "equipment": equipment,
            "equipment_fa": EQUIPMENT_FA[equipment],
            "target_muscles": muscles_fa([item["target"]]),
            "secondary_muscles": muscles_fa(item.get("secondary_muscles") or []),
            "instructions_fa": persian_steps(item, fa["sentences"]),
            "gif_url": gif,
            "muscles_primary": ",".join(primary),
            "muscles_secondary": ",".join(secondary),
            "instructions_en": english_steps(item),
            "source_id": item["id"],
        }
        cols = ", ".join(values)
        vals = ", ".join(sql_str(v) for v in values.values())
        updates = ", ".join(f"{c} = excluded.{c}" for c in values if c != "id")
        lines.append(f"INSERT INTO exercises ({cols}) VALUES ({vals}) ON CONFLICT(id) DO UPDATE SET {updates};")
        upserts += 1

    if unmapped:
        raise SystemExit(f"Unmapped muscle names: {unmapped}")

    # D1 rejects very large migration files, so split into parts under ~800 KB
    parts, current, size = [], [], 0
    for line in lines:
        n = len(line.encode("utf-8")) + 1
        if current and size + n > 800_000:
            parts.append(current)
            current, size = [], 0
        current.append(line)
        size += n
    parts.append(current)

    for i, part in enumerate(parts):
        name = f"{5 + i:04d}_persian_library_{i + 1}.sql"
        header = [
            "-- ============================================================================",
            f"-- Migration: {name} (part {i + 1} of {len(parts)})",
            "-- Generated by scripts/build_exercise_dataset.py --persian",
            "-- Persian names/muscles/instructions for the whole library (scripts/i18n/exercises_fa.json),",
            f"-- GIFs for every exercise (library via jsDelivr @ omercotkd/exercises-gifs {GIFS_SHA[:7]}),",
            "-- and curated rows re-pointed at the GIF that actually shows them.",
            "-- ============================================================================",
            "",
        ]
        with open(f"migrations/{name}", "w", encoding="utf-8") as f:
            f.write("\n".join(header + part) + "\n")
        print(f"Wrote migrations/{name} ({len(part)} statements)")
    print(f"{len(EXERCISES)} curated, {upserts} library rows")


if __name__ == "__main__":
    if "--library" in sys.argv:
        build_library()
    elif "--persian" in sys.argv:
        build_persian()
    else:
        main()
