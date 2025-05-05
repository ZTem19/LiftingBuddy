// This is the User Authentication FireBase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';  

export const firebaseConfig = {
    apiKey: "AIzaSyB1mtjxQ4cSzB-ZJIZfW6EAjD1018ONzLI",
    authDomain: "liftingbuddy-ddfdd.firebaseapp.com",
    projectId: "liftingbuddy-ddfdd",
    storageBucket: "liftingbuddy-ddfdd.firebasestorage.app",
    messagingSenderId: "777379616910",
    appId: "1:777379616910:web:3ff8cf242e10f6d5f511df",
    measurementId: "G-02S0NT8HLL"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services that you want to use
export const auth = getAuth(app); // Firebase Authentication
export const firestore = getFirestore(app); // Firebase Firestore
export const database = getDatabase(app); // Firebase Realtime Database (if you need it)
