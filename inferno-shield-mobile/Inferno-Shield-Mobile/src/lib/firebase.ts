
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "inferno-shield-mobile",
  "appId": "1:439591683833:web:36655b1f038196607cc428",
  "storageBucket": "inferno-shield-mobile.firebasestorage.app",
  "apiKey": "AIzaSyDv1TGsJskhYEcTeOyD891iNKtW4T_nDC4",
  "authDomain": "inferno-shield-mobile.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "439591683833"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
