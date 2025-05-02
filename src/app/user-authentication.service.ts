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
<<<<<<<< HEAD:src/app/user-authentication.service.ts
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
========
export class FetchServiceService implements OnInit {
  constructor() {}

  ngOnInit(): void {}
>>>>>>>> 888055420350c8b0aba58c23d17bf9bd134e9caa:src/app/fetch-service.service.ts
}
