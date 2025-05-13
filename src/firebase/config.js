// Firebase configuration
import { initializeApp, getApps } from "firebase/app";
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

// Check if Firebase is already initialized
let app;
try {
  // Get existing apps
  if (getApps().length === 0) {
    // Initialize Firebase if no apps exist
    app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
  } else {
    // Use the first existing app
    app = getApps()[0];
    console.log("Using existing Firebase app");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Initialize services safely
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app; 