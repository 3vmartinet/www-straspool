// Compiles a dart2wasm-generated main module from `source` which can then
// instantiatable via the `instantiate` method.
//
// `source` needs to be a `Response` object (or promise thereof) e.g. created
// via the `fetch()` JS API.
export async function compileStreaming(source) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(
      await WebAssembly.compileStreaming(source, builtins), builtins);
}

// Compiles a dart2wasm-generated wasm modules from `bytes` which is then
// instantiatable via the `instantiate` method.
export async function compile(bytes) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(await WebAssembly.compile(bytes, builtins), builtins);
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export async function instantiate(modulePromise, importObjectPromise) {
  var moduleOrCompiledApp = await modulePromise;
  if (!(moduleOrCompiledApp instanceof CompiledApp)) {
    moduleOrCompiledApp = new CompiledApp(moduleOrCompiledApp);
  }
  const instantiatedApp = await moduleOrCompiledApp.instantiate(await importObjectPromise);
  return instantiatedApp.instantiatedModule;
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export const invoke = (moduleInstance, ...args) => {
  moduleInstance.exports.$invokeMain(args);
}

class CompiledApp {
  constructor(module, builtins) {
    this.module = module;
    this.builtins = builtins;
  }

  // The second argument is an options object containing:
  // `loadDeferredModules` is a JS function that takes an array of module names
  //   matching wasm files produced by the dart2wasm compiler. It also takes a
  //   callback that should be invoked for each loaded module with 2 arugments:
  //   (1) the module name, (2) the loaded module in a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`. The callback
  //   returns a Promise that resolves when the module is instantiated.
  //   loadDeferredModules should return a Promise that resolves when all the
  //   modules have been loaded and the callback promises have resolved.
  // `loadDeferredId` is a JS function that takes load ID produced by the
  //   compiler when the `load-ids` option is passed. Each load ID maps to one
  //   or more wasm files as specified in the emitted JSON file. It also takes a
  //   callback that should be invoked for each loaded module with 2 arugments:
  //   (1) the module name, (2) the loaded module in a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`. The callback
  //   returns a Promise that resolves when the module is instantiated.
  //   loadDeferredModules should return a Promise that resolves when all the
  //   modules have been loaded and the callback promises have resolved.
  // `loadDynamicModule` is a JS function that takes two string names matching,
  //   in order, a wasm file produced by the dart2wasm compiler during dynamic
  //   module compilation and a corresponding js file produced by the same
  //   compilation. It also takes a callback that should be invoked with the
  //   loaded module in a format supported by `WebAssembly.compile` or
  //   `WebAssembly.compileStreaming` and the result of using the JS 'import'
  //   API on the js file path. It should return a Promise that resolves when
  //   all the modules have been loaded and the callback promises have resolved.
  async instantiate(additionalImports,
      {loadDeferredModules, loadDynamicModule, loadDeferredId} = {}) {
    let dartInstance;

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + value;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
      wrapped.dartFunction = dartFunction;
      wrapped[jsWrappedDartFunctionSymbol] = true;
      return wrapped;
    }

    // Imports
    const dart2wasm = {
            _1: (decoder, codeUnits) => decoder.decode(codeUnits),
      _2: () => new TextDecoder("utf-8", {fatal: true}),
      _3: () => new TextDecoder("utf-8", {fatal: false}),
      _4: (s) => +s,
      _5: x0 => new Uint8Array(x0),
      _6: (x0,x1,x2) => x0.set(x1,x2),
      _7: (x0,x1) => x0.transferFromImageBitmap(x1),
      _9: (x0,x1,x2) => x0.slice(x1,x2),
      _10: (x0,x1) => x0.decode(x1),
      _11: (x0,x1) => x0.segment(x1),
      _12: () => new TextDecoder(),
      _14: x0 => x0.buffer,
      _15: x0 => x0.wasmMemory,
      _16: () => globalThis.window._flutter_skwasmInstance,
      _17: x0 => x0.rasterStartMilliseconds,
      _18: x0 => x0.rasterEndMilliseconds,
      _19: x0 => x0.imageBitmaps,
      _135: (x0,x1) => x0.appendChild(x1),
      _166: (x0,x1,x2) => x0.addEventListener(x1,x2),
      _167: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      _168: (x0,x1) => new OffscreenCanvas(x0,x1),
      _169: x0 => x0.remove(),
      _170: (x0,x1) => x0.append(x1),
      _172: x0 => x0.unlock(),
      _173: x0 => x0.getReader(),
      _174: (x0,x1) => x0.item(x1),
      _175: x0 => x0.next(),
      _176: x0 => x0.now(),
      _183: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._183(f,arguments.length,x0) }),
      _184: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _186: (x0,x1) => x0.getModifierState(x1),
      _187: x0 => x0.preventDefault(),
      _188: x0 => x0.stopPropagation(),
      _189: (x0,x1) => x0.removeProperty(x1),
      _190: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._190(f,arguments.length,x0) }),
      _191: x0 => new window.FinalizationRegistry(x0),
      _192: (x0,x1,x2,x3) => x0.register(x1,x2,x3),
      _194: (x0,x1) => x0.unregister(x1),
      _195: (x0,x1) => x0.prepend(x1),
      _196: x0 => new Intl.Locale(x0),
      _197: (x0,x1) => x0.observe(x1),
      _198: x0 => x0.disconnect(),
      _199: (x0,x1) => x0.getAttribute(x1),
      _200: (x0,x1) => x0.contains(x1),
      _201: (x0,x1) => x0.querySelector(x1),
      _202: (x0,x1) => x0.matchMedia(x1),
      _203: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._203(f,arguments.length,x0) }),
      _204: (x0,x1,x2) => x0.call(x1,x2),
      _205: x0 => x0.blur(),
      _206: x0 => x0.hasFocus(),
      _207: (x0,x1) => x0.removeAttribute(x1),
      _208: (x0,x1,x2) => x0.insertBefore(x1,x2),
      _209: (x0,x1) => x0.hasAttribute(x1),
      _210: (x0,x1) => x0.getModifierState(x1),
      _211: (x0,x1) => x0.createTextNode(x1),
      _212: x0 => x0.getBoundingClientRect(),
      _213: (x0,x1) => x0.replaceWith(x1),
      _214: (x0,x1) => x0.contains(x1),
      _215: (x0,x1) => x0.closest(x1),
      _653: x0 => new Uint8Array(x0),
      _656: () => globalThis.window.flutterConfiguration,
      _658: x0 => x0.assetBase,
      _663: x0 => x0.canvasKitMaximumSurfaces,
      _664: x0 => x0.debugShowSemanticsNodes,
      _665: x0 => x0.hostElement,
      _666: x0 => x0.multiViewEnabled,
      _667: x0 => x0.nonce,
      _669: x0 => x0.fontFallbackBaseUrl,
      _679: x0 => x0.console,
      _680: x0 => x0.devicePixelRatio,
      _681: x0 => x0.document,
      _682: x0 => x0.history,
      _683: x0 => x0.innerHeight,
      _684: x0 => x0.innerWidth,
      _685: x0 => x0.location,
      _686: x0 => x0.navigator,
      _687: x0 => x0.visualViewport,
      _688: x0 => x0.performance,
      _689: x0 => x0.parent,
      _693: (x0,x1) => x0.getComputedStyle(x1),
      _694: x0 => x0.screen,
      _695: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._695(f,arguments.length,x0) }),
      _696: (x0,x1) => x0.requestAnimationFrame(x1),
      _700: (x0,x1) => x0.warn(x1),
      _703: x0 => globalThis.parseFloat(x0),
      _704: () => globalThis.window,
      _705: () => globalThis.Intl,
      _706: () => globalThis.Symbol,
      _709: x0 => x0.clipboard,
      _710: x0 => x0.maxTouchPoints,
      _711: x0 => x0.vendor,
      _712: x0 => x0.language,
      _713: x0 => x0.platform,
      _714: x0 => x0.userAgent,
      _715: (x0,x1) => x0.vibrate(x1),
      _716: x0 => x0.languages,
      _717: x0 => x0.documentElement,
      _718: (x0,x1) => x0.querySelector(x1),
      _719: (x0,x1) => x0.querySelectorAll(x1),
      _721: (x0,x1) => x0.createElement(x1),
      _724: (x0,x1) => x0.createEvent(x1),
      _725: x0 => x0.activeElement,
      _728: x0 => x0.head,
      _729: x0 => x0.body,
      _731: (x0,x1) => { x0.title = x1 },
      _734: x0 => x0.visibilityState,
      _735: () => globalThis.document,
      _736: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._736(f,arguments.length,x0) }),
      _737: (x0,x1) => x0.dispatchEvent(x1),
      _745: x0 => x0.target,
      _747: x0 => x0.timeStamp,
      _748: x0 => x0.type,
      _750: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
      _757: x0 => x0.firstChild,
      _761: x0 => x0.parentElement,
      _763: (x0,x1) => { x0.textContent = x1 },
      _764: x0 => x0.parentNode,
      _766: (x0,x1) => x0.removeChild(x1),
      _767: x0 => x0.isConnected,
      _775: x0 => x0.clientHeight,
      _776: x0 => x0.clientWidth,
      _777: x0 => x0.offsetHeight,
      _778: x0 => x0.offsetWidth,
      _779: x0 => x0.id,
      _780: (x0,x1) => { x0.id = x1 },
      _783: (x0,x1) => { x0.spellcheck = x1 },
      _784: x0 => x0.tagName,
      _785: x0 => x0.style,
      _787: (x0,x1) => x0.querySelectorAll(x1),
      _788: (x0,x1,x2) => x0.setAttribute(x1,x2),
      _789: x0 => x0.tabIndex,
      _790: (x0,x1) => { x0.tabIndex = x1 },
      _791: (x0,x1) => x0.focus(x1),
      _792: x0 => x0.scrollTop,
      _793: (x0,x1) => { x0.scrollTop = x1 },
      _794: (x0,x1) => { x0.scrollLeft = x1 },
      _795: x0 => x0.scrollLeft,
      _796: x0 => x0.classList,
      _797: (x0,x1) => x0.scrollIntoView(x1),
      _800: (x0,x1) => { x0.className = x1 },
      _802: (x0,x1) => x0.getElementsByClassName(x1),
      _803: x0 => x0.click(),
      _804: (x0,x1) => x0.attachShadow(x1),
      _807: x0 => x0.computedStyleMap(),
      _808: (x0,x1) => x0.get(x1),
      _814: (x0,x1) => x0.getPropertyValue(x1),
      _815: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
      _816: x0 => x0.offsetLeft,
      _817: x0 => x0.offsetTop,
      _818: x0 => x0.offsetParent,
      _820: (x0,x1) => { x0.name = x1 },
      _821: x0 => x0.content,
      _822: (x0,x1) => { x0.content = x1 },
      _840: (x0,x1) => { x0.nonce = x1 },
      _845: (x0,x1) => { x0.width = x1 },
      _847: (x0,x1) => { x0.height = x1 },
      _850: (x0,x1) => x0.getContext(x1),
      _918: x0 => x0.width,
      _919: x0 => x0.height,
      _921: (x0,x1) => x0.fetch(x1),
      _922: x0 => x0.status,
      _924: x0 => x0.body,
      _925: x0 => x0.arrayBuffer(),
      _928: x0 => x0.read(),
      _929: x0 => x0.value,
      _930: x0 => x0.done,
      _938: x0 => x0.x,
      _939: x0 => x0.y,
      _942: x0 => x0.top,
      _943: x0 => x0.right,
      _944: x0 => x0.bottom,
      _945: x0 => x0.left,
      _955: x0 => x0.height,
      _956: x0 => x0.width,
      _957: x0 => x0.scale,
      _958: (x0,x1) => { x0.value = x1 },
      _961: (x0,x1) => { x0.placeholder = x1 },
      _963: (x0,x1) => { x0.name = x1 },
      _964: x0 => x0.selectionDirection,
      _965: x0 => x0.selectionStart,
      _966: x0 => x0.selectionEnd,
      _969: x0 => x0.value,
      _971: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _972: x0 => x0.readText(),
      _973: (x0,x1) => x0.writeText(x1),
      _975: x0 => x0.altKey,
      _976: x0 => x0.code,
      _977: x0 => x0.ctrlKey,
      _978: x0 => x0.key,
      _979: x0 => x0.keyCode,
      _980: x0 => x0.location,
      _981: x0 => x0.metaKey,
      _982: x0 => x0.repeat,
      _983: x0 => x0.shiftKey,
      _984: x0 => x0.isComposing,
      _986: x0 => x0.state,
      _987: (x0,x1) => x0.go(x1),
      _989: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
      _990: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
      _991: x0 => x0.pathname,
      _992: x0 => x0.search,
      _993: x0 => x0.hash,
      _997: x0 => x0.state,
      _1012: x0 => x0.matches,
      _1016: x0 => x0.matches,
      _1020: x0 => x0.relatedTarget,
      _1022: x0 => x0.clientX,
      _1023: x0 => x0.clientY,
      _1024: x0 => x0.offsetX,
      _1025: x0 => x0.offsetY,
      _1028: x0 => x0.button,
      _1029: x0 => x0.buttons,
      _1030: x0 => x0.ctrlKey,
      _1034: x0 => x0.pointerId,
      _1035: x0 => x0.pointerType,
      _1036: x0 => x0.pressure,
      _1037: x0 => x0.tiltX,
      _1038: x0 => x0.tiltY,
      _1039: x0 => x0.getCoalescedEvents(),
      _1042: x0 => x0.deltaX,
      _1043: x0 => x0.deltaY,
      _1044: x0 => x0.wheelDeltaX,
      _1045: x0 => x0.wheelDeltaY,
      _1046: x0 => x0.deltaMode,
      _1053: x0 => x0.changedTouches,
      _1056: x0 => x0.clientX,
      _1057: x0 => x0.clientY,
      _1060: x0 => x0.data,
      _1063: (x0,x1) => { x0.disabled = x1 },
      _1065: (x0,x1) => { x0.type = x1 },
      _1066: (x0,x1) => { x0.max = x1 },
      _1067: (x0,x1) => { x0.min = x1 },
      _1068: x0 => x0.value,
      _1069: (x0,x1) => { x0.value = x1 },
      _1070: x0 => x0.disabled,
      _1071: (x0,x1) => { x0.disabled = x1 },
      _1073: (x0,x1) => { x0.placeholder = x1 },
      _1075: (x0,x1) => { x0.name = x1 },
      _1076: (x0,x1) => { x0.autocomplete = x1 },
      _1078: x0 => x0.selectionDirection,
      _1079: x0 => x0.selectionStart,
      _1081: x0 => x0.selectionEnd,
      _1084: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _1085: (x0,x1) => x0.add(x1),
      _1087: (x0,x1) => { x0.noValidate = x1 },
      _1088: (x0,x1) => { x0.method = x1 },
      _1089: (x0,x1) => { x0.action = x1 },
      _1114: x0 => x0.orientation,
      _1115: x0 => x0.width,
      _1116: x0 => x0.height,
      _1117: (x0,x1) => x0.lock(x1),
      _1136: x0 => new ResizeObserver(x0),
      _1139: (module,f) => finalizeWrapper(f, function(x0,x1) { return module.exports._1139(f,arguments.length,x0,x1) }),
      _1147: x0 => x0.length,
      _1148: x0 => x0.iterator,
      _1149: x0 => x0.Segmenter,
      _1150: x0 => x0.v8BreakIterator,
      _1151: (x0,x1) => new Intl.Segmenter(x0,x1),
      _1154: x0 => x0.language,
      _1155: x0 => x0.script,
      _1156: x0 => x0.region,
      _1174: x0 => x0.done,
      _1175: x0 => x0.value,
      _1176: x0 => x0.index,
      _1180: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
      _1181: (x0,x1) => x0.adoptText(x1),
      _1182: x0 => x0.first(),
      _1183: x0 => x0.next(),
      _1184: x0 => x0.current(),
      _1186: () => globalThis.window.FinalizationRegistry,
      _1197: x0 => x0.hostElement,
      _1198: x0 => x0.viewConstraints,
      _1201: x0 => x0.maxHeight,
      _1202: x0 => x0.maxWidth,
      _1203: x0 => x0.minHeight,
      _1204: x0 => x0.minWidth,
      _1205: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._1205(f,arguments.length,x0) }),
      _1206: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._1206(f,arguments.length,x0) }),
      _1207: (x0,x1) => ({addView: x0,removeView: x1}),
      _1210: x0 => x0.loader,
      _1211: () => globalThis._flutter,
      _1212: (x0,x1) => x0.didCreateEngineInitializer(x1),
      _1213: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._1213(f,arguments.length,x0) }),
      _1214: (module,f) => finalizeWrapper(f, function() { return module.exports._1214(f,arguments.length) }),
      _1215: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
      _1218: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._1218(f,arguments.length,x0) }),
      _1219: x0 => ({runApp: x0}),
      _1221: (module,f) => finalizeWrapper(f, function(x0,x1) { return module.exports._1221(f,arguments.length,x0,x1) }),
      _1222: x0 => new Promise(x0),
      _1223: x0 => x0.length,
      _1300: (x0,x1) => x0.createElement(x1),
      _1332: x0 => x0.toArray(),
      _1333: x0 => x0.toUint8Array(),
      _1334: x0 => ({serverTimestamps: x0}),
      _1335: x0 => ({source: x0}),
      _1338: x0 => new firebase_firestore.FieldPath(x0),
      _1339: (x0,x1) => new firebase_firestore.FieldPath(x0,x1),
      _1340: (x0,x1,x2) => new firebase_firestore.FieldPath(x0,x1,x2),
      _1341: (x0,x1,x2,x3) => new firebase_firestore.FieldPath(x0,x1,x2,x3),
      _1342: (x0,x1,x2,x3,x4) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4),
      _1343: (x0,x1,x2,x3,x4,x5) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4,x5),
      _1344: (x0,x1,x2,x3,x4,x5,x6) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4,x5,x6),
      _1345: (x0,x1,x2,x3,x4,x5,x6,x7) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4,x5,x6,x7),
      _1346: (x0,x1,x2,x3,x4,x5,x6,x7,x8) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4,x5,x6,x7,x8),
      _1347: (x0,x1,x2,x3,x4,x5,x6,x7,x8,x9) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4,x5,x6,x7,x8,x9),
      _1348: () => globalThis.firebase_firestore.documentId(),
      _1349: (x0,x1) => new firebase_firestore.Timestamp(x0,x1),
      _1350: (x0,x1) => new firebase_firestore.GeoPoint(x0,x1),
      _1351: x0 => globalThis.firebase_firestore.vector(x0),
      _1352: x0 => globalThis.firebase_firestore.Bytes.fromUint8Array(x0),
      _1353: x0 => globalThis.firebase_firestore.writeBatch(x0),
      _1354: (x0,x1) => globalThis.firebase_firestore.collection(x0,x1),
      _1356: (x0,x1) => globalThis.firebase_firestore.doc(x0,x1),
      _1359: x0 => x0.call(),
      _1383: x0 => x0.commit(),
      _1384: (x0,x1) => x0.delete(x1),
      _1388: x0 => globalThis.firebase_firestore.getDoc(x0),
      _1389: x0 => globalThis.firebase_firestore.getDocFromServer(x0),
      _1390: x0 => globalThis.firebase_firestore.getDocFromCache(x0),
      _1391: (x0,x1) => ({includeMetadataChanges: x0,source: x1}),
      _1394: (x0,x1,x2,x3) => globalThis.firebase_firestore.onSnapshot(x0,x1,x2,x3),
      _1397: (x0,x1) => globalThis.firebase_firestore.setDoc(x0,x1),
      _1398: (x0,x1) => globalThis.firebase_firestore.query(x0,x1),
      _1399: x0 => globalThis.firebase_firestore.getDocs(x0),
      _1400: x0 => globalThis.firebase_firestore.getDocsFromServer(x0),
      _1401: x0 => globalThis.firebase_firestore.getDocsFromCache(x0),
      _1402: x0 => globalThis.firebase_firestore.limit(x0),
      _1403: x0 => globalThis.firebase_firestore.limitToLast(x0),
      _1404: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._1404(f,arguments.length,x0) }),
      _1405: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._1405(f,arguments.length,x0) }),
      _1406: (x0,x1) => globalThis.firebase_firestore.orderBy(x0,x1),
      _1408: (x0,x1,x2) => globalThis.firebase_firestore.where(x0,x1,x2),
      _1413: (x0,x1) => x0.data(x1),
      _1417: x0 => x0.docChanges(),
      _1425: () => globalThis.firebase_firestore.serverTimestamp(),
      _1435: (x0,x1) => globalThis.firebase_firestore.getFirestore(x0,x1),
      _1437: x0 => globalThis.firebase_firestore.Timestamp.fromMillis(x0),
      _1438: (module,f) => finalizeWrapper(f, function() { return module.exports._1438(f,arguments.length) }),
      _1576: () => globalThis.firebase_firestore.updateDoc,
      _1577: () => globalThis.firebase_firestore.or,
      _1578: () => globalThis.firebase_firestore.and,
      _1592: x0 => x0.path,
      _1595: () => globalThis.firebase_firestore.GeoPoint,
      _1596: x0 => x0.latitude,
      _1597: x0 => x0.longitude,
      _1599: () => globalThis.firebase_firestore.VectorValue,
      _1600: () => globalThis.firebase_firestore.Bytes,
      _1603: x0 => x0.type,
      _1605: x0 => x0.doc,
      _1607: x0 => x0.oldIndex,
      _1609: x0 => x0.newIndex,
      _1611: () => globalThis.firebase_firestore.DocumentReference,
      _1615: x0 => x0.path,
      _1624: x0 => x0.metadata,
      _1625: x0 => x0.ref,
      _1630: x0 => x0.docs,
      _1632: x0 => x0.metadata,
      _1637: () => globalThis.firebase_firestore.Timestamp,
      _1638: x0 => x0.seconds,
      _1639: x0 => x0.nanoseconds,
      _1675: x0 => x0.hasPendingWrites,
      _1677: x0 => x0.fromCache,
      _1684: x0 => x0.source,
      _1689: () => globalThis.firebase_firestore.startAfter,
      _1690: () => globalThis.firebase_firestore.startAt,
      _1691: () => globalThis.firebase_firestore.endBefore,
      _1692: () => globalThis.firebase_firestore.endAt,
      _1733: (x0,x1) => ({timeout: x0,limitedUseAppCheckTokens: x1}),
      _1752: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._1752(f,arguments.length,x0) }),
      _1753: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._1753(f,arguments.length,x0) }),
      _1754: (x0,x1,x2) => globalThis.firebase_app_check.onTokenChanged(x0,x1,x2),
      _1755: x0 => new firebase_app_check.ReCaptchaV3Provider(x0),
      _1756: x0 => new firebase_app_check.ReCaptchaEnterpriseProvider(x0),
      _1757: x0 => ({provider: x0}),
      _1758: (x0,x1) => globalThis.firebase_app_check.initializeAppCheck(x0,x1),
      _1759: (x0,x1) => x0.getItem(x1),
      _1760: (x0,x1,x2) => x0.setItem(x1,x2),
      _1761: x0 => x0.deviceMemory,
      _1763: (x0,x1,x2,x3,x4,x5,x6,x7,x8) => ({apiKey: x0,authDomain: x1,databaseURL: x2,projectId: x3,storageBucket: x4,messagingSenderId: x5,measurementId: x6,appId: x7,recaptchaSiteKey: x8}),
      _1764: (x0,x1) => globalThis.firebase_core.initializeApp(x0,x1),
      _1765: x0 => globalThis.firebase_core.getApp(x0),
      _1766: () => globalThis.firebase_core.getApp(),
      _1767: (x0,x1,x2) => globalThis.firebase_core.registerVersion(x0,x1,x2),
      _1795: () => globalThis.firebase_core.SDK_VERSION,
      _1801: x0 => x0.apiKey,
      _1803: x0 => x0.authDomain,
      _1805: x0 => x0.databaseURL,
      _1807: x0 => x0.projectId,
      _1809: x0 => x0.storageBucket,
      _1811: x0 => x0.messagingSenderId,
      _1813: x0 => x0.measurementId,
      _1815: x0 => x0.appId,
      _1817: x0 => x0.recaptchaSiteKey,
      _1819: x0 => x0.name,
      _1820: x0 => x0.options,
      _1823: x0 => x0.token,
      _1827: (x0,x1) => globalThis.firebase_functions.getFunctions(x0,x1),
      _1829: (x0,x1,x2) => globalThis.firebase_functions.httpsCallable(x0,x1,x2),
      _1838: x0 => x0.data,
      _1850: (x0,x1) => globalThis.firebase_functions.httpsCallable(x0,x1),
      _1852: (x0,x1) => x0.debug(x1),
      _1853: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._1853(f,arguments.length,x0) }),
      _1854: (module,f) => finalizeWrapper(f, function(x0,x1) { return module.exports._1854(f,arguments.length,x0,x1) }),
      _1855: (x0,x1) => ({createScript: x0,createScriptURL: x1}),
      _1856: (x0,x1,x2) => x0.createPolicy(x1,x2),
      _1857: (x0,x1) => x0.createScriptURL(x1),
      _1858: (x0,x1,x2) => x0.createScript(x1,x2),
      _1859: (x0,x1) => x0.appendChild(x1),
      _1860: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._1860(f,arguments.length,x0) }),
      _1861: () => globalThis.Intl.DateTimeFormat(),
      _1862: x0 => x0.resolvedOptions(),
      _1863: x0 => globalThis.Intl.supportedValuesOf(x0),
      _1864: x0 => x0.timeZone,
      _1865: () => globalThis.removeSplashFromWeb(),
      _1867: Date.now,
      _1869: s => new Date(s * 1000).getTimezoneOffset() * 60,
      _1870: s => {
        if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(s)) {
          return NaN;
        }
        return parseFloat(s);
      },
      _1871: () => typeof dartUseDateNowForTicks !== "undefined",
      _1872: () => 1000 * performance.now(),
      _1873: () => Date.now(),
      _1874: () => {
        // On browsers return `globalThis.location.href`
        if (globalThis.location != null) {
          return globalThis.location.href;
        }
        return null;
      },
      _1875: () => {
        return typeof process != "undefined" &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
      _1876: () => new WeakMap(),
      _1877: (map, o) => map.get(o),
      _1878: (map, o, v) => map.set(o, v),
      _1879: x0 => new WeakRef(x0),
      _1880: x0 => x0.deref(),
      _1887: () => globalThis.WeakRef,
      _1890: s => JSON.stringify(s),
      _1891: s => printToConsole(s),
      _1892: o => {
        if (o === null || o === undefined) return 0;
        if (typeof(o) === 'string') return 1;
        return 2;
      },
      _1893: (o, p, r) => o.replaceAll(p, () => r),
      _1894: (o, p, r) => o.replace(p, () => r),
      _1895: Function.prototype.call.bind(String.prototype.toLowerCase),
      _1896: s => s.toUpperCase(),
      _1897: s => s.trim(),
      _1898: s => s.trimLeft(),
      _1899: s => s.trimRight(),
      _1900: (string, times) => string.repeat(times),
      _1901: Function.prototype.call.bind(String.prototype.indexOf),
      _1902: (s, p, i) => s.lastIndexOf(p, i),
      _1903: (string, token) => string.split(token),
      _1904: Object.is,
      _1909: (o, c) => o instanceof c,
      _1910: o => Object.keys(o),
      _1964: x0 => new Array(x0),
      _1966: x0 => x0.length,
      _1968: (x0,x1) => x0[x1],
      _1969: (x0,x1,x2) => { x0[x1] = x2 },
      _1972: (x0,x1,x2) => new DataView(x0,x1,x2),
      _1974: x0 => new Int8Array(x0),
      _1975: (x0,x1,x2) => new Uint8Array(x0,x1,x2),
      _1977: x0 => new Uint8ClampedArray(x0),
      _1979: x0 => new Int16Array(x0),
      _1981: x0 => new Uint16Array(x0),
      _1983: x0 => new Int32Array(x0),
      _1985: x0 => new Uint32Array(x0),
      _1987: x0 => new Float32Array(x0),
      _1989: x0 => new Float64Array(x0),
      _2013: x0 => x0.random(),
      _2016: () => globalThis.Math,
      _2029: (ms, c) =>
      setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
      _2030: (handle) => clearTimeout(handle),
      _2031: (ms, c) =>
      setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
      _2032: (handle) => clearInterval(handle),
      _2033: (c) =>
      queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
      _2034: () => Date.now(),
      _2035: () => new Error().stack,
      _2036: (exn) => {
        let stackString = exn.toString();
        let frames = stackString.split('\n');
        let drop = 4;
        if (frames[0].startsWith('Error')) {
            drop += 1;
        }
        return frames.slice(drop).join('\n');
      },
      _2037: (s, m) => {
        try {
          return new RegExp(s, m);
        } catch (e) {
          return String(e);
        }
      },
      _2038: (x0,x1) => x0.exec(x1),
      _2039: (x0,x1) => x0.test(x1),
      _2040: x0 => x0.pop(),
      _2042: o => o === undefined,
      _2044: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
      _2046: o => {
        const proto = Object.getPrototypeOf(o);
        return proto === Object.prototype || proto === null;
      },
      _2047: o => o instanceof RegExp,
      _2048: (l, r) => l === r,
      _2049: o => o,
      _2050: o => {
        if (o === undefined || o === null) return 0;
        if (typeof o === 'number') return 1;
        return 2;
      },
      _2051: o => o,
      _2052: o => {
        if (o === undefined || o === null) return 0;
        if (typeof o === 'boolean') return 1;
        return 2;
      },
      _2053: o => o,
      _2054: b => !!b,
      _2055: o => o.length,
      _2057: (o, i) => o[i],
      _2058: f => f.dartFunction,
      _2059: () => ({}),
      _2060: () => [],
      _2062: () => globalThis,
      _2063: (constructor, args) => {
        const factoryFunction = constructor.bind.apply(
            constructor, [null, ...args]);
        return new factoryFunction();
      },
      _2065: (o, p) => o[p],
      _2066: (o, p, v) => o[p] = v,
      _2067: (o, m, a) => o[m].apply(o, a),
      _2069: o => String(o),
      _2070: (p, s, f) => p.then(s, (e) => f(e, e === undefined)),
      _2071: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._2071(f,arguments.length,x0) }),
      _2072: (module,f) => finalizeWrapper(f, function(x0,x1) { return module.exports._2072(f,arguments.length,x0,x1) }),
      _2073: o => {
        if (o === undefined) return 1;
        var type = typeof o;
        if (type === 'boolean') return 2;
        if (type === 'number') return 3;
        if (type === 'string') return 4;
        if (o instanceof Array) return 5;
        if (ArrayBuffer.isView(o)) {
          if (o instanceof Int8Array) return 6;
          if (o instanceof Uint8Array) return 7;
          if (o instanceof Uint8ClampedArray) return 8;
          if (o instanceof Int16Array) return 9;
          if (o instanceof Uint16Array) return 10;
          if (o instanceof Int32Array) return 11;
          if (o instanceof Uint32Array) return 12;
          if (o instanceof Float32Array) return 13;
          if (o instanceof Float64Array) return 14;
          if (o instanceof DataView) return 15;
        }
        if (o instanceof ArrayBuffer) return 16;
        // Feature check for `SharedArrayBuffer` before doing a type-check.
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
            return 17;
        }
        if (o instanceof Promise) return 18;
        return 19;
      },
      _2074: o => [o],
      _2075: (o0, o1) => [o0, o1],
      _2076: (o0, o1, o2) => [o0, o1, o2],
      _2077: (o0, o1, o2, o3) => [o0, o1, o2, o3],
      _2078: (exn) => {
        if (exn instanceof Error) {
          return exn.stack;
        } else {
          return null;
        }
      },
      _2079: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI8ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2080: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI8ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2083: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2084: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2085: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2086: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2087: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF64ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2088: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF64ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2089: x0 => new ArrayBuffer(x0),
      _2090: s => {
        if (/[[\]{}()*+?.\\^$|]/.test(s)) {
            s = s.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
        }
        return s;
      },
      _2092: x0 => x0.index,
      _2094: x0 => x0.flags,
      _2095: x0 => x0.multiline,
      _2096: x0 => x0.ignoreCase,
      _2097: x0 => x0.unicode,
      _2098: x0 => x0.dotAll,
      _2099: (x0,x1) => { x0.lastIndex = x1 },
      _2100: (o, p) => p in o,
      _2101: (o, p) => o[p],
      _2102: (o, p, v) => o[p] = v,
      _2103: (o, p) => delete o[p],
      _2127: () => new AbortController(),
      _2128: x0 => x0.abort(),
      _2129: (x0,x1,x2,x3,x4,x5) => ({method: x0,headers: x1,body: x2,credentials: x3,redirect: x4,signal: x5}),
      _2130: (x0,x1) => globalThis.fetch(x0,x1),
      _2131: (x0,x1) => x0.get(x1),
      _2132: (module,f) => finalizeWrapper(f, function(x0,x1,x2) { return module.exports._2132(f,arguments.length,x0,x1,x2) }),
      _2133: (x0,x1) => x0.forEach(x1),
      _2134: x0 => x0.getReader(),
      _2135: x0 => x0.cancel(),
      _2136: x0 => x0.read(),
      _2137: x0 => x0.trustedTypes,
      _2138: (x0,x1) => { x0.text = x1 },
      _2139: o => o instanceof Array,
      _2142: (a, l) => a.length = l,
      _2143: a => a.pop(),
      _2144: (a, i) => a.splice(i, 1),
      _2145: (a, s) => a.join(s),
      _2146: (a, s, e) => a.slice(s, e),
      _2148: (a, b) => a == b ? 0 : (a > b ? 1 : -1),
      _2149: a => a.length,
      _2151: (a, i) => a[i],
      _2152: (a, i, v) => a[i] = v,
      _2154: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof ArrayBuffer) return 1;
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
          return 2;
        }
        return 3;
      },
      _2155: (o, offsetInBytes, lengthInBytes) => {
        var dst = new ArrayBuffer(lengthInBytes);
        new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
        return new DataView(dst);
      },
      _2157: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Uint8Array) return 1;
        return 2;
      },
      _2158: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
      _2159: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Int8Array) return 1;
        return 2;
      },
      _2160: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
      _2161: o => o instanceof Uint8ClampedArray,
      _2162: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
      _2163: o => o instanceof Uint16Array,
      _2164: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
      _2165: o => o instanceof Int16Array,
      _2166: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
      _2167: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Uint32Array) return 1;
        return 2;
      },
      _2168: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
      _2169: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Int32Array) return 1;
        return 2;
      },
      _2170: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
      _2172: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
      _2173: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Float32Array) return 1;
        return 2;
      },
      _2174: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
      _2175: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Float64Array) return 1;
        return 2;
      },
      _2176: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
      _2177: (a, i) => a.push(i),
      _2178: (t, s) => t.set(s),
      _2180: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
      _2182: o => o.buffer,
      _2183: o => o.byteOffset,
      _2184: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
      _2185: (b, o) => new DataView(b, o),
      _2186: (b, o, l) => new DataView(b, o, l),
      _2187: Function.prototype.call.bind(DataView.prototype.getUint8),
      _2188: Function.prototype.call.bind(DataView.prototype.setUint8),
      _2189: Function.prototype.call.bind(DataView.prototype.getInt8),
      _2190: Function.prototype.call.bind(DataView.prototype.setInt8),
      _2191: Function.prototype.call.bind(DataView.prototype.getUint16),
      _2192: Function.prototype.call.bind(DataView.prototype.setUint16),
      _2193: Function.prototype.call.bind(DataView.prototype.getInt16),
      _2194: Function.prototype.call.bind(DataView.prototype.setInt16),
      _2195: Function.prototype.call.bind(DataView.prototype.getUint32),
      _2196: Function.prototype.call.bind(DataView.prototype.setUint32),
      _2197: Function.prototype.call.bind(DataView.prototype.getInt32),
      _2198: Function.prototype.call.bind(DataView.prototype.setInt32),
      _2201: Function.prototype.call.bind(DataView.prototype.getBigInt64),
      _2202: Function.prototype.call.bind(DataView.prototype.setBigInt64),
      _2203: Function.prototype.call.bind(DataView.prototype.getFloat32),
      _2204: Function.prototype.call.bind(DataView.prototype.setFloat32),
      _2205: Function.prototype.call.bind(DataView.prototype.getFloat64),
      _2206: Function.prototype.call.bind(DataView.prototype.setFloat64),
      _2207: Function.prototype.call.bind(Number.prototype.toString),
      _2208: Function.prototype.call.bind(BigInt.prototype.toString),
      _2209: Function.prototype.call.bind(Number.prototype.toString),
      _2210: (d, digits) => d.toFixed(digits),
      _2225: () => globalThis.console,
      _2264: (x0,x1) => x0.error(x1),
      _3634: (x0,x1) => { x0.type = x1 },
      _3642: (x0,x1) => { x0.crossOrigin = x1 },
      _3644: (x0,x1) => { x0.text = x1 },
      _4101: () => globalThis.window,
      _4141: x0 => x0.document,
      _4163: x0 => x0.navigator,
      _4425: x0 => x0.trustedTypes,
      _4426: x0 => x0.sessionStorage,
      _4427: x0 => x0.localStorage,
      _4537: x0 => x0.maxTouchPoints,
      _4544: x0 => x0.appCodeName,
      _4545: x0 => x0.appName,
      _4546: x0 => x0.appVersion,
      _4547: x0 => x0.platform,
      _4548: x0 => x0.product,
      _4549: x0 => x0.productSub,
      _4550: x0 => x0.userAgent,
      _4551: x0 => x0.vendor,
      _4552: x0 => x0.vendorSub,
      _4554: x0 => x0.language,
      _4555: x0 => x0.languages,
      _4561: x0 => x0.hardwareConcurrency,
      _6700: x0 => x0.signal,
      _6752: x0 => x0.baseURI,
      _6769: () => globalThis.document,
      _6853: x0 => x0.head,
      _8530: x0 => x0.value,
      _8532: x0 => x0.done,
      _8951: () => globalThis.Notification.permission,
      _9229: x0 => x0.url,
      _9231: x0 => x0.status,
      _9233: x0 => x0.statusText,
      _9234: x0 => x0.headers,
      _9235: x0 => x0.body,
      _12863: x0 => x0.name,
      _13580: () => globalThis.console,
      _13608: x0 => x0.name,
      _13609: x0 => x0.message,
      _13610: x0 => x0.code,

    };

    const baseImports = {
      dart2wasm: dart2wasm,
      Math: Math,
      Date: Date,
      Object: Object,
      Array: Array,
      Reflect: Reflect,
      WebAssembly: {
        JSTag: WebAssembly.JSTag,
      },
      "": new Proxy({}, { get(_, prop) { return prop; } }),

    };

    const jsStringPolyfill = {
      "charCodeAt": (s, i) => s.charCodeAt(i),
      "compare": (s1, s2) => {
        if (s1 < s2) return -1;
        if (s1 > s2) return 1;
        return 0;
      },
      "concat": (s1, s2) => s1 + s2,
      "equals": (s1, s2) => s1 === s2,
      "fromCharCode": (i) => String.fromCharCode(i),
      "length": (s) => s.length,
      "substring": (s, a, b) => s.substring(a, b),
      "fromCharCodeArray": (a, start, end) => {
        if (end <= start) return '';

        const read = dartInstance.exports.$wasmI16ArrayGet;
        let result = '';
        let index = start;
        const chunkLength = Math.min(end - index, 500);
        let array = new Array(chunkLength);
        while (index < end) {
          const newChunkLength = Math.min(end - index, 500);
          for (let i = 0; i < newChunkLength; i++) {
            array[i] = read(a, index++);
          }
          if (newChunkLength < chunkLength) {
            array = array.slice(0, newChunkLength);
          }
          result += String.fromCharCode(...array);
        }
        return result;
      },
      "intoCharCodeArray": (s, a, start) => {
        if (s === '') return 0;

        const write = dartInstance.exports.$wasmI16ArraySet;
        for (var i = 0; i < s.length; ++i) {
          write(a, start++, s.charCodeAt(i));
        }
        return s.length;
      },
      "test": (s) => typeof s == "string",
    };


    

    dartInstance = await WebAssembly.instantiate(this.module, {
      ...baseImports,
      ...additionalImports,
      
      "wasm:js-string": jsStringPolyfill,
    });
    dartInstance.exports.$setThisModule(dartInstance);

    return new InstantiatedApp(this, dartInstance);
  }
}

class InstantiatedApp {
  constructor(compiledApp, instantiatedModule) {
    this.compiledApp = compiledApp;
    this.instantiatedModule = instantiatedModule;
  }

  // Call the main function with the given arguments.
  invokeMain(...args) {
    this.instantiatedModule.exports.$invokeMain(args);
  }
}
