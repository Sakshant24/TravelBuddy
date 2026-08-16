// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAx3O5HiJCNIZ7clkS8klBzYkjgRCityG0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "travelbuddy-2412.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "travelbuddy-2412",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "travelbuddy-2412.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "259695371727",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:259695371727:web:c523155e56adc0ab4d9eba",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-8WGTP5Y0CN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);