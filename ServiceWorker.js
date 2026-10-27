const cacheName = "UFC-Código Cuidado-0.1.6";
const contentToCache = [
    "TemplateData/style.css"
];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');

    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      await cache.addAll(contentToCache);
      self.skipWaiting();
    })());
});

// Remove caches de versões antigas ao ativar a nova versão do SW.
self.addEventListener('activate', function (e) {
    e.waitUntil((async function () {
        const nomes = await caches.keys();
        await Promise.all(nomes.filter(n => n !== cacheName).map(n => caches.delete(n)));
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', function (e) {
    const url = e.request.url;

    // Arquivos do build da Unity: SEMPRE rede, sem passar pelo cache do SW.
    // Motivos: (1) resposta com Content-Encoding: br nao pode ser re-servida
    // pelo cache do SW; (2) .br de build antigo em cache quebra o build novo.
    if (url.endsWith('.br') || url.includes('/Build/')) return;

    // HTML: network-first (cache só se a rede falhar).
    if (e.request.mode === 'navigate' || url.endsWith('.html')) {
        e.respondWith((async function () {
            try {
                const rede = await fetch(e.request);
                const cache = await caches.open(cacheName);
                cache.put(e.request, rede.clone());
                return rede;
            } catch (err) {
                const offline = await caches.match(e.request);
                if (offline) return offline;
                throw err;
            }
        })());
        return;
    }

    // Resto (css, js de interface, imagens): cache-first.
    e.respondWith((async function () {
        const cacheHit = await caches.match(e.request);
        if (cacheHit) return cacheHit;
        const rede = await fetch(e.request);
        const cache = await caches.open(cacheName);
        cache.put(e.request, rede.clone());
        return rede;
    })());
});
