self.addEventListener("install", function (e) {
  // do nth
  // e.waitUntil(
  //   caches.open("fox-store").then(function (cache) {
  //     return cache.addAll(["/"]);
  //   })
  // );
});

self.addEventListener("fetch", function (e) {
  // do nth
  // e.respondWith(
  //   caches.match(e.request).then(function (response) {
  //     return response || fetch(e.request);
  //   })
  // );
});
