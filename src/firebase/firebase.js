import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALrF4uQKtSYTwuUaUqc5h0e9nZLwr0kHc",
  authDomain: "glazone-interiors.firebaseapp.com",
  projectId: "glazone-interiors",
  storageBucket: "glazone-interiors.firebasestorage.app",
  messagingSenderId: "566998943641",
  appId: "1:566998943641:web:e9b0cfc2e7cbcfa1a2b508",
  measurementId: "G-HYS3W6S060"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Temporary development console test
if (process.env.NODE_ENV !== 'production') {
  console.log("Firebase project:", db.app.options.projectId);
  console.log("Firebase auth initialized:", !!auth);
}

export default app;
