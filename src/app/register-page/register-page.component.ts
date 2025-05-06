import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../data types/data-types';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';

  fName: string = '';
  lName: string = '';

  private router = inject(Router);

  constructor(private authService: AuthService) {}

  onRegister() {
    const user: User = {
      email: '',
      fname: this.fName,
      lname: this.lName,
      id: '',
      units: 'lbs',
    };

    this.authService
      .register(this.email, this.password, user)
      .then(() => {
        this.router.navigate(['settings-page']);
        // Handle successful registration (e.g., navigate to login)
      })
      .catch((error) => {
        console.error('Registration error: ', error);
      });
  }
}
