const CACHE_NAME = `spicecrm-app-v1`;

/**
 * Use the installation event to pre-cache all initial resources
 */
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll([
            '/',
        ]);
    })());
});

/**
 * handles the network requests for caching
 * using the stale while revalidate cache strategy
 * https://web.dev/learn/pwa/serving#stale_while_revalidate
 */
self.addEventListener('fetch', event => {
    event.respondWith((async () => {

        const canBeCached = event.request.url.startsWith('http') && !!event.request.destination;
        let cachedResponse, cache;

        if (canBeCached) {
            cache = await caches.open(CACHE_NAME);
            // Get the resource from the cache.
            cachedResponse = await cache.match(event.request);
        }

        if (cachedResponse) {
            fetchAndCache(event.request, cache);
            return cachedResponse;
        } else {
            try {
                return fetchAndCache(event.request, cache);
            } catch (e) {
                // The network failed.
            }
        }
    })());
});

/**
 *
 * @param request Request
 * @param cache CacheStorage
 * @returns {Promise<Response>}
 */
function fetchAndCache(request, cache) {
    // If the resource was not in the cache, try the network.
    return fetch(request).then(fetchResponse => {

        if(cache) {
            // Save the resource in the cache and return it.
            cache.put(request, fetchResponse.clone());
        }

        return fetchResponse;
    });
}
