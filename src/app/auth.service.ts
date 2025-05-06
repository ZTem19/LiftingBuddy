import { inject, Injectable, OnInit } from '@angular/core';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  documentId,
  where,
  getDocs,
} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from './firebase-config';
import { initializeApp } from 'firebase/app';
import { Auth, user } from '@angular/fire/auth';
import { User as fUser } from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import { User } from '../data types/data-types';
import {
  BehaviorSubject,
  from,
  Observable,
  of,
  Subscription,
  switchMap,
} from 'rxjs';

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  auth = inject(Auth);
  firestore = inject(Firestore);
  userCol = collection(this.firestore, 'users');

  private userSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  user = this.userSubject.asObservable();

  constructor() {
    user(this.auth)
      .pipe(
        switchMap((u) => {
          return u ? from(this.getUserData(u.uid)) : of(null);
        })
      )
      .subscribe((uData) => {
        this.userSubject.next(uData);
      });
  }

  ngOnInit(): void {}

  userSignedIn(): boolean {
    if (this.userSubject.value == null) {
      return false;
    } else {
      return true;
    }
  }

  private async getUserData(uid: string): Promise<User> {
    const userQuery = query(this.userCol, where('uid', '==', uid));

    const userDocs = await getDocs(userQuery);

    if (userDocs.size > 1) {
      throw new Error('Multiple users with uid: ' + uid);
    }

    const user: User = userDocs.docs.map((doc) => {
      return doc.data() as User;
    })[0];

    return user;
  }

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
