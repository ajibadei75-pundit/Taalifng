/* Taalif NG service worker. Bump VERSION on each release to refresh caches. */
const VERSION='taalif-v1',PRE=['./','index.html','offline.html','css/styles.css','js/site.js','js/portal.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/favicon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(PRE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
if(r.method!=='GET'||u.origin!==location.origin||u.pathname.includes('/api/'))return; /* never cache API, payment or personal data */
if(r.mode==='navigate'){e.respondWith(fetch(r).catch(()=>caches.match('index.html').then(h=>h||caches.match('offline.html'))));return}
e.respondWith(caches.match(r).then(h=>h||fetch(r).then(n=>{const c=n.clone();caches.open(VERSION).then(x=>x.put(r,c));return n})))});
