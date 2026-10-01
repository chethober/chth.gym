// ============================================================================
// Exercises Library Routes for جسم و اندیشه
// ============================================================================

import { Hono } from 'hono';
import { Env } from '../types';
import { Database } from '../db/queries';

const exercisesRouter = new Hono<{ Bindings: Env }>();

// GET /api/exercises -> Search and filter exercises
exercisesRouter.get('/', async (c) => {
  const query = c.req.query('q') || '';
  const category = c.req.query('category') || 'all';
  const equipment = c.req.query('equipment') || 'all';

  const db = new Database(c.env.DB);
  const exercises = await db.getAllExercises(query, category, equipment);

  return c.json({
    count: exercises.length,
    exercises
  });
});

// GET /api/exercises/categories -> Get all categories and equipments
exercisesRouter.get('/meta/filters', async (c) => {
  const categories = [
    { key: 'all', name_fa: 'همه عضلات', icon: 'zap' },
    { key: 'chest', name_fa: 'سینه', icon: 'shield' },
    { key: 'back', name_fa: 'پشت و زیربغل', icon: 'activity' },
    { key: 'legs', name_fa: 'پا و ساق', icon: 'trending-up' },
    { key: 'shoulders', name_fa: 'سرشانه', icon: 'target' },
    { key: 'arms', name_fa: 'بازو (جلو/پشت)', icon: 'award' },
    { key: 'core', name_fa: 'شکم و میان‌تنه', icon: 'layers' }
  ];

  const equipments = [
    { key: 'all', name_fa: 'همه ابزارها' },
    { key: 'barbell', name_fa: 'هالتر' },
    { key: 'dumbbell', name_fa: 'دمبل' },
    { key: 'cable', name_fa: 'سیم‌کش' },
    { key: 'bodyweight', name_fa: 'وزن بدن' },
    { key: 'machine', name_fa: 'دستگاه' }
  ];

  return c.json({
    categories,
    equipments
  });
});

// GET /api/exercises/:id -> Get single exercise details
exercisesRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const db = new Database(c.env.DB);
  const exercise = await db.getExerciseById(id);

  if (!exercise) {
    return c.json({ error: 'حرکت یافت نشد' }, 404);
  }

  return c.json({ exercise });
});

export { exercisesRouter };
