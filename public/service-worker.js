// Minimal service worker for PWA installability
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  // No caching – pass all requests through to the network
  event.respondWith(fetch(event.request))
})
