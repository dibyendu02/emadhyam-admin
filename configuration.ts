// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcSGhhpz0-BTJbqSpen83nnM6fhKKeT-8",
  authDomain: "gsb-app-2a4ed.firebaseapp.com",
  databaseURL:
    "https://gsb-app-2a4ed-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gsb-app-2a4ed",
  storageBucket: "gsb-app-2a4ed.appspot.com",
  messagingSenderId: "736658276257",
  appId: "1:736658276257:web:6b379da32cd6487de315e0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);
