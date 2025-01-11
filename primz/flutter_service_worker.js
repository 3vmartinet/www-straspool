'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"manifest.json": "3857926690e6e3544f34bc132317667a",
"flutter.js": "383e55f7f3cce5be08fcf1f3881f585c",
"main.dart.js": "c9231fd6e916c4b538da04d2e5bc6b0e",
"flutter_bootstrap.js": "d238daf5398c569621784f1e33210fd1",
"index.html": "23a9b10e798ac4a4d8cd3fca802d9c93",
"/": "23a9b10e798ac4a4d8cd3fca802d9c93",
"version.json": "6a15192d22d05dd08e347d278c8b419b",
"canvaskit/canvaskit.js": "738255d00768497e86aa4ca510cce1e1",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"canvaskit/skwasm.wasm": "4051bfc27ba29bf420d17aa0c3a98bce",
"canvaskit/skwasm.js.symbols": "c3c05bd50bdf59da8626bbe446ce65a3",
"canvaskit/skwasm.js": "5d4f9263ec93efeb022bb14a3881d240",
"canvaskit/canvaskit.wasm": "9251bb81ae8464c4df3b072f84aa969b",
"canvaskit/canvaskit.js.symbols": "74a84c23f5ada42fe063514c587968c6",
"canvaskit/chromium/canvaskit.js": "901bb9e28fac643b7da75ecfd3339f3f",
"canvaskit/chromium/canvaskit.wasm": "399e2344480862e2dfa26f12fa5891d7",
"canvaskit/chromium/canvaskit.js.symbols": "ee7e331f7f5bbf5ec937737542112372",
"assets/FontManifest.json": "f6af24913d16c0f2c935626f14fe359c",
"assets/NOTICES": "40f1a96c92dc352ff46966d53552d263",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/fonts/MaterialIcons-Regular.otf": "fb15719455f77ecb5aa85874201e232d",
"assets/AssetManifest.bin.json": "0b91975d030cb1ab3150e2bfec1d143d",
"assets/AssetManifest.bin": "ece5daa77ee4e56674b97ee930bd7cb3",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/AssetManifest.json": "eb2417050bf21dceee300647e5b43b0f",
"assets/assets/app_store.png": "fea459ae270cc14fc7eeb41aca80cc98",
"assets/assets/app_icons/primz_web.png": "8b8cd7501876c4020d192053bf19d5e1",
"assets/assets/app_icons/primz_splash.png": "fd22857ce52fc2b6deffda5826ebe929",
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
"assets/assets/primz/collectibles/2-1.jpeg": "c64ae5a727b94b3c39377e387b4517a9",
"assets/assets/primz/collectibles/11.jpeg": "eab55669a0dbd69f925372798c037a4f",
"assets/assets/primz/collectibles/4-fr.md": "8d166c0aa95df5aafc61c1dacf5d9f6e",
"assets/assets/primz/collectibles/10-1.jpeg": "9651a79e79a7846242c6268b1589bad6",
"assets/assets/primz/collectibles/6-en.md": "888a4e370f29b1b73f03d08e3f367757",
"assets/assets/primz/collectibles/12-de.md": "d6e8e3497a4fe9372504b5659bfa36a0",
"assets/assets/primz/collectibles/3-en.md": "aa81d7a6db9edb96aab6a0a08705d640",
"assets/assets/primz/collectibles/6-fr.md": "846960d6f6d5e14f5d43c04a6bc788ae",
"assets/assets/primz/collectibles/10.jpeg": "b3888cd59f6366874ec5071cbafc1e19",
"assets/assets/primz/collectibles/13-1.jpeg": "bc8ce884cc9ac898f9a989811937b880",
"assets/assets/primz/collectibles/0-fr.md": "b607cc7560cc69623b3d9cd9052e2fa9",
"assets/assets/primz/collectibles/4.jpeg": "ae88b6e10ac57efe27f3d23bd66085ee",
"assets/assets/primz/collectibles/13-fr.md": "691f415cc9b810e8da5bc97b9da42a08",
"assets/assets/primz/collectibles/1.jpeg": "fe5591bfb842aa807c2d17f90c8ee2e2",
"assets/assets/primz/collectibles/9-1.jpeg": "cd07f5203d1cb63966ec110a886c27e0",
"assets/assets/primz/collectibles/10-en.md": "a829fdd8fa3359ab556dbfce4e31fff9",
"assets/assets/primz/collectibles/3-fr.md": "a428dcd9bf95dbeae2f82f2c6cdba42d",
"assets/assets/primz/collectibles/12-fr.md": "c98be557a8e04291111b5b3718be9928",
"assets/assets/primz/collectibles/5-fr.md": "ac040aa957918d1c93f4059c5d6cf79a",
"assets/assets/primz/collectibles/7-de.md": "552752f2fd3d49c18eec88edcce3e2a3",
"assets/assets/primz/collectibles/13-en.md": "1bf025db8f44dfb01a74fba81bd30517",
"assets/assets/primz/collectibles/8-de.md": "c1f1ed5d72e250533a7da6ed2c90e3ff",
"assets/assets/primz/collectibles/9-en.md": "0d1f79b45d8a94504d002b4d95f0a2f6",
"assets/assets/primz/collectibles/14-fr.md": "1441efade93eb4f82a7a3dd949d46b7c",
"assets/assets/primz/collectibles/5.jpeg": "11e4ced08c05ed202972f57852176a16",
"assets/assets/primz/collectibles/3.jpeg": "9888acaeb8a811692e5dc99066433ba7",
"assets/assets/primz/collectibles/7.jpeg": "201771e802946cd8f07ed951a3934254",
"assets/assets/primz/collectibles/14-en.md": "3ee83bce9419433be4def31feff626c3",
"assets/assets/primz/collectibles/9-fr.md": "243ea131ee73a2f546544d4784edcec9",
"assets/assets/primz/collectibles/0-en.md": "aef46b7f0a0304d9c1686faaf0630e63",
"assets/assets/primz/collectibles/1-en.md": "6a0488c53b1010f825cb91a90c0889c7",
"assets/assets/primz/collectibles/8-1.jpeg": "83287ee9542071ad044ad36c74499afa",
"assets/assets/primz/collectibles/13.jpeg": "a7da6ee67b6558f2f4581b9b4ce8eed6",
"assets/assets/primz/collectibles/5-1.jpeg": "3cfc355d979eac179aae2a28e60fc0ab",
"assets/assets/primz/collectibles/6-de.md": "95c4d8fa6a56d6ad70701271d4b66973",
"assets/assets/primz/collectibles/12-1.jpeg": "3d911daa6c2aa3c065b9c016cfdce985",
"assets/assets/primz/collectibles/14-1.jpeg": "4e1847b968b7852425fc062ef55fff31",
"assets/assets/primz/collectibles/5-en.md": "17e0290ac55798fc25f5e35a50ff46be",
"assets/assets/primz/collectibles/8.jpeg": "8bc9d6f9bf2e7c2d8be976c95dce74c0",
"assets/assets/primz/collectibles/7-fr.md": "a3067a791f2d8dc7126a8b72510a99b8",
"assets/assets/primz/collectibles/10-fr.md": "54e3cd9249b020d718857d135d72c9ab",
"assets/assets/primz/collectibles/14-de.md": "f3ab1bd44a9b895026ace84c4a7ab865",
"assets/assets/primz/collectibles/7-en.md": "2f197f49733dbfab1d2ffa677f96854a",
"assets/assets/primz/collectibles/5-de.md": "0512e1c8713e3f229294bb54215e078c",
"assets/assets/primz/collectibles/1-de.md": "ccbc2b80d28a1f92a83e9558d51620e1",
"assets/assets/primz/collectibles/7-1.jpeg": "4cccdf1c415522385b83f155b686c931",
"assets/assets/primz/collectibles/10-de.md": "7b71cb50f8a83870821a5727fbc81cd3",
"assets/assets/primz/collectibles/11-en.md": "c5499d50911630f0dd4ddb3bc9359c18",
"assets/assets/primz/collectibles/3-1.jpeg": "2509f5269d5b64c1bb018c24e8c939fd",
"assets/assets/primz/collectibles/11-fr.md": "c774806839bcf3d56f8bdd0326a9e61a",
"assets/assets/primz/collectibles/0-1.jpeg": "b85db8e874ad69ed03888732d03ade0d",
"assets/assets/primz/collectibles/13-de.md": "699c3d68ff0d8e3eee65e4b896b42f2c",
"assets/assets/primz/collectibles/1-1.jpeg": "62ab7ce79cc6da9a427ff9171f032879",
"assets/assets/primz/collectibles/4-en.md": "9c297092e3880ec35a0918b2cde4d26c",
"assets/assets/primz/collectibles/12-en.md": "32474ec20cf248c7fcc5415aaf53c58f",
"assets/assets/primz/collectibles/11-de.md": "1265aaaa71cab038fbc8a56bdfb9ed04",
"assets/assets/primz/collectibles/4-de.md": "d998bc7f9de2eb0e417cb620561810e4",
"assets/assets/primz/collectibles/6-1.jpeg": "2fdbe31732776741b4e57a9a922f221d",
"assets/assets/primz/collectibles/3-de.md": "683114e5bad3e85b8d0bbaac846d5c30",
"assets/assets/primz/collectibles/2-en.md": "4ee7b69b830a5f8f1daa939f6445be3f",
"assets/assets/primz/collectibles/2-fr.md": "90896215249f075e7b4e63d91a04094f",
"assets/assets/primz/collectibles/8-fr.md": "fd504168b027eec251782bacea798c04",
"assets/assets/primz/collectibles/9.jpeg": "33ebbe4ac10949166da84745fe64ebe8",
"assets/assets/primz/collectibles/2.jpeg": "1eecbeaec28480806d275b600df06810",
"assets/assets/primz/collectibles/1-fr.md": "c1f9f9f0252fbe72c8878d343bf0e34b",
"assets/assets/primz/collectibles/0-de.md": "efac4c3296d3408000ffeda44cc8ffc7",
"assets/assets/primz/collectibles/4-1.jpeg": "2b6065373a4de8efbbefcb1a63e24c07",
"assets/assets/primz/collectibles/12.jpeg": "1ae5390d2cc5b5ab31dd19346ad88ad0",
"assets/assets/primz/collectibles/2-de.md": "aff998478cdec1934cc9b8684c59b25f",
"assets/assets/primz/collectibles/11-1.jpeg": "025308ea0edd148b29bceb9484f7393d",
"assets/assets/primz/collectibles/14.jpeg": "3f57c5ad78583247575e3481eb2e9af1",
"assets/assets/primz/collectibles/6.jpeg": "b69c4bbc54e28215b37045eb241049f9",
"assets/assets/primz/collectibles/9-de.md": "806fc11e10afe22dc5650120fb4b3c2b",
"assets/assets/primz/collectibles/0.jpeg": "e3b967ca0c6fabd841038c42632c86fb",
"assets/assets/primz/collectibles/8-en.md": "460945570546265187b9e1ba40781c9e",
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
"assets/assets/audio/relax/gameCompleted.wav": "f9b192c828d9b6cf5c72353e08981b5a",
"assets/assets/audio/relax/warning.wav": "21f491ab513ff51b8ac5b38a39118138",
"assets/assets/audio/relax/paused.wav": "b140957bf3c26ed40041b967b9ca24e0",
"assets/assets/audio/relax/incrementCompletedGames.wav": "83d00e0d1db65242fb6bfa32d560e275",
"assets/assets/audio/relax/selectAnswer.wav": "7aa72929db86da97e7e5b6294702002e",
"assets/assets/audio/relax/unselectAnswer.wav": "9e3760594c1c2cd1435cd95779e962aa",
"assets/assets/audio/relax/gameLost.wav": "867b00ba068c6c771e3fef677306ec82",
"assets/assets/audio/relax/levelCompleted.wav": "d7336c6e4445acf7d5a5f22ab7ded02e",
"assets/assets/audio/relax/allLevelsCompleted.wav": "656f5b6b8a98a4d35bc96519f3db9281",
"assets/assets/audio/relax/bonusActivated.wav": "e209dfe6635a34497c7fda408bd50f18",
"assets/assets/audio/relax/gameRecovered.wav": "6e67a1248ccf75c9a9c5a43b5e02fb2b",
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
