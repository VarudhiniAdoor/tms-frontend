import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchService } from '../../../services/batch.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { CalendarService } from '../../../services/calendar.service';
import { CourseService } from '../../../services/course.service';
import { Batch, Course, CourseCalendar } from '../../../models/domain.models';
import { AuthService } from '../../../core/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>Course Calendar</h2>

    <div *ngIf="calLoading">Loading course calendar...</div>
    <table *ngIf="calendars.length > 0" class="calendar-table">
      <thead>
        <tr>
          <th>Course</th>
          <th>Start Date</th>
          <th>End Date</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let c of calendars">
          <td>{{c.course?.courseName}}</td>
          <td>{{c.startDate | date}}</td>
          <td>{{c.endDate | date}}</td>
        </tr>
      </tbody>
    </table>

  


    <div *ngIf="searchText.trim()">
      <div *ngFor="let course of filteredCourses()" class="course-card">
        <h3>{{course.courseName}}</h3>
        <p>{{course.description}}</p>
        <div *ngIf="getCourseBatches(course).length > 0">
          <h4>Batches:</h4>
          <div *ngFor="let b of getCourseBatches(course)" class="batch-card">
            <div>
              <strong>{{b.batchName}}</strong> 
              ({{b.calendar?.startDate | date}} → {{b.calendar?.endDate | date}})
            </div>
            <div>Status: <strong>{{getStatus(b.batchId)}}</strong></div>
            <button (click)="request(b.batchId)" [disabled]="getStatus(b.batchId) !== 'Not Enrolled'">
              Request Enrollment
            </button>
          </div>
        </div>
      </div>
    </div>

    <hr>

    <h2>Active Batches</h2>
    <div *ngIf="warning" class="warning">{{warning}}</div>
    <div *ngIf="loading">Loading batches...</div>
    <div *ngFor="let b of batches" class="batch-card">
      <div class="title">{{b.batchName}}</div>
      <div>Course: {{b.calendar?.course?.courseName ?? '—'}}</div>
      <div>Start: {{b.calendar?.startDate | date}} | End: {{b.calendar?.endDate | date}}</div>
      <div>Status: <strong>{{getStatus(b.batchId)}}</strong></div>
      <button (click)="request(b.batchId)" [disabled]="getStatus(b.batchId) !== 'Not Enrolled'">
        Request Enrollment
      </button>
    </div>

    <p><a routerLink="/my-enrollments">View my enrollments & feedback</a></p>
  `,
  styles: [`
    table.calendar-table {
      width:100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    table.calendar-table th, table.calendar-table td {
      border:1px solid #ddd;
      padding:8px;
      text-align:left;
    }
    .search-box { width: 60%; padding:6px; margin-bottom:12px; }
    .course-card { border:1px solid #ccc; padding:10px; margin:10px 0; border-radius:6px; }
    .batch-card { border:1px solid #eee; padding:8px; margin:6px 0; border-radius:4px; }
    .title { font-weight:700; }
    .warning { color:darkorange; }
    button { margin-top:6px; padding:6px 10px; }
  `]
})
export class EmployeeDashboardComponent implements OnInit {
  batches: Batch[] = [];
  calendars: CourseCalendar[] = [];
  courses: Course[] = [];
  loading = false;
  calLoading = false;
  statusByBatch = new Map<number, string>();
  warning?: string;
  searchText = '';

  constructor(
    private batchSvc: BatchService,
    private enrollSvc: EnrollmentService,
    private calendarSvc: CalendarService,
    private courseSvc: CourseService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadBatches();
    this.loadCalendars();
    this.loadCourses();
  }

  loadBatches() {
    this.loading = true;
    this.batchSvc.getAll().subscribe({
      next: data => {
        this.batches = data;
        this.loading = false;
        this.enrollSvc.getMyEnrollments().subscribe(list => {
          if (!list || list.length === 0) {
            this.warning = 'If you see "Not Enrolled" everywhere — please add backend endpoint GET /api/enrollments/mine.';
          }
          (list || []).forEach(e => {
            const matchingBatch = this.batches.find(b => b.batchName === e.batchName);
            if (matchingBatch) this.statusByBatch.set(matchingBatch.batchId, e.status);
          });
        });
      },
      error: err => { this.loading = false; console.error(err); }
    });
  }

  loadCalendars() {
    this.calLoading = true;
    this.calendarSvc.getAll().subscribe({
      next: data => { this.calendars = data; this.calLoading = false; },
      error: err => { this.calLoading = false; console.error(err); }
    });
  }

  loadCourses() {
    this.courseSvc.getAll().subscribe({
      next: data => this.courses = data,
      error: err => console.error(err)
    });
  }

  filteredCourses(): Course[] {
    const term = this.searchText.trim().toLowerCase();
    return this.courses.filter(c => c.courseName.toLowerCase().includes(term));
  }

  // 🔹 instead of inline flatMap, compute batches here
  getCourseBatches(course: Course): Batch[] {
    return (course.calendars || []).flatMap(cal => cal.batches || []);
  }

  getStatus(batchId: number) {
    return this.statusByBatch.get(batchId) ?? 'Not Enrolled';
  }

  request(batchId: number) {
    this.enrollSvc.requestEnrollment(batchId).subscribe({
      next: dto => {
        this.statusByBatch.set(batchId, dto.status);
        alert('Enrollment requested.');
      },
      error: err => alert('Request failed: ' + (err?.error ?? JSON.stringify(err)))
    });
  }
}
