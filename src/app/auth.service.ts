import { Injectable } from '@angular/core';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from './firebase-config';
import { initializeApp } from 'firebase/app';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Register user and store additional info in Firestore
  async register(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create a reference to a user document in Firestore
    const userRef = doc(firestore, 'users', user.uid);

    // Store additional user data in Firestore (like username)
    await setDoc(userRef, {
      email: user.email,
      createdAt: new Date().toISOString()
    });

    return user;
  }
}
