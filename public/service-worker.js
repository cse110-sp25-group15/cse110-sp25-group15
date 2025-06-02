// Service Worker for local image caching
const CACHE_NAME = 'image-cache-v1';
const MAX_CACHE_ITEMS = 100; // Adjust as needed
const CACHE_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Helper: Clean up old cache entries
async function cleanUpCache(cache) {
  const requests = await cache.keys();
  if (requests.length > MAX_CACHE_ITEMS) {
    // Remove oldest entries
    for (let i = 0; i < requests.length - MAX_CACHE_ITEMS; i++) {
      await cache.delete(requests[i]);
    }
  }
}

// Helper: Check if cached response is expired
async function isExpired(response) {
  if (!response) { return true; }
  const dateHeader = response.headers.get('sw-cache-date');
  if (!dateHeader) { return false; }
  const cachedTime = parseInt(dateHeader, 10);
  return Date.now() - cachedTime > CACHE_EXPIRATION_MS;
}

self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) {
          return cached;
        }
        try {
          const response = await fetch(event.request);
          if (response && response.status === 200) {
            // Clone response for caching
            const cacheResponse = response.clone();
            await cache.put(event.request, cacheResponse);
            cleanUpCache(cache);
            return response;
          }
        } catch {
          // Network failed, try cache fallback
          if (cached) { return cached; }
          // Only use fallback for same-origin requests
          if (event.request.url.startsWith(self.location.origin)) {
            const fallback = await caches.match('/cse110-sp25-group15/fallback.png');
            if (fallback && fallback.ok) return fallback;
          }
          // For cross-origin or missing fallback, return a generic error response
          return Response.error();
        }
      })
    );
  }
});

// Clean up old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
      ),
    ),
  );
});
