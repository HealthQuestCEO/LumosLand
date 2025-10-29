// Firebase Configuration for HealthQuest Integration

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase configuration from HealthQuest
const firebaseConfig = {
  apiKey: "AIzaSyD3bQBANozGzirsNJsOpHYn0dED2kmNbss",
  authDomain: "healthquest-8e631.firebaseapp.com",
  projectId: "healthquest-8e631",
  storageBucket: "healthquest-8e631.firebasestorage.app",
  messagingSenderId: "441238628799",
  appId: "1:441238628799:web:477a4da266b34f678c590a",
  measurementId: "G-37J6NX3FCW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// HealthQuest API configuration
export const HEALTHQUEST_API_URL = "https://api-dev.discoverhealthquest.com";

// Export the app instance
export default app;