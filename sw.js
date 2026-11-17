// 曾氏族譜 3D 祠堂 Service Worker
// 每次發佈新版請把 CACHE 版號 +1；App 會偵測到新版並提示「軟體更新」
const CACHE = '3d-zupu-v33';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
const CDN = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  // 略過瀏覽器 HTTP 快取，確保新版檔案是剛從伺服器取得；不自動接手，等使用者按「立即更新」
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => {
  const t = e.data && e.data.type;
  if (t === 'SKIP_WAITING') self.skipWaiting();
  else if (t === 'VERSION' && e.ports[0]) e.ports[0].postMessage(CACHE);
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
