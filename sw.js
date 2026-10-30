const V="im-v1";
const SHELL=["./","index.html","map.json","manifest.webmanifest","icon-192.png","apple-touch-icon.png","https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.hostname.endsWith("basemaps.cartocdn.com"))return;
  if(e.request.mode==="navigate"){e.respondWith(fetch(e.request).then(r=>{caches.open(V).then(c=>c.put("index.html",r.clone()));return r}).catch(()=>caches.match("index.html")));return}
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{if(n.ok&&(u.origin===location.origin||u.hostname==="cdnjs.cloudflare.com")){const c=n.clone();caches.open(V).then(x=>x.put(e.request,c))}return n})));
});
