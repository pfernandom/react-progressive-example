/**
 * Created by pedro.f.marquez.soto on 6/22/2017.
 */

const CACHE_NAME = 'v1'
self.addEventListener("install", event => {
	console.log("Installed");

	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(cache =>
				fetch("/pwa-manifest.json")
					.then(response => response.json())
					.then(assets =>
						cache.addAll([
							"/",
							assets["main.js"],
							assets["vendor.js"],
							'/json/data.json',
						])
					)
			).then(() => self.skipWaiting())
			.catch(err => console.log)
	);
});


self.addEventListener('fetch', function(event) {
	console.log('Fetch')
	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
			.catch(e => {console.error("Error on the cache",e)})
	);
});

self.addEventListener("activate", event => {
	const cacheWhitelist = [CACHE_NAME];
	event.waitUntil(
		caches.keys()
			.then(keyList =>
				Promise.all(keyList.map(key => {
					if (!cacheWhitelist.includes(key)) {
						return caches.delete(key);
					}
				}))
			)
			.then(() => self.clients.claim())
	);
});