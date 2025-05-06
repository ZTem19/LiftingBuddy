import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase-config';
import { Auth } from '@angular/fire/auth';


@Component({
  selector: 'app-title-bar',
  imports: [RouterModule, NgIf],
  templateUrl: './title-bar.component.html',
  styleUrl: './title-bar.component.css',
})
export class TitleBarComponent implements OnInit {
  userLoggedIn: boolean = false;

  public auth = inject(Auth);

  ngOnInit() {
    // Listen for authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userLoggedIn = true; // User is logged in
      } else {
        this.userLoggedIn = false; // User is not logged in
      }
    });
  }
}
