import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/** New Firebase project – always jl-website-29804. Env overrides removed so the app never uses old Firebase. */
const firebaseConfig = {
  apiKey: "AIzaSyDSVkecMzvML4paV6-MpdmVVr7KKIsg_HI",
  authDomain: "jl-website-29804.firebaseapp.com",
  projectId: "jl-website-29804",
  storageBucket: "jl-website-29804.firebasestorage.app",
  messagingSenderId: "855985928515",
  appId: "1:855985928515:web:a570888fb8ded7e0f997f6",
};

function getApp(): FirebaseApp {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  }
  return getApps()[0] as FirebaseApp;
}

export const app = getApp();
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
