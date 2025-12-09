// ws_iframe_parent_loader.js
(function () {
  // Don't run twice
  if (window.__WS_parentLoaderReady) return;
  window.__WS_parentLoaderReady = true;

  // Take over any pending callbacks from the stub
  const queue = window.__WS_pendingIframeResize || [];
  delete window.__WS_pendingIframeResize;

  // Define the real helper
  window.WS_iframeResizeReady = function (cb) {
    if (window.iframeResize) {
      cb(window.iframeResize);
    } else {
      queue.push(cb);
    }
  };

  function flushQueue() {
    if (!window.iframeResize) return;
    while (queue.length) {
      const cb = queue.shift();
      try {
        cb(window.iframeResize);
      } catch (e) {
        console.error('WS iframeResize callback failed:', e);
      }
    }
  }

  // If parent lib already present (some other script loaded it), just flush
  if (window.iframeResize) {
    flushQueue();
    return;
  }

  // Otherwise load the v5.5.7 parent once
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@iframe-resizer/parent@5.5.7';
  s.onload = flushQueue;
  document.head.appendChild(s);
})();
