import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdBuHUx7dBx81RAOZ7IhaZHE8XSUnbS6g",
  authDomain: "ai-problems-reviewer.firebaseapp.com",
  projectId: "ai-problems-reviewer",
  storageBucket: "ai-problems-reviewer.firebasestorage.app",
  messagingSenderId: "698171835673",
  appId: "1:698171835673:web:5f47f5f6eb85a007df7188",
  measurementId: "G-8BX6TN0HSP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
