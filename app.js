// Translations dictionary (Internationalization / i18n)
const translations = {
  en: {
    title: "Welcome Back",
    subtitle: "Please sign in to continue",
    btnGoogle: "Sign in with Google",
    btnFacebook: "Sign in with Facebook",
    dir: "ltr"
  },
  fr: {
    title: "Bienvenue",
    subtitle: "Veuillez vous connecter pour continuer",
    btnGoogle: "Se connecter avec Google",
    btnFacebook: "Se connecter avec Facebook",
    dir: "ltr"
  },
  ar: {
    title: "مرحباً بك",
    subtitle: "يرجى تسجيل الدخول للمتابعة",
    btnGoogle: "تسجيل الدخول بواسطة جوجل",
    btnFacebook: "تسجيل الدخول بواسطة فيسبوك",
    dir: "rtl"
  }
};

// Language switcher handler
const langSelect = document.getElementById('languageSwitcher');
langSelect.addEventListener('change', (e) => {
  setLanguage(e.target.value);
});

function setLanguage(lang) {
  const t = translations[lang] || translations.en;
  
  document.getElementById('title').innerText = t.title;
  document.getElementById('subtitle').innerText = t.subtitle;
  document.getElementById('btnGoogle').innerText = t.btnGoogle;
  document.getElementById('btnFacebook').innerText = t.btnFacebook;
  
  // Set HTML direction (RTL for Arabic, LTR for others)
  document.documentElement.setAttribute('dir', t.dir);
  document.documentElement.setAttribute('lang', lang);
}

// Authentication Actions (Replace with your Firebase/Auth logic)
function loginWithGoogle() {
  console.log("Initiating Google Login...");
  alert("Redirecting to Google Login...");
  // Example with Firebase:
  // const provider = new firebase.auth.GoogleAuthProvider();
  // firebase.auth().signInWithPopup(provider);
}

function loginWithFacebook() {
  console.log("Initiating Facebook Login...");
  alert("Redirecting to Facebook Login...");
  // Example with Firebase:
  // const provider = new firebase.auth.FacebookAuthProvider();
  // firebase.auth().signInWithPopup(provider);
}
