import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <nav class="nav">
  <a routerLink="/" class="brand">TMS</a>
  <div class="links">
    <button class="theme-toggle" (click)="toggleTheme()">🌙/☀️</button>
    <span *ngIf="isLoggedIn" class="greeting">👋 Hello, {{ username }}</span>
    <a routerLink="/">Home</a>
    <a *ngIf="isEmployee" routerLink="/employee">Calendar</a>
    <a *ngIf="isEmployee" routerLink="/my-enrollments">My Enrollments</a>
    <a *ngIf="isManager" routerLink="/manager">Manager</a>
    <a *ngIf="isManager" routerLink="/batches">Batches</a>
    <a *ngIf="isManager" routerLink="/calendar">Calendar</a>
    <a *ngIf="isManager" routerLink="/enrollment">Enrollments</a>
    <a *ngIf="isAdmin" routerLink="/admin">Admin</a>
    <a *ngIf="!isLoggedIn" routerLink="/login">Login</a>
    <a *ngIf="isLoggedIn" (click)="logout()" class="link-button">Logout</a>
  </div>
</nav>
 `  
})
export class NavbarComponent {
  username: string | null = null;

  constructor(public auth: AuthService, private router: Router) {
    this.auth.user$.subscribe(user => {
      this.username = user?.username ?? null;
    });
  }
  get isLoggedIn() { return this.auth.isLoggedIn(); }
  get role() { return this.auth.getRole(); }
  get isEmployee() { return this.role === 'Employee'; }
  get isManager() { return this.role === 'Manager'; }
  get isAdmin() { return this.role === 'Administrator'; }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
  toggleTheme() {
  document.body.classList.toggle('dark-mode');
}
}
