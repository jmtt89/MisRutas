importScripts('workbox-sw.prod.v2.1.2.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "css/styles.css",
    "revision": "a802273af6ebc22e4363b7aacf5275cf"
  },
  {
    "url": "img/icon_medium_tile.png",
    "revision": "203cf42d0aad7b5918624a917a454432"
  },
  {
    "url": "img/icon_small_tile.png",
    "revision": "a2807c93ea33c295e1502fac2fe89b41"
  },
  {
    "url": "img/icon_wide_tile.png",
    "revision": "0f7a98165e8cc9525bdc36335a30cdf1"
  },
  {
    "url": "img/icon.png",
    "revision": "c1bf4eeb6d6c5c1597b221486df69ff0"
  },
  {
    "url": "img/launcher-icon-1x.png",
    "revision": "3e9a3832c9d8ab9ebf403af590d69e7e"
  },
  {
    "url": "img/launcher-icon-2x.png",
    "revision": "7e5f43b59a54949d2e137e6319cb68f9"
  },
  {
    "url": "img/launcher-icon-4x.png",
    "revision": "c1bf4eeb6d6c5c1597b221486df69ff0"
  },
  {
    "url": "img/touch-icon-ipad-retina.png",
    "revision": "db2acb2d7e0bb95c30b52c62fb51017b"
  },
  {
    "url": "img/touch-icon-ipad.png",
    "revision": "1c256e23b972abb3561fd5e770f37f05"
  },
  {
    "url": "img/touch-icon-iphone-retina.png",
    "revision": "f331a64f46dd2f63bcbdbf6b8dc1a6e4"
  },
  {
    "url": "img/touch-icon-iphone.png",
    "revision": "a0eb0eb694487f4163f423dcad6f2600"
  },
  {
    "url": "index.html",
    "revision": "38b1e3bc10101c72dd841737b90b9bdf"
  },
  {
    "url": "js/app.js",
    "revision": "5256376596152a9809631b7b5099ed39"
  },
  {
    "url": "js/modelo.js",
    "revision": "891725ba6af5ae0f03a82b2fee2eb95e"
  },
  {
    "url": "js/sw.js",
    "revision": "7403e9432f267d8440ac9bddb3419f67"
  },
  {
    "url": "js/workbox-sw.prod.v2.1.2.js",
    "revision": "685d1ceb6b9a9f94aacf71d6aeef8b51"
  },
  {
    "url": "manifest.json",
    "revision": "0079bce8c8f5d7afba258d205e83452a"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
workboxSW.router.registerRoute('https://code.jquery.com/**/*', workboxSW.strategies.cacheFirst({}), 'GET');
workboxSW.router.registerRoute('https://maps.googleapis.com/**/*', workboxSW.strategies.cacheFirst({}), 'GET');
