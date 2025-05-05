import { Component } from '@angular/core';
import { AuthService } from '../auth.service'; 
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  onRegister() {
    this.authService.register(this.email, this.password).then(() => {
      // Handle successful registration (e.g., navigate to login)
    }).catch(error => {
      console.error("Registration error: ", error);
    });
  }
}

