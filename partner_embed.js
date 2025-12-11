// --- White Swan iframe parent bootstrap stub ---
(function () {
  // Synchronous stub so code below can call WS_iframeResizeReady
  if (!window.WS_iframeResizeReady) {
    const pending = [];
    window.__WS_pendingIframeResize = pending;
    window.WS_iframeResizeReady = function (cb) {
      pending.push(cb);
    };
  }

  // Only inject the shared loader once per page
  if (window.__WS_parentLoaderInjected) return;
  window.__WS_parentLoaderInjected = true;

  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/pontuslagerberg/whiteswan@latest/ws_iframe_parent_loader.js';
  document.head.appendChild(s);
})();
