const CACHE_NAME = 'funny-spinner-v6';
const STATIC_CACHE_NAME = 'funny-spinner-static-v6';
const DYNAMIC_CACHE_NAME = 'funny-spinner-dynamic-v6';

// Files to cache for offline functionality
const STATIC_ASSETS = [
	'/',
	'/index.html',
	'/manifest.json',
	'/icons/icon.svg',
	'/icons/icon-192x192.png',
	'/icons/icon-144x144.png',
];

// Install event - cache static assets
self.addEventListener('install', event => {
	console.log('[SW] Installing service worker...');

	event.waitUntil(
		caches
			.open(STATIC_CACHE_NAME)
			.then(cache => {
				console.log('[SW] Caching static assets');
				return cache.addAll(STATIC_ASSETS);
			})
			.catch(error => {
				console.error('[SW] Failed to cache static assets:', error);
			})
	);

	// Force the service worker to skip waiting and become active immediately
	self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
	console.log('[SW] Activating service worker...');

	event.waitUntil(
		caches
			.keys()
			.then(cacheNames => {
				return Promise.all(
					cacheNames
						.filter(cacheName => {
							return (
								cacheName !== STATIC_CACHE_NAME &&
								cacheName !== DYNAMIC_CACHE_NAME
							);
						})
						.map(cacheName => {
							console.log('[SW] Deleting old cache:', cacheName);
							return caches.delete(cacheName);
						})
				);
			})
			.then(() => {
				// Take control of all pages immediately
				return self.clients.claim();
			})
	);
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== 'GET') {
		return;
	}

	// Skip external requests
	if (url.origin !== location.origin) {
		return;
	}

	event.respondWith(
		caches.match(request).then(cachedResponse => {
			// Return cached version if available
			if (cachedResponse) {
				console.log('[SW] Serving from cache:', request.url);
				return cachedResponse;
			}

			// Otherwise fetch from network
			return fetch(request)
				.then(networkResponse => {
					// Cache successful responses
					if (networkResponse.status === 200) {
						const responseClone = networkResponse.clone();

						// Determine which cache to use
						const cacheName = STATIC_ASSETS.some(
							asset =>
								request.url.endsWith(asset) ||
								request.url === `${location.origin}${asset}`
						)
							? STATIC_CACHE_NAME
							: DYNAMIC_CACHE_NAME;

						caches.open(cacheName).then(cache => {
							console.log('[SW] Caching new resource:', request.url);
							cache.put(request, responseClone);
						});
					}

					return networkResponse;
				})
				.catch(error => {
					console.error('[SW] Fetch failed:', error);

					// Return offline fallback for HTML requests
					if (request.headers.get('accept').includes('text/html')) {
						return caches.match('/index.html');
					}

					// For other requests, throw the error
					throw error;
				});
		})
	);
});

// Background sync for future enhancement
self.addEventListener('sync', event => {
	console.log('[SW] Background sync triggered:', event.tag);

	if (event.tag === 'spinner-results-sync') {
		event.waitUntil(syncSpinnerResults());
	}
});

// Handle push notifications for future enhancement
self.addEventListener('push', event => {
	console.log('[SW] Push message received');

	const options = {
		body: event.data ? event.data.text() : 'Time to make a decision!',
		icon: '/icons/icon.svg',
		badge: '/icons/icon.svg',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1,
		},
		actions: [
			{
				action: 'spin',
				title: 'Quick Spin',
				icon: '/icons/icon.svg',
			},
			{
				action: 'close',
				title: 'Close',
				icon: '/icons/icon.svg',
			},
		],
	};

	event.waitUntil(
		self.registration.showNotification('🎯 Funny Spinner', options)
	);
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
	console.log('[SW] Notification clicked:', event.action);

	event.notification.close();

	if (event.action === 'spin') {
		event.waitUntil(clients.openWindow('/?quick-spin=true'));
	} else if (event.action === 'close') {
		// Just close the notification
	} else {
		// Default action - open the app
		event.waitUntil(clients.openWindow('/'));
	}
});

// Sync spinner results (placeholder for future implementation)
async function syncSpinnerResults() {
	try {
		// This would sync offline spin results when back online
		console.log('[SW] Syncing spinner results...');
		// Implementation would go here
	} catch (error) {
		console.error('[SW] Failed to sync spinner results:', error);
	}
}

// Message handling for communication with the main app
self.addEventListener('message', event => {
	console.log('[SW] Message received:', event.data);

	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}

	if (event.data && event.data.type === 'GET_VERSION') {
		event.ports[0].postMessage({ version: CACHE_NAME });
	}
});

console.log('[SW] Service worker loaded successfully');
