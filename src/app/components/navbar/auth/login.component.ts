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
      <!-- Left side illustration with GIF -->
      <div class="login-image">
        <div class="gif-background">
          <img src="assets/img4_light.gif" alt="TMS Animation" class="background-gif" id="lightGif">
          <img src="assets/img4_dark.gif" alt="TMS Animation" class="background-gif" id="darkGif" style="display: none;">
        </div>
        <div class="login-hero">
          <div class="tms-logo">
            <img src="assets/logo.svg" alt="TMS Logo" class="logo-image">
            <h1 class="logo-text">TMS</h1>
          </div>
          <h2 class="hero-title">Training Management System</h2>
          <p class="hero-description">
            Streamline your organization's training programs. Manage courses, track progress, and empower your team's professional development.
          </p>
        </div>
      </div>

      <!-- Right side login form -->
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <div class="login-logo">
              <img src="assets/logo.svg" alt="TMS Logo" class="login-logo-image">
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
              <div *ngIf="form.get('username')?.invalid && form.get('username')?.touched" class="error-message">
                Username is required
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input 
                id="password"
                formControlName="password" 
                type="password"
                placeholder="Enter your password"
                class="form-input"
                [class.error]="form.get('password')?.invalid && form.get('password')?.touched">
              <div *ngIf="form.get('password')?.invalid && form.get('password')?.touched" class="error-message">
                Password is required
              </div>
            </div>
            
            <button 
              type="submit" 
              class="login-button"
              [disabled]="form.invalid">
              Sign In
            </button>
            
            <div *ngIf="error" class="error-message">
              {{ error }}
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: flex;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .login-image {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
    }

    .gif-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }

    .background-gif {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.3;
    }

    .login-hero {
      text-align: center;
      color: white;
      max-width: 500px;
      position: relative;
      z-index: 2;
    }

    .tms-logo {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
      justify-content: center;
    }

    .logo-image {
      width: 64px;
      height: 64px;
      object-fit: contain;
    }

    .logo-text {
      font-size: 2.5rem;
      font-weight: 800;
      color: white;
      margin: 0;
    }

    .hero-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 24px 0;
      background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-description {
      font-size: 1.125rem;
      line-height: 1.6;
      margin: 0;
      opacity: 0.9;
    }

    .login-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .login-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      justify-content: center;
    }

    .login-logo-image {
      width: 48px;
      height: 48px;
      object-fit: contain;
    }

    .login-logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    .login-header h2 {
      font-size: 1.875rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 8px 0;
    }

    .login-subtitle {
      color: #6b7280;
      margin: 0;
      font-size: 1rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .form-input {
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: #f9fafb;
    }

    .form-input:focus {
      outline: none;
      border-color: #6366f1;
      background: white;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
      background: #fef2f2;
    }

    .login-button {
      padding: 12px 24px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      margin-top: 8px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 3px 10px rgba(99, 102, 241, 0.2);
      min-width: 100px;
      height: 40px;
    }

    .login-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    .login-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
      background: linear-gradient(135deg, #5b5bf6 0%, #7c3aed 100%);
    }

    .login-button:hover:not(:disabled)::before {
      left: 100%;
    }

    .login-button:active:not(:disabled) {
      transform: translateY(0px);
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
    }

    .login-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      font-weight: 500;
    }

    /* Dark mode support */
    body.dark-mode .login-wrapper {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }

    body.dark-mode .login-image {
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 100%);
    }

    body.dark-mode .login-container {
      background: rgba(26, 26, 36, 0.95);
    }

    body.dark-mode .login-card {
      background: #1a1a2e;
      border-color: rgba(255, 255, 255, 0.1);
    }

    body.dark-mode .login-logo-text,
    body.dark-mode .login-header h2 {
      color: #f9fafb;
    }

    body.dark-mode .login-subtitle {
      color: #9ca3af;
    }

    body.dark-mode .form-label {
      color: #d1d5db;
    }

    body.dark-mode .form-input {
      background: #374151;
      border-color: #4b5563;
      color: #f9fafb;
    }

    body.dark-mode .form-input:focus {
      background: #4b5563;
      border-color: #6366f1;
    }

    body.dark-mode .login-button {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      box-shadow: 0 3px 10px rgba(99, 102, 241, 0.3);
    }

    body.dark-mode .login-button:hover:not(:disabled) {
      background: linear-gradient(135deg, #5b5bf6 0%, #7c3aed 100%);
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
    }

    /* Show appropriate GIF based on theme */
    body.dark-mode #lightGif {
      display: none !important;
    }

    body.dark-mode #darkGif {
      display: block !important;
    }

    @media (max-width: 768px) {
      .login-wrapper {
        flex-direction: column;
      }
      
      .login-image {
        padding: 40px 20px;
      }
      
      .login-container {
        padding: 40px 20px;
      }
      
      .hero-title {
        font-size: 2rem;
      }
      
      .logo-text {
        font-size: 2rem;
      }
    }
  `]
})
export class LoginComponent {
  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  error?: string;
  
  constructor(private auth: AuthService, private router: Router) {}

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