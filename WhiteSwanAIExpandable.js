(function () {
  const currentScript = document.currentScript;
  const chatUrl = currentScript.getAttribute('data-chat-url');

  if (!chatUrl) {
    console.error('[White Swan Chat] Missing data-chat-url attribute on script tag.');
    return;
  }

  const iframe = document.createElement('iframe');

  // Required attributes
  iframe.src = chatUrl;
  iframe.id = 'WhiteSwanIframe';
  iframe.className = 'ExpandableWhiteSwanAI';
  iframe.loading = 'eager';
  iframe.allowFullscreen = true;

  // Initial styling (chat bubble size)
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
