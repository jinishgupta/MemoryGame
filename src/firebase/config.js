// Firebase configuration
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZnIQVLgP7SXPtELRSUT3cABjXKKLgdLc",
  authDomain: "matchup-5c8a1.firebaseapp.com",
  projectId: "matchup-5c8a1",
  storageBucket: "matchup-5c8a1.appspot.com",
  messagingSenderId: "912234947972",
  appId: "1:912234947972:web:2855658105195bb0ede9d1",
  measurementId: "G-DCVV8XYNHQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app; 