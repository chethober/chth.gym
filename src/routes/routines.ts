// ============================================================================
// Routine Builder & Sharing Routes for جسم و اندیشه
// ============================================================================

import { Hono } from 'hono';
import { Env, User } from '../types';
import { Database } from '../db/queries';
import { requireAuth, optionalAuth } from '../auth/session';
import { getWorkoutSuggestions, getPresetById } from '../data/preloadedWorkouts';

const routinesRouter = new Hono<{ Bindings: Env; Variables: { user?: User } }>();

// GET /api/routines/suggestions -> Get workout routine recommendations based on BMI & goal
routinesRouter.get('/suggestions', optionalAuth, async (c) => {
  const user = c.get('user');
  const db = new Database(c.env.DB);

  let bmiQuery = c.req.query('bmi') ? parseFloat(c.req.query('bmi')!) : undefined;
  let goalQuery = c.req.query('goal');
  let levelQuery = c.req.query('level');

  // If user is authenticated and parameters not fully provided, lookup from user profile in D1
  if (user && (!bmiQuery || !goalQuery)) {
    try {
      const profile = await db.getUserProfile(user.id);
      if (profile) {
        if (!bmiQuery && profile.height_cm > 0 && profile.current_weight_kg > 0) {
          const heightM = profile.height_cm / 100;
          bmiQuery = parseFloat((profile.current_weight_kg / (heightM * heightM)).toFixed(1));
        }
        if (!goalQuery && profile.fitness_goal) {
          goalQuery = profile.fitness_goal;
        }
        if (!levelQuery && profile.fitness_level) {
          levelQuery = profile.fitness_level;
        }
      }
    } catch (e) {}
  }

  const suggestions = getWorkoutSuggestions(bmiQuery, goalQuery, levelQuery);

  return c.json({
    success: true,
    ...suggestions
  });
});

// POST /api/routines/suggestions/import/:id -> Import a preloaded preset into user's saved routines
routinesRouter.post('/suggestions/import/:id', requireAuth, async (c) => {
  const user = c.get('user')!;
  const presetId = c.req.param('id');
  if (!presetId) {
    return c.json({ error: 'شناسه برنامه پیشنهادی نامعتبر است' }, 400);
  }

  const preset = getPresetById(presetId);
  if (!preset) {
    return c.json({ error: 'برنامه پیشنهادی مورد نظر یافت نشد' }, 404);
  }

  const db = new Database(c.env.DB);
  const created = await db.createRoutine(
    user.id,
    preset.title,
    preset.description,
    preset.exercises.map(ex => ({
      exercise_id: ex.exercise_id,
      target_sets: ex.target_sets,
      target_reps: ex.target_reps,
      rest_seconds: ex.rest_seconds
    }))
  );

  return c.json({
    success: true,
    message: `برنامه «${preset.title}» با موفقیت به برنامه‌های تمرینی شما اضافه شد!`,
    routine: created
  });
});

// GET /api/routines/share/:id -> Get public shared routine details (No Auth required)
routinesRouter.get('/share/:id', async (c) => {
  const routineId = c.req.param('id');
  if (!routineId) {
    return c.json({ error: 'شناسه برنامه نامعتبر است' }, 400);
  }

  const db = new Database(c.env.DB);
  const routine = await db.getPublicRoutineById(routineId);

  if (!routine) {
    return c.json({ error: 'برنامه تمرینی مورد نظر یافت نشد یا ممکن است حذف شده باشد' }, 404);
  }

  return c.json({ routine });
});

// POST /api/routines/import/:id -> Import/Clone shared routine to authenticated user profile
routinesRouter.post('/import/:id', requireAuth, async (c) => {
  const user = c.get('user')!;
  const routineId = c.req.param('id');
  if (!routineId) {
    return c.json({ error: 'شناسه برنامه نامعتبر است' }, 400);
  }

  const db = new Database(c.env.DB);
  const cloned = await db.cloneRoutineForUser(user.id, routineId);
  if (!cloned) {
    return c.json({ error: 'برنامه تمرینی برای افزودن به پروفایل یافت نشد' }, 404);
  }

  return c.json({
    success: true,
    message: `برنامه «${cloned.title}» با موفقیت به برنامه‌های تمرینی شما اضافه شد!`,
    routine: cloned
  });
});

// GET /api/routines -> List all routines (user routines if authenticated, empty list for guests)
routinesRouter.get('/', optionalAuth, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ routines: [] });
  }

  const db = new Database(c.env.DB);
  const routines = await db.getRoutinesByUser(user.id);

  return c.json({ routines });
});

// GET /api/routines/:id -> Get routine by ID
routinesRouter.get('/:id', optionalAuth, async (c) => {
  const user = c.get('user');
  const routineId = c.req.param('id');
  if (!routineId) {
    return c.json({ error: 'شناسه برنامه نامعتبر است' }, 400);
  }

  const db = new Database(c.env.DB);
  const routine = user 
    ? await db.getRoutineById(routineId, user.id)
    : await db.getPublicRoutineById(routineId);

  if (!routine) {
    return c.json({ error: 'برنامه تمرینی یافت نشد' }, 404);
  }

  return c.json({ routine });
});

// POST /api/routines -> Create a new routine (Works for both authenticated users and guest clients)
routinesRouter.post('/', optionalAuth, async (c) => {
  const user = c.get('user');
  const userId = user ? user.id : `guest_${crypto.randomUUID().slice(0, 8)}`;
  const body = await c.req.json<{
    title: string;
    description?: string;
    exercises: { exercise_id: string; target_sets: number; target_reps: number; rest_seconds: number }[];
  }>();

  if (!body.title || !body.title.trim()) {
    return c.json({ error: 'عنوان برنامه تمرینی الزامی است' }, 400);
  }

  if (!body.exercises || !Array.isArray(body.exercises) || body.exercises.length === 0) {
    return c.json({ error: 'حداقل یک حرکت باید به برنامه اضافه شود' }, 400);
  }

  const db = new Database(c.env.DB);
  const newRoutine = await db.createRoutine(
    userId,
    body.title.trim(),
    body.description || '',
    body.exercises
  );

  return c.json({
    success: true,
    message: 'برنامه تمرینی با موفقیت ایجاد شد',
    routine: newRoutine
  }, 201);
});

// DELETE /api/routines/:id -> Delete a routine
routinesRouter.delete('/:id', optionalAuth, async (c) => {
  const user = c.get('user');
  const routineId = c.req.param('id');
  if (!routineId) {
    return c.json({ error: 'شناسه برنامه نامعتبر است' }, 400);
  }

  const db = new Database(c.env.DB);
  // If user is authenticated, delete for user; if guest, delete if routine exists
  const existing = await db.getPublicRoutineById(routineId);
  if (!existing) {
    return c.json({ error: 'برنامه تمرینی یافت نشد' }, 404);
  }

  if (user && existing.user_id !== user.id && !existing.user_id.startsWith('guest')) {
    return c.json({ error: 'دسترسی حذف این برنامه را ندارید' }, 403);
  }

  const deleted = await db.deleteRoutine(routineId, existing.user_id);
  if (!deleted) {
    return c.json({ error: 'خطا در حذف برنامه' }, 500);
  }

  return c.json({ success: true, message: 'برنامه تمرینی حذف شد' });
});

export { routinesRouter };
