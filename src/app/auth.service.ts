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
  getDoc,
} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from './firebase-config';
import { initializeApp } from 'firebase/app';
import { Auth, user } from '@angular/fire/auth';
import { User as fUser } from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore, updateDoc } from '@angular/fire/firestore';
import { User } from '../data types/data-types';
import {
  BehaviorSubject,
  firstValueFrom,
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

  getUserId(): string {
    if (this.userSubject.value) {
      return this.userSubject.value.id;
    }
    throw new Error('No user signed in unable to get id.');
  }

  userSignedIn(): boolean {
    if (this.userSubject.value == null) {
      return false;
    } else {
      return true;
    }
  }

  private async getUserData(uid: string): Promise<User> {
    const docRef = doc(this.firestore, 'users/' + uid);
    const userDocs = await getDoc(docRef);

    const user = userDocs.data() as User;
    user.id = userDocs.id;
    console.log(JSON.stringify(user));
    return user;
  }

  // Register user and store additional info in Firestore
  async register(email: string, password: string, userInfo: User) {
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
      fname: userInfo.fname,
      lname: userInfo.lname,
      units: userInfo.units,
    });

    return user;
  }

  async saveUser() {
    const user = await firstValueFrom(this.user);
    if (user != null) {
      const userRef = doc(this.firestore, 'users', user.id);
      updateDoc(userRef, {
        fname: user.fname,
        lname: user.lname,
        units: user.units,
      });
    } else {
      console.error('Trying to save null user!');
    }
  }

  async setUserUnits(units: string) {
    const user = await firstValueFrom(this.user);
    if (user != null) {
      user.units = units;
      this.userSubject.next(user);
    } else {
      console.error('Trying to set units for null user!');
    }
  }

  getUserSync(): User | null {
    return this.userSubject.value;
  }
}
