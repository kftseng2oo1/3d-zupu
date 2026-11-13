// 曾氏族譜 3D 祠堂 Service Worker
const CACHE = '3d-zupu-v19';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
const CDN = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // 祭祀雲端（上香、語音）一律走網路
  if (url.hostname.endsWith('workers.dev')) return;
  // three.js、字型：快取優先（版本固定）
  if (CDN.includes(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const c = res.clone(); caches.open(CACHE).then(k => k.put(req, c)); }
      return res;
    })));
    return;
  }
  if (url.origin !== location.origin) return;
  // 誦經音檔：iOS 以 Range 分段讀取，交給瀏覽器直接處理，不經快取
  if (/\.mp3$/.test(url.pathname)) return;
  // 本站檔案：先給快取，背景更新
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(res => {
      if (res.ok) { const c = res.clone(); caches.open(CACHE).then(k => k.put(req, c)); }
      return res;
    }).catch(() => hit || caches.match('./index.html'));
    return hit || net;
  }));
});
