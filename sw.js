// ZabCal service worker: makes the installed app work offline.
//
// Strategy:
// - Same-origin files (HTML, JS, CSS, icons): network-first, falling back to cache.
//   Online users always get the latest deploy; offline users get the last copy they saw.
// - Pinned CDN files (Chart.js, Google Fonts): cache-first, since a pinned URL never changes.
// - Vercel analytics is never cached.
//
// Bump CACHE_VERSION when the list of precached files changes.
const CACHE_VERSION = 'zabcal-v1';

const APP_SHELL = [
    './',
    './index.html',
    './tailwind.css',
    './lenis.min.js',
    './Animation.js?v=1',
    './timetableData.js?v=2',
    './database.js?v=5',
    './script.js?v=13',
    './manifest.json',
    './icons/icon-48.png',
    './icons/icon-180.png',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

const CACHE_FIRST_HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

async function networkFirst(request) {
    const cache = await caches.open(CACHE_VERSION);
    try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
    } catch (err) {
        const cached = await cache.match(request);
        if (cached) return cached;
        // Offline navigation to any route (e.g. /#semesters) falls back to the app shell.
        if (request.mode === 'navigate') {
            const shell = await cache.match('./index.html');
            if (shell) return shell;
        }
        throw err;
    }
}

async function cacheFirst(request) {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    // Opaque (no-cors) responses have status 0 but are still usable from cache.
    if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
    return response;
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.pathname.startsWith('/_vercel/')) return;

    if (url.origin === self.location.origin) {
        event.respondWith(networkFirst(request));
    } else if (CACHE_FIRST_HOSTS.includes(url.hostname)) {
        event.respondWith(cacheFirst(request));
    }
});
