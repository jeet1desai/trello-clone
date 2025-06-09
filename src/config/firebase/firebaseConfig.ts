import { initializeApp } from "firebase/app";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
import axiosInstance from "../../helper/axiosInstance";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const messaging = getMessaging(app);

// Set up providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
const facebookProvider = new FacebookAuthProvider();
facebookProvider.setCustomParameters({ prompt: "select_account" });
const githubProvider: OAuthProvider = new OAuthProvider("github.com");
githubProvider.setCustomParameters({ prompt: "select_account" });
githubProvider.addScope("user:email");
const microsoftProvider = new OAuthProvider("microsoft.com");
microsoftProvider.setCustomParameters({ prompt: "select_account" });

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const fpn_token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
    });
    console.log("fpn_token", fpn_token);
    try {
      await axiosInstance.put("/auth/save-device-token", {
        fpn_token,
      });
    } catch (error) {
      console.error("Error while generating token:", error);
    }
  }
};

export {
  auth,
  googleProvider,
  githubProvider,
  facebookProvider,
  microsoftProvider,
};
