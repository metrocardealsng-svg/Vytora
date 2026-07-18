const CACHE = "vytora-v3";
const OFFLINE_PAGE = "/";

const STATIC = [
  "/",
  "/tracker",
  "/dashboard",
  "/pricing",
  "/tribe",
  "/tips",
  "/challenges",
  "/nutrition",
  "/sleep",
  "/calisthenics",
  "/blog",
  "/manifest.json",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => {
      return c.addAll(STATIC).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  // Always fetch API routes fresh - never cache
  if (e.request.url.includes("/api/")) return;

  // For map tiles - cache aggressively
  if (e.request.url.includes("openstreetmap.org")) {
    e.respondWith(
      caches.open("map-tiles").then((cache) =>
        cache.match(e.request).then((cached) => {
          if (cached) return cached;
          return fetch(e.request).then((res) => {
            cache.put(e.request, res.clone());
            return res;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // Network first, fall back to cache, then offline page
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
        return res;
      })
      .catch(() =>
        caches.match(e.request).then((cached) => cached || caches.match(OFFLINE_PAGE))
      )
  );
});
