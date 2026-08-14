// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjgM9o829pj2tiQ_IzWydvhpJmPDlWg-M",
  authDomain: "travelbuddy-ai24.firebaseapp.com",
  projectId: "travelbuddy-ai24",
  storageBucket: "travelbuddy-ai24.firebasestorage.app",
  messagingSenderId: "478246679552",
  appId: "1:478246679552:web:bb184b0e9c68e47597d4e5",
  measurementId: "G-WYMEBR22K0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);