import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase-config';
import { getAuth, signOut } from 'firebase/auth';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-settings-page',
  imports: [NgIf, FormsModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent implements OnInit {
  user: any;
  private auth = getAuth(initializeApp(firebaseConfig));  // Initialize Firebase Auth here
  constructor(private router: Router) {}

  preferredUnit: 'kg' | 'lbs' = 'lbs' ;


  ngOnInit() {
    // Retrieve user data from sessionStorage
    const userData = sessionStorage.getItem('user');
    const storedUnit = sessionStorage.getItem('preferredUnit');

    if (userData) {
      this.user = JSON.parse(userData); // Parse the JSON string into an object
    } else {
      // If no user data is found, redirect to login
      this.router.navigate(['/login-page']);
    }

    if (storedUnit === 'kg' || storedUnit === 'lbs') {
      this.preferredUnit = storedUnit;
    }
  }

  onUnitChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.preferredUnit = selectElement.value as 'kg' | 'lbs';
    sessionStorage.setItem('preferredUnit', this.preferredUnit);
    console.log('Preferred unit set to:', this.preferredUnit);
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
