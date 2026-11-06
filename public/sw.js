// Offline support for the app: keeps the shell, libraries, exercise media and the last
// API reads available without a connection. Changes made offline are queued by the page
// (src/frontend/offlineUi.ts) and sent when the connection returns, not here.
//
// Bump VERSION whenever this file's caching changes, so installed apps drop the old caches.
// The page itself is fetched network-first, so app updates reach users without a bump.
const VERSION = 'v2';
const SHELL_CACHE = 'shell-' + VERSION;
const MEDIA_CACHE = 'media-' + VERSION;
// Not versioned: the user's last reads must survive a worker update made while offline
const API_CACHE = 'api-v1';

const CDN_HOSTS = ['cdn.tailwindcss.com', 'unpkg.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];
// Reads that must always come from the server (sign-in redirects, health checks)
const NEVER_CACHED_API = [/^\/api\/auth\/(google|logout)/, /^\/api\/health$/];
// Past this, a slow connection is treated as offline and the cached copy is used
const API_TIMEOUT_MS = 6000;
const SHELL_TIMEOUT_MS = 4000;
const PRECACHE = ['/', '/icons/site.webmanifest', '/icons/icon-192x192.png', '/icons/icon-512x512.png', '/icons/icon-maskable-512x512.png', '/icons/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => Promise.all(PRECACHE.map(url => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const keep = [SHELL_CACHE, MEDIA_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => !keep.includes(k)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(v => { clearTimeout(timer); resolve(v); }, e => { clearTimeout(timer); reject(e); });
  });
}

// Marks an answer as the offline copy, so the page knows it may be behind the server
async function markOffline(response) {
  const headers = new Headers(response.headers);
  headers.set('X-From-Offline-Cache', '1');
  return new Response(await response.blob(), { status: response.status, statusText: response.statusText, headers });
}

async function networkFirst(request, cacheName, { cacheKey, timeout, mark } = {}) {
  const cache = await caches.open(cacheName);
  const network = fetch(request).then(response => {
    if (response.ok) cache.put(cacheKey || request, response.clone());
    return response;
  });
  try {
    return await (timeout ? withTimeout(network, timeout) : network);
  } catch (e) {
    const cached = await cache.match(cacheKey || request);
    if (cached) return mark ? markOffline(cached) : cached;
    // Nothing cached: keep waiting for a slow network rather than fail early
    return network;
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
      if (!NEVER_CACHED_API.some(re => re.test(url.pathname))) {
        event.respondWith(networkFirst(request, API_CACHE, { timeout: API_TIMEOUT_MS, mark: true }));
      }
      return;
    }
    if (request.mode === 'navigate' && url.pathname === '/') {
      // One shell for every query string (?share_routine=…, ?auth=success, ?source=pwa)
      event.respondWith(networkFirst(request, SHELL_CACHE, { cacheKey: '/', timeout: SHELL_TIMEOUT_MS }));
      return;
    }
    if (url.pathname.startsWith('/gifs/') || url.pathname.startsWith('/icons/') || url.pathname.startsWith('/screenshots/')) {
      event.respondWith(cacheFirst(request, MEDIA_CACHE));
    }
    return;
  }

  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(event, SHELL_CACHE));
  }
});

// The page sends the libraries, fonts and media it loaded before this worker took control
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type !== 'cache-urls' || !Array.isArray(data.urls)) return;
  event.waitUntil((async () => {
    const shell = await caches.open(SHELL_CACHE);
    const media = await caches.open(MEDIA_CACHE);
    for (const raw of data.urls.slice(0, 200)) {
      let url;
      try { url = new URL(raw); } catch (e) { continue; }
      const sameOrigin = url.origin === self.location.origin;
      const isMedia = sameOrigin && (url.pathname.startsWith('/gifs/') || url.pathname.startsWith('/icons/'));
      const isShell = (sameOrigin && (url.pathname === '/' || url.pathname === '/icons/site.webmanifest')) || CDN_HOSTS.includes(url.hostname);
      if (!isMedia && !isShell) continue;
      const cache = isMedia ? media : shell;
      const key = sameOrigin && url.pathname === '/' ? '/' : url.href;
      if (await cache.match(key)) continue;
      try {
        // Fonts are requested with CORS by the page; scripts and styles without it
        let response = await fetch(url.href, { mode: sameOrigin ? 'same-origin' : 'cors', credentials: sameOrigin ? 'same-origin' : 'omit' })
          .catch(() => fetch(url.href, { mode: 'no-cors' }));
        if (response.ok || response.type === 'opaque') await cache.put(key, response);
      } catch (e) {}
    }
  })());
});
