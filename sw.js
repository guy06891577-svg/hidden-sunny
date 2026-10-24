const C='sunny-v8',F=['./','index.html','style.css','game.js','manifest.json','icon.svg','img/stage1.jpg','img/stage2.jpg','img/stage3.jpg','img/stage4.jpg','img/stage5.jpg','img/stage6.jpg','img/stage7.jpg','img/stage8.jpg','img/sunny.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
