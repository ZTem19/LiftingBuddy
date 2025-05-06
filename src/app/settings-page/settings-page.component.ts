import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase-config';
import { getAuth, signOut } from 'firebase/auth';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../auth.service';
import { firstValueFrom } from 'rxjs';
import { DataService } from '../data.service';
import { User } from '../../data types/data-types';

@Component({
  selector: 'app-settings-page',
  imports: [NgIf, FormsModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css',
})
export class SettingsPageComponent implements OnInit {
  user?: User | null = null;
  private auth = inject(Auth); // Initialize Firebase Auth here
  private authService = inject(AuthService);
  private dataService = inject(DataService);
  constructor(private router: Router) {}

  preferredUnit: 'kg' | 'lbs' = 'lbs';

  ngOnInit() {
    // Retrieve user data from sessionStorage
    // const userData = sessionStorage.getItem('user');
    // const storedUnit = sessionStorage.getItem('preferredUnit');

    // if (userData) {
    //   this.user = JSON.parse(userData); // Parse the JSON string into an object
    // } //else {
    //   // If no user data is found, redirect to login
    //   this.router.navigate(['/login-page']);
    // }
    this.getUser();
  }

  private async getUser() {
    this.user = await firstValueFrom(this.authService.user);
    console.log(JSON.stringify(this.user));
    if (this.user == null) {
      this.router.navigate(['login-page']);
    } else {
      if (this.user.units === 'kg' || this.user.units === 'lbs') {
        this.preferredUnit = this.user.units;
      }
    }
  }

  onUnitChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.preferredUnit = selectElement.value as 'kg' | 'lbs';
    // sessionStorage.setItem('preferredUnit', this.preferredUnit);
    if (this.user) {
      this.authService.setUserUnits(this.preferredUnit);
      this.authService.saveUser();
    }

    console.log('Preferred unit set to:', this.preferredUnit);
  }

  logout() {
    // Sign the user out of Firebase
    signOut(this.auth)
      .then(() => {
        // Clear user data from sessionStorage
        sessionStorage.removeItem('user');

        // Navigate to the login page
        this.router.navigate(['/login-page']);
        
      })
      .catch((error) => {
        console.error('Error during logout: ', error);
      });
  }
}
