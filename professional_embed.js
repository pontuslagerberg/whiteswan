(function(){
  // Create a <script> tag
  const iframeResizerScript = document.createElement('script');
  iframeResizerScript.src = 'https://cdn.jsdelivr.net/npm/@iframe-resizer/parent@latest';
  iframeResizerScript.onload = () => {
    // once it’s loaded, you can call iFrameResize()
    iFrameResize({
      sizeHeight: true,
      sizeWidth:  true
    }, '#WhiteSwanIframe');
  };
  document.head.appendChild(iframeResizerScript);

window.addEventListener('load', function() {
    var iframe = document.getElementById('WhiteSwanIframe');

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

function sendFrameHeight() {
    var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    var iframe = document.getElementById('WhiteSwanIframe');
    iframe.contentWindow.postMessage({ 'minHeight': vh }, '*');
}
    
    sendFrameHeight();

window.addEventListener('resize', function() {
    sendFrameHeight();
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
})();
