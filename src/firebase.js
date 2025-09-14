// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
  apiKey: "AIzaSyBJBPuD8ftg8OsqCrhG8uQOw1ZRb9hk7jQ",
  authDomain: "enable--authentication-918d5.firebaseapp.com",
  projectId: "enable--authentication-918d5",
  storageBucket: "enable--authentication-918d5.firebasestorage.app",
  messagingSenderId: "242974728160",
  appId: "1:242974728160:web:478645344a7a8d5d55d585",
  measurementId: "G-9V0NB1B0B2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
