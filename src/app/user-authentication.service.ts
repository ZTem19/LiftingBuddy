import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { User } from '../data types/data-types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAuthenticationService {
  firestore: Firestore = inject(Firestore);
  private userCollection = collection(this.firestore, 'users');

  ngOnInit(): void {}

  getUsers(): Observable<User[]> {
    return collectionData(this.userCollection, { idField: 'id' }) as Observable<
      User[]
    >;
  }

  addUser(user: User) {
    let userReference = doc(this.userCollection);
    user.id = userReference.id;

    setDoc(userReference, user);
  }
}
