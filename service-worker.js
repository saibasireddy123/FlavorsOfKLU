const CACHE_NAME = "flavors-of-klu-v2"; // Increment version for updates
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/menu.json",
  "/images/food-bg.jpg"
];

// Install Service Worker & Cache Files
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Caching assets...");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate & Delete Old Cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("🗑️ Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control immediately
});

// Fetch Strategy: Network First, Then Cache
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("menu.json")) {
    // Always fetch latest menu.json
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone()); // Update cache
            return response;
          });
        })
        .catch(() => caches.match(event.request)) // Fallback to cache
    );
  } else {
    // Cache-first for other assets
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

// Notify Clients About New Update
self.addEventListener("message", (event) => {
  if (event.data === "checkForUpdate") {
    self.skipWaiting(); // Force update
  }
});
