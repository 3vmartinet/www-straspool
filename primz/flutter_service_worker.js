'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"manifest.json": "3857926690e6e3544f34bc132317667a",
"flutter.js": "c71a09214cb6f5f8996a531350400a9a",
"main.dart.js": "4239f444f71985c0fbcff49ab37a5fbb",
"index.html": "afb9968fa2019cd139a19e1e0a637da2",
"/": "afb9968fa2019cd139a19e1e0a637da2",
"version.json": "913a4651acdf22ecb05bac4b86d9ce57",
"canvaskit/canvaskit.js": "c86fbd9e7b17accae76e5ad116583dc4",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"canvaskit/skwasm.wasm": "e42815763c5d05bba43f9d0337fa7d84",
"canvaskit/skwasm.js.symbols": "741d50ffba71f89345996b0aa8426af8",
"canvaskit/skwasm.js": "445e9e400085faead4493be2224d95aa",
"canvaskit/canvaskit.wasm": "3d2a2d663e8c5111ac61a46367f751ac",
"canvaskit/canvaskit.js.symbols": "38cba9233b92472a36ff011dc21c2c9f",
"canvaskit/chromium/canvaskit.js": "43787ac5098c648979c27c13c6f804c3",
"canvaskit/chromium/canvaskit.wasm": "f5934e694f12929ed56a671617acd254",
"canvaskit/chromium/canvaskit.js.symbols": "4525682ef039faeb11f24f37436dca06",
"assets/FontManifest.json": "f6af24913d16c0f2c935626f14fe359c",
"assets/NOTICES": "f1a03693880444435ebbde641124e859",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/fonts/MaterialIcons-Regular.otf": "0fcf47c52969826266ab44334d03a06f",
"assets/AssetManifest.bin.json": "45a8d5516b977cee109573484be48d84",
"assets/AssetManifest.bin": "da74f9bb7ccd192ad96bb092cc807577",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/AssetManifest.json": "36a29e4529b030469118bcd964855739",
"assets/assets/app_store.png": "fea459ae270cc14fc7eeb41aca80cc98",
"assets/assets/app_icons/primz_web.png": "8b8cd7501876c4020d192053bf19d5e1",
"assets/assets/app_icons/numz_web.png": "4a6cd800b163efc9ff3ae444c4024f8e",
"assets/assets/app_icons/primz_android.png": "49b16cd2838ac8b8f4fe82a20543cf77",
"assets/assets/app_icons/numz_android.png": "8a86c99002b9d4ed9367288abf90f1e4",
"assets/assets/app_icons/numz.png": "23417687448f4d5cf7b9e98ef47b97b3",
"assets/assets/app_icons/primz.png": "69000b3a1b6405ff3542f02d20b6bbb1",
"assets/assets/fonts/Digital7-regular.ttf": "1e670d88b23c7ab956f1829e3828a210",
"assets/assets/mockups.png": "2f7237e0294b01e143d3e9e4ccab3e4a",
"assets/assets/play_store.png": "7bf5d76eed45ea0a79c31a4913ae80b3",
"assets/assets/primz/bonus/TurboBoost.gif": "992ace05caa1ba90852787824f17d1da",
"assets/assets/primz/bonus/EjectorSeat.gif": "7b7120c9c4d70cea2c262e66fb21d55c",
"assets/assets/primz/bonus/Laser.gif": "8f5e6c60d95d1a81ead8c912c3b8d8bc",
"assets/assets/primz/collectibles/12.md": "57daebc445d758b95f1c33cfec67a23a",
"assets/assets/primz/collectibles/1.md": "58ebb72039e18b2540bac3a0fcf3b35c",
"assets/assets/primz/collectibles/2.md": "d23ed5686c2165ac8fb1fcbd4ab80256",
"assets/assets/primz/collectibles/13.md": "cbebcb3e1ad26e3947a038e59841f07c",
"assets/assets/primz/collectibles/3.md": "8edc895825a6f55e9f657b936bfba960",
"assets/assets/primz/collectibles/11.md": "f5eab7898d0613db0b084464f59efec0",
"assets/assets/primz/collectibles/6.md": "ed0d102558ddbfc80ea1eb2df6986516",
"assets/assets/primz/collectibles/9.md": "ddac4a8f53d37857bebe4f36d5c0ab0d",
"assets/assets/primz/collectibles/15.md": "21f6712ce06f7fb30d63a5133a44349e",
"assets/assets/primz/collectibles/14.md": "116271fb1868377577df83b3b580df89",
"assets/assets/primz/collectibles/4.md": "4f2a77944ec418ab08bf23a5c509c2b3",
"assets/assets/primz/collectibles/5.md": "05ce87dfa474f7adfb9bf66ce5000944",
"assets/assets/primz/collectibles/7.md": "aa9b02028926c1b73b140181cd9b4e58",
"assets/assets/primz/collectibles/8.md": "993eb2609dc937fa793aad7eda3f3e45",
"assets/assets/primz/collectibles/10.md": "11afa6ca839d217271479924c7bb9485",
"assets/assets/audio/famousPlumber/gameCompleted.wav": "a36764134107d0fe6c80bc7fa696fb16",
"assets/assets/audio/famousPlumber/warning.wav": "1eb2e100e9946c567bc8ebe099afae71",
"assets/assets/audio/famousPlumber/paused.wav": "20f930b5c81597710cf237423bee1394",
"assets/assets/audio/famousPlumber/incrementCompletedGames.wav": "a471456c08a47d58960e397291b6ce8d",
"assets/assets/audio/famousPlumber/selectAnswer.wav": "b377dcd4ed1e233d09d675c952bbc776",
"assets/assets/audio/famousPlumber/unselectAnswer.wav": "da8ea9abe3ece7075a8492549a889425",
"assets/assets/audio/famousPlumber/gameLost.wav": "18337b1c47f5438faad0ee3c415cdab5",
"assets/assets/audio/famousPlumber/levelCompleted.wav": "d82c39fd5aa149573ec9366082b6a2f6",
"assets/assets/audio/famousPlumber/allLevelsCompleted.wav": "d03296f3c332d0a58de367c531d29fe3",
"assets/assets/audio/famousPlumber/bonusActivated.wav": "ecbe75382491838b0139f625251546bb",
"assets/assets/audio/famousPlumber/gameRecovered.wav": "872073a1918e0ac80adf92bdfd2fa67b",
"assets/assets/audio/chill/gameCompleted.wav": "f9b192c828d9b6cf5c72353e08981b5a",
"assets/assets/audio/chill/warning.wav": "21f491ab513ff51b8ac5b38a39118138",
"assets/assets/audio/chill/paused.wav": "b140957bf3c26ed40041b967b9ca24e0",
"assets/assets/audio/chill/incrementCompletedGames.wav": "83d00e0d1db65242fb6bfa32d560e275",
"assets/assets/audio/chill/selectAnswer.wav": "7aa72929db86da97e7e5b6294702002e",
"assets/assets/audio/chill/unselectAnswer.wav": "9e3760594c1c2cd1435cd95779e962aa",
"assets/assets/audio/chill/gameLost.wav": "867b00ba068c6c771e3fef677306ec82",
"assets/assets/audio/chill/levelCompleted.wav": "d7336c6e4445acf7d5a5f22ab7ded02e",
"assets/assets/audio/chill/allLevelsCompleted.wav": "656f5b6b8a98a4d35bc96519f3db9281",
"assets/assets/audio/chill/bonusActivated.wav": "e209dfe6635a34497c7fda408bd50f18",
"assets/assets/audio/chill/gameRecovered.wav": "6e67a1248ccf75c9a9c5a43b5e02fb2b",
"assets/assets/audio/oxo/gameCompleted.wav": "b882056cb983002fde4d5300a09b0210",
"assets/assets/audio/oxo/warning.wav": "ac6132766864faec7efea93ea7ca3ed8",
"assets/assets/audio/oxo/paused.wav": "1e5c5b4bd36a2d904ca6b250c1dee60c",
"assets/assets/audio/oxo/incrementCompletedGames.wav": "1179806067a54e575bcba2f7dd7e90bc",
"assets/assets/audio/oxo/selectAnswer.wav": "777b857bdfc2432dbc601fd6687cbed4",
"assets/assets/audio/oxo/unselectAnswer.wav": "b39fbaa6056e3591f2beff8a660e7967",
"assets/assets/audio/oxo/gameLost.wav": "901bc48deb006fc8e65eeb40823f197f",
"assets/assets/audio/oxo/levelCompleted.wav": "b4a53ebcab625fa87924e8317d54bfbd",
"assets/assets/audio/oxo/allLevelsCompleted.wav": "ba4e6608c023d3598c9f0e7f90e86280",
"assets/assets/audio/oxo/bonusActivated.wav": "79286bde378c8187c517b5d44a6d75d2",
"assets/assets/audio/oxo/gameRecovered.wav": "e9542d0ab16505163f45fad4a913621f",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
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
