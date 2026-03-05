(() => {
  // ====== CONFIG ======
  const CFG = {
    fonts: {
      bold: "Campton Bolder",
      light: "Campton Lighter",
    },

    classes: {
      fontBold: "ws-font-bold",
      fontLight: "ws-font-light",
      btn: "ws-btn",
      btnOutline: "ws-btn--outline",
      btnGreen: "ws-btn--green",
      btnOrange: "ws-btn--orange",
      btnGray: "ws-btn--gray",
      btnRed: "ws-btn--red",
      btnDark: "ws-btn--dark",
      btnYellow: "ws-btn--yellow",
      btnGradient: "ws-btn--gradient",
      btnTransparent: "ws-btn--transparent",
      link: "ws-link",
      linkDestructive: "ws-link--destructive",
      linkNormal: "ws-link--normal",
      surfaceBright: "ws-surface-bright",
      toggle: "ws-toggle",
      separato: "ws-separato",
      secondaryText: "ws-secondary-text",
      border: "ws-border",
      borderTop: "ws-border-top",
      borderRight: "ws-border-right",
      borderBottom: "ws-border-bottom",
      borderLeft: "ws-border-left",
      borderAll: "ws-border-all",
      darkSurface: "ws-dark-surface",
    },

    linkColors: {
      normal: {
        tokens: [
          "var(--color_primary_contrast_default)",
          "var(--color_alert_default)",
        ],
        rgb: [
          "rgb(118, 114, 255)",
          "rgb(254, 205, 185)",
        ],
      },
      destructive: {
        tokens: [
          "var(--color_destructive_default)",
          "var(--color_coegt_default)",
        ],
        rgb: [
          "rgb(231, 110, 116)",
          "rgb(193, 91, 96)",
        ],
      },
    },

    bgTokenToVariantClass: {
      "var(--color_success_default)": "ws-btn--green",
      "var(--color_warning_default)": "ws-btn--orange",
      "var(--color_alert_default)": "ws-btn--orange",
      "var(--color_danger_default)": "ws-btn--red",
      "var(--color_error_default)": "ws-btn--red",
      "var(--color_destructive_default)": "ws-btn--red",
      "var(--color_coegt_default)": "ws-btn--red",
      "var(--color_primary_default)": "ws-btn--dark",
      "var(--color_coDyS_default)": "ws-btn--gray",
      "var(--color_coDKP_default)": "ws-btn--gray",
    },

    bgRgbToVariantClass: {
      "rgb(235, 235, 245)": "ws-btn--gray",
      "rgb(235,235,245)": "ws-btn--gray",
      "rgba(32, 17, 57, 0.2)": "ws-btn--gray",
      "rgba(32, 17, 57, 0.5)": "ws-btn--gray",
      "rgb(254, 205, 185)": "ws-btn--orange",
      "rgb(32, 17, 57)": "ws-btn--dark",
      "rgb(122, 255, 195)": "ws-btn--green",
      "rgb(231, 110, 116)": "ws-btn--red",
      "rgb(193, 91, 96)": "ws-btn--red",
    },

    // CSS var substrings → button variant (for vars used inside rgba() etc.)
    bgVarSubstringToClass: {
      "--color_cofrq_default": "ws-btn--yellow",
      "--color_codys_default": "ws-btn--gray",
      "--color_codkp_default": "ws-btn--gray",
    },

    brightSurface: {
      tokens: [
        "var(--color_surface_default)",
        "var(--color_background_default)",
      ],
      rgb: [
        "rgb(255, 255, 255)",
        "rgb(235, 235, 245)",
      ],
    },

    darkSurface: {
      tokens: [
        "var(--color_primary_default)",
        "var(--color_cnjbR0_default)",
      ],
      rgb: [
        "rgb(32, 17, 57)",
        "rgba(21, 12, 37, 1)",
      ],
    },

    secondaryText: {
      tokens: [
        "var(--color_codkp_default)",
      ],
      rgb: [
        "rgba(32, 17, 57, 0.5)",
      ],
    },

    clickableButtonSelector: ".clickable-element.bubble-element.Group, .clickable-element.bubble-element.Button, .bad-revision",

    scanSelector: [
      "button",
      "input, textarea, select",
      "label",
      "li",
      "ul",
      "ol",
      ".bad-revision",
      ".ql-editor[contenteditable]",
      ".select2-dropdown",
      ".select2-MultiDropdown",
      ".bubble-element.Text",
      ".bubble-element.Shape",
      ".bubble-element.Checkbox",
      ".bubble-element.FileInput",
      ".file-input-text",
      ".bubble-element[class*='MultiFileInput']",
      ".dz-message",
      ".bubble-element.Group",
      ".bubble-element.GroupFocus",
      ".bubble-element.group-item",
      ".bubble-element.CustomElement",
      ".bubble-element.Popup",
      ".clickable-element.bubble-element.Button",
      "a.bubble-element.Link",
    ].join(","),

    enablePointerRecheck: true,
  };

  // ====== INTERNALS ======
  let mutationWatcher = null;
  let running = false;

  const queued = new Set();
  let rafScheduled = false;
  let flushTimer = null;
  let lastFlushAt = 0;
  const FLUSH_INTERVAL_MS = 250;

  const lastSig = new WeakMap();

  function schedule(el, priority = false) {
    if (!el || el.nodeType !== 1) return;
    queued.add(el);

    if (priority) {
      if (!rafScheduled) {
        rafScheduled = true;
        requestAnimationFrame(() => {
          rafScheduled = false;
          flush();
        });
      }
      return;
    }

    if (flushTimer) return;

    const now = Date.now();
    const wait = Math.max(0, FLUSH_INTERVAL_MS - (now - lastFlushAt));

    flushTimer = setTimeout(() => {
      flushTimer = null;
      lastFlushAt = Date.now();
      flush();
    }, wait);
  }

  function flush() {
    rafScheduled = false;

    const items = Array.from(queued);
    queued.clear();

    for (const el of items) {
      processElementAndMaybeSubtree(el);
    }
  }

  function isHidden(el) {
    if (!el.isConnected) return true;

    if (el.offsetParent === null) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return true;
    }
    return false;
  }

  function processElementAndMaybeSubtree(root) {
    if (isHidden(root)) return;

    if (root.matches?.(CFG.scanSelector)) processOne(root);

    const nodes = root.querySelectorAll?.(CFG.scanSelector);
    if (!nodes || nodes.length === 0) return;

    for (const el of nodes) {
      if (!isHidden(el)) processOne(el);
    }
  }

  function normalizeFontFamily(ff) {
    if (!ff) return "";
    return String(ff).replace(/["']/g, "").trim();
  }

  function getInlineBgTokenOrRgb(el) {
    if (!el.style) return "";
    // getPropertyValue returns the raw CSS text (including var() references).
    // el.style.backgroundColor (IDL attribute) returns "" for CSS variable values.
    const bgc = (el.style.getPropertyValue("background-color") || "").trim();
    if (bgc) return bgc;

    const bg = (el.style.getPropertyValue("background") || "").trim();
    if (bg) {
      const m = bg.match(/(var\([^)]+\)|rgba?\([^)]+\))\s*$/);
      if (m) return m[1].trim();
    }
    return "";
  }

  function getEffectiveBg(el) {
    const inline = normalizeColor(getInlineBgTokenOrRgb(el));
    if (inline) return inline;
    return normalizeColor(getComputedStyle(el).backgroundColor);
  }

  function normalizeColor(s) {
    if (!s) return "";
    const t = String(s).trim().toLowerCase();
    if (!t) return "";
    if (t.startsWith("rgb")) return t.replace(/\s+/g, "");
    if (t.startsWith("#")) return t;
    if (t.startsWith("var(")) return t.replace(/\s+/g, "");
    return t;
  }

  function isTransparentColor(normalized) {
    if (!normalized) return false;
    if (normalized === "transparent") return true;
    // rgba with alpha = 0 (handles 0, 0.0, 0.00, etc.)
    const m = normalized.match(/^rgba\(\d+,\d+,\d+,(0|0?\.0+)\)$/);
    return !!m;
  }

  function hasAlphaBelowOne(normalizedColor) {
    if (!normalizedColor) return false;
    const m = normalizedColor.match(/^rgba\([^,]+,[^,]+,[^,]+,([^)]+)\)$/);
    if (!m) return false;
    const alpha = parseFloat(m[1]);
    return Number.isFinite(alpha) && alpha < 1;
  }

  function hasVisibleBorder(el) {
    const bs = (el.style?.borderStyle || "").trim().toLowerCase();
    const bw = (el.style?.borderWidth || "").trim();
    if (!bs || bs === "none" || bs === "hidden") return false;
    const w = parseFloat(bw);
    return Number.isFinite(w) && w > 0;
  }

  // ====== FREEZE HELPERS ======
  function getFrozen(el, key) {
    return el.getAttribute("data-ws-" + key) || "";
  }

  function setFrozen(el, key, value) {
    if (value === "" || value == null) el.removeAttribute("data-ws-" + key);
    else el.setAttribute("data-ws-" + key, String(value));
  }

  function freezeIfComputed(el, key, value, usedComputed) {
    if (usedComputed) setFrozen(el, key, value);
  }

  function resolveCssVarToRgb(varName) {
    const probe = document.createElement("span");
    probe.style.position = "absolute";
    probe.style.left = "-99999px";
    probe.style.color = `var(${varName})`;
    document.body.appendChild(probe);
    const rgb = normalizeColor(getComputedStyle(probe).color);
    probe.remove();
    return rgb;
  }

  function resolveCssVarToBg(varName) {
    const probe = document.createElement("span");
    probe.style.position = "absolute";
    probe.style.left = "-99999px";
    probe.style.backgroundColor = `var(${varName})`;
    document.body.appendChild(probe);
    const rgb = normalizeColor(getComputedStyle(probe).backgroundColor);
    probe.remove();
    return rgb;
  }

  function clearButtonVariantClasses(el) {
    el.classList.remove(
      CFG.classes.btnGreen,
      CFG.classes.btnOrange,
      CFG.classes.btnGray,
      CFG.classes.btnRed,
      CFG.classes.btnDark,
      CFG.classes.btnYellow,
      CFG.classes.btnGradient,
      CFG.classes.btnTransparent
    );
  }

  function clearAllButtonClasses(el) {
    el.classList.remove(CFG.classes.btn, CFG.classes.btnOutline);
    clearButtonVariantClasses(el);
  }

  function applyFontClasses(el) {
    const frozen = getFrozen(el, "font");
    if (frozen === "bold") {
      el.classList.add(CFG.classes.fontBold);
      el.classList.remove(CFG.classes.fontLight);
      return "B*";
    }
    if (frozen === "light") {
      el.classList.add(CFG.classes.fontLight);
      el.classList.remove(CFG.classes.fontBold);
      return "L*";
    }

    let ffRaw = el.style?.fontFamily || "";
    let fwRaw = el.style?.fontWeight || "";

    let usedComputed = false;
    if (!ffRaw && !fwRaw) {
      const cs = getComputedStyle(el);
      ffRaw = cs.fontFamily || "";
      fwRaw = cs.fontWeight || "";
      usedComputed = true;
    }

    const ff = normalizeFontFamily(ffRaw).toLowerCase();
    const fw = String(fwRaw).trim().toLowerCase();

    const boldKey = CFG.fonts.bold.toLowerCase();

    const fwNum = parseInt(fw, 10);
    const isBold =
      ff.includes(boldKey) ||
      fw === "bold" ||
      (Number.isFinite(fwNum) && fwNum >= 600);

    const isLight =
      !isBold && (
        ff.includes("campton lighter") ||
        ff.includes("var(--font_default)") ||
        ff.includes("--font_default") ||
        (Number.isFinite(fwNum) && fwNum > 0 && fwNum < 600) ||
        fw === "normal"
      );

    el.classList.toggle(CFG.classes.fontBold, isBold);
    el.classList.toggle(CFG.classes.fontLight, isLight);
    freezeIfComputed(el, "font", isBold ? "bold" : (isLight ? "light" : ""), usedComputed);

    return (isBold ? "B" : "") + (isLight ? "L" : "");
  }

  function hasDescendantText(el) {
    if (hasOwnTextNode(el)) return true;
    return !!el.querySelector?.(".bubble-element.Text");
  }

  function isButtonish(el) {
    if (el.classList.contains("input")) return false;
    if (el.tagName === "BUTTON") return true;
    // Divs/Groups without any text content are never buttons (e.g. icon-only circles, image containers)
    if (el.matches?.(".bubble-element.Group") && !hasDescendantText(el)) return false;
    if (el.matches?.(CFG.clickableButtonSelector)) return true;
    // Badge-like Groups: has visible border + non-transparent bg (pills, tags, badges)
    if (el.matches?.(".bubble-element.Group") && hasVisibleBorder(el) && !detectTransparency(el)) return true;
    return false;
  }

  function detectTransparency(el) {
    const bgRaw = (el.style?.background || "").trim().toLowerCase();
    const bgcRaw = (el.style?.backgroundColor || "").trim().toLowerCase();

    if (bgRaw === "none transparent" ||
        bgcRaw === "transparent" ||
        bgRaw.includes("transparent")) {
      return true;
    }

    // Check rgba alpha=0 on backgroundColor
    if (bgcRaw && isTransparentColor(normalizeColor(bgcRaw))) return true;

    // Check rgba alpha=0 extracted from background shorthand
    if (bgRaw) {
      const rgbaMatch = bgRaw.match(/rgba?\([^)]+\)/);
      if (rgbaMatch && isTransparentColor(normalizeColor(rgbaMatch[0]))) return true;
    }

    // Computed fallback only when no inline bg info at all
    if (!bgRaw && !bgcRaw) {
      return isTransparentColor(normalizeColor(getComputedStyle(el).backgroundColor));
    }

    return false;
  }

  function hasGradientBg(el) {
    const bg = (el.style?.background || "").toLowerCase();
    return bg.includes("linear-gradient") || bg.includes("radial-gradient");
  }

  function applyButtonClasses(el) {
    if (!isButtonish(el)) {
      clearAllButtonClasses(el);
      return "";
    }

    const frozenVariant = getFrozen(el, "btn-variant");
    if (frozenVariant) {
      el.classList.add(CFG.classes.btn);
      clearButtonVariantClasses(el);
      el.classList.add(frozenVariant);
    }

    el.classList.add(CFG.classes.btn);
    clearButtonVariantClasses(el);

    // Gradient takes priority — no further color mapping needed
    if (hasGradientBg(el)) {
      el.classList.add(CFG.classes.btnGradient);
      el.classList.remove(CFG.classes.btnOutline);
      freezeIfComputed(el, "btn-variant", CFG.classes.btnGradient, false);
      return "BTN:gradient:";
    }

    const isTransparent = detectTransparency(el);

    // When transparent, skip color mapping — the bg is invisible
    if (isTransparent) {
      if (el.tagName !== "DIV" && !el.matches?.(".bubble-element.Icon")) {
        // Non-divs and non-icon buttons get the explicit transparent class
        el.classList.add(CFG.classes.btnTransparent);
        const isOutline = el.getAttribute("data-outline") === "true" || hasVisibleBorder(el);
        el.classList.toggle(CFG.classes.btnOutline, isOutline);
        freezeIfComputed(el, "btn-variant", CFG.classes.btnTransparent, false);
        return "BTN:transparent:" + (isOutline ? "O" : "");
      }
      // Divs and icon buttons: skip transparent class + color mapping — no visible bg
      return "BTN:skip-transparent";
    }

    // Color mapping (only for non-transparent, non-gradient buttons)
    const bg = getEffectiveBg(el);
    const bgToken = normalizeColor(getInlineBgTokenOrRgb(el));
    const usedComputedBg = !bgToken;
    const p = CFG._palette;
    const rgbMap = CFG._normalizedRgbMap;

    let mapped = "";

    mapped = CFG.bgTokenToVariantClass[bgToken] || "";

    if (!mapped && rgbMap) {
      mapped = rgbMap[bgToken] || rgbMap[bg] || "";
    }

    // CSS var substring matching (handles vars inside rgba(), etc.)
    if (!mapped) {
      const bgStr = ((el.style?.backgroundColor || "") + (el.style?.background || "")).toLowerCase();
      for (const [varSub, cls] of Object.entries(CFG.bgVarSubstringToClass)) {
        if (bgStr.includes(varSub)) { mapped = cls; break; }
      }
    }

    if (!mapped && p) {
      if (bg === p.success) mapped = CFG.classes.btnGreen;
      else if (bg === p.alert) mapped = CFG.classes.btnOrange;
      else if (bg === p.primary) mapped = CFG.classes.btnDark;
      else if (bg === p.background) mapped = CFG.classes.btnGray;
      else if (bg === p.destructive || bg === p.destructiveAlt) mapped = CFG.classes.btnRed;
    }

    if (mapped) el.classList.add(mapped);

    el.classList.remove(CFG.classes.btnOutline);
    freezeIfComputed(el, "btn-variant", mapped, usedComputedBg);

    return "BTN:" + (mapped || "none") + ":";
  }

  function applyLinkClasses(el) {
    const frozenIsLink = getFrozen(el, "link");
    if (frozenIsLink === "1") {
      el.classList.add(CFG.classes.link);
      const frozenDestr = getFrozen(el, "link-destructive");
      const frozenNormal = getFrozen(el, "link-normal");
      el.classList.toggle(CFG.classes.linkDestructive, frozenDestr === "1");
      el.classList.toggle(CFG.classes.linkNormal, frozenNormal === "1");
      return "LINK:*";
    }

    const tag = el.tagName;
    const isAnchor = tag === "A";
    const isButton = tag === "BUTTON";
    const isClickable = el.classList.contains("clickable-element");
    const isTextLink = isClickable && el.matches?.(".bubble-element.Text");

    let isButtonLink = false;

    if (isButton) {
      const isTransparent = detectTransparency(el);

      const borderStyle = (el.style?.borderStyle || "").trim().toLowerCase();
      const border = (el.style?.border || "").trim().toLowerCase();

      const borderNone =
        borderStyle === "none" ||
        border.includes("none") ||
        (!borderStyle && !border);

      let c = normalizeColor(el.style?.color);
      if (!c) c = normalizeColor(getComputedStyle(el).color);

      const looksLikeLinkColor =
        (CFG._normalLinkColors && CFG._normalLinkColors.has(c)) ||
        (CFG._destructiveLinkColors && CFG._destructiveLinkColors.has(c));

      isButtonLink = isTransparent && borderNone && looksLikeLinkColor;
    }

    if (!isTextLink && !isButtonLink && !isAnchor) {
      el.classList.remove(CFG.classes.link, CFG.classes.linkDestructive, CFG.classes.linkNormal);
      return "";
    }

    el.classList.add(CFG.classes.link);

    let color = normalizeColor(el.style?.color);
    let usedComputed = false;
    if (!color) {
      color = normalizeColor(getComputedStyle(el).color);
      usedComputed = true;
    }

    const isDestructive = CFG._destructiveLinkColors && CFG._destructiveLinkColors.has(color);
    const isNormal = !isDestructive && CFG._normalLinkColors && CFG._normalLinkColors.has(color);

    freezeIfComputed(el, "link", "1", usedComputed);
    freezeIfComputed(el, "link-destructive", isDestructive ? "1" : "0", usedComputed);
    freezeIfComputed(el, "link-normal", isNormal ? "1" : "0", usedComputed);

    el.classList.toggle(CFG.classes.linkDestructive, isDestructive);
    el.classList.toggle(CFG.classes.linkNormal, isNormal);

    return "LINK:" + (isDestructive ? "D" : isNormal ? "N" : "P") + (isButtonLink ? ":B" : isAnchor ? ":A" : ":T");
  }

  function applySurfaceClasses(el) {
    const tag = el.tagName;

    // Separators and Page elements are never surfaces
    if (el.classList.contains(CFG.classes.separato) || el.classList.contains("Page")) {
      el.classList.remove(CFG.classes.surfaceBright);
      return;
    }

    // Inputs/textareas/selects are always bright surfaces
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
      el.classList.add(CFG.classes.surfaceBright);
      return;
    }

    // Rich text editors (Quill): bright surface + force font-light
    if (el.matches?.(".ql-editor[contenteditable]")) {
      el.classList.add(CFG.classes.surfaceBright);
      el.classList.add(CFG.classes.fontLight);
      el.classList.remove(CFG.classes.fontBold);
      return;
    }

    // Only classify elements that explicitly set a background
    const bgToken = normalizeColor(getInlineBgTokenOrRgb(el));
    if (!bgToken) {
      el.classList.remove(CFG.classes.surfaceBright);
      return;
    }

    let isBright = CFG._brightBgSet.has(bgToken);

    // For CSS vars or unrecognized values, resolve to RGB and recheck
    if (!isBright) {
      const resolved = normalizeColor(getComputedStyle(el).backgroundColor);
      isBright = CFG._brightBgSet.has(resolved);
    }

    el.classList.toggle(CFG.classes.surfaceBright, isBright);
  }

  function applyToggleClass(el) {
    if (!el.matches?.(".bubble-element.Group")) return;

    const maxW = parseFloat(el.style?.maxWidth);
    const maxH = parseFloat(el.style?.maxHeight || el.style?.minHeight);
    if (!Number.isFinite(maxW) || maxW > 50) return;
    if (!Number.isFinite(maxH) || maxH > 50) return;

    const br = parseFloat(el.style?.borderRadius);
    if (!Number.isFinite(br) || br < maxW * 0.4) return;

    if (!hasVisibleBorder(el)) return;

    el.classList.add(CFG.classes.toggle);
  }

  function firstFinitePxValue(values) {
    for (const value of values) {
      const n = parseFloat(value);
      if (Number.isFinite(n)) return n;
    }
    return NaN;
  }

  function applySeparatoClass(el) {
    if (!el.matches?.(".bubble-element.Shape, .bubble-element.Group")) {
      el.classList.remove(CFG.classes.separato);
      return;
    }

    const cs = getComputedStyle(el);

    let bgToken = normalizeColor(getInlineBgTokenOrRgb(el));
    if (!bgToken) {
      bgToken = normalizeColor(cs.backgroundColor);
    }
    if (!bgToken || isTransparentColor(bgToken)) {
      el.classList.remove(CFG.classes.separato);
      return;
    }

    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (width === 0 && height === 0) {
      el.classList.remove(CFG.classes.separato);
      return;
    }

    const paddings = [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft]
      .map((v) => parseFloat(v))
      .filter(Number.isFinite);
    const hasVisiblePadding = paddings.some((v) => v > 0.5);
    if (hasVisiblePadding) {
      el.classList.remove(CFG.classes.separato);
      return;
    }

    if ((el.textContent || "").trim()) {
      el.classList.remove(CFG.classes.separato);
      return;
    }

    if (el.children && el.children.length > 0) {
      el.classList.remove(CFG.classes.separato);
      return;
    }

    const THIN_PX = 5;
    const LONG_PX = 8;
    const isHorizontalSeparato = height <= THIN_PX && width >= LONG_PX;
    const isVerticalSeparato = width <= THIN_PX && height >= LONG_PX;

    el.classList.toggle(CFG.classes.separato, isHorizontalSeparato || isVerticalSeparato);
  }

  function hasOwnTextNode(el) {
    for (const node of el.childNodes || []) {
      if (node.nodeType === Node.TEXT_NODE && (node.textContent || "").trim()) {
        return true;
      }
    }
    return false;
  }

  function applySecondaryTextClass(el) {
    const isClassifiedText =
      el.classList.contains(CFG.classes.fontBold) ||
      el.classList.contains(CFG.classes.fontLight);

    if (!isClassifiedText) {
      el.classList.remove(CFG.classes.secondaryText);
      return;
    }

    // Only classify true text-bearing elements, not layout containers.
    const isTextLikeElement = el.matches?.(
      ".bubble-element.Text, label, a.bubble-element.Link, .file-input-text, .dz-message, .ql-editor[contenteditable], .bad-revision"
    );
    if (!isTextLikeElement && !hasOwnTextNode(el)) {
      el.classList.remove(CFG.classes.secondaryText);
      return;
    }

    let color = normalizeColor(el.style?.color);
    if (!color) {
      color = normalizeColor(getComputedStyle(el).color);
    }

    const isSecondaryTokenOrResolved =
      CFG._secondaryTextColors && CFG._secondaryTextColors.has(color);
    const isSubunitAlphaText = hasAlphaBelowOne(color);

    el.classList.toggle(
      CFG.classes.secondaryText,
      !!isSecondaryTokenOrResolved || isSubunitAlphaText
    );
  }

  function applyDarkSurfaceClass(el) {
    if (el.classList.contains(CFG.classes.separato) || el.classList.contains("Page")) {
      el.classList.remove(CFG.classes.darkSurface);
      return;
    }

    const bgToken = normalizeColor(getInlineBgTokenOrRgb(el));
    if (!bgToken) {
      el.classList.remove(CFG.classes.darkSurface);
      return;
    }

    let isDark = CFG._darkBgSet.has(bgToken);

    if (!isDark) {
      const resolved = normalizeColor(getComputedStyle(el).backgroundColor);
      isDark = CFG._darkBgSet.has(resolved);
    }

    el.classList.toggle(CFG.classes.darkSurface, isDark);
  }

  // Currently used for border exclusion; kept for potential future input-specific logic
  const INPUT_SELECTOR = "input, textarea, select, .Input, .Dropdown, .MultiLineInput, .date_div, .picker__input, .PictureInput, .FileInput, .bubble-element.Checkbox, .easyrte-wrapper-bubble, .ql-container, .ql-snow, button.button_for_file_uploader";

  function isInputElement(el) {
    return el.matches?.(INPUT_SELECTOR);
  }

  function clearAllBorderClasses(el) {
    el.classList.remove(
      CFG.classes.border,
      CFG.classes.borderTop,
      CFG.classes.borderRight,
      CFG.classes.borderBottom,
      CFG.classes.borderLeft,
      CFG.classes.borderAll
    );
  }

  function applyBorderClass(el) {
    if (isInputElement(el)) {
      clearAllBorderClasses(el);
      return;
    }

    const cs = getComputedStyle(el);
    const sides = [
      { key: "top", cls: CFG.classes.borderTop },
      { key: "right", cls: CFG.classes.borderRight },
      { key: "bottom", cls: CFG.classes.borderBottom },
      { key: "left", cls: CFG.classes.borderLeft },
    ];
    let hasAnyPaintedBorder = false;
    let paintedCount = 0;

    for (const { key, cls } of sides) {
      const style = cs.getPropertyValue("border-" + key + "-style");
      const hasStyle = style && style !== "none" && style !== "hidden";

      const w = parseFloat(cs.getPropertyValue("border-" + key + "-width"));
      const hasWidth = Number.isFinite(w) && w > 0;

      const color = normalizeColor(cs.getPropertyValue("border-" + key + "-color"));
      const hasColor = color && !isTransparentColor(color);

      const painted = hasStyle && hasWidth && hasColor;
      el.classList.toggle(cls, !!painted);
      if (painted) {
        hasAnyPaintedBorder = true;
        paintedCount++;
      }
    }

    el.classList.toggle(CFG.classes.border, hasAnyPaintedBorder);
    el.classList.toggle(CFG.classes.borderAll, paintedCount === 4);
  }

  function buildInputSig(el) {
    return (el.style?.fontFamily || "") + "|" +
           (el.style?.fontWeight || "") + "|" +
           (el.style?.color || "") + "|" +
           (el.style?.backgroundColor || "") + "|" +
           (el.style?.background || "") + "|" +
           (el.style?.borderStyle || "") + "|" +
           (el.style?.borderWidth || "") + "|" +
           (el.style?.border || "");
  }

  function processOne(el) {
    const sig = buildInputSig(el);
    const prevSig = lastSig.get(el);
    if (prevSig === sig) return;
    lastSig.set(el, sig);

    const isFirstRun = prevSig === undefined;

    // Volatile: re-evaluate on every style change
    applyFontClasses(el);

    // Input elements must never carry border classes
    if (isInputElement(el)) {
      clearAllBorderClasses(el);
    }

    // Separato must be classified before surfaces (separators are excluded from surfaces).
    // Runs once on first run; on subsequent runs the class is already present.
    if (isFirstRun) {
      applySeparatoClass(el);
    }

    applySurfaceClasses(el);
    applyDarkSurfaceClass(el);

    // Stable classifications: classify once on first run, skip on re-runs
    if (isFirstRun) {
      const linkResult = applyLinkClasses(el);
      if (linkResult) {
        setFrozen(el, "is-link", "1");
        clearAllButtonClasses(el);
      } else {
        applyButtonClasses(el);
      }
      applyToggleClass(el);
      applySecondaryTextClass(el);
      applyBorderClass(el);
    } else if (getFrozen(el, "is-link") === "1") {
      // Already classified as link — skip button re-evaluation
    } else {
      // Buttons are volatile (hover, state changes)
      applyButtonClasses(el);
    }
  }

  function onMutations(mutations) {
    for (const m of mutations) {
      if (m.type === "childList") {
        for (const n of m.addedNodes) {
          if (n && n.nodeType === 1) schedule(n);
        }
      } else if (m.type === "attributes") {
        schedule(m.target);
      }
    }
  }

  function buildNormalizedRgbMap() {
    CFG._normalizedRgbMap = {};
    for (const [key, cls] of Object.entries(CFG.bgRgbToVariantClass)) {
      CFG._normalizedRgbMap[normalizeColor(key)] = cls;
    }
  }

  function initBrightSurfaces() {
    CFG._brightBgSet = new Set();

    for (const rgb of CFG.brightSurface.rgb) {
      CFG._brightBgSet.add(normalizeColor(rgb));
    }

    for (const token of CFG.brightSurface.tokens) {
      CFG._brightBgSet.add(normalizeColor(token));
      const varName = token.match(/var\(([^)]+)\)/)?.[1];
      if (varName) {
        CFG._brightBgSet.add(resolveCssVarToBg(varName));
      }
    }
  }

  function initLinkColors() {
    CFG._normalLinkColors = new Set();
    CFG._destructiveLinkColors = new Set();

    for (const rgb of CFG.linkColors.normal.rgb) {
      CFG._normalLinkColors.add(normalizeColor(rgb));
    }
    for (const token of CFG.linkColors.normal.tokens) {
      CFG._normalLinkColors.add(normalizeColor(token));
      const varName = token.match(/var\(([^)]+)\)/)?.[1];
      if (varName) CFG._normalLinkColors.add(resolveCssVarToRgb(varName));
    }

    for (const rgb of CFG.linkColors.destructive.rgb) {
      CFG._destructiveLinkColors.add(normalizeColor(rgb));
    }
    for (const token of CFG.linkColors.destructive.tokens) {
      CFG._destructiveLinkColors.add(normalizeColor(token));
      const varName = token.match(/var\(([^)]+)\)/)?.[1];
      if (varName) CFG._destructiveLinkColors.add(resolveCssVarToRgb(varName));
    }
  }

  function initDarkSurfaces() {
    CFG._darkBgSet = new Set();

    for (const rgb of CFG.darkSurface.rgb) {
      CFG._darkBgSet.add(normalizeColor(rgb));
    }

    for (const token of CFG.darkSurface.tokens) {
      CFG._darkBgSet.add(normalizeColor(token));
      const varName = token.match(/var\(([^)]+)\)/)?.[1];
      if (varName) {
        CFG._darkBgSet.add(resolveCssVarToBg(varName));
      }
    }
  }

  function initSecondaryTextColors() {
    CFG._secondaryTextColors = new Set();

    for (const rgb of CFG.secondaryText.rgb) {
      CFG._secondaryTextColors.add(normalizeColor(rgb));
    }

    for (const token of CFG.secondaryText.tokens) {
      CFG._secondaryTextColors.add(normalizeColor(token));
      const varName = token.match(/var\(([^)]+)\)/)?.[1];
      if (varName) {
        CFG._secondaryTextColors.add(resolveCssVarToRgb(varName));
      }
    }
  }

  function initPalette() {
    CFG._palette = {
      alert: resolveCssVarToBg("--color_alert_default"),
      success: resolveCssVarToBg("--color_success_default"),
      background: resolveCssVarToBg("--color_background_default"),
      primary: resolveCssVarToBg("--color_primary_default"),
      destructive: resolveCssVarToBg("--color_destructive_default"),
      destructiveAlt: resolveCssVarToBg("--color_coEgT_default"),
      link: resolveCssVarToRgb("--color_primary_contrast_default"),
    };
    buildNormalizedRgbMap();
    initBrightSurfaces();
    initDarkSurfaces();
    initLinkColors();
    initSecondaryTextColors();
  }

  function start() {
    if (running) return;
    running = true;

    if (!CFG._palette) initPalette();
    schedule(document.body);

    mutationWatcher = new MutationObserver(onMutations);
    mutationWatcher.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["style", "class", "data-outline"],
    });

    if (CFG.enablePointerRecheck) {
      const opts = { capture: true, passive: true };
      document.addEventListener("pointerover", pointerHandler, opts);
      document.addEventListener("pointerout", pointerHandler, opts);
      document.addEventListener("focusin", pointerHandler, true);
      document.addEventListener("focusout", pointerHandler, true);
    }
  }

  function stop() {
    if (!running) return;
    running = false;

    if (mutationWatcher) {
      mutationWatcher.disconnect();
      mutationWatcher = null;
    }

    if (CFG.enablePointerRecheck) {
      const opts = { capture: true };
      document.removeEventListener("pointerover", pointerHandler, opts);
      document.removeEventListener("pointerout", pointerHandler, opts);
      document.removeEventListener("focusin", pointerHandler, true);
      document.removeEventListener("focusout", pointerHandler, true);
    }

    queued.clear();
    rafScheduled = false;
  }

  function rescan() {
    schedule(document.body);
  }

  function pointerHandler(e) {
    const t = e.target;
    if (!t || t.nodeType !== 1) return;

    if (t.matches?.(CFG.scanSelector)) schedule(t, true);

    const btnAncestor = t.closest?.(CFG.clickableButtonSelector + ",button");
    if (btnAncestor) schedule(btnAncestor, true);

    const textAncestor = t.closest?.(".bubble-element.Text");
    if (textAncestor) schedule(textAncestor, true);
  }

  function refreshTheme() {
    CFG._palette = null;
    initPalette();
    schedule(document.body);
  }

  window.WSClassifier = { start, stop, rescan, refreshTheme };
})();

WSClassifier.start();
