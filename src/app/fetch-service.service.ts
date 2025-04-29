import { inject, Injectable, OnInit } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../data types/data-types';

@Injectable({
  providedIn: 'root',
})
export class FetchServiceService implements OnInit {
  constructor() {}

  firestore: Firestore = inject(Firestore);
  private userCollection = collection(this.firestore, 'users');

  ngOnInit(): void {}

  getUsers(): Observable<User[]> {
    return collectionData(this.userCollection, { idField: 'id' }) as Observable<
      User[]
    >;
  }
}
