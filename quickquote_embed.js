/*! Checking domain for embedding (quickquote_embed) */
const maxRetries = 6;      // 6 × 250ms = 1.5s
const retryInterval = 250;

let responded = false;
let originAcked = false;
let retries = 0;
let intervalId = null;
let childWindow = null;
let childOrigin = null;

// Listen for messages from child (READY and ORIGIN_ACK)
window.addEventListener("message", (event) => {
  const d = event.data || {};

  if (d.type !== "WHITE_SWAN_CHILD_READY" && d.type !== "WHITE_SWAN_CHILD_ORIGIN_ACK") return;

  if (d.type === "WHITE_SWAN_CHILD_READY" && (!responded || event.source !== childWindow)) {
    console.log("[Parent - quickquote_embed] Received READY from child — starting origin send sequence");
    childWindow = event.source;
    childOrigin = event.origin || "*";
    responded = true;
    originAcked = false;

    sendOrigin();
    retries = 1;
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      if (originAcked) { clearInterval(intervalId); intervalId = null; return; }
      if (retries >= maxRetries) { clearInterval(intervalId); intervalId = null; return; }
      sendOrigin();
      retries++;
    }, retryInterval);
  }

  if (d.type === "WHITE_SWAN_CHILD_ORIGIN_ACK" && event.source === childWindow) {
    console.log("[Parent - quickquote_embed] Received ORIGIN_ACK from child — clearing retries");
    originAcked = true;
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
  }
});

function sendOrigin() {
  const currentIframe = document.getElementById("WhiteSwanQuickQuote");
  if (!currentIframe?.contentWindow) return;

  const message = {
    type: "WHITE_SWAN_PARENT_ORIGIN",
    origin: window.location.origin,
    ts: Date.now(),
  };

  const target = childOrigin || "*";
  try {
    currentIframe.contentWindow.postMessage(message, target);
    console.log("[Parent - quickquote_embed] Sent origin →", message.origin);
  } catch (err) {
    console.warn("[Parent - quickquote_embed] Failed to postMessage to child", err);
  }
}

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

// Show the loader as soon as possible with DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Select the iframe with the specified ID
    var iframe = document.getElementById('WhiteSwanQuickQuote');

    if (iframe) {
        console.log("Initializing loader...");

        // Create a parent container to hold both the iframe and the loader
        var parentContainer = document.createElement('div');
        parentContainer.setAttribute('id', 'iframe-wrapper');
        parentContainer.setAttribute('style', 'position: relative; width: 100%; min-height: 1px;');

        // Insert the parent container just before the iframe and move the iframe inside the parent
        iframe.parentNode.insertBefore(parentContainer, iframe);
        parentContainer.appendChild(iframe);

        // Create the loader div with a transparent background inside the parent container
        var loader = document.createElement('div');
        loader.setAttribute('id', 'iframe-loader');
        loader.setAttribute('style', 'position: absolute; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(255, 255, 255, 0); z-index: 10;'); // Transparent
        loader.innerHTML = `
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                <img src="https://762d0145e332a78fcb6f9b529c26ab.cdn.bubble.io/f1704422279269x624430105089719440/lightmode%20loader.svg" alt="Loading..." style="width: 60px; height: 60px;">
            </div>
        `;
        parentContainer.appendChild(loader);

        // Ensure that the loader hides and the iframe shows up when fully loaded
        iframe.onload = function() {
            console.log("Iframe loaded successfully!");
            loader.style.display = 'none'; // Hide the loader
            iframe.style.visibility = 'visible'; // Make the iframe visible
        };

        // Initially hide the iframe until it's fully loaded
        iframe.style.visibility = 'hidden';
    } else {
        console.error('Iframe with the specified ID not found during DOMContentLoaded event.');
    }
});

window.addEventListener("message", function(event) {
  const data = event.data;

  // 1) Bare string "scrollToTop" support
  if (data === "scrollToTop") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // 2) Everything else must be an object with an "action" field
  if (!data || typeof data !== "object" || !data.action) return;

  switch (data.action) {
    // === Open a popup window ===
    case "openWindow": {
      window.open(data.url, "_blank", "width=500,height=600");
      break;
    }

    // === Open a new tab (with fallback) ===
    case "openTab": {
      const newTab = window.open(data.url, "_blank");
      if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
        window.top.location.href = data.url;
      }
      break;
    }

    // === Scroll parent to top ===
    case "scrollToTop": {
      window.scrollTo({ top: 0, behavior: "smooth" });
      break;
    }

    // === Ask parent to send updated iframe height ===
    case "AdjustHeight": {
      if (typeof sendFrameHeight === "function") {
        sendFrameHeight();
      }
      break;
    }

    // === Redirect parent window ===
    case "Redirect": {
      window.top.location.href = data.url;
      break;
    }

    // === Scroll parent so the iframe is in view ===
    case "scrollToIframe": {
      // 1) Try the passed-in ID or your QuickQuote default
      const idToFind = data.iframeId || "WhiteSwanQuickQuote";

      // 2) Fallback chain: ID → class → any iframe
      const iframe =
        document.getElementById(idToFind) ||
        document.querySelector("iframe.WhiteSwanEmbed") ||
        document.querySelector("iframe");

      if (iframe) {
        const rect = iframe.getBoundingClientRect();
        window.scrollTo({
          top: window.scrollY + rect.top,
          behavior: "smooth"
        });
      }
      break;
    }

    // === Add new actions here as needed ===

    default:
      // unknown action — ignore
      break;
  }
}, false);

// Initialize iframeResize v5 via shared loader after window load
window.addEventListener('load', function () {
  var iframe = document.getElementById('WhiteSwanQuickQuote');

  if (!iframe) {
    console.error('Iframe with the specified ID not found during load event.');
    return;
  }

  console.log('Initializing iframe resizing (WS loader)...');

  // Use the shared loader helper; this will queue the callback
  // until @iframe-resizer/parent@5.5.7 is fully loaded.
  WS_iframeResizeReady(function (resize) {
    resize(
      {
        direction: 'both',
        license: 'GPLv3',
        log: false
      },
      iframe // pass the element directly (or [iframe])
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
