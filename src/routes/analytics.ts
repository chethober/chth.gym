// ============================================================================
// Analytics & Performance Dashboard Routes for جسم و اندیشه
// ============================================================================

import { Hono } from 'hono';
import { Env, User } from '../types';
import { Database } from '../db/queries';
import { requireAuth } from '../auth/session';

const analyticsRouter = new Hono<{ Bindings: Env; Variables: { user: User } }>();

analyticsRouter.use('*', requireAuth);

// GET /api/analytics/dashboard -> Main metrics and dashboard stats
analyticsRouter.get('/dashboard', async (c) => {
  const user = c.get('user');
  const db = new Database(c.env.DB);
  const summary = await db.getDashboardSummary(user);

  return c.json(summary);
});

// GET /api/analytics/prs -> All personal records (PRs)
analyticsRouter.get('/prs', async (c) => {
  const user = c.get('user');
  const limit = Number(c.req.query('limit')) || 50;
  const db = new Database(c.env.DB);
  const prs = await db.getUserPRs(user.id, limit);

  return c.json({ prs });
});

// GET /api/analytics/volume-progression -> Volume over time for charts
analyticsRouter.get('/volume-progression', async (c) => {
  const user = c.get('user');
  const days = Number(c.req.query('days')) || 30;
  const db = new Database(c.env.DB);
  const data = await db.getVolumeProgression(user.id, days);

  return c.json({ data });
});

export { analyticsRouter };
