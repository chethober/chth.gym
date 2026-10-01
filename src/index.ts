// ============================================================================
// Main Application Entrypoint for جسم و اندیشه (Jesm O Andishe)
// Cloudflare Workers + Hono Framework
// ============================================================================

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

import { Env, User } from './types';
import { authRouter } from './routes/auth';
import { exercisesRouter } from './routes/exercises';
import { routinesRouter } from './routes/routines';
import { workoutsRouter } from './routes/workouts';
import { analyticsRouter } from './routes/analytics';
import { profileRouter } from './routes/profile';
import { renderAppHtml } from './frontend/html';

const app = new Hono<{ Bindings: Env; Variables: { user?: User } }>();

// Global Middlewares
app.use('*', logger());
app.use('*', cors({
  origin: (origin) => origin || '*',
  credentials: true
}));
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com", "https://unpkg.com", "https://cdn.jsdelivr.net"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:", "blob:", "https://*"],
    connectSrc: ["'self'", "https://*"]
  }
}));

// API Routes
app.route('/api/auth', authRouter);
app.route('/api/exercises', exercisesRouter);
app.route('/api/routines', routinesRouter);
app.route('/api/workouts', workoutsRouter);
app.route('/api/analytics', analyticsRouter);
app.route('/api/profile', profileRouter);

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    app: c.env.APP_NAME || 'جسم و اندیشه',
    time: new Date().toISOString()
  });
});

// Serve Single Page Application Frontend
app.get('/', (c) => {
  return c.html(renderAppHtml());
});

// Global Error Handler
app.onError((err, c) => {
  console.error('Unhandled Server Error:', err);
  return c.json({
    error: 'خطای سرور رخ داد. لطفا مجددا تلاش کنید.',
    message: err.message
  }, 500);
});

// 404 Handler - Fallback to SPA for frontend routes or JSON error for API
app.notFound((c) => {
  if (c.req.path.startsWith('/api/')) {
    return c.json({ error: 'مسیر API مورد نظر یافت نشد' }, 404);
  }
  return c.html(renderAppHtml());
});

export default app;
