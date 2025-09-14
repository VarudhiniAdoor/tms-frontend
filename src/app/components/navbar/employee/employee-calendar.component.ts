import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarService } from '../../../services/calendar.service';
import { CourseCalendar } from '../../../models/domain.models';

@Component({
  selector: 'app-employee-coursecalendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>📅 Course Calendar</h2>
    <div *ngIf="loading">Loading...</div>
    <table *ngIf="calendars.length > 0" class="calendar-table">
      <thead>
        <tr><th>Course</th><th>Start Date</th><th>End Date</th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let c of calendars">
          <td>{{c.course?.courseName}}</td>
          <td>{{c.startDate | date}}</td>
          <td>{{c.endDate | date}}</td>
        </tr>
      </tbody>
    </table>
  `
})
export class EmployeeCourseCalendarComponent implements OnInit {
  calendars: CourseCalendar[] = [];
  loading = false;

  constructor(private calendarSvc: CalendarService) {}

  ngOnInit() {
    this.loading = true;
    this.calendarSvc.getAll().subscribe({
      next: data => { this.calendars = data; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
