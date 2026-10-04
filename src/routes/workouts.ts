// ============================================================================
// Workout Tracking & Logging Routes for جسم و اندیشه
// ============================================================================

import { Hono } from 'hono';
import { Env, User } from '../types';
import { Database } from '../db/queries';
import { requireAuth } from '../auth/session';
import { getPresetById } from '../data/preloadedWorkouts';

const workoutsRouter = new Hono<{ Bindings: Env; Variables: { user: User } }>();

// Require authentication for all workout endpoints
workoutsRouter.use('*', requireAuth);

// GET /api/workouts/active -> Get current active workout session
workoutsRouter.get('/active', async (c) => {
  const user = c.get('user');
  const db = new Database(c.env.DB);
  const session = await db.getActiveWorkoutSession(user.id);

  return c.json({ session });
});

// POST /api/workouts/start -> Start a new workout session
workoutsRouter.post('/start', async (c) => {
  const user = c.get('user');
  const body = (await c.req.json().catch(() => ({}))) as {
    title?: string;
    routine_id?: string;
    preset_id?: string;
  };

  const db = new Database(c.env.DB);

  let targetRoutineId = body.routine_id;
  let targetTitle = body.title;

  // If starting from a preloaded preset, auto-clone into user's routines if needed
  if (body.preset_id) {
    const preset = getPresetById(body.preset_id);
    if (preset) {
      targetTitle = targetTitle || preset.title;
      const userRoutines = await db.getRoutinesByUser(user.id);
      let existingRoutine = userRoutines.find(r => r.title === preset.title);
      if (!existingRoutine) {
        existingRoutine = await db.createRoutine(
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
      }
      targetRoutineId = existingRoutine.id;
    }
  }

  const session = await db.startWorkoutSession(user.id, targetTitle, targetRoutineId);

  return c.json({
    success: true,
    session
  });
});

// Helper handler for logging a set
async function handleLogSet(c: any) {
  const user = c.get('user');
  const sessionId = c.req.param('id') || '';
  const body = (await c.req.json()) as {
    exercise_id: string;
    set_number: number;
    reps: number;
    weight_kg: number;
    rpe?: number;
  };

  if (!body.exercise_id) {
    return c.json({ error: 'شناسه حرکت الزامی است' }, 400);
  }

  const db = new Database(c.env.DB);
  const { log, isPr, isE1rmPr } = await db.logWorkoutSet(
    user.id,
    sessionId,
    body.exercise_id,
    Number(body.set_number) || 1,
    Number(body.reps) || 0,
    Number(body.weight_kg) || 0,
    body.rpe ? Number(body.rpe) : undefined
  );

  return c.json({
    success: true,
    log,
    set_log: log,
    isPr,
    is_pr: isPr,
    is_e1rm_pr: isE1rmPr,
    message: isPr ? '🔥 تبریک! یک رکورد شخصی (PR) جدید ثبت شد!' : 'ست با موفقیت ثبت شد'
  });
}

// POST /api/workouts/:id/log-set & POST /api/workouts/:id/sets -> Log a completed set
workoutsRouter.post('/:id/log-set', handleLogSet);
workoutsRouter.post('/:id/sets', handleLogSet);

// Helper handler for deleting a set
async function handleDeleteSet(c: any) {
  const user = c.get('user');
  const setId = c.req.param('setId') || '';
  const db = new Database(c.env.DB);

  const deleted = await db.deleteWorkoutSet(setId, user.id);
  if (!deleted) {
    return c.json({ error: 'ست مورد نظر یافت نشد' }, 404);
  }

  return c.json({ success: true, message: 'ست حذف شد' });
}

// DELETE /api/workouts/:id/delete-set/:setId & DELETE /api/workouts/:id/sets/:setId -> Delete a logged set
workoutsRouter.delete('/:id/delete-set/:setId', handleDeleteSet);
workoutsRouter.delete('/:id/sets/:setId', handleDeleteSet);

// POST /api/workouts/:id/finish -> Complete workout session
workoutsRouter.post('/:id/finish', async (c) => {
  const user = c.get('user');
  const sessionId = c.req.param('id') || '';
  const body = await c.req.json<{ notes?: string }>().catch(() => ({ notes: undefined }));

  const db = new Database(c.env.DB);
  const completedSession = await db.finishWorkoutSession(sessionId, user.id, body.notes);

  if (!completedSession) {
    return c.json({ error: 'جلسه تمرین یافت نشد' }, 404);
  }

  return c.json({
    success: true,
    message: '🎉 خسته نباشید! جلسه تمرین با موفقیت به پایان رسید و در تاریخچه ثبت شد.',
    session: completedSession
  });
});

// Helper handler for discarding/cancelling an active workout session
async function handleDiscardWorkout(c: any) {
  const user = c.get('user');
  const sessionId = c.req.param('id') || '';
  const db = new Database(c.env.DB);

  const discarded = await db.discardWorkoutSession(sessionId, user.id);
  return c.json({ success: true, discarded, message: 'جلسه تمرین لغو و پاکسازی شد.' });
}

// POST /api/workouts/:id/discard & DELETE /api/workouts/:id -> Discard/cancel active workout
workoutsRouter.post('/:id/discard', handleDiscardWorkout);
workoutsRouter.delete('/:id', handleDiscardWorkout);

// GET /api/workouts/history -> List past completed workouts
workoutsRouter.get('/history', async (c) => {
  const user = c.get('user');
  const limit = Math.min(Number(c.req.query('limit')) || 20, 200);
  const db = new Database(c.env.DB);
  const history = await db.getWorkoutHistory(user.id, limit);

  return c.json({ history });
});

// GET /api/workouts/:id -> Get workout session details by ID
workoutsRouter.get('/:id', async (c) => {
  const user = c.get('user');
  const sessionId = c.req.param('id') || '';
  const db = new Database(c.env.DB);
  const session = await db.getWorkoutSessionById(sessionId, user.id);

  if (!session) {
    return c.json({ error: 'جلسه تمرین یافت نشد' }, 404);
  }

  return c.json({ session });
});

export { workoutsRouter };
