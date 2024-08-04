// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmvsaUj4nLTzKFAlJq3VeQ3xFWtnICbEw",
  authDomain: "inventory-management-cf03c.firebaseapp.com",
  projectId: "inventory-management-cf03c",
  storageBucket: "inventory-management-cf03c.appspot.com",
  messagingSenderId: "522604764630",
  appId: "1:522604764630:web:eaaf9c6ff5271590e25877",
  measurementId: "G-VDHQX9RQRT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
