import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CalendarDrawerComponent } from './components/CourseCalendar/calendar-drawer.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FormsModule,CalendarDrawerComponent],
  template: `
    <div class="app-shell">
      <app-navbar></app-navbar>
      <main class="container">
        <router-outlet></router-outlet>
        <app-calendar-drawer></app-calendar-drawer>
      </main>
    </div>
  `,
  styles: [`
    .app-shell { font-family: Arial, Helvetica, sans-serif; }
    .container { padding: 16px; max-width: 1100px; margin: 0 auto; }
  `]
})
export class AppComponent {}
