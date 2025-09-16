import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { CalendarDrawerService } from '../../../services/calendar-drawer.service';
import { ThemeService } from '../../../services/theme.service';
import { Subscription } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faGraduationCap, faUserTie, faCalendarAlt, faCheckCircle, 
  faMoon, faSun, faSignOutAlt, faKey, faUser
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  template: `
  <nav class="nav">
    <a routerLink="/" class="brand">
      <fa-icon [icon]="faGraduationCap" class="brand-icon"></fa-icon>
      <span class="brand-text">TMS</span>
    </a>
    
    <div class="nav-center">
      <div class="nav-links" *ngIf="isLoggedIn">
      
  
        
      </div>
    </div>
    
    <div class="nav-actions">
      <button class="theme-toggle" (click)="toggleTheme()" [title]="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
        <fa-icon [icon]="isDarkMode ? faMoon : faSun" class="theme-icon"></fa-icon>
      </button>
      
      <button *ngIf="isLoggedIn" (click)="openCalendar()" class="btn btn-ghost btn-sm">
        <fa-icon [icon]="faCalendarAlt" class="btn-icon"></fa-icon>
        Calendar
      </button>
      
      <div *ngIf="isLoggedIn" class="user-menu" [title]="'Hello, ' + username + ' (' + role + ')'">
        <div class="user-info">
          <div class="user-avatar">
            <fa-icon [icon]="faUser" class="avatar-icon"></fa-icon>
          </div>
          <div class="user-details">
            <span class="greeting">Hello, {{ username }}</span>
            <span class="user-role">{{ role }}</span>
          </div>
        </div>
        <button (click)="logout()" class="btn btn-outline btn-sm logout-btn">
          <fa-icon [icon]="faSignOutAlt" class="btn-icon"></fa-icon>
          Logout
        </button>
      </div>
      
      <a *ngIf="!isLoggedIn" routerLink="/login" class="btn btn-primary">
        <fa-icon [icon]="faKey" class="btn-icon"></fa-icon>
        Login
      </a>
    </div>
  </nav>
  `,
})
export class NavbarComponent implements OnInit, OnDestroy {
  username: string | null = null;
  isDarkMode = false;
  private themeSubscription?: Subscription;

  // FontAwesome Icons
  faGraduationCap = faGraduationCap;
  faUserTie = faUserTie;
  faCalendarAlt = faCalendarAlt;
  faCheckCircle = faCheckCircle;
  faMoon = faMoon;
  faSun = faSun;
  faSignOutAlt = faSignOutAlt;
  faKey = faKey;
  faUser = faUser;

  constructor(
    public auth: AuthService, 
    private router: Router, 
    private drawer: CalendarDrawerService,
    private themeService: ThemeService
  ) {
    this.auth.user$.subscribe(user => {
      this.username = user?.username ?? null;
    });
  }

  ngOnInit() {
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  ngOnDestroy() {
    this.themeSubscription?.unsubscribe();
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
    this.themeService.toggleTheme();
  }

  openCalendar() {
    this.drawer.open();
  }
}



    // <a *ngIf="isEmployee" routerLink="/employee"> Employee</a>
    // <a *ngIf="isManager" routerLink="/manager">Manager</a>
    // <a *ngIf="isAdmin" routerLink="/admin">Admin</a>