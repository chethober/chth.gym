#!/usr/bin/env node
// Dev-only: seed the LOCAL D1/KV with two signed-in users so layouts can be checked
// against kind data and against the worst realistic data.
//
//   npx wrangler dev --port 8787      (in another terminal)
//   node scripts/seed-worst-case.mjs [http://localhost:8787]
//
// Then switch datasets by setting the jesm_session cookie on localhost (devtools →
// Application → Cookies) to the printed value: ses_dev_demo or ses_dev_worst.
// Writes only to the --local state; it never touches the remote database.
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = process.argv[2] || 'http://localhost:8787';
const wrangler = (...args) => execFileSync('npx', ['wrangler', ...args, '--local'], { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const sql = q => { const f = join(mkdtempSync(join(tmpdir(), 'seed-')), 'q.sql'); writeFileSync(f, q); wrangler('d1', 'execute', 'jesm-db', '--file', f); };
const esc = s => s.replace(/'/g, "''");

const USERS = {
  demo: { id: 'dev_demo', name: 'علی رضایی', email: 'ali@example.com', avatar: null },
  // A real Google display name and a long institutional address; the avatar URL 404s.
  worst: {
    id: 'dev_worst',
    name: 'سیده فاطمه‌زهرا موسوی‌نژاد طباطبایی',
    email: 'fatemeh.zahra.mousavinejad.tabatabaei@university-of-tehran-alumni.example.com',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocK-expired-avatar=s96-c',
  },
};

// Longest exercise names in the library, so rows meet their real worst case.
const LONG_EX = ['ex_db_1680', 'ex_db_0010', 'ex_db_1679', 'ex_db_3240', 'ex_db_1649', 'ex_db_3241'];

async function session(user) {
  sql(`DELETE FROM users WHERE id='${user.id}';
INSERT INTO users (id, google_id, email, name, avatar_url) VALUES ('${user.id}', 'g_${user.id}', '${esc(user.email)}', '${esc(user.name)}', ${user.avatar ? `'${esc(user.avatar)}'` : 'NULL'});`);
  const sid = `ses_${user.id}`;
  const data = { userId: user.id, email: user.email, name: user.name, avatarUrl: user.avatar || undefined, expiresAt: Date.now() + 30 * 864e5 };
  wrangler('kv', 'key', 'put', '--binding', 'KV_SESSIONS', `session:${sid}`, JSON.stringify(data));
  return sid;
}

async function api(sid, method, path, body) {
  const res = await fetch(BASE + path, { method, headers: { 'Content-Type': 'application/json', Cookie: `jesm_session=${sid}` }, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${await res.text()}`);
  return res.json();
}

async function workout(sid, routine, sets, notes) {
  const { session: w } = await api(sid, 'POST', '/api/workouts/start', { routine_id: routine.id });
  for (const s of sets) await api(sid, 'POST', `/api/workouts/${w.id}/log-set`, s);
  await api(sid, 'POST', `/api/workouts/${w.id}/finish`, { notes });
  return w.id;
}

async function seedDemo() {
  const sid = await session(USERS.demo);
  const { routine } = await api(sid, 'POST', '/api/routines', { title: 'روز سینه', description: 'سینه و پشت بازو', exercises: [{ exercise_id: LONG_EX[3], target_sets: 3, target_reps: 10, rest_seconds: 60 }] });
  await workout(sid, routine, [{ exercise_id: LONG_EX[3], set_number: 1, reps: 10, weight_kg: 40 }], '');
  return sid;
}

async function seedWorst() {
  const u = USERS.worst;
  const sid = await session(u);
  sql(`INSERT OR REPLACE INTO user_profiles (user_id, gender, age, height_cm, current_weight_kg, target_weight_kg, fitness_level, fitness_goal, target_weekly_workouts, daily_water_target_liters)
VALUES ('${u.id}', 'female', 67, 198.5, 142.5, 68.25, 'advanced', 'fat_loss', 7, 4.75);`);

  const ex = (id, sets = 5, reps = 12, rest = 180) => ({ exercise_id: id, target_sets: sets, target_reps: reps, rest_seconds: rest });
  const routines = [];
  // 1: a title a coach would actually write, plus a pasted description
  routines.push((await api(sid, 'POST', '/api/routines', {
    title: 'برنامه سه‌روزه قدرتی بالاتنه و پایین‌تنه با تمرکز ویژه روی اسکوات و ددلیفت برای آمادگی مسابقات پاورلیفتینگ',
    description: 'این برنامه را مربی باشگاه برای فصل آماده‌سازی نوشته است. هفته‌های اول تا چهارم با ۷۰٪ یک تکرار بیشینه شروع کنید و هر هفته ۲٫۵ کیلوگرم اضافه کنید؛ در هفته پنجم بارگذاری را کم کنید (دی‌لود). قبل از هر جلسه ۱۰ دقیقه گرم کردن عمومی و تحرک‌پذیری لگن و مچ پا فراموش نشود.',
    exercises: [...LONG_EX, ...LONG_EX].map(id => ex(id, 10, 100, 600)),
  })).routine);
  // 2: one character
  routines.push((await api(sid, 'POST', '/api/routines', { title: '۱', exercises: [ex(LONG_EX[0], 1, 1, 0)] })).routine);
  // 3: mixed scripts and an emoji, the bidi worst case
  routines.push((await api(sid, 'POST', '/api/routines', { title: 'Push Day 💪 — هفته ۳ (PPL v2.1)', description: 'Bench / OHP / Dips', exercises: [ex(LONG_EX[1]), ex(LONG_EX[2])] })).routine);
  // 4: an unbroken Latin token (pasted URL / hashtag)
  routines.push((await api(sid, 'POST', '/api/routines', { title: '#upper_lower_split_hypertrophy_block_2026_final_v3', exercises: [ex(LONG_EX[4])] })).routine);
  // Many more, so lists reach their realistic length
  for (let i = 5; i <= 24; i++) routines.push((await api(sid, 'POST', '/api/routines', { title: `برنامه شماره ${i}`, exercises: [ex(LONG_EX[i % 6])] })).routine);

  // History: heavy volume, decimals, a set with 0 reps, a 4-hour session, long notes, and an empty session
  const heavy = [];
  for (let i = 1; i <= 40; i++) heavy.push({ exercise_id: LONG_EX[i % 6], set_number: i, reps: i === 3 ? 0 : 12, weight_kg: 1 + (i % 2 ? 287.5 : 2.5) });
  await workout(sid, routines[0], heavy, 'زانوی چپ از ست سوم درد گرفت؛ هفته بعد اسکوات را سبک‌تر بزنم و حتماً با فیزیوتراپ هماهنگ کنم. https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG');
  await workout(sid, routines[2], [{ exercise_id: LONG_EX[1], set_number: 1, reps: 1, weight_kg: 0.5 }], '');
  await workout(sid, routines[1], [], '');
  for (let i = 0; i < 30; i++) await workout(sid, routines[3 + (i % 3)], [{ exercise_id: LONG_EX[i % 6], set_number: 1, reps: 8, weight_kg: 102.5 }], '');
  // Spread history over past weeks, and make one session very long
  sql(`UPDATE workout_sessions SET start_time = datetime('now', '-' || (abs(random()) % 60) || ' days'), end_time = start_time WHERE user_id='${u.id}';
UPDATE workout_sessions SET duration_seconds = 14460 WHERE user_id='${u.id}' AND title LIKE 'برنامه سه‌روزه%';`);

  // Weekly plan: a full day (6 is the server max), and the long-title routine on most days
  const plan = { 0: routines.slice(0, 6).map(r => r.id), 1: [routines[0].id], 2: [routines[2].id], 3: [routines[3].id], 4: [routines[0].id, routines[2].id], 5: [routines[1].id] };
  await api(sid, 'PUT', '/api/profile/weekly-plan', { plan });
  // Today's check-in with a long note
  await api(sid, 'POST', '/api/profile/daily-log', { weight_kg: 142.5, water_liters: 4.75, notes: 'خواب کم، استرس کاری زیاد. ' .repeat(8) });
  // An in-progress workout with every long-named exercise
  await api(sid, 'POST', '/api/workouts/start', { routine_id: routines[0].id });
  return sid;
}

const demo = await seedDemo();
const worst = await seedWorst();
console.log(JSON.stringify({ demo, worst }));
