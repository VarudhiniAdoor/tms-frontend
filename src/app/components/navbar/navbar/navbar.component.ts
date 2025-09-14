import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { CalendarDrawerService } from '../../../services/calendar-drawer.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <nav class="nav">
  <a routerLink="/" class="brand">TMS</a>
  <div class="links">
    <button class="theme-toggle" (click)="toggleTheme()"></button>
    <span *ngIf="isLoggedIn" class="greeting">👋 Hello, {{ username }}</span>
    
    
    <a *ngIf="!isLoggedIn" routerLink="/login">Login</a>
    <a *ngIf="isLoggedIn" (click)="openCalendar()" class="link-button">Course Calendar</a>
    <a *ngIf="isLoggedIn" (click)="logout()" class="link-button">Logout</a>
  </div>
</nav>
 `  
})
export class NavbarComponent {
  username: string | null = null;

  constructor(public auth: AuthService, private router: Router, private drawer: CalendarDrawerService) {
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
openCalendar() {
  this.drawer.open(); // triggers the drawer to open
}
}



    // <a *ngIf="isEmployee" routerLink="/employee"> Employee</a>
    // <a *ngIf="isManager" routerLink="/manager">Manager</a>
    // <a *ngIf="isAdmin" routerLink="/admin">Admin</a>