const staticCacheName = 'weather-v2';
const urls2ToCache = [
  './weather.htm',
  './images/PGSC.png',
  './weather/webcam.png',
  './images/Animated-lightningT.gif',
  './images/Animated-Waves.gif',
  './images/boat-48.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urls2ToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});