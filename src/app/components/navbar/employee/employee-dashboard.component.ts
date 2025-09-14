import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { EmployeeCourseCalendarComponent } from './employee-coursecalendar.component';
import { EmployeeBatchesComponent } from './employee-batches.component';
import { MyEnrollmentsComponent } from './my-enrollments.component';
import { CalendarListComponent } from '../../CourseCalendar/manager-coursecalandar.component';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, EmployeeBatchesComponent, MyEnrollmentsComponent,CalendarListComponent],
  template: `
    <div class="employee-dashboard">
      <!-- Sidebar -->
      <aside class="sidebar">
        <h2 class="sidebar-title">👤 Employee Dashboard</h2>
        <ul>
          <li [class.active]="tab==='calendar'" (click)="tab='calendar'">
            <i class="fa-solid fa-calendar-days"></i> Course Calendar
          </li>
          <li [class.active]="tab==='batches'" (click)="tab='batches'">
            <i class="fa-solid fa-users"></i> Active Batches
          </li>
          <li [class.active]="tab==='enrollments'" (click)="tab='enrollments'">
            <i class="fa-solid fa-book"></i> My Enrollments
          </li>
        </ul>
      </aside>

      <!-- Main content -->
      <main class="content">

        <app-calendar-list *ngIf="tab==='calendar'"></app-calendar-list>
        <app-employee-batches *ngIf="tab==='batches'"></app-employee-batches>
        <app-my-enrollments *ngIf="tab==='enrollments'"></app-my-enrollments>
      </main>
    </div>
  `,
  styleUrls: ['./employee.style.css']
})
export class EmployeeDashboardComponent {
  tab: 'calendar' | 'batches' | 'enrollments' = 'calendar';
}
