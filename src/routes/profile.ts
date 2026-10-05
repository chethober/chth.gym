// ============================================================================
// User Profile, Goals & Daily Check-in Routes for جسم و اندیشه
// ============================================================================

import { Hono } from 'hono';
import { Env, User, UserProfile } from '../types';
import { Database } from '../db/queries';
import { requireAuth } from '../auth/session';

const profileRouter = new Hono<{ Bindings: Env; Variables: { user: User } }>();

// All profile endpoints require authentication
profileRouter.use('*', requireAuth);

// GET /api/profile -> Get user profile, goals, and today's check-in status
profileRouter.get('/', async (c) => {
  const user = c.get('user');
  const db = new Database(c.env.DB);

  const profile = await db.getUserProfile(user.id);
  const dailyLogs = await db.getDailyLogs(user.id, 30);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = dailyLogs.find(l => l.log_date === todayStr) || null;

  return c.json({
    user,
    profile,
    dailyLogs,
    todayLog,
    hasLoggedToday: !!todayLog
  });
});

// PUT /api/profile -> Update user profile and fitness goals
profileRouter.put('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json<Partial<UserProfile>>();
  const db = new Database(c.env.DB);

  const updatedProfile = await db.upsertUserProfile(user.id, body);

  return c.json({
    success: true,
    message: 'اطلاعات و اهداف با موفقیت ذخیره شدند',
    profile: updatedProfile
  });
});

// POST /api/profile/daily-log -> Log daily weight, water intake, notes
profileRouter.post('/daily-log', async (c) => {
  const user = c.get('user');
  const body = await c.req.json<{
    weight_kg?: number;
    water_liters?: number;
    notes?: string;
    log_date?: string;
  }>();

  const db = new Database(c.env.DB);
  const log = await db.logDailyMetric(
    user.id,
    body.weight_kg,
    body.water_liters,
    body.notes,
    body.log_date
  );

  return c.json({
    success: true,
    message: 'ثبت روزانه شما با موفقیت ذخیره شد!',
    log
  });
});

// GET /api/profile/daily-logs -> Get history of daily logs
profileRouter.get('/daily-logs', async (c) => {
  const user = c.get('user');
  const limit = Number(c.req.query('limit')) || 30;
  const db = new Database(c.env.DB);
  const logs = await db.getDailyLogs(user.id, limit);

  return c.json({ logs });
});

// GET /api/profile/weekly-plan -> Saved routines scheduled per weekday (0 = Saturday)
profileRouter.get('/weekly-plan', async (c) => {
  const user = c.get('user');
  const db = new Database(c.env.DB);
  const plan = await db.getWeeklyPlan(user.id);

  return c.json({ plan });
});

// PUT /api/profile/weekly-plan -> Replace the weekly plan
profileRouter.put('/weekly-plan', async (c) => {
  const user = c.get('user');
  const body = await c.req.json<{ plan?: Record<string, unknown> }>().catch(() => ({} as { plan?: Record<string, unknown> }));
  const input = body.plan && typeof body.plan === 'object' ? body.plan : {};

  const plan: Record<string, string[]> = {};
  for (let day = 0; day < 7; day++) {
    const ids = input[String(day)];
    if (!Array.isArray(ids)) continue;
    const clean = [...new Set(ids.filter((id): id is string => typeof id === 'string' && id.length > 0 && id.length <= 64))].slice(0, 6);
    if (clean.length > 0) plan[String(day)] = clean;
  }

  const db = new Database(c.env.DB);
  await db.saveWeeklyPlan(user.id, plan);

  return c.json({ success: true, plan });
});

export { profileRouter };
