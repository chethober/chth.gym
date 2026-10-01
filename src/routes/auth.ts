// ============================================================================
// Auth Routes for جسم و اندیشه
// ============================================================================

import { Hono } from 'hono';
import { Env, User } from '../types';
import { Database } from '../db/queries';
import { createSession, destroySession, getSession, requireAuth } from '../auth/session';
import { getGoogleAuthUrl, exchangeCodeForTokens, fetchGoogleUserInfo } from '../auth/google';

const authRouter = new Hono<{ Bindings: Env; Variables: { user?: User } }>();

// GET /api/auth/google -> Redirect to Google OAuth Consent screen
authRouter.get('/google', (c) => {
  if (!c.env.GOOGLE_CLIENT_ID || c.env.GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID')) {
    return c.redirect('/?auth_error=' + encodeURIComponent('تنظیمات ورود با گوگل هنوز انجام نشده است'));
  }

  const state = crypto.randomUUID();
  const reqUrl = new URL(c.req.url);
  const dynamicRedirectUri = `${reqUrl.protocol}//${reqUrl.host}/api/auth/google/callback`;
  const url = getGoogleAuthUrl(c.env, state, dynamicRedirectUri);
  return c.redirect(url);
});

// GET /api/auth/google/callback -> Google OAuth redirect callback
authRouter.get('/google/callback', async (c) => {
  const code = c.req.query('code');
  const error = c.req.query('error');

  if (error || !code) {
    return c.redirect('/?auth_error=' + encodeURIComponent(error || 'کد احراز هویت دریافت نشد'));
  }

  const reqUrl = new URL(c.req.url);
  const dynamicRedirectUri = `${reqUrl.protocol}//${reqUrl.host}/api/auth/google/callback`;
  const tokenData = await exchangeCodeForTokens(c.env, code, dynamicRedirectUri);
  if (!tokenData || !tokenData.access_token) {
    return c.redirect('/?auth_error=' + encodeURIComponent('خطا در دریافت توکن گوگل'));
  }

  const googleUser = await fetchGoogleUserInfo(tokenData.access_token);
  if (!googleUser || !googleUser.email) {
    return c.redirect('/?auth_error=' + encodeURIComponent('اطلاعات حساب کاربری گوگل دریافت نشد'));
  }

  const db = new Database(c.env.DB);
  const user = await db.upsertGoogleUser(
    googleUser.id,
    googleUser.email,
    googleUser.name || 'ورزشکار گرامی',
    googleUser.picture
  );

  await createSession(c, user);
  return c.redirect('/?auth=success');
});

// POST /api/auth/logout -> Log out current user
authRouter.post('/logout', async (c) => {
  await destroySession(c);
  return c.json({ success: true, message: 'با موفقیت خارج شدید.' });
});

// GET /api/auth/me -> Current logged in user info
authRouter.get('/me', async (c) => {
  const session = await getSession(c);
  if (!session) {
    return c.json({ authenticated: false, user: null });
  }

  const db = new Database(c.env.DB);
  const user = await db.getUserById(session.userId);
  if (!user) {
    await destroySession(c);
    return c.json({ authenticated: false, user: null });
  }

  return c.json({
    authenticated: true,
    user
  });
});

export { authRouter };
