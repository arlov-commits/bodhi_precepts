/* Fast days, offline.
   The whole app is a handful of static files, so the service worker keeps a
   copy of all of them and serves from it. Bump CACHE only to force every
   client to throw its copy away; ordinary edits do not need it, because each
   response is refreshed in the background as it is served. */
var CACHE = "bodhi-v1";
var SHELL = [
  "./",
  "index.html",
  "data.js",
  "manifest.webmanifest",
  "icon.svg",
  "icon-32.png",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
  "apple-touch-icon.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (cache) {
    return cache.addAll(SHELL);
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) {
      return k === CACHE ? null : caches.delete(k);
    }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(caches.open(CACHE).then(function (cache) {
    return cache.match(req).then(function (hit) {
      /* Fetched alongside whatever is served, so a new build lands in the
         cache now and is shown at the next launch. */
      var fresh = fetch(req).then(function (res) {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(function () { return null; });
      if (hit) return hit;
      return fresh.then(function (res) {
        if (res) return res;
        /* Offline and not in the cache: a page request still has somewhere
           to go, since the shell is always there. */
        return req.mode === "navigate" ? cache.match("index.html")
          : Response.error();
      });
    });
  }));
});
