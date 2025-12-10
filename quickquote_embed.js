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
