import { Component } from '@angular/core';
import { login, register } from '../services/firebase.service';
import { Router } from '@angular/router';
import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports:[ 
    IonicModule,
		CommonModule,
    FormsModule
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';
  isLoginMode: boolean = true;
  errorMessage: string = '';

  constructor(private router: Router) {}

  async onSubmit() {
    try {
      if (this.isLoginMode) {
        await login(this.email, this.password);
      } else {
        await register(this.email, this.password);
      }
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }
}
