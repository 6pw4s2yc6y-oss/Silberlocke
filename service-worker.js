// ── service-worker.js ──────────────────────────────────────────────────────
// App-Shell-Caching für Offline-Fähigkeit. Bei Inhaltsänderungen CACHE_VERSION
// hochzählen – alte Caches werden beim activate automatisch entfernt.

const CACHE_VERSION = 'silberlocke-v16';
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
    './data/supplements/products.json',
    './data/app/timeline_config.json',
    './data/training/sport_data.json',
    './data/health/body_zones.json',
    './data/nutrition/nutr_data.json',
    './data/health/bloodmarkers.json',
    './data/health/monitoring.json',
    './data/health/emergency.json',
    './data/health/injuries.json',
    './data/health/mental.json',
    './data/app/daytypes.json',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
];

// Install: App-Shell vorab cachen (Fehler einzelner Dateien blockieren nicht).
// KEIN automatisches skipWaiting mehr – die neue Version wartet, bis der Nutzer
// im Update-Banner auf „Aktualisieren" tippt (verhindert Cache-Mix).
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(cache => Promise.allSettled(APP_SHELL.map(url => cache.add(url))))
    );
});

// Die Seite kann die wartende Version auffordern, sofort aktiv zu werden.
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// Activate: veraltete Caches löschen.
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// Fetch: nur GET im selben Origin behandeln.
// Network-first: immer die aktuelle Version aus dem Netz laden (und den Cache
// aktualisieren), Cache nur als Offline-Fallback. So bekommen Nutzer neue
// Deploys sofort – ohne dass die Cache-Version manuell erhöht werden muss.
self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

    event.respondWith(
        fetch(req).then(res => {
            if (res && res.ok && res.type === 'basic') {
                const copy = res.clone();
                caches.open(CACHE_VERSION).then(cache => cache.put(req, copy));
            }
            return res;
        }).catch(() => caches.match(req).then(cached => {
            if (cached) return cached;
            if (req.mode === 'navigate') return caches.match('./index.html');
            return new Response('', { status: 504, statusText: 'Offline' });
        }))
    );
});
