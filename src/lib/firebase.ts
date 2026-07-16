// ============================================================
// Tewtorify — Firebase Configuration
// ============================================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAXvnPzfoMtoa8XnWhfoov2RufWV367Pv0",
  authDomain: "tewtorifyonline.firebaseapp.com",
  projectId: "tewtorifyonline",
  storageBucket: "tewtorifyonline.firebasestorage.app",
  messagingSenderId: "603608081645",
  appId: "1:603608081645:web:b84ba2b0c2b9f3b3f898e4",
  measurementId: "G-YG34VVPHFZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export service instances (used by AuthContext, firestore.ts, etc.)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;