// ── service-worker.js ──────────────────────────────────────────────────────
// App-Shell-Caching für Offline-Fähigkeit. Bei Inhaltsänderungen CACHE_VERSION
// hochzählen – alte Caches werden beim activate automatisch entfernt.

const CACHE_VERSION = 'status-v49';
const APP_SHELL = [
    './',
    './index.html',
    './impressum.html',
    './datenschutz.html',
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
    './data/studies/studies.json',
    './data/app/tips.json',
    './data/app/quiz.json',
    './data/app/manifest.json',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
];

// Install: App-Shell STRIKT und vollständig vorab cachen (addAll = alles oder
// nichts). Schlägt eine Datei fehl, schlägt die Installation fehl und der
// Browser versucht es später erneut – so gibt es nie halbe Versions-Pakete.
// KEIN automatisches skipWaiting – die neue Version wartet, bis der Nutzer
// im Update-Banner auf „Aktualisieren" tippt.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(cache => cache.addAll(APP_SHELL.map(url => new Request(url, { cache: 'no-cache' }))))
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
// CACHE-FIRST aus dem aktuellen, vollständigen Versions-Paket. Dadurch laufen
// HTML/JS/CSS/Daten immer konsistent aus EINER Version – nie gemischt (das war
// die Ursache toter Buttons bei wackligem Netz). Neue Deploys kommen atomar
// über den Update-Banner-Flow: neue SW-Version installiert das komplette Paket,
// erst der Tipp auf „Aktualisieren" schaltet um und lädt einmal sauber neu.
self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

    event.respondWith(
        caches.open(CACHE_VERSION).then(cache =>
            cache.match(req, { ignoreSearch: true }).then(cached => {
                if (cached) return cached;
                // Nicht im Paket (z. B. neue Datei): aus dem Netz holen und merken.
                return fetch(req).then(res => {
                    if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
                    return res;
                }).catch(() => {
                    if (req.mode === 'navigate') return cache.match('./index.html');
                    return new Response('', { status: 504, statusText: 'Offline' });
                });
            })
        )
    );
});
