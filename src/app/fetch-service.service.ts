import { inject, Injectable, OnInit } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../data types/data-types';

@Injectable({
  providedIn: 'root',
})
export class FetchServiceService implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
