/*! Checking domain for embedding (partner_featured - multi-iframe, per-child handshake) */
(function () {
  const MAX_RETRIES = 8;          // 8 × 400ms ≈ 3.2s
  const RETRY_INTERVAL = 400;

  // Collect iframes reliably
  const iframes = Array.from(document.querySelectorAll("iframe.WhiteSwanEmbed, iframe[id^='WhiteSwan']"));
  if (iframes.length === 0) {
    console.warn("[Parent - partner_featured] No White Swan iframes found on page");
  }

  // Map each child window -> handshake state
  // Use Map because event.source is an object (window)
  const handshakes = new Map();

  // Helper: find iframe element by contentWindow (may be null if not found)
  function findIframeBySource(source) {
    return iframes.find((f) => f.contentWindow === source) || null;
  }

  window.addEventListener("message", (event) => {
    const data = event.data || {};
    const source = event.source;
    if (!source) return;

    // START handshake on READY
    if (data.type === "WHITE_SWAN_CHILD_READY") {
      let hs = handshakes.get(source);

      // Start a new handshake if none exists or if it's a new iframe instance
      if (!hs || source !== hs.childWindow) {
        const iframeEl = findIframeBySource(source); // may be null
        hs = {
          childWindow: source,
          childOrigin: event.origin || "*",
          iframeEl,
          responded: true,
          originAcked: false,
          retries: 0,
          intervalId: null
        };
        handshakes.set(source, hs);

        console.log("[Parent - partner_featured] Received READY — starting origin send to one child", iframeEl ? iframeEl.id : "(no-id)");
        sendOriginTo(hs);

        // short retry sequence for this child
        hs.retries = 1;
        if (hs.intervalId) clearInterval(hs.intervalId);
        hs.intervalId = setInterval(() => {
          if (hs.originAcked) { clearInterval(hs.intervalId); hs.intervalId = null; return; }
          if (hs.retries >= MAX_RETRIES) { clearInterval(hs.intervalId); hs.intervalId = null; return; }
          sendOriginTo(hs);
          hs.retries++;
        }, RETRY_INTERVAL);
      } else {
        // If handshake already started for this source, ignore duplicate READY (prevents restarting an interval)
        console.log("[Parent - partner_featured] Received duplicate READY for same child — ignoring");
      }
      return;
    }

    // STOP on ORIGIN_ACK for that child
    if (data.type === "WHITE_SWAN_CHILD_ORIGIN_ACK") {
      const hs = handshakes.get(source);
      if (hs && source === hs.childWindow) {
        console.log("[Parent - partner_featured] Received ORIGIN_ACK from child — clearing retries");
        hs.originAcked = true;
        if (hs.intervalId) { clearInterval(hs.intervalId); hs.intervalId = null; }
        // optional: remove handshake state after ack
        // handshakes.delete(source);
      }
    }
  });

  function sendOriginTo(hs) {
    const origin = window.location.origin || (window.location.protocol + "//" + window.location.host);
    const msg = {
      type: "WHITE_SWAN_PARENT_ORIGIN",
      origin,
      id: hs.iframeEl?.id || null,
      ts: Date.now()
    };
    try {
      hs.childWindow.postMessage(msg, hs.childOrigin || "*");
      console.log("[Parent - partner_featured] Sent origin →", origin, "to", hs.iframeEl ? hs.iframeEl.id : "(no-id)");
    } catch (err) {
      console.warn("[Parent - partner_featured] Failed to postMessage to child", err);
    }
  }
})();

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

// Initialize iframe-resizer for #EmbedFeature
window.addEventListener('load', function () {
  var iframe = document.getElementById('EmbedFeature');
  if (!iframe) {
    console.error('Partner Featured: iframe #EmbedFeature not found on load.');
    return;
  }

  WS_iframeResizeReady(function (resize) {
    resize(
      {
        sizeHeight: true,
        sizeWidth: true,
        license: 'GPLv3',
        log: false,
      },
      iframe // or [iframe]
    );
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Grab all iframes with the class "WhiteSwanEmbed"
  const iframes = Array.from(document.querySelectorAll('iframe.WhiteSwanEmbed'));

  // Helper to sync parent → child
  const syncChild = (iframe, params) => {
    // If you prefer reload via src:
    const originalSrc = iframe.getAttribute('data-original-src') || iframe.src;
    const newSrc = params
      ? `${originalSrc.split('?')[0]}?${params}`
      : originalSrc;

    if (iframe.src !== newSrc) {
      console.log(`Updating iframe (${iframe.className}) src to:`, newSrc);
      iframe.src = newSrc;
    }

    // Or, for postMessage sync:
    // iframe.contentWindow.postMessage({ type: "syncUrl", params }, '*');
  };

  // Store originals and do initial sync
  iframes.forEach(iframe => {
    iframe.setAttribute('data-original-src', iframe.src);
    const initParams = window.location.search.replace(/^\?/, '');
    syncChild(iframe, initParams);
  });

  // When parent URL changes (back/forward)
  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search).toString();
    console.log("Parent popstate, params:", params);
    iframes.forEach(iframe => syncChild(iframe, params));
  });

  // Listen for child → parent messages
  window.addEventListener('message', event => {
    // Optional security check:
    // if (!iframes.some(f => f.contentWindow === event.source)) return;

    const { type, params } = event.data || {};
    if (type === "updateUrl") {
      console.log("Received updateUrl from iframe:", params);
      const newUrl = `${window.location.origin}${window.location.pathname}${params ? '?' + params : ''}`;
      history.pushState(null, "", newUrl);
    }
  });
});
