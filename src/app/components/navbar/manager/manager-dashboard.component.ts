import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchesListComponent } from './manager-batchlist.component';
import { CalendarListComponent } from './manager-coursecalandar.component';
import { EnrollmentComponent } from './manager-enrollment.component';

@Component({
  selector: 'app-manager-home',
  standalone: true,
  imports: [CommonModule, BatchesListComponent, CalendarListComponent, EnrollmentComponent],
  template: `
    <h1>Manager Dashboard</h1>

    <div class="content">
      <app-batches-list *ngIf="tab==='batches'"></app-batches-list>
      <app-calendar-list *ngIf="tab==='calendar'"></app-calendar-list>
      <app-enrollment *ngIf="tab==='enrollments'"></app-enrollment>
   
  `
})
export class ManagerDashboardComponent {
  tab: 'batches' | 'calendar' | 'enrollments' = 'batches';
}