(function () {
  function loadGoogleTranslateScript(callback) {
    var existing = document.getElementById("google-translate-script");
    if (existing) {
      callback();
      return;
    }
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      callback();
      return;
    }
    var script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function initializeGoogleTranslate() {
    if (!window.__GOOGLE_TRANSLATION_CONFIG__) {
      return;
    }
    if (!window.google || !window.google.translate) {
      return;
    }
    try {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: window.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage,
        },
        "google_translate_element"
      );
    } catch (e) {
      // no-op
    }
  }

  window.googleTranslateElementInit = initializeGoogleTranslate;
  window.TranslateInit = function () {
    loadGoogleTranslateScript(initializeGoogleTranslate);
  };

  // Auto-initialize on page load to ensure translator is ready in production
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }
  ready(function () {
    loadGoogleTranslateScript(initializeGoogleTranslate);
  });
})();
