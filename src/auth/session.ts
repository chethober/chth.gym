// ============================================================================
// Session & Auth Middleware for جسم و اندیشه
// ============================================================================

import { Context, Next } from 'hono';
import { Env, SessionData, User } from '../types';
import { Database } from '../db/queries';

export const SESSION_COOKIE_NAME = 'jesm_session';
export const SESSION_EXPIRY_SECONDS = 60 * 60 * 24 * 30; // 30 days

// In-memory fallback map if KV is not bound in mock/test run
const memorySessionStore = new Map<string, SessionData>();

export async function createSession(
  c: Context<any>,
  user: User
): Promise<string> {
  const sessionId = `ses_${crypto.randomUUID()}`;
  const sessionData: SessionData = {
    userId: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatar_url || undefined,
    expiresAt: Date.now() + SESSION_EXPIRY_SECONDS * 1000
  };

  if (c.env?.KV_SESSIONS) {
    await c.env.KV_SESSIONS.put(
      `session:${sessionId}`,
      JSON.stringify(sessionData),
      { expirationTtl: SESSION_EXPIRY_SECONDS }
    );
  } else {
    memorySessionStore.set(`session:${sessionId}`, sessionData);
  }

  // Set HTTP-only Cookie
  c.header(
    'Set-Cookie',
    `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_EXPIRY_SECONDS}`
  );

  return sessionId;
}

export async function getSession(
  c: Context<any>
): Promise<SessionData | null> {
  const cookieHeader = c.req.header('Cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(v => {
      const parts = v.trim().split('=');
      return [parts[0], parts.slice(1).join('=')];
    })
  );

  const sessionId = cookies[SESSION_COOKIE_NAME];
  if (!sessionId) return null;

  let sessionRaw: string | null = null;
  if (c.env?.KV_SESSIONS) {
    sessionRaw = await c.env.KV_SESSIONS.get(`session:${sessionId}`);
  } else {
    const memoryData = memorySessionStore.get(`session:${sessionId}`);
    if (memoryData) sessionRaw = JSON.stringify(memoryData);
  }

  if (!sessionRaw) return null;

  try {
    const session: SessionData = JSON.parse(sessionRaw);
    if (Date.now() > session.expiresAt) {
      await destroySession(c);
      return null;
    }
    return session;
  } catch (err) {
    return null;
  }
}

export async function destroySession(
  c: Context<any>
): Promise<void> {
  const cookieHeader = c.req.header('Cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(v => {
      const parts = v.trim().split('=');
      return [parts[0], parts.slice(1).join('=')];
    })
  );

  const sessionId = cookies[SESSION_COOKIE_NAME];
  if (sessionId) {
    if (c.env?.KV_SESSIONS) {
      await c.env.KV_SESSIONS.delete(`session:${sessionId}`);
    } else {
      memorySessionStore.delete(`session:${sessionId}`);
    }
  }

  c.header(
    'Set-Cookie',
    `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
}

// Authentication Middleware for Protected API routes
export async function requireAuth(c: Context<any>, next: Next) {
  const session = await getSession(c);
  if (!session) {
    return c.json({ error: 'احراز هویت انجام نشده است. لطفاً وارد حساب خود شوید.', code: 'UNAUTHORIZED' }, 401);
  }

  const db = new Database(c.env.DB);
  const user = await db.getUserById(session.userId);
  if (!user) {
    return c.json({ error: 'کاربر یافت نشد', code: 'USER_NOT_FOUND' }, 401);
  }

  // Attach user to context
  c.set('user' as any, user);
  await next();
}

// Optional Authentication Middleware (attaches user if authenticated, continues otherwise)
export async function optionalAuth(c: Context<any>, next: Next) {
  const session = await getSession(c);
  if (session) {
    const db = new Database(c.env.DB);
    const user = await db.getUserById(session.userId);
    if (user) {
      c.set('user' as any, user);
    }
  }
  await next();
}
