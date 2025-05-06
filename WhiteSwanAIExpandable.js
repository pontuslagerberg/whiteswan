(function () {
  // Try using document.currentScript (most reliable)
  let chatUrl = null;
  let scriptEl = document.currentScript;

  if (!scriptEl || !scriptEl.getAttribute('data-chat-url')) {
    // Fallback if currentScript is null or missing the attribute
    const scripts = document.querySelectorAll('script[src*="WhiteSwanAIExpandable.js"]');
    scriptEl = scripts[scripts.length - 1]; // last one in DOM
  }

  if (scriptEl) {
    chatUrl = scriptEl.getAttribute('data-chat-url');
  }

  if (!chatUrl) {
    console.error('[White Swan Chat] Missing data-chat-url attribute on script tag.');
    return;
  }

  const iframe = document.createElement('iframe');

  iframe.src = chatUrl;
  iframe.id = 'WhiteSwanIframe';
  iframe.className = 'ExpandableWhiteSwanAI';
  iframe.loading = 'eager';
  iframe.allowFullscreen = true;

  Object.assign(iframe.style, {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
    width: '65px',
    height: '65px',
    border: 'none',
    zIndex: '2147483647',
  });

  document.body.appendChild(iframe);
})();
