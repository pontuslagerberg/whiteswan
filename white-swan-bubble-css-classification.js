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
      btnWhite: "ws-btn--white",
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
      surfaceBrightContent: "ws-surface-bright-content",
      darkSurfaceContent: "ws-dark-surface-content",
      input: "ws-input",
      inputExpandable: "ws-input-expandable",
      destructiveText: "ws-destructive-text",
      transparentBg: "ws-transparent-bg",
      perpTopLeft: "ws-top-left-perpendicular",
      perpTopRight: "ws-top-right-perpendicular",
      perpBottomRight: "ws-bottom-right-perpendicular",
      perpBottomLeft: "ws-bottom-left-perpendicular",
    },

    // Used for both link variant (ws-link--destructive) and destructive text (ws-destructive-text).
    // Tokens + rgb define destructive reds; resolved var values are added in init except when they equal primary.
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
      "var(--color_background_default)": "ws-btn--gray",
      "var(--color_surface_default)": "ws-btn--white",
      "rgb(255, 255, 255)": "ws-btn--white",
    },

    // Keys are normalized (normalizeColor) so one form per color is enough; rgba(...,1) matches rgb(...).
    bgRgbToVariantClass: {
      "rgb(255, 255, 255)": "ws-btn--white",
      "rgb(235, 235, 245)": "ws-btn--gray",
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
      "--color_background_default": "ws-btn--gray",
      "--color_surface_default": "ws-btn--white",
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

    // Primary/dark text color — never classified as destructive (text or link).
    primaryText: {
      tokens: [
        "var(--color_primary_default)",
      ],
      rgb: [
        "rgb(32, 17, 57)",
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
      ".bubble-element.HTML",
      ".bubble-element.HTML p, .bubble-element.HTML h1, .bubble-element.HTML h2, .bubble-element.HTML h3, .bubble-element.HTML h4, .bubble-element.HTML h5, .bubble-element.HTML h6, .bubble-element.HTML ul, .bubble-element.HTML ol, .bubble-element.HTML li, .bubble-element.HTML span",
      ".bubble-element.CustomElement",
      ".bubble-element.Popup",
      ".clickable-element.bubble-element.Button",
      "a.bubble-element.Link",
      ".tippy-content",
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

  let lastSig = new WeakMap();

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

  // ====== STANDARDIZED STYLE READING ======
  //
  // Three tiers, checked in order:
  //
  // 1. getInlineValue(el, prop)
  //    Reads raw inline style via getPropertyValue (captures CSS variables).
  //    Use when you want to match against pre-saved token sets without resolving.
  //
  // 2. getBubbleRuleValue(el, prop)
  //    Reads from Bubble's CSS rules (.b-root .bubble-element.{uniqueClass}).
  //    These carry the designer's intended values from Bubble's editor, BEFORE
  //    our whitelabeling CSS overrides them with !important.
  //
  // 3. Computed style (getComputedStyle)
  //    Final fallback. Includes all CSS cascade including our overrides.
  //    clean=true strips our classification classes to avoid reading our own overrides.
  //
  // getResolvedValue(el, prop, { clean }) runs all three tiers.

  const _bubbleRuleCache = new Map();
  let _bubbleRuleCacheBuilt = false;

  function buildBubbleRuleCache() {
    _bubbleRuleCache.clear();
    for (const sheet of document.styleSheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (!rules) continue;
        for (const rule of rules) {
          if (!rule.selectorText) continue;
          const m = rule.selectorText.match(
            /\.b-root\s+\.bubble-element\.(\w+)\s*$/
          );
          if (m) _bubbleRuleCache.set(m[1], rule.style);
        }
      } catch (e) { /* cross-origin stylesheet */ }
    }
    _bubbleRuleCacheBuilt = true;
  }

  function getBubbleRuleValue(el, prop) {
    if (!_bubbleRuleCacheBuilt) return "";
    for (const cls of el.classList) {
      const style = _bubbleRuleCache.get(cls);
      if (style) {
        const val = (style.getPropertyValue(prop) || "").trim();
        if (val) return val;
      }
    }
    return "";
  }

  const OUR_OVERRIDE_CLASSES_LAZY = { value: null };
  function getOurOverrideClasses() {
    if (!OUR_OVERRIDE_CLASSES_LAZY.value) {
      OUR_OVERRIDE_CLASSES_LAZY.value = [
        CFG.classes.fontBold, CFG.classes.fontLight,
        CFG.classes.link, CFG.classes.linkDestructive, CFG.classes.linkNormal,
        CFG.classes.destructiveText, CFG.classes.btn,
      ];
    }
    return OUR_OVERRIDE_CLASSES_LAZY.value;
  }

  function getInlineValue(el, prop) {
    if (!el.style?.getPropertyValue) return "";
    return (el.style.getPropertyValue(prop) || "").trim();
  }

  function getResolvedValue(el, prop, { clean = false } = {}) {
    const inline = getInlineValue(el, prop);
    if (inline && !inline.startsWith("var(")) return inline;

    const bubbleVal = !inline ? getBubbleRuleValue(el, prop) : "";
    if (bubbleVal && !bubbleVal.startsWith("var(")) return bubbleVal;

    let had;
    if (clean) {
      const classes = getOurOverrideClasses();
      had = classes.filter(c => el.classList.contains(c));
      for (const c of had) el.classList.remove(c);
    }

    const computed = (getComputedStyle(el).getPropertyValue(prop) || "").trim();

    if (clean && had) {
      for (const c of had) el.classList.add(c);
    }

    return computed;
  }

  function getInlineOrBubbleBg(el) {
    const bgc = getInlineValue(el, "background-color");
    if (bgc) return bgc;
    const bg = getInlineValue(el, "background");
    if (bg) {
      const m = bg.match(/(var\([^)]+\)|rgba?\([^)]+\))/);
      if (m) return m[1].trim();
    }
    const bubbleBgc = getBubbleRuleValue(el, "background-color");
    if (bubbleBgc) return bubbleBgc;
    const bubbleBg = getBubbleRuleValue(el, "background");
    if (bubbleBg) {
      const m = bubbleBg.match(/(var\([^)]+\)|rgba?\([^)]+\))/);
      if (m) return m[1].trim();
    }
    return "";
  }

  function getEffectiveBg(el) {
    const inline = normalizeColor(getInlineOrBubbleBg(el));
    if (inline) return inline;
    return normalizeColor(getComputedStyle(el).backgroundColor);
  }

  /** Canonicalizes color strings: normalizes spacing to no-space, and rgba(r,g,b,1) → rgb(r,g,b). */
  function normalizeColor(s) {
    if (!s) return "";
    const t = String(s).trim().toLowerCase();
    if (!t) return "";
    if (t.startsWith("rgb")) {
      const inner = t.replace(/^rgba?\(|\)$/g, "").trim();
      const parts = inner.split(/[,\s]+/).filter(Boolean);
      const normalizedInner = parts.join(",");
      const isRgba = t.startsWith("rgba");
      let out = (isRgba ? "rgba(" : "rgb(") + normalizedInner + ")";
      if (isRgba && parts.length === 4) {
        const a = parseFloat(parts[3]);
        if (Number.isFinite(a) && a >= 1) out = "rgb(" + parts[0] + "," + parts[1] + "," + parts[2] + ")";
      }
      return out;
    }
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
    const bs = getInlineValue(el, "border-style").toLowerCase();
    const bw = getInlineValue(el, "border-width");
    if (!bs || bs === "none" || bs === "hidden") return false;
    const w = parseFloat(bw);
    return Number.isFinite(w) && w > 0;
  }

  // ====== FREEZE HELPERS ======
  const FROZEN_PREFIX = "data-wsc-";

  function getFrozen(el, key) {
    return el.getAttribute(FROZEN_PREFIX + key) || "";
  }

  function setFrozen(el, key, value) {
    if (value === "" || value == null) el.removeAttribute(FROZEN_PREFIX + key);
    else el.setAttribute(FROZEN_PREFIX + key, String(value));
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
      CFG.classes.btnWhite,
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
    const hasInlineFont = !!getInlineValue(el, "font-family");
    const frozen = getFrozen(el, "font");
    if (frozen && !hasInlineFont) {
      if (frozen === "bold") {
        el.classList.add(CFG.classes.fontBold);
        el.classList.remove(CFG.classes.fontLight);
        return "B*";
      }
    }

    // Tooltips: always treat tippy content as light font, independent of the
    // underlying font stack, as long as no explicit inline font-family is set.
    if (!hasInlineFont && el.matches?.(".tippy-content")) {
      el.classList.add(CFG.classes.fontLight);
      el.classList.remove(CFG.classes.fontBold);
      setFrozen(el, "font", "light");
      return "L:tippy";
      if (frozen === "light") {
        el.classList.add(CFG.classes.fontLight);
        el.classList.remove(CFG.classes.fontBold);
        return "L*";
      }
    }

    let ffRaw = getResolvedValue(el, "font-family", { clean: true });
    let fwRaw = getResolvedValue(el, "font-weight", { clean: true });

    let usedComputed = !getInlineValue(el, "font-family");

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

  function isIconElement(el) {
    return el.classList.contains("Icon");
  }

  function isButtonish(el) {
    if (el.classList.contains("input")) return false;
    if (isIconElement(el)) return false;
    if (el.tagName === "BUTTON") return true;
    // Divs/Groups without any text content are never buttons (e.g. icon-only circles, image containers)
    if (el.matches?.(".bubble-element.Group") && !hasDescendantText(el)) return false;
    if (el.matches?.(CFG.clickableButtonSelector)) return true;
    // Badge-like Groups (pills, tags): visible border + non-transparent bg + compact height (≤60px)
    if (el.matches?.(".bubble-element.Group") && hasVisibleBorder(el) && !detectTransparency(el)) {
      const h = el.getBoundingClientRect().height;
      if (Number.isFinite(h) && h <= 60) return true;
    }
    return false;
  }

  function detectTransparency(el) {
    const bgRaw = getInlineValue(el, "background").toLowerCase();
    const bgcRaw = getInlineValue(el, "background-color").toLowerCase();

    if (bgRaw === "none transparent" ||
        bgcRaw === "transparent" ||
        bgRaw.includes("transparent")) {
      return true;
    }

    if (bgcRaw && isTransparentColor(normalizeColor(bgcRaw))) return true;

    if (bgRaw) {
      const rgbaMatch = bgRaw.match(/rgba?\([^)]+\)/);
      if (rgbaMatch && isTransparentColor(normalizeColor(rgbaMatch[0]))) return true;
    }

    if (!bgRaw && !bgcRaw) {
      return isTransparentColor(normalizeColor(getComputedStyle(el).backgroundColor));
    }

    return false;
  }

  function hasGradientBg(el) {
    const bg = getInlineValue(el, "background").toLowerCase();
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
    if (!CFG._normalizedBgTokenToVariantClass) buildNormalizedBgTokenToVariantClass();
    const bg = getEffectiveBg(el);
    const bgToken = normalizeColor(getInlineOrBubbleBg(el));
    const usedComputedBg = !bgToken;
    const p = CFG._palette;
    const rgbMap = CFG._normalizedRgbMap;

    let mapped = "";

    mapped = CFG._normalizedBgTokenToVariantClass[bgToken] || "";

    if (!mapped && rgbMap) {
      mapped = rgbMap[bgToken] || rgbMap[bg] || "";
    }

    if (!mapped) {
      const resolved = normalizeColor(getComputedStyle(el).backgroundColor);
      if (resolved) {
        mapped = CFG._normalizedBgTokenToVariantClass[resolved] || (rgbMap && rgbMap[resolved]) || "";
      }
    }

    // CSS var substring matching (handles vars inside rgba(), etc.)
    if (!mapped) {
      const bgStr = (getInlineValue(el, "background-color") + getInlineValue(el, "background")).toLowerCase();
      for (const [varSub, cls] of Object.entries(CFG.bgVarSubstringToClass)) {
        if (bgStr.includes(varSub)) { mapped = cls; break; }
      }
    }

    if (!mapped && p) {
      if (bg === p.success) mapped = CFG.classes.btnGreen;
      else if (bg === p.alert) mapped = CFG.classes.btnOrange;
      else if (bg === p.primary) mapped = CFG.classes.btnDark;
      else if (bg === p.background) mapped = CFG.classes.btnGray;
      else if (bg === p.surface) mapped = CFG.classes.btnWhite;
      else if (bg === p.destructive || bg === p.destructiveAlt) mapped = CFG.classes.btnRed;
    }

    if (mapped) el.classList.add(mapped);

    el.classList.remove(CFG.classes.btnOutline);
    freezeIfComputed(el, "btn-variant", mapped, usedComputedBg);

    return "BTN:" + (mapped || "none") + ":";
  }

  function getOriginalColor(el) {
    const inline = normalizeColor(getInlineValue(el, "color"));
    if (inline) return { color: inline, usedComputed: false };

    const color = normalizeColor(getResolvedValue(el, "color", { clean: true }));
    return { color, usedComputed: true };
  }

  function applyLinkClasses(el) {
    const frozenIsLink = getFrozen(el, "link");
    if (frozenIsLink === "1") {
      el.classList.add(CFG.classes.link);

      const { color } = getOriginalColor(el);
      const isDestructiveColor = CFG._destructiveLinkColors && CFG._destructiveLinkColors.has(color);
      const isPrimaryOrSecondaryText =
        (CFG._primaryTextColors && CFG._primaryTextColors.has(color)) ||
        (CFG._secondaryTextColors && CFG._secondaryTextColors.has(color));
      const isDestructive = isDestructiveColor && !isPrimaryOrSecondaryText;
      const isNormal = !isDestructive && CFG._normalLinkColors && CFG._normalLinkColors.has(color);

      el.classList.toggle(CFG.classes.linkDestructive, isDestructive);
      el.classList.toggle(CFG.classes.linkNormal, isNormal);
      setFrozen(el, "link-destructive", isDestructive ? "1" : "0");
      setFrozen(el, "link-normal", isNormal ? "1" : "0");
      return "LINK:*";
    }

    const tag = el.tagName;
    const isAnchor = tag === "A";
    const isButton = tag === "BUTTON";
    const isClickable = el.classList.contains("clickable-element");
    const isTextLink = isClickable && el.matches?.(".bubble-element.Text");

    const isChildOfLinkParent = !isTextLink && !isAnchor && !isButton &&
      el.matches?.(".bubble-element.Text") &&
      el.parentElement?.closest?.(".clickable-element.link-underline, .clickable-element.link-colored, a.clickable-element");

    let isButtonLink = false;

    if (isButton) {
      const isTransparent = detectTransparency(el);

      const borderStyle = getInlineValue(el, "border-style").toLowerCase();
      const border = getInlineValue(el, "border").toLowerCase();

      const borderNone =
        borderStyle === "none" ||
        border.includes("none") ||
        (!borderStyle && !border);

      const { color: c } = getOriginalColor(el);

      const looksLikeLinkColor =
        (CFG._normalLinkColors && CFG._normalLinkColors.has(c)) ||
        (CFG._destructiveLinkColors && CFG._destructiveLinkColors.has(c));

      isButtonLink = isTransparent && borderNone && looksLikeLinkColor;
    }

    if (!isTextLink && !isButtonLink && !isAnchor && !isChildOfLinkParent) {
      el.classList.remove(CFG.classes.link, CFG.classes.linkDestructive, CFG.classes.linkNormal);
      return "";
    }

    // If this is a file-uploader button inside a PictureInput, mark its parent
    // so CSS can treat the container as a link shell instead of an input.
    if (isButton && el.classList.contains("button_for_file_uploader")) {
      const pictureInput = el.closest?.(".PictureInput");
      if (pictureInput) {
        pictureInput.setAttribute("data-ws-is-link", "1");
      }
    }

    el.classList.add(CFG.classes.link);

    const { color, usedComputed } = getOriginalColor(el);

    const isDestructiveColor = CFG._destructiveLinkColors && CFG._destructiveLinkColors.has(color);
    const isPrimaryOrSecondaryText =
      (CFG._primaryTextColors && CFG._primaryTextColors.has(color)) ||
      (CFG._secondaryTextColors && CFG._secondaryTextColors.has(color));
    const isDestructive = isDestructiveColor && !isPrimaryOrSecondaryText;
    const isNormal = !isDestructive && CFG._normalLinkColors && CFG._normalLinkColors.has(color);

    freezeIfComputed(el, "link", "1", usedComputed);
    setFrozen(el, "link-destructive", isDestructive ? "1" : "0");
    setFrozen(el, "link-normal", isNormal ? "1" : "0");

    el.classList.toggle(CFG.classes.linkDestructive, isDestructive);
    el.classList.toggle(CFG.classes.linkNormal, isNormal);

    return "LINK:" + (isDestructive ? "D" : isNormal ? "N" : "P") + (isButtonLink ? ":B" : isAnchor ? ":A" : isChildOfLinkParent ? ":C" : ":T");
  }

  function applyDestructiveTextClass(el) {
    if (el.classList.contains(CFG.classes.link)) {
      el.classList.remove(CFG.classes.destructiveText);
      return;
    }

    const isTextLikeElement = el.matches?.(
      ".bubble-element.Text, label, a.bubble-element.Link, .file-input-text, .dz-message, .ql-editor[contenteditable], .bad-revision"
    );
    if (!isTextLikeElement && !hasOwnTextNode(el)) {
      el.classList.remove(CFG.classes.destructiveText);
      return;
    }

    const { color } = getOriginalColor(el);
    const isDestructiveColor = CFG._destructiveLinkColors && CFG._destructiveLinkColors.has(color);
    const isPrimaryOrSecondaryText =
      (CFG._primaryTextColors && CFG._primaryTextColors.has(color)) ||
      (CFG._secondaryTextColors && CFG._secondaryTextColors.has(color));
    const isDestructive = isDestructiveColor && !isPrimaryOrSecondaryText;
    el.classList.toggle(CFG.classes.destructiveText, isDestructive);
  }

  function isInChatMother(el) {
    return el.classList.contains("chat_mother") || !!el.closest?.(".chat_mother");
  }

  function clearAllSurfaceClasses(el) {
    el.classList.remove(
      CFG.classes.surfaceBright, CFG.classes.darkSurface,
      CFG.classes.surfaceBrightContent, CFG.classes.darkSurfaceContent
    );
  }

  function applySurfaceClasses(el) {
    const tag = el.tagName;

    if (isInChatMother(el)) {
      clearAllSurfaceClasses(el);
      return;
    }

    // Buttons, separators, and Page elements are never surfaces
    if ((tag === "BUTTON" && !isIconElement(el)) || isButtonish(el) || el.classList.contains(CFG.classes.separato) || el.classList.contains("Page")) {
      el.classList.remove(CFG.classes.surfaceBright);
      return;
    }

    // Inputs/textareas/selects are always bright surfaces (except hidden file inputs)
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
      if (isHiddenFileInput(el)) {
        el.classList.remove(CFG.classes.surfaceBright);
      } else {
        el.classList.add(CFG.classes.surfaceBright);
      }
      return;
    }

    // Rich text editors (Quill): bright surface + force font-light
    if (el.matches?.(".ql-editor[contenteditable]")) {
      el.classList.add(CFG.classes.surfaceBright);
      el.classList.add(CFG.classes.fontLight);
      el.classList.remove(CFG.classes.fontBold);
      return;
    }

    // Only classify elements that explicitly set a non-transparent background
    const bgToken = normalizeColor(getInlineOrBubbleBg(el));
    if (bgToken && isTransparentColor(bgToken)) {
      el.classList.remove(CFG.classes.surfaceBright);
      return;
    }

    let isBright = false;

    if (bgToken) {
      // Prefer the explicit inline/Bubble background when present.
      isBright = CFG._brightBgSet.has(bgToken) || isColorBright(bgToken);
    }

    if (!isBright) {
      const resolved = normalizeColor(getComputedStyle(el).backgroundColor);
      if (!resolved || isTransparentColor(resolved)) {
        el.classList.remove(CFG.classes.surfaceBright);
        return;
      }
      isBright = CFG._brightBgSet.has(resolved) || isColorBright(resolved);
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

    let bgToken = normalizeColor(getInlineOrBubbleBg(el));
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
    if (isLinkStyledUploaderButton(el)) {
      el.classList.remove(CFG.classes.secondaryText);
      return;
    }
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

    const color = normalizeColor(getResolvedValue(el, "color", { clean: true }));

    const isSecondaryTokenOrResolved =
      CFG._secondaryTextColors && CFG._secondaryTextColors.has(color);
    const isSubunitAlphaText = hasAlphaBelowOne(color);

    el.classList.toggle(
      CFG.classes.secondaryText,
      !!isSecondaryTokenOrResolved || isSubunitAlphaText
    );
  }

  function relativeLuminance(r, g, b) {
    const sRGB = [r, g, b].map(c => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  }

  /** Parse r,g,b from rgb/rgba string (comma- or space-separated; computed style can return either). */
  function parseRgbChannels(colorStr) {
    if (!colorStr) return null;
    const m = String(colorStr).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const parts = m[1].split(/[,\s]+/).filter(Boolean).map(Number);
    if (parts.length >= 3 && parts.every(Number.isFinite)) return parts.slice(0, 3);
    return null;
  }

  function isColorDark(colorStr) {
    const ch = parseRgbChannels(colorStr);
    return ch ? relativeLuminance(ch[0], ch[1], ch[2]) < 0.2 : false;
  }

  function isColorBright(colorStr) {
    const ch = parseRgbChannels(colorStr);
    return ch ? relativeLuminance(ch[0], ch[1], ch[2]) > 0.7 : false;
  }

  function applyDarkSurfaceClass(el) {
    if (isInChatMother(el) || (el.tagName === "BUTTON" && !isIconElement(el)) || el.classList.contains(CFG.classes.separato) || el.classList.contains("Page")) {
      el.classList.remove(CFG.classes.darkSurface);
      return;
    }
    // Allow buttonish elements (e.g. dark-mode toggler) to get ws-dark-surface when bg is primary/dark

    const bgToken = normalizeColor(getInlineOrBubbleBg(el));
    if (bgToken && isTransparentColor(bgToken)) {
      el.classList.remove(CFG.classes.darkSurface);
      return;
    }

    let isDark = bgToken ? CFG._darkBgSet.has(bgToken) : false;

    if (!isDark) {
      const resolved = normalizeColor(getComputedStyle(el).backgroundColor);
      if (!resolved || isTransparentColor(resolved)) {
        el.classList.remove(CFG.classes.darkSurface);
        return;
      }
      isDark = CFG._darkBgSet.has(resolved) || isColorDark(resolved);
    }

    el.classList.toggle(CFG.classes.darkSurface, isDark);
  }

  function applyContentSurfaceClasses(el) {
    const hasBright = el.classList.contains(CFG.classes.surfaceBright);
    const hasDark = el.classList.contains(CFG.classes.darkSurface);

    if (!hasBright && !hasDark) {
      el.classList.remove(CFG.classes.surfaceBrightContent, CFG.classes.darkSurfaceContent);
      return;
    }

    // Once qualified, keep the class (sticky) so collapsing doesn't flicker
    if (hasBright && el.classList.contains(CFG.classes.surfaceBrightContent)) return;
    if (hasDark && el.classList.contains(CFG.classes.darkSurfaceContent)) return;

    const rect = el.getBoundingClientRect();
    const meetsSize = rect.width >= 80 && rect.height >= 48;
    const hasText = hasDescendantText(el);
    const qualifies = meetsSize && hasText;

    if (qualifies) {
      el.classList.toggle(CFG.classes.surfaceBrightContent, hasBright);
      el.classList.toggle(CFG.classes.darkSurfaceContent, hasDark);
    }
  }

  function applyExpandableInputClass(el) {
    if (el.classList.contains(CFG.classes.inputExpandable)) return;
    if (el.classList.contains("input") && el.querySelector?.("input")) {
      el.classList.add(CFG.classes.inputExpandable);
    }
  }

  function applyTransparentBgClass(el) {
    if (!isInputElement(el)) {
      el.classList.remove(CFG.classes.transparentBg);
      return;
    }
    el.classList.toggle(CFG.classes.transparentBg, detectTransparency(el));
  }

  // Currently used for border exclusion; kept for potential future input-specific logic
  const INPUT_SELECTOR = "input, textarea, select, .input, .Input, .Dropdown, .MultiLineInput, .date_div, .picker__input, .PictureInput, .FileInput, .bubble-element.Checkbox, .easyrte-wrapper-bubble, .ql-container, .ql-snow, button.button_for_file_uploader, .ql-mention-list-container, .ql-mention-list, .ql-mention-list-item";

  function isHiddenFileInput(el) {
    return el.tagName === "INPUT" && el.type === "file" &&
      getInlineValue(el, "opacity") === "0";
  }

  function isLinkStyledPictureInput(el) {
    if (!el.classList.contains("PictureInput")) return false;
    if (el.hasAttribute("data-ws-is-link")) return true;
    return !!el.querySelector?.("[data-ws-is-link], .button_for_file_uploader[style*='background-color: transparent'], .button_for_file_uploader[data-wsc-is-link='1']");
  }

  function isLinkStyledUploaderButton(el) {
    if (el.tagName !== "BUTTON" || !el.classList.contains("button_for_file_uploader")) return false;
    const pictureInput = el.closest?.(".PictureInput");
    return pictureInput ? isLinkStyledPictureInput(pictureInput) : false;
  }

  function isInputElement(el) {
    if (!el.matches?.(INPUT_SELECTOR)) return false;
    if (isHiddenFileInput(el)) return false;
    if (isLinkStyledPictureInput(el)) return false;
    if (isLinkStyledUploaderButton(el)) return false;
    return true;
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

  function isButtonElement(el) {
    if (isIconElement(el)) return false;
    return el.tagName === "BUTTON" || isButtonish(el) || el.classList.contains(CFG.classes.btn);
  }

  function applyBorderClass(el) {
    if (isInputElement(el) || isButtonElement(el) || isHiddenFileInput(el) || isLinkStyledUploaderButton(el)) {
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

  const PERP_CORNERS = [
    { prop: "border-top-left-radius",     cls: "perpTopLeft" },
    { prop: "border-top-right-radius",    cls: "perpTopRight" },
    { prop: "border-bottom-right-radius", cls: "perpBottomRight" },
    { prop: "border-bottom-left-radius",  cls: "perpBottomLeft" },
  ];

  function clearAllPerpClasses(el) {
    for (const { cls } of PERP_CORNERS) el.classList.remove(CFG.classes[cls]);
  }

  function applyPerpendicularCorners(el) {
    if (el.classList.contains(CFG.classes.separato)) {
      clearAllPerpClasses(el);
      return;
    }

    let anyRounded = false;
    let anyPerp = false;

    for (const { prop, cls } of PERP_CORNERS) {
      const raw = getResolvedValue(el, prop);
      const val = parseFloat(raw);
      const isPerp = Number.isFinite(val) && val === 0;
      el.classList.toggle(CFG.classes[cls], isPerp);
      if (isPerp) anyPerp = true;
      else anyRounded = true;
    }

    // Only keep perp classes if the element has a mix of rounded and straight corners
    if (!anyRounded || !anyPerp) {
      clearAllPerpClasses(el);
    }
  }

  function buildInputSig(el) {
    return getInlineValue(el, "font-family") + "|" +
           getInlineValue(el, "font-weight") + "|" +
           getInlineValue(el, "color") + "|" +
           getInlineValue(el, "background-color") + "|" +
           getInlineValue(el, "background") + "|" +
           getInlineValue(el, "border-style") + "|" +
           getInlineValue(el, "border-width") + "|" +
           getInlineValue(el, "border") + "|" +
           getInlineValue(el, "border-radius");
  }

  function isClickContext(el) {
    return el.classList.contains("clickable-element") ||
           !!el.closest?.(".clickable-element");
  }

  function processOne(el) {
    const sig = buildInputSig(el);
    const prevSig = lastSig.get(el);
    const sigChanged = prevSig !== sig;
    if (sigChanged) lastSig.set(el, sig);

    const isFirstRun = prevSig === undefined;

    // ── RUN-ONCE: full classification on first encounter ──
    if (isFirstRun) {
      applyFontClasses(el);

      if (isHiddenFileInput(el)) {
        clearAllBorderClasses(el);
        el.classList.remove(CFG.classes.input);
      } else if (isLinkStyledUploaderButton(el)) {
        clearAllBorderClasses(el);
        el.classList.remove(CFG.classes.input, CFG.classes.transparentBg);
      } else if (isInputElement(el)) {
        el.classList.add(CFG.classes.input);
        clearAllBorderClasses(el);
      } else if (isButtonElement(el)) {
        clearAllBorderClasses(el);
      }

      applySeparatoClass(el);
      applySurfaceClasses(el);
      applyDarkSurfaceClass(el);
      applyContentSurfaceClasses(el);
      applyTransparentBgClass(el);
      applyExpandableInputClass(el);

      if (isInputElement(el) || isButtonElement(el)) {
        applyPerpendicularCorners(el);
      } else {
        clearAllPerpClasses(el);
      }

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
      applyDestructiveTextClass(el);
      return;
    }

    // ── VOLATILE: only truly dynamic concerns on subsequent style changes ──
    if (sigChanged) {
      if (isClickContext(el)) {
        applyFontClasses(el);
      }

      if (getFrozen(el, "is-link") !== "1") {
        applyButtonClasses(el);
      }

      if (isInputElement(el) || isButtonElement(el)) {
        applyPerpendicularCorners(el);
      }
    }
  }

  function onMutations(mutations) {
    let stylesAdded = false;
    for (const m of mutations) {
      if (m.type === "childList") {
        for (const n of m.addedNodes) {
          if (n && n.nodeType === 1) {
            schedule(n);
            if (n.tagName === "STYLE" || n.tagName === "LINK") stylesAdded = true;
          }
        }
      } else if (m.type === "attributes") {
        schedule(m.target);
      }
    }
    if (stylesAdded) buildBubbleRuleCache();
  }

  function buildNormalizedRgbMap() {
    CFG._normalizedRgbMap = {};
    for (const [key, cls] of Object.entries(CFG.bgRgbToVariantClass)) {
      CFG._normalizedRgbMap[normalizeColor(key)] = cls;
    }
  }

  /** Normalized lookup for button variant by bg token; keys normalized so spacing in rgb() doesn't matter. */
  function buildNormalizedBgTokenToVariantClass() {
    CFG._normalizedBgTokenToVariantClass = {};
    for (const [key, cls] of Object.entries(CFG.bgTokenToVariantClass)) {
      CFG._normalizedBgTokenToVariantClass[normalizeColor(key)] = cls;
    }
  }

  function initBrightSurfaces() {
    CFG._brightBgSet = new Set();

    for (const rgb of CFG.brightSurface.rgb) {
      addNonTransparent(CFG._brightBgSet, rgb);
    }

    for (const token of CFG.brightSurface.tokens) {
      addNonTransparent(CFG._brightBgSet, token);
      const varName = token.match(/var\(([^)]+)\)/)?.[1];
      if (varName) {
        addNonTransparent(CFG._brightBgSet, resolveCssVarToBg(varName));
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

    const primaryNorm = normalizeColor(resolveCssVarToRgb("--color_primary_default") || "");
    for (const rgb of CFG.linkColors.destructive.rgb) {
      CFG._destructiveLinkColors.add(normalizeColor(rgb));
    }
    for (const token of CFG.linkColors.destructive.tokens) {
      CFG._destructiveLinkColors.add(normalizeColor(token));
      const varName = token.match(/var\(([^)]+)\)/)?.[1];
      if (varName) {
        const resolved = resolveCssVarToRgb(varName);
        if (resolved) {
          const resolvedNorm = normalizeColor(resolved);
          if (resolvedNorm !== primaryNorm) CFG._destructiveLinkColors.add(resolvedNorm);
        }
      }
    }
  }

  function addNonTransparent(set, color) {
    const c = normalizeColor(color);
    if (c && !isTransparentColor(c)) set.add(c);
  }

  function initDarkSurfaces() {
    CFG._darkBgSet = new Set();

    for (const rgb of CFG.darkSurface.rgb) {
      addNonTransparent(CFG._darkBgSet, rgb);
    }

    for (const token of CFG.darkSurface.tokens) {
      addNonTransparent(CFG._darkBgSet, token);
      const varName = token.match(/var\(([^)]+)\)/)?.[1];
      if (varName) {
        addNonTransparent(CFG._darkBgSet, resolveCssVarToBg(varName));
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

  function initPrimaryTextColors() {
    CFG._primaryTextColors = new Set();

    for (const rgb of CFG.primaryText.rgb) {
      CFG._primaryTextColors.add(normalizeColor(rgb));
    }

    for (const token of CFG.primaryText.tokens) {
      CFG._primaryTextColors.add(normalizeColor(token));
      const varName = token.match(/var\(([^)]+)\)/)?.[1];
      if (varName) {
        CFG._primaryTextColors.add(resolveCssVarToRgb(varName));
      }
    }
  }

  function initPalette() {
    CFG._palette = {
      alert: resolveCssVarToBg("--color_alert_default"),
      success: resolveCssVarToBg("--color_success_default"),
      background: resolveCssVarToBg("--color_background_default"),
      surface: resolveCssVarToBg("--color_surface_default"),
      primary: resolveCssVarToBg("--color_primary_default"),
      destructive: resolveCssVarToBg("--color_destructive_default"),
      destructiveAlt: resolveCssVarToBg("--color_coEgT_default"),
      link: resolveCssVarToRgb("--color_primary_contrast_default"),
    };
    buildNormalizedRgbMap();
    buildNormalizedBgTokenToVariantClass();
    initBrightSurfaces();
    initDarkSurfaces();
    initLinkColors();
    initSecondaryTextColors();
    initPrimaryTextColors();
  }

  function start() {
    if (running) return;
    running = true;

    buildBubbleRuleCache();
    if (!CFG._palette) initPalette();
    schedule(document.body);
    setTimeout(() => {
      buildBubbleRuleCache();
      schedule(document.body);
    }, 2000);

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
    lastSig = new WeakMap();
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

  /** Re-read palette from CSS variables and re-classify the entire DOM from scratch. Also removes the theme stylesheet link so the correct light/dark CSS can be re-attached. */
  function refreshTheme() {
    document.getElementById("white-label-stylesheet")?.remove();
    lastSig = new WeakMap();
    CFG._palette = null;
    initPalette();
    schedule(document.body);
  }

  /** Remove the theme <link> by id (e.g. when toggling light/dark mode so the old external CSS stops applying). Does not remove any <style> element. */
  function detachThemeStylesheet(linkId) {
    const id = linkId || "white-label-stylesheet";
    document.getElementById(id)?.remove();
  }

  function sanitizeCSS(css) {
    return css
      .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
      .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")
      .replace(/\u00A0/g, " ")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/[\u2013\u2014]/g, "-");
  }

  const _styleEls = {};
  function injectCSS(css, id) {
    const key = id || "ws-theme";
    let el = _styleEls[key];
    if (!el) {
      el = document.createElement("style");
      el.id = key;
      document.body.appendChild(el);
      _styleEls[key] = el;
    }
    el.textContent = sanitizeCSS(css);
  }

  function removeCSS(id) {
    const key = id || "ws-theme";
    const el = _styleEls[key];
    if (el) {
      el.remove();
      delete _styleEls[key];
    }
  }

  window.WSClassifier = { start, stop, rescan, refreshTheme, detachThemeStylesheet, injectCSS, removeCSS };
})();

WSClassifier.start();
