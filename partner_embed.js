/*!Checking domain for embedding*/
const iframe = document.getElementById("WhiteSwanIframe");
  /*! Checking domain for embedding (partner_embed) */
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

  // Only handle our two message types
  if (d.type !== "WHITE_SWAN_CHILD_READY" && d.type !== "WHITE_SWAN_CHILD_ORIGIN_ACK") return;

  // Start handshake if we haven't started yet OR it's a new iframe instance (reload/new contentWindow)
  if (d.type === "WHITE_SWAN_CHILD_READY" && (!responded || event.source !== childWindow)) {
    console.log("[Parent - partner_embed] Received READY from child — starting origin send sequence");
    childWindow = event.source;
    childOrigin = event.origin || "*";
    responded = true;
    originAcked = false;

    // immediate send + short retry sequence
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

  // Stop when child ACKs (only if from same childWindow)
  if (d.type === "WHITE_SWAN_CHILD_ORIGIN_ACK" && event.source === childWindow) {
    console.log("[Parent - partner_embed] Received ORIGIN_ACK from child — clearing retries");
    originAcked = true;
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
  }
});

function sendOrigin() {
  // re-query iframe in case DOM replaced it
  const currentIframe = document.getElementById("WhiteSwanIframe");
  if (!currentIframe?.contentWindow) return;

  const message = {
    type: "WHITE_SWAN_PARENT_ORIGIN",
    origin: window.location.origin,
    ts: Date.now(),
  };

  const target = childOrigin || "*";
  try {
    currentIframe.contentWindow.postMessage(message, target);
    console.log("[Parent - partner_embed] Sent origin →", message.origin);
  } catch (err) {
    console.warn("[Parent - partner_embed] Failed to postMessage to child", err);
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

// Initialize iframe-resizer for #WhiteSwanIframe
window.addEventListener('load', function () {
  var iframe = document.getElementById('WhiteSwanIframe');
  if (!iframe) {
    console.error('Partner Embed: iframe #WhiteSwanIframe not found on load.');
    return;
  }

  WS_iframeResizeReady(function (resize) {
    resize(
      {
        direction: 'both',
        license: 'GPLv3',
        log: true, // keep logging here if you like
      },
      iframe
    );
  });
});

window.addEventListener('load', function() {
    var iframe = document.getElementById('WhiteSwanIframe');

    var brandingDiv = document.createElement('div');
    brandingDiv.style.position = 'fixed';
    brandingDiv.style.bottom = '30px';
    brandingDiv.style.border = '1px solid #201139';
    brandingDiv.style.display = 'flex';
    brandingDiv.style.flexDirection = 'column';
    brandingDiv.style.alignItems = 'center';
    brandingDiv.style.left = '50%';
    brandingDiv.style.transform = 'translateX(-50%)';
    brandingDiv.style.padding = '15px 15px 15px 15px'; 
    brandingDiv.style.backgroundColor = '#fff';
    brandingDiv.style.borderRadius = '10px';
    brandingDiv.style.maxHeight = '52px'; 
    brandingDiv.style.alignItems = 'center';
    brandingDiv.id = "branding_div";


    var imagesDiv = document.createElement('div');
    imagesDiv.style.width = '161px';
    imagesDiv.style.display = 'flex';
    imagesDiv.style.justifyContent = 'space-between';
    imagesDiv.style.height = '20px'; 
    imagesDiv.style.maxHeight = '20px'; 

    var image1 = document.createElement('img');
    image1.src = 'https://762d0145e332a78fcb6f9b9f529c26ab.cdn.bubble.io/f1687223907166x372570148873097660/Powered_by_text.svg';
    image1.style.width = '65.19px';
    image1.style.height = '18.3125px';
    image1.style.maxHeight = '18.3125px';
    image1.style.marginTop = '1.48px';
    image1.style.marginBottom = '0.23px';

    var image2 = document.createElement('img');
    image2.src = 'https://762d0145e332a78fcb6f9b9f529c26ab.cdn.bubble.io/f1687228487060x445089023249106500/wspoweredbylogo.png';
image2.alt = 'White Swan Partner Logo';
    image2.style.width = '89px';
    image2.style.height = '11px';
    image2.style.maxHeight = '11px';
image2.style.marginTop = '3.4px';
    image2.style.marginBottom = '0px';

    var link = document.createElement('a');
    link.href = 'https://whiteswan.io';
    link.target = '_blank';
    link.appendChild(image2);
    link.style.display = 'flex';
    link.style.height = '20px';
    link.style.maxHeight = '20px';

    imagesDiv.appendChild(image1);
    imagesDiv.appendChild(link);

    brandingDiv.appendChild(imagesDiv);
    document.body.appendChild(brandingDiv);

window.addEventListener('scroll', function() {
    var rect = iframe.getBoundingClientRect();
    var iframeBottomAbsolute = window.scrollY + rect.bottom; 
    if (window.scrollY > iframeBottomAbsolute - window.innerHeight) {
        brandingDiv.style.position = 'absolute';
        brandingDiv.style.bottom = 'unset';
        brandingDiv.style.top = (iframeBottomAbsolute - brandingDiv.offsetHeight - 30) + 'px'; 
    } else {
        brandingDiv.style.position = 'fixed';
        brandingDiv.style.bottom = '30px';
        brandingDiv.style.top = 'unset';
    }
}, { passive: true });

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
