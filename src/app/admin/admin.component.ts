import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUsersComponent } from './admin-users.component';
import { AdminCoursesComponent } from './admin-courses.component';
import { AdminCalendarComponent } from './admin-calendar.component';
import { AdminEnrollmentsComponent } from './admin-enrollments.component';
import { AdminFeedbackComponent } from './admin-feedback.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUsers, faBook, faCalendarAlt, faClipboardList, faChartBar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    AdminUsersComponent,
    AdminCoursesComponent,
    AdminCalendarComponent,
    AdminEnrollmentsComponent,
    AdminFeedbackComponent,
    FontAwesomeModule
  ],
  template: `
  <div class="admin-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <button (click)="tab='users'" [class.active]="tab==='users'">
  <fa-icon [icon]="faUsers"></fa-icon> Users
</button>
<button (click)="tab='courses'" [class.active]="tab==='courses'">
  <fa-icon [icon]="faBook"></fa-icon> Courses
</button>
<button (click)="tab='batches'" [class.active]="tab==='batches'">
  <fa-icon [icon]="faCalendarAlt"></fa-icon> Batches
</button>
<button (click)="tab='enrollments'" [class.active]="tab==='enrollments'">
  <fa-icon [icon]="faClipboardList"></fa-icon> Enrollments
</button>
<button (click)="tab='reports'" [class.active]="tab==='reports'">
  <fa-icon [icon]="faChartBar"></fa-icon> Reports
</button>

      </nav>
    </aside>

    <!-- Content -->
    <main class="content">
      <div [ngSwitch]="tab">
        <app-admin-users *ngSwitchCase="'users'"></app-admin-users>
        <app-admin-courses *ngSwitchCase="'courses'"></app-admin-courses>
        <app-admin-calendar *ngSwitchCase="'batches'"></app-admin-calendar>
        <app-admin-enrollments *ngSwitchCase="'enrollments'"></app-admin-enrollments>
        <app-admin-feedback *ngSwitchCase="'reports'"></app-admin-feedback>
      </div>
    </main>
  </div>
  `
})
export class AdminComponent {
  tab: 'users' | 'courses' | 'batches' | 'enrollments' | 'reports' = 'users';
  faUsers = faUsers;
  faBook = faBook;
  faCalendarAlt = faCalendarAlt;
  faClipboardList = faClipboardList;
  faChartBar = faChartBar;

  constructor(private library: FaIconLibrary) {
    library.addIcons(faUsers, faBook, faCalendarAlt, faClipboardList, faChartBar);
  }
}
