const cacheName = "insmemo-storage";

self.addEventListener("install", (e) => {
  // e.waitUntil(
  //   caches.open(cacheName).then((cache) => {
  //     return cache.addAll([]);
  //   })
  // );
});

self.addEventListener("fetch", function (e) {
  // e.respondWith(
  //   caches.match(e.request).then(async (r) => {
  //     try {
  //       const response = await fetch(e.request);
  //       return caches.open(cacheName).then((cache) => {
  //         try {
  //           cache.put(e.request, response.clone());
  //         } catch (error) {
  //           // do nth
  //         }
  //         return response;
  //       });
  //     } catch (error) {
  //       return r;
  //     }
  //   })
  // );
});

self.addEventListener("activate", function (e) {
  // e.waitUntil(
  //   caches.keys().then(function (keyList) {
  //     return Promise.all(
  //       keyList.map(function (key) {
  //         if (cacheName.indexOf(key) === -1) {
  //           return caches.delete(key);
  //         }
  //       })
  //     );
  //   })
  // );
});
