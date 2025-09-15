import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CalendarDrawerComponent } from './components/CourseCalendar/calendar-drawer.component';
import { ThemeService } from './services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FormsModule, CalendarDrawerComponent],
  template: `
    <div class="app-shell" [class.dark-mode]="isDarkMode">
      <app-navbar></app-navbar>
      <main class="main-content">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
        <app-calendar-drawer></app-calendar-drawer>
      </main>
      
      <!-- Loading Overlay -->
      <div class="loading-overlay" *ngIf="isLoading">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-shell {
      min-height: 100vh;
      background: var(--light-bg);
      transition: background var(--transition-normal);
      position: relative;
    }

    .app-shell.dark-mode {
      background: var(--dark-bg);
    }

    .main-content {
      min-height: calc(100vh - 80px);
      padding: var(--spacing-xl);
      position: relative;
    }

    .content-wrapper {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-modal);
      backdrop-filter: blur(4px);
    }

    .loading-spinner {
      text-align: center;
      color: white;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto var(--spacing-md);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .main-content {
        padding: var(--spacing-md);
      }
    }

    @media (max-width: 480px) {
      .main-content {
        padding: var(--spacing-sm);
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  isLoading = false;
  private themeSubscription?: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  ngOnDestroy() {
    this.themeSubscription?.unsubscribe();
  }
}
