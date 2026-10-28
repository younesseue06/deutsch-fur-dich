// Configuration template for OAuth Credentials
// Replace placeholders with your actual keys from Google Cloud & Facebook Developers

const AUTH_CONFIG = {
  google: {
    clientId: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
    redirectUri: "https://yourdomain.com/auth/google/callback"
  },
  facebook: {
    appId: "YOUR_FACEBOOK_APP_ID",
    redirectUri: "https://yourdomain.com/auth/facebook/callback"
  }
};

// Setup Steps:
// 1. Google: Go to https://console.cloud.google.com -> Credentials -> OAuth 2.0 Client ID
// 2. Facebook: Go to https://developers.facebook.com -> My Apps -> Facebook Login
