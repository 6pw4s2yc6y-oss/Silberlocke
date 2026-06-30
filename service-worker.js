// ── service-worker.js ──────────────────────────────────────────────────────
// App-Shell-Caching für Offline-Fähigkeit. Bei Inhaltsänderungen CACHE_VERSION
// hochzählen – alte Caches werden beim activate automatisch entfernt.

const CACHE_VERSION = 'silberlocke-v4';
const APP_SHELL = [
    './',
    './index.html',
    './css/style.css',
    './js/main.js',
    './js/modules/calculator.js',
    './js/modules/timeline.js',
    './js/modules/ui.js',
    './js/modules/dataFetcher.js',
    './js/modules/storage.js',
    './js/vendor/idb-keyval.js',
    './data/products.json',
    './data/timeline_config.json',
    './data/sport_data.json',
    './data/body_zones.json',
    './data/nutr_data.json',
    './data/bloodmarkers.json',
    './data/monitoring.json',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
];

// Install: App-Shell vorab cachen (Fehler einzelner Dateien blockieren nicht).
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(cache => Promise.allSettled(APP_SHELL.map(url => cache.add(url))))
            .then(() => self.skipWaiting())
    );
});

// Activate: veraltete Caches löschen.
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// Fetch: nur GET im selben Origin behandeln. Cache-first mit Netzwerk-Fallback;
// Navigationen fallen offline auf index.html zurück.
self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

    event.respondWith(
        caches.match(req).then(cached => {
            if (cached) return cached;
            return fetch(req).then(res => {
                if (res && res.ok && res.type === 'basic') {
                    const copy = res.clone();
                    caches.open(CACHE_VERSION).then(cache => cache.put(req, copy));
                }
                return res;
            }).catch(() => {
                if (req.mode === 'navigate') return caches.match('./index.html');
                return new Response('', { status: 504, statusText: 'Offline' });
            });
        })
    );
});
