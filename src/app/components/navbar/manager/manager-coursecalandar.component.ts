// manager-coursecalendar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarService } from '../../../services/calendar.service';
import { CourseCalendar } from '../../../models/domain.models';

@Component({
  selector: 'app-calendar-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">📅 Course Calendar - Manager</h2>

      
      <div *ngIf="loading" class="text-gray-500">Loading calendars...</div>

      
      <div *ngIf="!loading && calendars.length===0" class="text-gray-500">
        No calendar entries found.
      </div>

      <!-- List -->
      <div *ngIf="!loading && calendars.length>0" class="space-y-6">
        <div *ngFor="let c of calendars"
          class="bg-white border-l-4 border-blue-500 rounded-xl shadow-sm p-5 flex justify-between items-center hover:shadow-lg transition">

          <!-- Left section -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-1">
              {{c.course?.courseName || 'Unnamed Course'}}
            </h3>
            <p class="text-xs text-gray-500">Course ID: {{c.courseId}}</p>
          </div>

          <!-- Right section -->
          <div class="text-sm text-gray-700">
            <p class="flex items-center gap-2">
              <span class="font-medium text-blue-600">Start:</span>
              {{c.startDate | date:'mediumDate'}}
            </p>
            <p class="flex items-center gap-2">
              <span class="font-medium text-red-600">End:</span>
              {{c.endDate | date:'mediumDate'}}
            </p><hr>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CalendarListComponent implements OnInit {
  calendars: CourseCalendar[] = [];
  loading = false;

  constructor(private calSvc: CalendarService) {}

  ngOnInit() {
    this.loading = true;
    this.calSvc.getAll().subscribe({
      next: data => { this.calendars = data; this.loading = false; },
      error: () => { this.calendars = []; this.loading = false; }
    });
  }
}
