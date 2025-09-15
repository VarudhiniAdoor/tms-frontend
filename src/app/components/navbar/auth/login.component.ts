import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="login-wrapper">
      <!-- Left side illustration -->
      <div class="login-image">
        <div class="login-hero">
          <div class="tms-logo">
            <span class="logo-icon">🎓</span>
            <h1 class="logo-text">TMS</h1>
          </div>
          <h2 class="hero-title">Training Management System</h2>
          <p class="hero-description">
            Streamline your organization's training programs. Manage courses, track progress, and empower your team's professional development.
          </p>
        </div>
        <img src="./assets/img4_light.gif" alt="TMS Login" class="hero-image">
      </div>

      <!-- Right side login form -->
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <div class="login-logo">
              <span class="login-logo-icon">🎓</span>
              <span class="login-logo-text">TMS</span>
            </div>
            <h2>Welcome Back</h2>
            <p class="login-subtitle">Sign in to access your training dashboard</p>
          </div>
          
          <form [formGroup]="form" (ngSubmit)="submit()" class="login-form">
            <div class="form-group">
              <label for="username" class="form-label">Username</label>
              <input 
                id="username"
                formControlName="username" 
                placeholder="Enter your username"
                class="form-input"
                [class.error]="form.get('username')?.invalid && form.get('username')?.touched">
            </div>
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input 
                id="password"
                formControlName="password" 
                placeholder="Enter your password" 
                type="password"
                class="form-input"
                [class.error]="form.get('password')?.invalid && form.get('password')?.touched">
            </div>
            
            <button type="submit" [disabled]="form.invalid" class="login-btn">
              <span class="btn-icon">🔑</span>
              <span>Sign In</span>
            </button>
            
            <div *ngIf="error" class="error-message">
              <span class="error-icon">⚠️</span>
              {{error}}
            </div>
          </form>
          
          <div class="login-footer">
            <p class="footer-text">Access your personalized training experience</p>
            <div class="role-info">
              <small>Available roles: Administrator, Manager, Employee</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  error?: string;
  isDarkMode = false;
  
  constructor(private auth: AuthService, private router: Router) {this.isDarkMode = document.body.classList.contains('dark-mode');}

  submit() {
    this.error = undefined;
    const val = this.form.value;
    this.auth.login({ username: val.username!, password: val.password! }).subscribe({
      next: () => {
        const role = this.auth.getRole();
        if (role === 'Administrator') this.router.navigate(['/admin']);
        else if (role === 'Manager') this.router.navigate(['/manager']);
        else this.router.navigate(['/employee']);
      },
      error: err => this.error = err?.error ?? 'Login failed'
    });
  }
}


// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../core/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   template: `
//     <h2>Login</h2>
//     <form [formGroup]="form" (ngSubmit)="submit()">
//       <div><input formControlName="username" placeholder="Username"></div>
//       <div><input formControlName="password" placeholder="Password" type="password"></div>
//       <div><button [disabled]="form.invalid">Login</button></div>
//       <div *ngIf="error" class="error">{{error}}</div>
//     </form>
//   `,
//   styles: [`.error { color: red; margin-top:8px; } input { display:block; margin:6px 0; padding:8px; width: 280px; }`]
// })
// export class LoginComponent {
//   form = new FormGroup({
//     username: new FormControl('', Validators.required),
//     password: new FormControl('', Validators.required)
//   });
//   error?: string;

//   constructor(private auth: AuthService, private router: Router) {}

//   submit() {
//     this.error = undefined;
//     const val = this.form.value;
//     this.auth.login({ username: val.username!, password: val.password! }).subscribe({
//       next: () => {
//         const role = this.auth.getRole();
//         if (role === 'Administrator') this.router.navigate(['/admin']);
//         else if (role === 'Manager') this.router.navigate(['/manager']);
//         else this.router.navigate(['/employee']);
//       },
//       error: err => this.error = err?.error ?? 'Login failed'
//     });
//   }
// }
