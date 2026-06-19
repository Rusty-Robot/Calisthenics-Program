// ─── Cache Configuration ────────────────────────────────────────────────────
// Bump CACHE_VERSION any time you push an update — this forces old caches to clear.
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `calisthenics-${CACHE_VERSION}`;

// Files to pre-cache on install (the "app shell")
const APP_SHELL = [
const APP_SHELL = [
  '/Calisthenics-Program/',
  '/Calisthenics-Program/index.html',
  '/Calisthenics-Program/CalisthenicsYearPlan.jsx',
  '/Calisthenics-Program/manifest.json',
  '/Calisthenics-Program/icons/icon-192.png',
  '/Calisthenics-Program/icons/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js',
];

// ─── Install ─────────────────────────────────────────────────────────────────
// Pre-cache all app shell files the moment the SW is installed.
self.addEventListener('install', event => {
  console.log(`[SW] Installing cache: ${CACHE_NAME}`);
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pre-caching app shell');
      return cache.addAll(APP_SHELL);
    }).then(() => {
      // Skip the waiting phase so the new SW activates immediately
      return self.skipWaiting();
    })
  );
});

// ─── Activate ────────────────────────────────────────────────────────────────
// Remove any old caches from previous versions.
self.addEventListener('activate', event => {
  console.log(`[SW] Activating: ${CACHE_NAME}`);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('calisthenics-') && name !== CACHE_NAME)
          .map(oldCache => {
            console.log(`[SW] Deleting old cache: ${oldCache}`);
            return caches.delete(oldCache);
          })
      );
    }).then(() => {
      // Take control of all open tabs immediately
      return self.clients.claim();
    })
  );
});

// ─── Fetch ────────────────────────────────────────────────────────────────────
// Strategy: Cache First, fall back to network.
// For the JSX file we use Network First so updates are picked up on next load.
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Network-first for the main component file (so updates deploy cleanly)
  if (url.pathname.endsWith('CalisthenicsYearPlan.jsx')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Cache-first for everything else (app shell, CDN assets, icons)
  event.respondWith(cacheFirst(event.request));
});

// ─── Strategy: Cache First ────────────────────────────────────────────────────
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const networkResponse = await fetch(request);
    // Cache the fresh response for next time
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    // If both cache and network fail, return a simple offline fallback
    return offlineFallback(request);
  }
}

// ─── Strategy: Network First ─────────────────────────────────────────────────
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    // Network failed — serve from cache if available
    const cached = await caches.match(request);
    if (cached) return cached;
    return offlineFallback(request);
  }
}

// ─── Offline Fallback ─────────────────────────────────────────────────────────
function offlineFallback(request) {
  const url = new URL(request.url);

  // For navigation requests, serve index.html from cache
  if (request.mode === 'navigate') {
    return caches.match('/index.html');
  }

  // For everything else, return a minimal 503
  return new Response('Offline — resource not cached yet.', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain' },
  });
}

// ─── Background Sync (optional) ──────────────────────────────────────────────
// Listens for a 'check-update' sync tag. You can trigger this from the app
// via navigator.serviceWorker.ready.then(sw => sw.sync.register('check-update'))
self.addEventListener('sync', event => {
  if (event.tag === 'check-update') {
    event.waitUntil(
      fetch('/CalisthenicsYearPlan.jsx').then(res => {
        if (res.ok) {
          return caches.open(CACHE_NAME).then(cache => cache.put('/CalisthenicsYearPlan.jsx', res));
        }
      }).catch(() => {}) // silent fail if offline
    );
  }
});
