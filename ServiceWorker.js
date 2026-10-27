const cacheName = "UFC-Código Cuidado-0.1.5";
const contentToCache = [
    "Build/gat8paciente.loader.js",
    "Build/gat8paciente.framework.js.br",
    "Build/gat8paciente.data.br",
    "Build/gat8paciente.wasm.br",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');

    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

// Remove caches de versões antigas ao ativar a nova versão do SW.
self.addEventListener('activate', function (e) {
    e.waitUntil((async function () {
        const nomes = await caches.keys();
        await Promise.all(nomes.filter(n => n !== cacheName).map(n => caches.delete(n)));
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      const url = e.request.url;

      // Network-first para HTML: garante que o index e o menu sempre venham
      // atualizados; o cache só é usado se a rede falhar (offline).
      if (e.request.mode === 'navigate' || url.endsWith('.html')) {
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
      }

      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
