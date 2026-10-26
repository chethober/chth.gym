// Offline support for the app: keeps the shell, libraries, exercise media and the last
// API reads available without a connection. Sets logged offline are queued by the page
// (src/frontend/offlineUi.ts) and sent when the connection returns, not here.
const VERSION = 'v1';
const SHELL_CACHE = 'shell-' + VERSION;
const MEDIA_CACHE = 'media-' + VERSION;
const API_CACHE = 'api-' + VERSION;

const CDN_HOSTS = ['cdn.tailwindcss.com', 'unpkg.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];
// Reads the app needs to boot and continue a workout offline
const CACHED_API = [
  /^\/api\/auth\/me$/,
  /^\/api\/routines$/,
  /^\/api\/exercises/,
  /^\/api\/profile/,
  /^\/api\/analytics\/dashboard$/,
  /^\/api\/workouts\/(active|history|last-sets)$/
];

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  const keep = [SHELL_CACHE, MEDIA_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => !keep.includes(k)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request, cacheName, cacheKey) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(cacheKey || request, response.clone());
    return response;
  } catch (e) {
    const cached = await cache.match(cacheKey || request);
    if (cached) return cached;
    throw e;
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  // Opaque (cross-origin no-cors) responses report status 0 but are still usable
  if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
  return response;
}

// Serve the cached copy at once and refresh it in the background (CDN URLs may be unversioned)
async function staleWhileRevalidate(event, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(event.request);
  const refresh = fetch(event.request).then(response => {
    if (response.ok || response.type === 'opaque') cache.put(event.request, response.clone());
    return response;
  });
  if (cached) {
    event.waitUntil(refresh.catch(() => {}));
    return cached;
  }
  return refresh;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    if (url.pathname.startsWith('/api/')) {
      if (CACHED_API.some(re => re.test(url.pathname))) {
        event.respondWith(networkFirst(request, API_CACHE));
      }
      return;
    }
    if (request.mode === 'navigate' && url.pathname === '/') {
      // One shell for every query string (?share_routine=…, ?auth=success)
      event.respondWith(networkFirst(request, SHELL_CACHE, '/'));
      return;
    }
    if (url.pathname.startsWith('/gifs/') || url.pathname.startsWith('/icons/')) {
      event.respondWith(cacheFirst(request, MEDIA_CACHE));
    }
    return;
  }

  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(event, SHELL_CACHE));
  }
});
