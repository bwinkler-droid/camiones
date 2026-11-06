/* App TPR Camiones: guarda la "cáscara" de la app para que abra rápido y sin conexión.
   La app siempre busca la versión nueva primero (si hay conexión); los datos nunca se guardan acá. */
const C = 'tpr-app-v3', F = ['app.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(F)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(K => Promise.all(K.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => { const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   /* el servidor del portal nunca pasa por acá */
  e.respondWith(fetch(e.request).then(r => { const k = r.clone(); caches.open(C).then(c => c.put(e.request, k)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true }))); });
