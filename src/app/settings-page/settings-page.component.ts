import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase-config';
import { getAuth, signOut } from 'firebase/auth';

@Component({
  selector: 'app-settings-page',
  imports: [NgIf],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent implements OnInit {
  user: any;
  private auth = getAuth(initializeApp(firebaseConfig));  // Initialize Firebase Auth here
  constructor(private router: Router) {}

  ngOnInit() {
    // Retrieve user data from sessionStorage
    const userData = sessionStorage.getItem('user');

    if (userData) {
      this.user = JSON.parse(userData); // Parse the JSON string into an object
    } else {
      // If no user data is found, redirect to login
      this.router.navigate(['/login-page']);
    }
  }

  logout() {
    // Sign the user out of Firebase
    signOut(this.auth).then(() => {
      // Clear user data from sessionStorage
      sessionStorage.removeItem('user');
      
      // Navigate to the login page
      this.router.navigate(['/login-page']);
    }).catch((error) => {
      console.error('Error during logout: ', error);
    });
  }
}
