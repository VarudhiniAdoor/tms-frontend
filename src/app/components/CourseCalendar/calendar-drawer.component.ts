import { Component } from '@angular/core';
import { CalendarDrawerService } from '../../services/calendar-drawer.service';
import { CalendarListComponent } from './manager-coursecalandar.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendarAlt, faTimes, faChevronLeft, faChevronRight, faBook, faUsers, faClock, faMapPin } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-calendar-drawer',
  standalone: true,
  imports: [CalendarListComponent, CommonModule, FontAwesomeModule],
  template: `
    <!-- Backdrop -->
    <div class="drawer-backdrop" *ngIf="isOpen" (click)="close()"></div>

    <!-- Drawer -->
    <div class="drawer" [class.open]="isOpen">
      <!-- Drawer Header -->
      <div class="drawer-header">
        <div class="drawer-title">
          <fa-icon [icon]="faCalendarAlt" class="title-icon"></fa-icon>
          <h3>Course Calendar</h3>
        </div>
        <button class="close-btn" (click)="close()">
          <fa-icon [icon]="faTimes"></fa-icon>
        </button>
      </div>

      <!-- Calendar Content -->
      <div class="drawer-content">
        <app-calendar-list></app-calendar-list>
      </div>
    </div>
  `,
  styleUrls: ['./calendar-drawer.component.css']
})
export class CalendarDrawerComponent {
  isOpen = false;

  // FontAwesome Icons
  faCalendarAlt = faCalendarAlt;
  faTimes = faTimes;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faBook = faBook;
  faUsers = faUsers;
  faClock = faClock;
  faMapPin = faMapPin;

  constructor(private drawer: CalendarDrawerService) {
    this.drawer.open$.subscribe(v => this.isOpen = v);
  }

  close() {
    this.drawer.close();
  }
}
