'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"canvaskit/canvaskit.js": "26eef3024dbc64886b7f48e1b6fb05cf",
"canvaskit/canvaskit.js.symbols": "efc2cd87d1ff6c586b7d4c7083063a40",
"canvaskit/canvaskit.wasm": "e7602c687313cfac5f495c5eac2fb324",
"canvaskit/chromium/canvaskit.js": "b7ba6d908089f706772b2007c37e6da4",
"canvaskit/chromium/canvaskit.js.symbols": "e115ddcfad5f5b98a90e389433606502",
"canvaskit/chromium/canvaskit.wasm": "ea5ab288728f7200f398f60089048b48",
"canvaskit/skwasm.js": "ac0f73826b925320a1e9b0d3fd7da61c",
"canvaskit/skwasm.js.symbols": "96263e00e3c9bd9cd878ead867c04f3c",
"canvaskit/skwasm.wasm": "828c26a0b1cc8eb1adacbdd0c5e8bcfa",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"flutter.js": "4b2350e14c6650ba82871f60906437ea",
"flutter_bootstrap.js": "b6f786cda5ceafb59f75afab69963c67",
"index.html": "79a473572188159f7a3d9c42f6610c16",
"/": "79a473572188159f7a3d9c42f6610c16",
"main.dart.js": "edd1217e21d32b9ce76197905146829e",
"version.json": "dd3d59b38eafe33959db59b420c06487",
"assets/assets/misc/app_store.png": "fea459ae270cc14fc7eeb41aca80cc98",
"assets/assets/misc/hardt.jpg": "bc284157ee2fa33f1291d3ce46b7d703",
"assets/assets/misc/open_data_logo.png": "1161c56e520760a9efe8846da150c667",
"assets/assets/misc/play_store.png": "7bf5d76eed45ea0a79c31a4913ae80b3",
"assets/assets/google_fonts/Anton-Regular.ttf": "7777f7f3f519eaedd41b8b9a8cd2666e",
"assets/assets/affiliate_categories/ecouteurs.png": "a21a2f7f6e2a45f25cd74f06eb894313",
"assets/assets/affiliate_categories/lunettes.png": "4e6cd73b97132b95ccc3dbf5ee6e6843",
"assets/assets/affiliate_categories/maillots_femme.png": "5fe73d28dda486996b0c7f93c1d9f2f5",
"assets/assets/affiliate_categories/maillots_homme.png": "7f886b425600c52c1520a1f6d6c4b7b1",
"assets/assets/affiliate_categories/palmes.png": "3ddc12e654f64e6086a796770afcdd3d",
"assets/assets/affiliate_categories/planches.png": "cb5beebf8a0ba98e436d6514c45ecfe5",
"assets/assets/affiliate_categories/pull_buoys.png": "de6067af5acfc53853d92cdcc181c3a4",
"assets/assets/affiliate_categories/sacs.png": "171a84a6c8d5323cb9a45a30b4ad48d7",
"assets/assets/affiliate_categories/snorkels.png": "22a2bf490d9f56ab7fd0300411b64947",
"assets/fonts/MaterialIcons-Regular.otf": "f3c0056853bf3cdf52069633797f76c2",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.json": "3b0617b07ed3c565c4bd473066f6d366",
"assets/AssetManifest.bin.json": "f07f6005319c5a56f10a705b6150e98e",
"assets/AssetManifest.bin": "4a9c5078bb70ab888f4d3e68555e72dd",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/NOTICES": "d6b4f5e1a6a7c1bb27e52f4f91110473",
"favicon.ico": "efebfb01710081679b621bfdebf4d645",
"favicon.png": "efebfb01710081679b621bfdebf4d645",
"icons/Icon-192.png": "3c761eaa334a5eb48621d87424728f6d",
"icons/Icon-512.png": "2ce7edb8deabaac799e9e7adaf1a8dee",
"icons/Icon-maskable-192.png": "3c761eaa334a5eb48621d87424728f6d",
"icons/Icon-maskable-512.png": "2ce7edb8deabaac799e9e7adaf1a8dee",
"manifest.json": "29c1be7c6927351a5d44ed6f2dd5c4ff"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
