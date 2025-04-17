/*! iFrame Resizer (iframeSizer.min.js ) - v4.3.5 - 2023-03-08
 *  Desc: Force cross domain iframes to size to content.
 *  Requires: iframeResizer.contentWindow.min.js to be loaded into the target frame.
 *  Copyright: (c) 2023 David J. Bradshaw - dave@bradshaw.net
 *  License: MIT
 */
!function(d){var c,u,a,v,x,I,M,r,f,k,i,l,z;function m(){return window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver}function F(e,n,i){e.addEventListener(n,i,!1)}function B(e,n,i){e.removeEventListener(n,i,!1)}function p(e){return x+"["+(n="Host page: "+(e=e),n=window.top!==window.self?window.parentIFrame&&window.parentIFrame.getId?window.parentIFrame.getId()+": "+e:"Nested host page: "+e:n)+"]";var n}function t(e){return k[e]?k[e].log:u}function O(e,n){o("log",e,n,t(e))}function E(e,n){o("info",e,n,t(e))}function R(e,n){o("warn",e,n,!0)}function o(e,n,i,t){!0===t&&"object"==typeof window.console&&console[e](p(n),i)}function w(e){function i(){t("Height"),t("Width"),P(function(){H(w),C(b),l("onResized",w)},w,"init")}function n(){var e=p.slice(I).split(":"),n=e[1]?parseInt(e[1],10):0,i=k[e[0]]&&k[e[0]].iframe,t=getComputedStyle(i);return{iframe:i,id:e[0],height:n+function(e){if("border-box"!==e.boxSizing)return 0;var n=e.paddingTop?parseInt(e.paddingTop,10):0,e=e.paddingBottom?parseInt(e.paddingBottom,10):0;return n+e}(t)+function(e){if("border-box"!==e.boxSizing)return 0;var n=e.borderTopWidth?parseInt(e.borderTopWidth,10):0,e=e.borderBottomWidth?parseInt(e.borderBottomWidth,10):0;return n+e}(t),width:e[2],type:e[3]}}function t(e){var n=Number(k[b]["max"+e]),i=Number(k[b]["min"+e]),e=e.toLowerCase(),t=Number(w[e]);O(b,"Checking "+e+" is in range "+i+"-"+n),t<i&&(t=i,O(b,"Set "+e+" to min value")),n<t&&(t=n,O(b,"Set "+e+" to max value")),w[e]=""+t}function o(){var t=e.origin,o=k[b]&&k[b].checkOrigin;if(o&&""+t!="null"&&!function(){if(o.constructor!==Array)return e=k[b]&&k[b].remoteHost,O(b,"Checking connection is from: "+e),t===e;var e,n=0,i=!1;for(O(b,"Checking connection is from allowed list of origins: "+o);n<o.length;n++)if(o[n]===t){i=!0;break}return i}())throw new Error("Unexpected message received from: "+t+" for "+w.iframe.id+". Message was: "+e.data+". This error can be disabled by setting the checkOrigin: false option or by providing of array of trusted domains.");return 1}function a(e){return p.slice(p.indexOf(":")+v+e)}function s(i,t){var e,n,o;e=function(){var e,n;A("Send Page Info","pageInfo:"+(e=document.body.getBoundingClientRect(),n=w.iframe.getBoundingClientRect(),JSON.stringify({iframeHeight:n.height,iframeWidth:n.width,clientHeight:Math.max(document.documentElement.clientHeight,window.innerHeight||0),clientWidth:Math.max(document.documentElement.clientWidth,window.innerWidth||0),offsetTop:parseInt(n.top-e.top,10),offsetLeft:parseInt(n.left-e.left,10),scrollTop:window.pageYOffset,scrollLeft:window.pageXOffset,documentHeight:document.documentElement.clientHeight,documentWidth:document.documentElement.clientWidth,windowHeight:window.innerHeight,windowWidth:window.innerWidth})),i,t)},n=32,z[o=t]||(z[o]=setTimeout(function(){z[o]=null,e()},n))}function r(e){e=e.getBoundingClientRect();return W(b),{x:Math.floor(Number(e.left)+Number(M.x)),y:Math.floor(Number(e.top)+Number(M.y))}}function d(e){var n=e?r(w.iframe):{x:0,y:0},i={x:Number(w.width)+n.x,y:Number(w.height)+n.y};O(b,"Reposition requested from iFrame (offset x:"+n.x+" y:"+n.y+")"),window.top===window.self?(M=i,c(),O(b,"--")):window.parentIFrame?window.parentIFrame["scrollTo"+(e?"Offset":"")](i.x,i.y):R(b,"Unable to scroll to requested position, window.parentIFrame not found")}function c(){!1===l("onScroll",M)?S():C(b)}function u(e){var e=e.split("#")[1]||"",n=decodeURIComponent(e),n=document.getElementById(n)||document.getElementsByName(n)[0];n?(n=r(n),O(b,"Moving to in page link (#"+e+") at x: "+n.x+" y: "+n.y),M={x:n.x,y:n.y},c(),O(b,"--")):window.top===window.self?O(b,"In page link #"+e+" not found"):window.parentIFrame?window.parentIFrame.moveToAnchor(e):O(b,"In page link #"+e+" not found and window.parentIFrame not found")}function f(e){var n,i={};i=0===Number(w.width)&&0===Number(w.height)?{x:(n=a(9).split(":"))[1],y:n[0]}:{x:w.width,y:w.height},l(e,{iframe:w.iframe,screenX:Number(i.x),screenY:Number(i.y),type:w.type})}function l(e,n){return T(b,e,n)}function m(){switch(k[b]&&k[b].firstRun&&k[b]&&(k[b].firstRun=!1),w.type){case"close":N(w.iframe);break;case"message":n=a(6),O(b,"onMessage passed: {iframe: "+w.iframe.id+", message: "+n+"}"),l("onMessage",{iframe:w.iframe,message:JSON.parse(n)}),O(b,"--");break;case"mouseenter":f("onMouseEnter");break;case"mouseleave":f("onMouseLeave");break;case"autoResize":k[b].autoResize=JSON.parse(a(9));break;case"scrollTo":d(!1);break;case"scrollToOffset":d(!0);break;case"pageInfo":s(k[b]&&k[b].iframe,b),r=b,e("Add ",F),k[r]&&(k[r].stopPageInfo=o);break;case"pageInfoStop":k[b]&&k[b].stopPageInfo&&(k[b].stopPageInfo(),delete k[b].stopPageInfo);break;case"inPageLink":u(a(9));break;case"reset":j(w);break;case"init":i(),l("onInit",w.iframe);break;default:0===Number(w.width)&&0===Number(w.height)?R("Unsupported message received ("+w.type+"), this is likely due to the iframe containing a later version of iframe-resizer than the parent page"):i()}function e(n,i){function t(){k[r]?s(k[r].iframe,r):o()}["scroll","resize"].forEach(function(e){O(r,n+e+" listener for sendPageInfo"),i(window,e,t)})}function o(){e("Remove ",B)}var r,n}var g,h,p=e.data,w={},b=null;if("[iFrameResizerChild]Ready"===p)for(var y in k)A("iFrame requested init",L(y),k[y].iframe,y);else x===(""+p).slice(0,I)&&p.slice(I).split(":")[0]in k?(w=n(),b=w.id,k[b]&&(k[b].loaded=!0),(h=w.type in{true:1,false:1,undefined:1})&&O(b,"Ignoring init message from meta parent page"),!h&&(h=!0,k[g=b]||(h=!1,R(w.type+" No settings for "+g+". Message was: "+p)),h)&&(O(b,"Received: "+p),g=!0,null===w.iframe&&(R(b,"IFrame ("+w.id+") not found"),g=!1),g&&o()&&m())):E(b,"Ignored: "+p)}function T(e,n,i){var t=null,o=null;if(k[e]){if("function"!=typeof(t=k[e][n]))throw new TypeError(n+" on iFrame["+e+"] is not a function");o=t(i)}return o}function g(e){e=e.id;delete k[e]}function N(e){var n=e.id;if(!1===T(n,"onClose",n))O(n,"Close iframe cancelled by onClose event");else{O(n,"Removing iFrame: "+n);try{e.parentNode&&e.parentNode.removeChild(e)}catch(e){R(e)}T(n,"onClosed",n),O(n,"--"),g(e)}}function W(e){null===M&&O(e,"Get page position: "+(M={x:window.pageXOffset===d?document.documentElement.scrollLeft:window.pageXOffset,y:window.pageYOffset===d?document.documentElement.scrollTop:window.pageYOffset}).x+","+M.y)}function C(e){null!==M&&(window.scrollTo(M.x,M.y),O(e,"Set page position: "+M.x+","+M.y),S())}function S(){M=null}function j(e){O(e.id,"Size reset requested by "+("init"===e.type?"host page":"iFrame")),W(e.id),P(function(){H(e),A("reset","reset",e.iframe,e.id)},e,"reset")}function H(o){function i(e){var n;function i(){Object.keys(k).forEach(function(e){function n(e){return"0px"===(k[i]&&k[i].iframe.style[e])}var i;k[i=e]&&null!==k[i].iframe.offsetParent&&(n("height")||n("width"))&&A("Visibility change","resize",k[i].iframe,i)})}function t(e){O("window","Mutation observed: "+e[0].target+" "+e[0].type),h(i,16)}!a&&"0"===o[e]&&(a=!0,O(r,"Hidden iFrame detected, creating visibility listener"),e=m())&&(n=document.querySelector("body"),new e(t).observe(n,{attributes:!0,attributeOldValue:!1,characterData:!0,characterDataOldValue:!1,childList:!0,subtree:!0}))}function e(e){var n;n=e,o.id?(o.iframe.style[n]=o[n]+"px",O(o.id,"IFrame ("+r+") "+n+" set to "+o[n]+"px")):O("undefined","messageData id not set"),i(e)}var r=o.iframe.id;k[r]&&(k[r].sizeHeight&&e("height"),k[r].sizeWidth)&&e("width")}function P(e,n,i){i!==n.type&&r&&!window.jasmine?(O(n.id,"Requesting animation frame"),r(e)):e()}function A(n,i,t,o,e){function r(){var e;t&&"contentWindow"in t&&null!==t.contentWindow?(e=k[o]&&k[o].targetOrigin,O(o,"["+n+"] Sending msg to iframe["+o+"] ("+i+") targetOrigin: "+e),t.contentWindow.postMessage(x+i,e)):R(o,"["+n+"] IFrame("+o+") not found")}function a(){e&&k[o]&&k[o].warningTimeout&&(k[o].msgTimeout=setTimeout(function(){!k[o]||k[o].loaded||s||(s=!0,R(o,"IFrame has not responded within "+k[o].warningTimeout/1e3+" seconds. Check iFrameResizer.contentWindow.js has been loaded in iFrame. This message can be ignored if everything is working, or you can set the warningTimeout option to a higher value or zero to suppress this warning."))},k[o].warningTimeout))}var s=!1;o=o||t.id,k[o]&&(r(),a())}function L(e){return e+":"+k[e].bodyMarginV1+":"+k[e].sizeWidth+":"+k[e].log+":"+k[e].interval+":"+k[e].enablePublicMethods+":"+k[e].autoResize+":"+k[e].bodyMargin+":"+k[e].heightCalculationMethod+":"+k[e].bodyBackground+":"+k[e].bodyPadding+":"+k[e].tolerance+":"+k[e].inPageLinks+":"+k[e].resizeFrom+":"+k[e].widthCalculationMethod+":"+k[e].mouseEvents}function s(t,i){function e(i){var e=m();e&&(e=e,t.parentNode)&&new e(function(e){e.forEach(function(e){Array.prototype.slice.call(e.removedNodes).forEach(function(e){e===t&&N(t)})})}).observe(t.parentNode,{childList:!0}),F(t,"load",function(){var e,n;A("iFrame.onload",i,t,d,!0),e=k[r]&&k[r].firstRun,n=k[r]&&k[r].heightCalculationMethod in f,!e&&n&&j({iframe:t,height:0,width:0,type:"init"})}),A("init",i,t,d,!0)}function o(e){var n=e.split("Callback");2===n.length&&(this[n="on"+n[0].charAt(0).toUpperCase()+n[0].slice(1)]=this[e],delete this[e],R(r,"Deprecated: '"+e+"' has been renamed '"+n+"'. The old method will be removed in the next major version."))}function n(e){if(e=e||{},k[r]=Object.create(null),k[r].iframe=t,k[r].firstRun=!0,k[r].remoteHost=t.src&&t.src.split("/").slice(0,3).join("/"),"object"!=typeof e)throw new TypeError("Options is not an object");Object.keys(e).forEach(o,e);var n,i=e;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(k[r][n]=(Object.prototype.hasOwnProperty.call(i,n)?i:l)[n]);k[r]&&(k[r].targetOrigin=!0!==k[r].checkOrigin||""===(e=k[r].remoteHost)||null!==e.match(/^(about:blank|javascript:|file:\/\/)/)?"*":e)}var r=function(e){if("string"!=typeof e)throw new TypeError("Invaild id for iFrame. Expected String");var n;return""===e&&(t.id=(n=i&&i.id||l.id+c++,null!==document.getElementById(n)&&(n+=c++),e=n),u=(i||{}).log,O(e,"Added missing iframe ID: "+e+" ("+t.src+")")),e}(t.id);if(r in k&&"iFrameResizer"in t)R(r,"Ignored iFrame, already setup.");else{switch(n(i),O(r,"IFrame scrolling "+(k[r]&&k[r].scrolling?"enabled":"disabled")+" for "+r),t.style.overflow=!1===(k[r]&&k[r].scrolling)?"hidden":"auto",k[r]&&k[r].scrolling){case"omit":break;case!0:t.scrolling="yes";break;case!1:t.scrolling="no";break;default:t.scrolling=k[r]?k[r].scrolling:"no"}s("Height"),s("Width"),a("maxHeight"),a("minHeight"),a("maxWidth"),a("minWidth"),"number"!=typeof(k[r]&&k[r].bodyMargin)&&"0"!==(k[r]&&k[r].bodyMargin)||(k[r].bodyMarginV1=k[r].bodyMargin,k[r].bodyMargin=k[r].bodyMargin+"px"),e(L(r)),k[r]&&(k[r].iframe.iFrameResizer={close:N.bind(null,k[r].iframe),removeListeners:g.bind(null,k[r].iframe),resize:A.bind(null,"Window resize","resize",k[r].iframe),moveToAnchor:function(e){A("Move to anchor","moveToAnchor:"+e,k[r].iframe,r)},sendMessage:function(e){A("Send Message","message:"+(e=JSON.stringify(e)),k[r].iframe,r)}})}function a(e){var n=k[r][e];1/0!==n&&0!==n&&(t.style[e]="number"==typeof n?n+"px":n,O(r,"Set "+e+" = "+t.style[e]))}function s(e){if(k[r]["min"+e]>k[r]["max"+e])throw new Error("Value for min"+e+" can not be greater than max"+e)}}function h(e,n){null===i&&(i=setTimeout(function(){i=null,e()},n))}function e(){"hidden"!==document.visibilityState&&(O("document","Trigger event: Visibility change"),h(function(){b("Tab Visible","resize")},16))}function b(i,t){Object.keys(k).forEach(function(e){var n;k[n=e]&&"parent"===k[n].resizeFrom&&k[n].autoResize&&!k[n].firstRun&&A(i,t,k[e].iframe,e)})}function y(){F(window,"message",w),F(window,"resize",function(){var e;O("window","Trigger event: "+(e="resize")),h(function(){b("Window "+e,"resize")},16)}),F(document,"visibilitychange",e),F(document,"-webkit-visibilitychange",e)}function n(){function t(e,n){if(n){if(!n.tagName)throw new TypeError("Object is not a valid DOM element");if("IFRAME"!==n.tagName.toUpperCase())throw new TypeError("Expected <IFRAME> tag, found <"+n.tagName+">");s(n,e),o.push(n)}}for(var o,e=["moz","webkit","o","ms"],n=0;n<e.length&&!r;n+=1)r=window[e[n]+"RequestAnimationFrame"];return r?r=r.bind(window):O("setup","RequestAnimationFrame not supported"),y(),function(e,n){var i;switch(o=[],(i=e)&&i.enablePublicMethods&&R("enablePublicMethods option has been removed, public methods are now always available in the iFrame"),typeof n){case"undefined":case"string":Array.prototype.forEach.call(document.querySelectorAll(n||"iframe"),t.bind(d,e));break;case"object":t(e,n);break;default:throw new TypeError("Unexpected data type ("+typeof n+")")}return o}}function q(e){e.fn?e.fn.iFrameResize||(e.fn.iFrameResize=function(i){return this.filter("iframe").each(function(e,n){s(n,i)}).end()}):E("","Unable to bind to jQuery, it is not fully loaded.")}"undefined"!=typeof window&&(c=0,a=u=!1,v="message".length,I=(x="[iFrameSizer]").length,M=null,r=window.requestAnimationFrame,f=Object.freeze({max:1,scroll:1,bodyScroll:1,documentElementScroll:1}),k={},i=null,l=Object.freeze({autoResize:!0,bodyBackground:null,bodyMargin:null,bodyMarginV1:8,bodyPadding:null,checkOrigin:!0,inPageLinks:!1,enablePublicMethods:!0,heightCalculationMethod:"bodyOffset",id:"iFrameResizer",interval:32,log:!1,maxHeight:1/0,maxWidth:1/0,minHeight:0,minWidth:0,mouseEvents:!0,resizeFrom:"parent",scrolling:!1,sizeHeight:!0,sizeWidth:!1,warningTimeout:5e3,tolerance:0,widthCalculationMethod:"scroll",onClose:function(){return!0},onClosed:function(){},onInit:function(){},onMessage:function(){R("onMessage function not defined")},onMouseEnter:function(){},onMouseLeave:function(){},onResized:function(){},onScroll:function(){return!0}}),z={},window.jQuery!==d&&q(window.jQuery),"function"==typeof define&&define.amd?define([],n):"object"==typeof module&&"object"==typeof module.exports&&(module.exports=n()),window.iFrameResize=window.iFrameResize||n())}();
//# sourceMappingURL=iframeResizer.map
window.addEventListener('load', function() {
    iFrameResize({log:true},'#WhiteSwanIframe');
});  

window.addEventListener('load', function() {
    var iframe = document.getElementById('WhiteSwanIframe');

    var brandingDiv = document.createElement('div');
    brandingDiv.style.position = 'fixed';
    brandingDiv.style.bottom = '30px';
    brandingDiv.style.border = '1px solid #201139';
    brandingDiv.style.display = 'flex';
    brandingDiv.style.flexDirection = 'column';
    brandingDiv.style.alignItems = 'center';
    brandingDiv.style.left = '50%';
    brandingDiv.style.transform = 'translateX(-50%)';
    brandingDiv.style.padding = '15px 15px 15px 15px'; 
    brandingDiv.style.backgroundColor = '#fff';
    brandingDiv.style.borderRadius = '10px';
    brandingDiv.style.maxHeight = '52px'; 
    brandingDiv.style.alignItems = 'center';
    brandingDiv.id = "branding_div";


    var imagesDiv = document.createElement('div');
    imagesDiv.style.width = '161px';
    imagesDiv.style.display = 'flex';
    imagesDiv.style.justifyContent = 'space-between';
    imagesDiv.style.height = '20px'; 
    imagesDiv.style.maxHeight = '20px'; 

    var image1 = document.createElement('img');
    image1.src = 'https://762d0145e332a78fcb6f9b9f529c26ab.cdn.bubble.io/f1687223907166x372570148873097660/Powered_by_text.svg';
    image1.style.width = '65.19px';
    image1.style.height = '18.3125px';
    image1.style.maxHeight = '18.3125px';
    image1.style.marginTop = '1.48px';
    image1.style.marginBottom = '0.23px';

    var image2 = document.createElement('img');
    image2.src = 'https://762d0145e332a78fcb6f9b9f529c26ab.cdn.bubble.io/f1687228487060x445089023249106500/wspoweredbylogo.png';
image2.alt = 'White Swan Partner Logo';
    image2.style.width = '89px';
    image2.style.height = '11px';
    image2.style.maxHeight = '11px';
image2.style.marginTop = '3.4px';
    image2.style.marginBottom = '0px';

    var link = document.createElement('a');
    link.href = 'https://whiteswan.io';
    link.target = '_blank';
    link.appendChild(image2);
    link.style.display = 'flex';
    link.style.height = '20px';
    link.style.maxHeight = '20px';

    imagesDiv.appendChild(image1);
    imagesDiv.appendChild(link);

    brandingDiv.appendChild(imagesDiv);
    document.body.appendChild(brandingDiv);

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
