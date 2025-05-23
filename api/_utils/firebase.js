// Firebase Admin SDK configuration for server-side
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let app;

const initializeFirebase = () => {
  if (!app) {
    try {
      // In production, use service account key from environment variable
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });
      } else {
        // For development, you can use a service account file
        // Make sure to add the file to .gitignore
        console.warn('FIREBASE_SERVICE_ACCOUNT_KEY not found, using default credentials');
        app = admin.initializeApp();
      }
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      throw error;
    }
  }
  return app;
};

// Get Firestore instance
const getFirestore = () => {
  const app = initializeFirebase();
  return admin.firestore(app);
};

// Get Storage instance
const getStorage = () => {
  const app = initializeFirebase();
  return admin.storage(app);
};

module.exports = {
  initializeFirebase,
  getFirestore,
  getStorage,
  admin
};
