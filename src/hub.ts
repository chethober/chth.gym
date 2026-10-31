// The CHTH hub (the owner's private admin bot): the gym reports sign-ups, finished workouts,
// tagged visits and server errors, and answers GET /internal/stats for the hub's dashboard.
// Both directions are signed with HUB_SECRET; without it reporting is off and the stats route
// refuses every call. Only counts and pseudonymous ids leave the gym.

import type { Context } from 'hono';
import { createReporter, verifySigned } from './chth-kit/hub.js';
import type { Env } from './types';

type Ctx = Context<{ Bindings: Env; Variables: any }>;

/** Sends one event without delaying the response. Never throws. */
export function track(c: Ctx, type: string, data: Record<string, unknown> = {}, user?: string) {
  const reporter = createReporter({ url: c.env.HUB_URL, secret: c.env.HUB_SECRET, source: 'gym' });
  if (!reporter.enabled) return;
  const sent = reporter.track(type, data, user);
  try { c.executionCtx.waitUntil(sent); } catch { /* no execution context in tests */ }
}

/** A visit that came from another CHTH product (?ref=chthgamesbot), for the hub's funnel. */
export function trackRef(c: Ctx, locale: string) {
  const ref = c.req.query('ref');
  if (ref && /^[a-zA-Z0-9_]{1,40}$/.test(ref)) track(c, 'visit', { ref, path: new URL(c.req.url).pathname, lang: locale });
}

const count = async (db: D1Database, sql: string) => (await db.prepare(sql).first<{ n: number }>())?.n ?? 0;
const since = (days: number) => `strftime('%Y-%m-%dT%H:%M:%S', 'now', '-${days} days')`;

export async function statsResponse(c: Ctx): Promise<Response> {
  const secret = c.env.HUB_SECRET;
  const ok = secret ? await verifySigned(c.req.raw, (s) => (s === 'hub' ? secret : null)) : null;
  if (!ok) return c.json({ ok: false, error: 'forbidden' }, 403);
  const db = c.env.DB;
  const [users, newUsers7d, activeUsers7d, workouts24h, workouts7d, routines] = await Promise.all([
    count(db, 'SELECT COUNT(*) AS n FROM users'),
    count(db, `SELECT COUNT(*) AS n FROM users WHERE replace(created_at, ' ', 'T') >= ${since(7)}`),
    count(db, `SELECT COUNT(DISTINCT user_id) AS n FROM workout_sessions WHERE replace(start_time, ' ', 'T') >= ${since(7)}`),
    count(db, `SELECT COUNT(*) AS n FROM workout_sessions WHERE status = 'completed' AND replace(end_time, ' ', 'T') >= ${since(1)}`),
    count(db, `SELECT COUNT(*) AS n FROM workout_sessions WHERE status = 'completed' AND replace(end_time, ' ', 'T') >= ${since(7)}`),
    count(db, 'SELECT COUNT(*) AS n FROM routines'),
  ]);
  const top = await db.prepare(`SELECT title AS name, COUNT(*) AS count FROM workout_sessions
    WHERE status = 'completed' AND replace(end_time, ' ', 'T') >= ${since(30)} GROUP BY title ORDER BY count DESC LIMIT 5`).all<{ name: string; count: number }>();
  return c.json({ users, newUsers7d, activeUsers7d, workouts24h, workouts7d, routines, topPrograms: top.results ?? [] });
}
