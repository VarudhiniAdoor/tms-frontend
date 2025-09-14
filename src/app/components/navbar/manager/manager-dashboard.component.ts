import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchesListComponent } from './manager-batchlist.component';
import { CalendarListComponent } from '../../CourseCalendar/manager-coursecalandar.component';
import { EnrollmentComponent } from './manager-enrollment.component';
@Component({
  selector: 'app-manager-home',
  standalone: true,
  imports: [CommonModule, BatchesListComponent, CalendarListComponent, EnrollmentComponent],
template: `
    <div class="manager-dashboard">
      <!-- Sidebar -->
      <aside class="sidebar">
        <h2 class="sidebar-title">📊 Manager Dashboard</h2>
        <ul>
          <li [class.active]="tab==='enrollments'" (click)="tab='enrollments'">
  <i class="fa-solid fa-user-check"></i> Enrollments
  <span *ngIf="pendingCount>0" class="badge">{{pendingCount}}</span>
</li>
<li [class.active]="tab==='calendar'" (click)="tab='calendar'">
  <i class="fa-solid fa-calendar-days"></i> Calendar
</li>
<li [class.active]="tab==='batches'" (click)="tab='batches'">
  <i class="fa-solid fa-layer-group"></i> Batches
</li>

        </ul>
      </aside>

      <!-- Main content -->
      <main class="content">
        
        <app-enrollment *ngIf="tab==='enrollments'" (pendingChanged)="pendingCount=$event"></app-enrollment>
        <app-calendar-list *ngIf="tab==='calendar'"></app-calendar-list>
        <app-batches-list *ngIf="tab==='batches'"></app-batches-list>
      </main>
    </div>
  `
})
export class ManagerDashboardComponent {
  tab: 'batches' | 'calendar' | 'enrollments' = 'enrollments';
  pendingCount = 0;
}