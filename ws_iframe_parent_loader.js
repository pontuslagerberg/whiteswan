// ws_iframe_parent_loader.js
(function () {
  // Avoid double-init
  if (window.__WS_parentLoaderInitialized) return;
  window.__WS_parentLoaderInitialized = true;

  // ---- 1. Selectors: which iframes belong to White Swan ----
  // Allow a page to override or extend this before loader runs
  const DEFAULT_SELECTORS = [
    'iframe#WhiteSwanIframe',
    'iframe#WhiteSwanQuickQuote',
    'iframe#EmbedFeature',
    'iframe.WhiteSwanEmbed',
    'iframe.WhiteSwanAI',
    'iframe.ExpandableWhiteSwanAI',
  ];

  const WS_IFRAME_SELECTORS =
    (window.WS_IFRAME_SELECTORS && window.WS_IFRAME_SELECTORS.length)
      ? window.WS_IFRAME_SELECTORS
      : DEFAULT_SELECTORS;

  window.WS_IFRAME_SELECTORS = WS_IFRAME_SELECTORS; // expose for other scripts if needed

  function getTrackedIframes() {
    const nodeList = document.querySelectorAll(WS_IFRAME_SELECTORS.join(','));

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

  // Optional helper: visible and not already resized
  function filterResizables(list) {
    return list.filter((el) => {
      if (el.dataset.wsIframeResized === 'true') return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
  }

  // ---- 2. Parent-side loader for iframeResizer ----
  // Attach to the same ready-queue API you already use
  const pending = window.__WS_pendingIframeResize || [];
  window.__WS_pendingIframeResize = pending;

  if (!window.WS_iframeResizeReady) {
    window.WS_iframeResizeReady = function (cb) {
      if (window.iframeResize) {
        cb(window.iframeResize);
      } else {
        pending.push(cb);
      }
    };
  }

  function flushQueue() {
    if (!window.iframeResize) return;
    while (pending.length) {
      const cb = pending.shift();
      try {
        cb(window.iframeResize);
      } catch (e) {
  console.error(
    '[WhiteSwan Parent] WS_iframeResizeReady callback failed:',
    e && e.message,
    '\nSTACK:\n',
    e && e.stack,
    '\nRAW ERROR:',
    e
  );
   throw e; 
}
    }
  }

  // Load the parent library once.
  if (!window.iframeResize) {
    const s = document.createElement('script');
    // Use your own hosted copy if you want:
    s.src = 'https://cdn.jsdelivr.net/npm/@iframe-resizer/parent@5.5.7';
    s.async = true;
    s.onload = flushQueue;
    s.onerror = function () {
      console.error('[WhiteSwan Parent] Failed to load iframeResizer parent library');
    };
    (document.head || document.documentElement).appendChild(s);
  } else {
    // Already present (e.g., bundled into host page)
    flushQueue();
  }

  // ---- 3. Origin handshake (clickjacking defence plumbing) ----

  const WS_MAX_RETRIES = 12;        
  const WS_RETRY_INTERVAL = 250;

  // Map<Window, HandshakeState>
  const wsEmbeds = new Map();

  function findIframeForWindow(childWindow) {
    const iframes = getTrackedIframes();
    for (const iframe of iframes) {
      if (iframe.contentWindow === childWindow) {
        return iframe;
      }
    }
    return null;
  }

  function sendOriginFor(state) {
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

  function handleChildReady(event) {
    const childWindow = event.source;
    if (!childWindow) return;

    const iframe = findIframeForWindow(childWindow);
    if (!iframe) return; // not ours

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

    sendOriginFor(state);
    state.retries = 1;

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

  function handleChildAck(event) {
    const childWindow = event.source;
    if (!childWindow) return;

    const state = wsEmbeds.get(childWindow);
    if (!state) return;

    console.log('[WhiteSwan Parent] ORIGIN_ACK from child — stopping retries');
    state.originAcked = true;
    if (state.intervalId) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    }
  }

  window.addEventListener('message', (event) => {
    const d = event.data || {};
    if (d.type === 'WHITE_SWAN_CHILD_READY') {
      handleChildReady(event);
    } else if (d.type === 'WHITE_SWAN_CHILD_ORIGIN_ACK') {
      handleChildAck(event);
    }
  });

  // NOTE on clickjacking:
  // The actual "is this parent allowed?" logic should live in the CHILD page:
  // - Child receives WHITE_SWAN_PARENT_ORIGIN
  // - Compares it against its allowlist
  // - Only sends WHITE_SWAN_CHILD_ORIGIN_ACK if allowed
  // This file is the plumbing that makes that handshake work for ALL iframes.

// ---- 4. Centralized iframeResize init for all tracked iframes ----
  function isChatIframe(el) {
    if (!el || el.tagName !== 'IFRAME') return false;
    // Adjust this list if you rename / add chat iframe variants
    return el.classList.contains('ExpandableWhiteSwanAI');
  }

  function logIframeInfo(prefix, el) {
    return {
      msg: prefix,
      id: el.id || '(no id)',
      className: el.className || '(no class)',
      src: (el.src || '').substring(0, 80),
    };
  }

  function initResizer(resize) {
    // Track poll attempts for late-loading iframes
    let pollCount = 0;
    let consecutiveIdleCycles = 0;
    const MAX_POLL_COUNT = 20; // ~10 seconds at 500ms intervals
    const POLL_INTERVAL = 500;
    const IDLE_CYCLES_TO_STOP = 6; // Stop after 3 seconds of no new iframes
    let pollTimerId = null;

    function runResize() {
      const allTracked = getTrackedIframes();
      const raw = filterResizables(allTracked);
      const targets = raw.filter(
        (el) => el && el.nodeType === 1 && el.tagName === 'IFRAME'
      );

      // Log discovery of all tracked iframes (including already-initialized)
      if (allTracked.length > 0) {
        console.log(
          '[WhiteSwan Parent] Tracked iframes in DOM:',
          allTracked.map((el) => ({
            id: el.id || '(no id)',
            className: el.className || '(no class)',
            alreadyInitialized: el.dataset.wsIframeResized === 'true',
          }))
        );
      }

      if (!targets.length) {
        console.log('[WhiteSwan Parent] No new iframes to initialize this pass');
        return;
      }

      console.log(
        '[WhiteSwan Parent] Initializing iframeResize on:',
        targets.map((el) => logIframeInfo('target', el))
      );

      targets.forEach((el) => {
        // Double-check guard (defensive)
        if (el.dataset.wsIframeResized === 'true') {
          console.log('[WhiteSwan Parent] Skipping (already initialized):', logIframeInfo('skip', el));
          return;
        }

        const chat = isChatIframe(el);
        const direction = chat ? 'both' : 'vertical';

        try {
          resize(
            {
              direction,
              license: 'GPLv3',
              checkOrigin: false,
              warningTimeout: 20000, // Give child 20s to respond before warning
            },
            el
          );
          el.dataset.wsIframeResized = 'true';
          console.log('[WhiteSwan Parent] ✓ iframeResize attached:', logIframeInfo('attached', el));
        } catch (e) {
          console.error(
            '[WhiteSwan Parent] iframeResize failed for element:',
            logIframeInfo('error', el),
            e
          );
        }
      });
    }

    // Poll loop: catch late-loading iframes that MutationObserver might miss
    // Lightweight: only queries DOM once per interval, stops early if idle
    function pollForLateIframes() {
      pollCount++;
      const uninitialized = getTrackedIframes().filter(
        (el) => el.dataset.wsIframeResized !== 'true'
      );

      if (uninitialized.length > 0) {
        consecutiveIdleCycles = 0; // Reset idle counter
        console.log(
          '[WhiteSwan Parent] Poll #' + pollCount + ': found uninitialized iframe(s):',
          uninitialized.map((el) => logIframeInfo('poll-found', el))
        );
        runResize();
      } else {
        consecutiveIdleCycles++;
      }

      // Stop polling after MAX_POLL_COUNT OR after IDLE_CYCLES_TO_STOP consecutive idle cycles
      const shouldStop = pollCount >= MAX_POLL_COUNT || consecutiveIdleCycles >= IDLE_CYCLES_TO_STOP;
      if (shouldStop) {
        const reason = consecutiveIdleCycles >= IDLE_CYCLES_TO_STOP 
          ? 'idle for ' + (consecutiveIdleCycles * POLL_INTERVAL / 1000) + 's'
          : 'max polls reached';
        console.log('[WhiteSwan Parent] Poll loop stopped (' + reason + ') after', pollCount, 'checks');
        clearInterval(pollTimerId);
        pollTimerId = null;
      }
    }

    // Expose for MutationObserver and manual triggers
    window.WS_runIframeResizer = runResize;

    // Initial run
    runResize();

    // Start poll loop for late iframes
    pollTimerId = setInterval(pollForLateIframes, POLL_INTERVAL);
  }

  // ✅ Hook it up here:
  WS_iframeResizeReady(function (resize) {
    console.log('[WhiteSwan Parent] iframeResizer library loaded - initializing');
    initResizer(resize);
  });


// ---- 5. Watch for dynamically added iframes and resize them ----
(function () {
  if (!('MutationObserver' in window)) return;
  if (window.__WS_resizeWatcherAttached) return;
  window.__WS_resizeWatcherAttached = true;

  // Build a simple selector string we can use with .matches()
  const frameSelector = WS_IFRAME_SELECTORS.join(',');

  const resizeWatcher = new MutationObserver(function (mutationList) {
    let shouldRun = false;
    let triggerReason = '';

    for (const mutation of mutationList) {
      // Handle attribute changes (e.g., class added to existing iframe)
      if (mutation.type === 'attributes' && mutation.target) {
        const node = mutation.target;
        if (
          node.nodeType === 1 &&
          node.tagName === 'IFRAME' &&
          node.matches &&
          node.matches(frameSelector) &&
          node.dataset.wsIframeResized !== 'true'
        ) {
          shouldRun = true;
          triggerReason = 'attribute change on iframe: ' + (node.id || node.className || 'unknown');
          break;
        }
      }

      // Handle added nodes
      if (!mutation.addedNodes || !mutation.addedNodes.length) continue;

      mutation.addedNodes.forEach(function (node) {
        if (shouldRun) return; // already decided

        // Only care about elements
        if (node.nodeType !== 1) return;

        // Direct match (the node itself is an iframe we care about)
        if (node.matches && node.matches(frameSelector)) {
          if (node.dataset.wsIframeResized !== 'true') {
            shouldRun = true;
            triggerReason = 'new iframe added: ' + (node.id || node.className || 'unknown');
          }
          return;
        }

        // Or it contains one (e.g. a wrapper div with the iframe inside)
        if (node.querySelector) {
          const nested = node.querySelector(frameSelector);
          if (nested && nested.dataset.wsIframeResized !== 'true') {
            shouldRun = true;
            triggerReason = 'nested iframe added: ' + (nested.id || nested.className || 'unknown');
          }
        }
      });
    }

    if (shouldRun && window.WS_runIframeResizer) {
      console.log('[WhiteSwan Parent] resizeWatcher triggered:', triggerReason);
      window.WS_runIframeResizer();
    }
  });

  function startWatching() {
    if (!document.body) {
      // Edge case: if called very early
      document.addEventListener('DOMContentLoaded', startWatching, { once: true });
      return;
    }
    resizeWatcher.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id'], // Watch for class/id changes on iframes
    });
    console.log('[WhiteSwan Parent] resizeWatcher started - monitoring for new/changed iframes');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startWatching, { once: true });
  } else {
    startWatching();
  }
})();

  // ---- 6. Shared parent-side message handler (scroll/nav/URL) ----


  function scrollToTrackedIframe(opts) {
    const id = opts && opts.iframeId;
    let target = null;

    if (id) {
      target = document.getElementById(id);
    }

    if (!target) {
      // Fallback similar to your old code: QuickQuote first, then general embed
      target =
        document.getElementById('WhiteSwanQuickQuote') ||
        document.getElementById('WhiteSwanIframe') ||
        document.querySelector('iframe.WhiteSwanEmbed');
    }

    if (!target) return;

    const r = target.getBoundingClientRect();
    const top = window.scrollY + r.top;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function isFromTrackedIframe(event) {
    const src = event.source;
    if (!src) return false;
    return getTrackedIframes().some((f) => f.contentWindow === src);
  }

  window.addEventListener(
    'message',
    (event) => {
      const data = event.data;

      // Legacy string message ("scrollToTop")
      if (data === 'scrollToTop') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (!data || typeof data !== 'object') return;

      const { action, type, url, iframeId, params } = data;

      // Optional safety: only react to messages coming from our iframes
      if (!isFromTrackedIframe(event)) return;

      // QuickQuote-style / generic updateUrl message
      if (type === 'updateUrl') {
        const queryString =
          typeof params === 'string'
            ? params
            : new URLSearchParams(params || {}).toString();

        const base = `${window.location.origin}${window.location.pathname}`;
        const next = queryString ? `${base}?${queryString}` : base;

        if (window.location.href !== next) {
          history.pushState(null, '', next);
        }
        return;
      }

      // Action-based messages (from professional_embed)
      switch (action) {
        case 'openWindow':
          if (url) window.open(url, '_blank', 'width=500,height=600');
          break;

        case 'openTab': {
          if (!url) break;
          const t = window.open(url, '_blank');
          if (!t || t.closed) window.top.location.href = url;
          break;
        }

        case 'scrollToTop':
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;

        case 'Redirect':
          if (url) window.top.location.href = url;
          break;

        case 'scrollToIframe':
          scrollToTrackedIframe({ iframeId });
          break;

        default:
          // Unknown action – ignore
          break;
      }
    },
    false
  );


  // ---- 7. URL sync only for "full embeds", not chat bubble ----

  document.addEventListener('DOMContentLoaded', () => {
    const embedIframes = [
      ...document.querySelectorAll('iframe.WhiteSwanEmbed'),
      ...document.querySelectorAll('iframe#WhiteSwanQuickQuote'),
    ];

    const sync = (iframe, params) => {
      const orig = iframe.getAttribute('data-original-src') || iframe.src;
      const base = orig.split('?')[0];
      const next = params ? `${base}?${params}` : base;
      if (iframe.src !== next) iframe.src = next;
    };

    embedIframes.forEach((f) => {
      f.setAttribute('data-original-src', f.src);
      sync(f, window.location.search.slice(1));
    });

    window.addEventListener('popstate', () => {
      const p = new URLSearchParams(window.location.search).toString();
      embedIframes.forEach((f) => sync(f, p));
    });

    
  });
})();
