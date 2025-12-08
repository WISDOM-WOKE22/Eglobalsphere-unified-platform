// Type declaration for Google Translate
interface Window {
  __GOOGLE_TRANSLATION_CONFIG__: {
    defaultLanguage: string;
  };
}

declare var google: any; // Declare google as a global variable

function loadGoogleTranslateScript(callback: () => void) {
  const existingScript = document.getElementById("google-translate-script");
  if (existingScript) {
    callback();
    return;
  }

  const script = document.createElement("script");
  script.id = "google-translate-script";
  script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  script.onload = callback;
  document.head.appendChild(script);
}

function initializeGoogleTranslate() {
  if (!window.__GOOGLE_TRANSLATION_CONFIG__) {
    console.warn("Google Translate configuration not found");
    return;
  }

  // @ts-ignore - google is loaded dynamically
  new google.translate.TranslateElement({
    pageLanguage: window.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage,
  });
}

// This function will be called by Google's script
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }
}

window.googleTranslateElementInit = initializeGoogleTranslate;

export function TranslateInit() {
  loadGoogleTranslateScript(initializeGoogleTranslate);
}
