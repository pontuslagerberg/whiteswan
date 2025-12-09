// ws_iframe_parent_loader.js
(function () {
  // Avoid loading twice
  if (window.__WS_iframeParentLoader) return;
  window.__WS_iframeParentLoader = true;

  // Queue of callbacks that want iframeResize
  const queue = (window.__WS_iframeInitQueue = window.__WS_iframeInitQueue || []);

  function onParentReady() {
    if (!window.iframeResize) return;
    while (queue.length) {
      const fn = queue.shift();
      try {
        fn(window.iframeResize);
      } catch (e) {
        console.error('WS iframeResize init callback failed:', e);
      }
    }
  }

  // If already loaded (another script tag) just flush queue
  if (window.iframeResize) {
    onParentReady();
    return;
  }

  // Otherwise load @iframe-resizer/parent exactly once
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@iframe-resizer/parent@5.5.7';
  s.onload = onParentReady;
  document.head.appendChild(s);

  // Expose helper
  window.WS_iframeResizeReady = function (cb) {
    if (window.iframeResize) {
      cb(window.iframeResize);
    } else {
      queue.push(cb);
    }
  };
})();
