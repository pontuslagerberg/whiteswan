  (function () {
    var CSS_URL =
      "https://cdn.jsdelivr.net/gh/pontuslagerberg/whiteswan@latest/chat_expandable_embed.css";
    var PRO_EMBED_URL =
      "https://cdn.jsdelivr.net/gh/pontuslagerberg/whiteswan@latest/professional_embed.js";

    function loadCssOnce(href) {
      var existing = document.querySelector(
        'link[rel="stylesheet"][href="' + href + '"]'
      );
      if (existing) return;

      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = href;
      (document.head || document.documentElement).appendChild(link);
    }

    function loadScriptOnce(src, callback) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        if (callback) {
          if (existing.dataset.wsLoaded === "true") callback();
          else existing.addEventListener("load", callback, { once: true });
        }
        return;
      }

      var s = document.createElement("script");
      s.src = src;
      s.async = true;

      if (callback) {
        s.addEventListener("load", function () {
          s.dataset.wsLoaded = "true";
          callback();
        });
        s.addEventListener("error", function () {
          console.error(
            "[White Swan Chat] Failed to load script:",
            src
          );
        });
      }

      (document.head || document.documentElement).appendChild(s);
    }

    function onDomReady(fn) {
      if (
        document.readyState === "interactive" ||
        document.readyState === "complete"
      ) {
        fn();
      } else {
        document.addEventListener("DOMContentLoaded", fn, { once: true });
      }
    }

    var chatUrl = null;
    var scriptEl = document.currentScript;

    if (!scriptEl || !scriptEl.getAttribute("data-chat-url")) {
      var scripts = document.querySelectorAll(
        'script[src*="WhiteSwanAIExpandable.js"]'
      );
      scriptEl = scripts[scripts.length - 1];
    }

    if (scriptEl) {
      chatUrl = scriptEl.getAttribute("data-chat-url");
    }

    if (!chatUrl) {
      console.error(
        "[White Swan Chat] Missing data-chat-url attribute on script tag."
      );
      return;
    }

    function initChatIframe() {
      var iframe = document.createElement("iframe");

      iframe.src = chatUrl;
      iframe.id = "WhiteSwanIframe";
      iframe.className = "ExpandableWhiteSwanAI";
      iframe.loading = "eager";
      iframe.allowFullscreen = true;

      Object.assign(iframe.style, {
        position: "fixed",
        bottom: "16px",
        right: "16px",
        width: "65px",
        height: "65px",
        border: "none",
        zIndex: "2147483647",
      });

      document.body.appendChild(iframe);
    }

    loadCssOnce(CSS_URL);
    loadScriptOnce(PRO_EMBED_URL);
    onDomReady(initChatIframe);
  })();
