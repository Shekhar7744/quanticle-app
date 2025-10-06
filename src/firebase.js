import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; // ✅ Realtime DB

const firebaseConfig = {
  apiKey: "AIzaSyCz1xbNXXESTMNBvgF5BXwUp-P2PepPEus",
  authDomain: "quanticle-51638.firebaseapp.com",
  projectId: "quanticle-51638",
  storageBucket: "quanticle-51638.firebasestorage.app", // ✅ Correct Firebase bucket name
  messagingSenderId: "1046727023980",
  appId: "1:1046727023980:web:21973d396a46c4c2ca2749",
  databaseURL: "https://quanticle-51638-default-rtdb.firebaseio.com", // ✅ Realtime DB
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);             // Firestore
export const storage = getStorage(app);          // Firebase Storage
export const auth = getAuth(app);                // Firebase Auth
export const realtimeDB = getDatabase(app);      // Realtime Database