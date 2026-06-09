const CACHE='birthprep-v2';
const ASSETS=["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-512.png", "img/a_chairlunge.jpg", "img/a_d0lean.jpg", "img/a_d0lunge.jpg", "img/a_offball.jpg", "img/a_peanut.jpg", "img/a_seated.jpg", "img/e_chairsquat.jpg", "img/e_d0drape.jpg", "img/e_figure8.jpg", "img/e_hipcircle.jpg", "img/e_offball.jpg", "img/e_peanut.jpg", "img/e_peanutseat.jpg", "img/e_pelvictilt.jpg", "img/e_sit.jpg", "img/e_squatball.jpg", "img/p_drape.jpg", "img/p_offball.jpg", "img/p_peanut.jpg", "img/t_handsknees.jpg"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==location.origin) return; // YouTube etc -> straight to network
  const isPage = req.mode==='navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html');
  if(isPage){
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));return r;}).catch(()=>caches.match(req).then(r=>r||caches.match('index.html'))));
  } else {
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(r2=>{const cp=r2.clone();caches.open(CACHE).then(c=>c.put(req,cp));return r2;})));
  }
});
