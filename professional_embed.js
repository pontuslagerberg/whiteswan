/*!Checking domain for embedding*/
const iframe = document.getElementById("whiteSwanEmbed");
  const maxRetries = 6;      // 6 × 250ms = 1.5s
  const retryInterval = 250;
  let responded = false;
  let retries = 0;
  let intervalId = null;

  // Reply when the child sends READY
  window.addEventListener("message", (event) => {
    const d = event.data || {};
    if (d.type === "WHITE_SWAN_CHILD_READY") {
      console.log("[Parent] Received READY from child — sending origin");
      sendOrigin();
      responded = true;
      // fire short retry sequence for redundancy
      retries = 1;
      intervalId = setInterval(() => {
        if (retries >= maxRetries) clearInterval(intervalId);
        sendOrigin();
        retries++;
      }, retryInterval);
    }
  });

  function sendOrigin() {
    if (!iframe?.contentWindow) return;
    const message = {
      type: "WHITE_SWAN_PARENT_ORIGIN",
      origin: window.location.origin,
      ts: Date.now(),
    };
    iframe.contentWindow.postMessage(message, "*");
    console.log("[Parent] Sent origin →", message.origin);
  }

(function () {
  // 1) Load iframe-resizer parent and defer until iframe exists
  const irs = document.createElement('script');
  irs.src = 'https://cdn.jsdelivr.net/npm/@iframe-resizer/parent@latest';
  irs.onload = () => {
    const tryResize = () => {
      if (document.getElementById('WhiteSwanIframe')) {
        iframeResize({
          sizeHeight: true,
          sizeWidth: true,
          license: 'GPLv3'
        }, '#WhiteSwanIframe');
      } else {
        setTimeout(tryResize, 50);
      }
    };
    tryResize();
  };
  document.head.appendChild(irs);

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
