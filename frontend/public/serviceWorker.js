const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html","/static/js/bundle.js", "/static/js/main.chunk.js", "/static/js/vendors~main.chunk.js"]

// Installation of SW
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("Cache opened!");
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error("Failed to open cache during install:", error);
            })
    );
});

// Fetch Event
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                return cachedResponse || fetch(event.request).catch(() => caches.match("offline.html"));
            })
    );
});

// Activate Event
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});