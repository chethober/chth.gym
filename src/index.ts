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
import { renderPublicPrograms, renderProgramNotFound, escapeHtml } from './frontend/publicPrograms';
import { PRELOADED_WORKOUTS, getPresetById } from './data/preloadedWorkouts';

const app = new Hono<{ Bindings: Env; Variables: { user?: User } }>();

// Global Middlewares
app.use('*', logger());
app.use('*', cors({
  origin: (origin) => origin || '*',
  credentials: true
}));
app.use('*', secureHeaders({
  // Framable by this site and the chth.wtf portfolio only (its desktop shows projects in a window)
  xFrameOptions: false,
  contentSecurityPolicy: {
    frameAncestors: ["'self'", 'https://chth.wtf', 'https://www.chth.wtf'],
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

// Public, rendered program pages for sharing and search discovery.
app.get('/programs', c => c.html(renderPublicPrograms(new URL(c.req.url).origin)));
app.get('/programs/:id', c => {
  const preset = getPresetById(c.req.param('id'));
  if (!preset) return c.html(renderProgramNotFound(new URL(c.req.url).origin), 404);
  return c.html(renderPublicPrograms(new URL(c.req.url).origin, preset));
});
app.get('/sitemap.xml', c => {
  const origin = escapeHtml(new URL(c.req.url).origin);
  c.header('Content-Type', 'application/xml; charset=utf-8');
  return c.body('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ['', '/programs', ...PRELOADED_WORKOUTS.map(p => '/programs/' + p.id)].map(path => '<url><loc>' + origin + path + '</loc></url>').join('') + '</urlset>');
});
app.get('/robots.txt', c => c.text('User-agent: *\nDisallow: /api/\nSitemap: ' + new URL(c.req.url).origin + '/sitemap.xml\n'));

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
