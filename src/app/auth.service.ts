import { inject, Injectable } from '@angular/core';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from './firebase-config';
import { initializeApp } from 'firebase/app';
import { Auth } from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(Auth);
  firestore = inject(Firestore);
  // Register user and store additional info in Firestore
  async register(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create a reference to a user document in Firestore
    const userRef = doc(this.firestore, 'users', user.uid);

    // Store additional user data in Firestore (like username)
    await setDoc(userRef, {
      email: user.email,
      createdAt: new Date().toISOString(),
    });

    return user;
  }
}
