/**
 * Legacy cleanup: unregister service worker and clear caches.
 * PWA support was removed in favor of a simpler static site.
 */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.map((name) => caches.delete(name))))
      .then(() => self.registration.unregister())
  );
});
