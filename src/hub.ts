// The CHTH hub (the owner's private admin bot): the gym reports sign-ups, finished workouts,
// tagged visits and server errors, and answers the hub's signed calls:
//   GET  /internal/stats         the dashboard and the 📣 Marketing screen
//   POST /internal/announcement  the site banner ({ text, url }; empty text clears it)
// Both directions are signed with HUB_SECRET; without it reporting is off and the internal
// routes refuse every call. Reports go through the HUB service binding (same Cloudflare
// account), or to HUB_URL when it is set. Only counts and pseudonymous ids leave the gym.

import type { Context } from 'hono';
import { createReporter, verifySigned } from './chth-kit/hub.js';
import type { Env } from './types';

type Ctx = Context<{ Bindings: Env; Variables: any }>;

/** Sends one event without delaying the response. Never throws. */
export function track(c: Ctx, type: string, data: Record<string, unknown> = {}, user?: string) {
  const env = c.env ?? ({} as Env);
  const binding = !env.HUB_URL && env.HUB && typeof env.HUB.fetch === 'function' ? env.HUB : undefined;
  const reporter = createReporter({
    // The host is ignored on a service binding; only the path is signed.
    url: env.HUB_URL || (binding ? 'https://hub.internal' : undefined),
    secret: env.HUB_SECRET,
    source: 'gym',
    ...(binding ? { fetch: (input: RequestInfo | URL, init?: RequestInit) => binding.fetch(input as any, init as any) } : {}),
  });
  if (!reporter.enabled) return;
  const sent = reporter.track(type, data, user);
  try { c.executionCtx.waitUntil(sent); } catch { /* no execution context in tests */ }
}

const REF_RE = /^[a-zA-Z0-9_]{1,40}$/;
const REF_COOKIE = 'chth_ref';

/**
 * A visit tagged ?ref= (another CHTH product, or a campaign link made in the hub), for the
 * hub's funnel. The tag is kept in a cookie for 30 days so a later sign-up counts for it.
 */
export function trackRef(c: Ctx, locale: string) {
  const ref = c.req.query('ref');
  if (!ref || !REF_RE.test(ref)) return;
  track(c, 'visit', { ref, path: new URL(c.req.url).pathname, lang: locale });
  c.header('Set-Cookie', `${REF_COOKIE}=${ref}; Path=/; Max-Age=${30 * 86400}; SameSite=Lax; Secure; HttpOnly`, { append: true });
}

/** The campaign tag a visitor arrived with in the last 30 days, if any. */
export function refFromCookie(cookieHeader: string | undefined | null): string | undefined {
  const m = new RegExp(`(?:^|;\\s*)${REF_COOKIE}=([^;]+)`).exec(cookieHeader ?? '');
  return m && REF_RE.test(m[1]) ? m[1] : undefined;
}

const count = async (db: D1Database, sql: string) => (await db.prepare(sql).first<{ n: number }>())?.n ?? 0;
const since = (days: number) => `strftime('%Y-%m-%dT%H:%M:%S', 'now', '-${days} days')`;

/** A request signed by the hub with HUB_SECRET, or null. */
async function fromHub(c: Ctx) {
  const secret = c.env?.HUB_SECRET;
  return secret ? verifySigned(c.req.raw, (s) => (s === 'hub' ? secret : null)) : null;
}

export async function statsResponse(c: Ctx): Promise<Response> {
  if (!(await fromHub(c))) return c.json({ ok: false, error: 'forbidden' }, 403);
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
  return c.json({ users, newUsers7d, activeUsers7d, workouts24h, workouts7d, routines, topPrograms: top.results ?? [], marketing: await marketingStats(c) });
}

/** Growth, activation and retention for the hub's 📣 Marketing screen. Counts only. */
async function marketingStats(c: Ctx) {
  const db = c.env.DB;
  const created = "replace(u.created_at, ' ', 'T')";
  const ended = "replace(w.end_time, ' ', 'T')";
  const days = await db.prepare(`SELECT substr(replace(created_at, ' ', 'T'), 1, 10) AS date, COUNT(*) AS n FROM users
    WHERE replace(created_at, ' ', 'T') >= ${since(14)} GROUP BY date`).all<{ date: string; n: number }>();
  const byDate = new Map((days.results ?? []).map((r) => [r.date, r.n]));
  const signupsByDay = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(Date.now() - (13 - i) * 86_400_000).toISOString().slice(0, 10);
    return { date, n: byDate.get(date) ?? 0 };
  });
  const [signedUp30d, trained30d, cohort, returned, dormant, remindersOn] = await Promise.all([
    count(db, `SELECT COUNT(*) AS n FROM users u WHERE ${created} >= ${since(30)}`),
    count(db, `SELECT COUNT(*) AS n FROM users u WHERE ${created} >= ${since(30)}
      AND EXISTS (SELECT 1 FROM workout_sessions w WHERE w.user_id = u.id AND w.status = 'completed')`),
    count(db, `SELECT COUNT(*) AS n FROM users u WHERE ${created} < ${since(7)} AND ${created} >= ${since(35)}`),
    count(db, `SELECT COUNT(*) AS n FROM users u WHERE ${created} < ${since(7)} AND ${created} >= ${since(35)}
      AND EXISTS (SELECT 1 FROM workout_sessions w WHERE w.user_id = u.id AND w.status = 'completed' AND ${ended} >= ${since(7)})`),
    count(db, `SELECT COUNT(*) AS n FROM (SELECT w.user_id FROM workout_sessions w WHERE w.status = 'completed'
      GROUP BY w.user_id HAVING MAX(${ended}) < ${since(14)})`),
    count(db, 'SELECT COUNT(*) AS n FROM user_profiles WHERE daily_reminder_enabled = 1'),
  ]);
  return {
    signupsByDay,
    activation: { signedUp30d, trained30d },
    retention: { cohort, returned },
    dormant,
    remindersOn,
    announcement: await getAnnouncement(c.env.KV_SESSIONS),
  };
}

// ---- The site banner, set from the hub ----

export type Announcement = { text: string; url: string | null };
const ANNOUNCEMENT_KEY = 'hub:announcement';

export async function getAnnouncement(kv: KVNamespace | undefined, cacheTtl?: number): Promise<Announcement | null> {
  if (!kv) return null;
  try {
    const raw = await kv.get(ANNOUNCEMENT_KEY, cacheTtl ? { cacheTtl } : undefined);
    const a = raw ? JSON.parse(raw) as Announcement : null;
    return a && typeof a.text === 'string' && a.text ? a : null;
  } catch {
    return null;
  }
}

/** POST /internal/announcement { text, url? }: sets the banner, or clears it with empty text. */
export async function announcementResponse(c: Ctx): Promise<Response> {
  const signed = await fromHub(c);
  if (!signed) return c.json({ ok: false, error: 'forbidden' }, 403);
  let body: { text?: unknown; url?: unknown };
  try { body = JSON.parse(signed.body || '{}'); } catch { return c.json({ ok: false, error: 'bad JSON' }, 400); }
  const text = String(body.text ?? '').trim();
  const url = String(body.url ?? '').trim();
  if (!text) {
    await c.env.KV_SESSIONS.delete(ANNOUNCEMENT_KEY);
    return c.json({ ok: true, announcement: null });
  }
  if (text.length > 200) return c.json({ ok: false, error: 'The banner can be up to 200 characters.' }, 400);
  if (url && !/^https:\/\/[^\s"'<>]+$/.test(url)) return c.json({ ok: false, error: 'The link must start with https://' }, 400);
  const announcement: Announcement = { text, url: url || null };
  await c.env.KV_SESSIONS.put(ANNOUNCEMENT_KEY, JSON.stringify(announcement));
  return c.json({ ok: true, announcement });
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]!));

/** The banner strip, closable per visitor (it comes back when the text changes). */
export function bannerHtml(a: Announcement | null): string {
  if (!a) return '';
  const id = Array.from(a.text + (a.url ?? '')).reduce((h, ch) => (h * 31 + ch.codePointAt(0)!) >>> 0, 7).toString(36);
  const text = escapeHtml(a.text);
  const body = a.url ? `<a href="${escapeHtml(a.url)}" style="color:inherit;text-decoration:underline">${text}</a>` : text;
  return `<div id="chth-banner" data-id="${id}" role="status" style="display:flex;align-items:center;justify-content:center;gap:.75rem;padding:.5rem 1rem;font-size:.875rem;line-height:1.4;text-align:center;background:var(--chth-product-accent,#16a34a);color:var(--chth-product-on-accent,#fff)">`
    + `<span>${body}</span><button type="button" aria-label="Close" style="background:none;border:0;color:inherit;font-size:1.1rem;line-height:1;cursor:pointer;opacity:.8" onclick="try{localStorage.setItem('chth-banner',this.parentNode.dataset.id)}catch(e){}this.parentNode.remove()">×</button></div>`
    + `<script>try{var b=document.getElementById('chth-banner');if(b&&localStorage.getItem('chth-banner')===b.dataset.id)b.remove()}catch(e){}</script>`;
}

/** Puts the banner right after <body>. */
export const withBanner = (html: string, a: Announcement | null) => (a ? html.replace(/<body[^>]*>/, (tag) => tag + bannerHtml(a)) : html);
