// src/app/login/login.page.ts
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '../firebase-config';
import { FirebaseError, initializeApp } from 'firebase/app';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  // Initialize Firebase App
  private auth = inject(Auth);


  constructor(private router: Router) {}

  // Login function
  async login() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );
      const user = userCredential.user;

      sessionStorage.setItem('user', JSON.stringify(user));

      // If login is successful, navigate to the home or dashboard page
      this.router.navigate(['/settings-page']); // Replace with the route you want to go to after login
    } catch (error) {
      // Handle error (e.g., invalid credentials)
      const firebaseError = error as FirebaseError;
      console.error('Login error: ', firebaseError);

      // Get the error message based on the Firebase error code
      this.errorMessage = this.getErrorMessage(firebaseError.code);
    }
  }

  // Function to map Firebase error codes to user-friendly messages
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/user-disabled':
        return 'This user has been disabled.';
      case 'auth/user-not-found':
        return 'No user found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}
