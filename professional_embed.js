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

/*! White Swan parent ↔ child origin handshake (multi-iframe aware) */

// Any iframe that matches one of these is considered a White Swan embed
const WS_IFRAME_SELECTORS = [
  'iframe#WhiteSwanIframe',
  'iframe#WhiteSwanQuickQuote',
  'iframe.WhiteSwanEmbed',
  'iframe.WhiteSwanAI',
  'iframe.ExpandableWhiteSwanAI'           
];

const WS_MAX_RETRIES = 6;        // 6 × 250ms = 1.5s
const WS_RETRY_INTERVAL = 250;

// Map<Window, HandshakeState>
const wsEmbeds = new Map();

/**
 * Find all iframes that are potential White Swan embeds.
 */
function getTrackedIframes() {
  const nodeList = document.querySelectorAll(WS_IFRAME_SELECTORS.join(','));
  // Deduplicate in case one element matches multiple selectors
  const seen = new Set();
  const result = [];
  nodeList.forEach((el) => {
    if (!seen.has(el)) {
      seen.add(el);
      result.push(el);
    }
  });
  return result;
}

/**
 * Given a child window, find the corresponding iframe element
 * among our tracked iframes.
 */
function findIframeForWindow(childWindow) {
  const iframes = getTrackedIframes();
  for (const iframe of iframes) {
    if (iframe.contentWindow === childWindow) {
      return iframe;
    }
  }
  return null;
}

/**
 * Start or continue sending origin to a specific child window.
 */
function sendOriginFor(state) {
  // Try to ensure iframe is still connected and wired to this window
  let iframe = state.iframe;
  if (!iframe || !iframe.isConnected || iframe.contentWindow !== state.childWindow) {
    iframe = findIframeForWindow(state.childWindow);
    state.iframe = iframe;
  }

  if (!iframe || !iframe.contentWindow) {
    console.warn('[WhiteSwan Parent] No iframe/contentWindow for this childWindow');
    return;
  }

  const message = {
    type: 'WHITE_SWAN_PARENT_ORIGIN',
    origin: window.location.origin,
    ts: Date.now(),
  };

  const target = state.targetOrigin || '*';

  try {
    state.childWindow.postMessage(message, target);
    console.log('[WhiteSwan Parent] Sent origin →', message.origin);
  } catch (err) {
    console.warn('[WhiteSwan Parent] Failed to postMessage to child', err);
  }
}

/**
 * Handle READY from a child. Creates/updates per-window state.
 */
function handleChildReady(event) {
  const childWindow = event.source;
  if (!childWindow) return;

  // Only consider if this window belongs to one of our tracked iframes
  const iframe = findIframeForWindow(childWindow);
  if (!iframe) {
    // Not one of ours; ignore quietly
    return;
  }

  let state = wsEmbeds.get(childWindow);
  if (!state) {
    state = {
      iframe,
      childWindow,
      targetOrigin: event.origin || '*',
      originAcked: false,
      retries: 0,
      intervalId: null,
    };
    wsEmbeds.set(childWindow, state);
  } else {
    // Update origin and iframe reference in case of reload / DOM changes
    state.iframe = iframe;
    state.targetOrigin = event.origin || state.targetOrigin || '*';
    state.originAcked = false;
    state.retries = 0;
    if (state.intervalId) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    }
  }

  console.log('[WhiteSwan Parent] READY from child — starting origin send sequence');

  // Immediate send
  sendOriginFor(state);
  state.retries = 1;

  // Short retry loop until ACK or max retries
  state.intervalId = setInterval(() => {
    if (state.originAcked) {
      clearInterval(state.intervalId);
      state.intervalId = null;
      return;
    }
    if (state.retries >= WS_MAX_RETRIES) {
      clearInterval(state.intervalId);
      state.intervalId = null;
      console.warn('[WhiteSwan Parent] Max retries reached without ACK');
      return;
    }
    sendOriginFor(state);
    state.retries++;
  }, WS_RETRY_INTERVAL);
}

/**
 * Handle ORIGIN_ACK from a child. Marks state as done.
 */
function handleChildAck(event) {
  const childWindow = event.source;
  if (!childWindow) return;

  const state = wsEmbeds.get(childWindow);
  if (!state) {
    // ACK from a window we’re not tracking – ignore
    return;
  }

  console.log('[WhiteSwan Parent] ORIGIN_ACK from child — stopping retries');
  state.originAcked = true;
  if (state.intervalId) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }
}

// Listen for messages from children
window.addEventListener('message', (event) => {
  const d = event.data || {};
  if (d.type === 'WHITE_SWAN_CHILD_READY') {
    handleChildReady(event);
  } else if (d.type === 'WHITE_SWAN_CHILD_ORIGIN_ACK') {
    handleChildAck(event);
  }
});

(function () {
    // 1) Use shared iframe-resizer loader and init all tracked iframes
  WS_iframeResizeReady(function (resize) {
    function tryResize() {
      const tracked = getTrackedIframes(); // uses WS_IFRAME_SELECTORS

      if (tracked.length) {
        resize(
          {
            direction: 'both',
            license: 'GPLv3',
          },
          tracked // pass the actual iframe elements
        );
      } else {
        setTimeout(tryResize, 50);
      }
    }

    tryResize();
  });

  // 2) On window load: scroll-based branding + messaging + height sync
  window.addEventListener('load', () => {
    const iframe = document.getElementById('WhiteSwanIframe');
    const brandingDiv = document.getElementById('brandingDiv'); // or remove if unused

    if (iframe && brandingDiv) {
      window.addEventListener('scroll', () => {
        const r = iframe.getBoundingClientRect();
        const bottomAbs = window.scrollY + r.bottom;
        if (window.scrollY > bottomAbs - window.innerHeight) {
          brandingDiv.style.position = 'absolute';
          brandingDiv.style.top = `${bottomAbs - brandingDiv.offsetHeight - 30}px`;
        } else {
          brandingDiv.style.position = 'fixed';
          brandingDiv.style.bottom = '30px';
        }
      }, { passive: true });
    }

    // Message handler
    window.addEventListener('message', event => {
      const d = event.data;
      if (d === 'scrollToTop') return window.scrollTo({ top: 0, behavior: 'smooth' });
      if (!d || typeof d !== 'object' || !d.action) return;
      switch (d.action) {
        case 'openWindow': window.open(d.url, '_blank', 'width=500,height=600'); break;
        case 'openTab': {
          const t = window.open(d.url, '_blank');
          if (!t || t.closed) window.top.location.href = d.url;
          break;
        }
        case 'scrollToTop': window.scrollTo({ top: 0, behavior: 'smooth' }); break;
        case 'AdjustHeight': sendFrameHeight(); break;
        case 'Redirect': window.top.location.href = d.url; break;
        case 'scrollToIframe': {
          const id = d.iframeId || 'WhiteSwanQuickQuote';
          const target = document.getElementById(id) || document.querySelector('iframe.WhiteSwanEmbed');
          if (target) {
            const rr = target.getBoundingClientRect();
            window.scrollTo({ top: window.scrollY + rr.top, behavior: 'smooth' });
          }
          break;
        }
      }
    }, false);

    // Height sync
    function sendFrameHeight() {
      const vh = Math.max(document.documentElement.clientHeight, window.innerHeight);
      const f = document.getElementById('WhiteSwanIframe');
      if (f && f.contentWindow) f.contentWindow.postMessage({ minHeight: vh }, '*');
    }
    window.addEventListener('resize', sendFrameHeight);
    sendFrameHeight();
  });

  // 3) DOMContentLoaded: URL sync for any .WhiteSwanEmbed iframes
  document.addEventListener('DOMContentLoaded', () => {
    const iframes = [...document.querySelectorAll('iframe.WhiteSwanEmbed')];
    const sync = (iframe, params) => {
      const orig = iframe.getAttribute('data-original-src') || iframe.src;
      const next = params ? `${orig.split('?')[0]}?${params}` : orig;
      if (iframe.src !== next) iframe.src = next;
    };
    iframes.forEach(f => {
      f.setAttribute('data-original-src', f.src);
      sync(f, window.location.search.slice(1));
    });
    window.addEventListener('popstate', () => {
      const p = new URLSearchParams(window.location.search).toString();
      iframes.forEach(f => sync(f, p));
    });
    window.addEventListener('message', e => {
      if (e.data?.type === 'updateUrl') {
        history.pushState(null, '', `${location.pathname}${e.data.params ? '?' + e.data.params : ''}`);
      }
    });
  });
})();
