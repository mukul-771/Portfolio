// Firebase configuration for client-side
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Firebase configuration object
// Using direct values for now to ensure it works
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDPBrWnREe4A6Gyocb45QO2xM_pBmFyJqA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mukul-portfolio-c4a6e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mukul-portfolio-c4a6e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mukul-portfolio-c4a6e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "370259597832",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:370259597832:web:edbd49985c52438eac4fbd"
};

console.log('🔥 Firebase config:', firebaseConfig);

// Initialize Firebase
console.log('🔥 Initializing Firebase app...');
const app = initializeApp(firebaseConfig);
console.log('🔥 Firebase app initialized:', app);

// Initialize Firebase services
console.log('🔥 Initializing Firestore...');
export const db = getFirestore(app);
console.log('🔥 Firestore initialized:', db);

console.log('🔥 Initializing Storage...');
export const storage = getStorage(app);
console.log('🔥 Storage initialized:', storage);

console.log('🔥 Initializing Auth...');
export const auth = getAuth(app);
console.log('🔥 Auth initialized:', auth);

export default app;
