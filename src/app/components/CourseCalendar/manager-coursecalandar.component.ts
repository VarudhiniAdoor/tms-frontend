import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarService } from '../../services/calendar.service';
import { CourseCalendar } from '../../models/domain.models';
import { BatchService } from '../../services/batch.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight, faBook, faUsers, faClock, faMapPin, faCalendarAlt, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-calendar-list',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './manager-coursecalendar.component.html',
  styleUrls: ['./manager-coursecalendar.component.css']
})
export class CalendarListComponent implements OnInit {
  calendars: CourseCalendar[] = [];
  loading = false;

  currentMonth: Date = new Date();
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthDays: { date: Date; inCurrentMonth: boolean }[] = [];

  selectedDate: Date | null = null;
  selectedCourses: CourseCalendar[] = [];

  // Map date string → courses
  dateCourseMap: { [key: string]: CourseCalendar[] } = {};

  // FontAwesome Icons
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faBook = faBook;
  faUsers = faUsers;
  faClock = faClock;
  faMapPin = faMapPin;
  faCalendarAlt = faCalendarAlt;
  faGraduationCap = faGraduationCap;

  constructor(private calSvc: CalendarService, private batchSvc: BatchService) {}

  ngOnInit() {
    this.loading = true;
    this.calSvc.getAll().subscribe({
      next: data => {
        this.calendars = data;
        console.log('Loaded calendars:', this.calendars);
        this.loading = false;
        this.generateCalendar();
      },
      error: (err) => {
        console.error('Error loading calendars:', err);
        this.calendars = [];
        this.loading = false;
        this.generateCalendar();
      }
    });
  }

  generateCalendar() {
    const start = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const end = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

    const days: { date: Date; inCurrentMonth: boolean }[] = [];

    // Previous month days
    const prevDays = start.getDay();
    for (let i = prevDays; i > 0; i--) {
      const d = new Date(start);
      d.setDate(d.getDate() - i);
      days.push({ date: d, inCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= end.getDate(); i++) {
      days.push({ date: new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i), inCurrentMonth: true });
    }

    // Next month padding to complete grid
    const nextDays = 42 - days.length;
    for (let i = 1; i <= nextDays; i++) {
      const d = new Date(end);
      d.setDate(d.getDate() + i);
      days.push({ date: d, inCurrentMonth: false });
    }

    this.monthDays = days;

    // Build dateCourseMap
    this.dateCourseMap = {};
    for (const c of this.calendars) {
      const key = new Date(c.startDate).toDateString();
      if (!this.dateCourseMap[key]) this.dateCourseMap[key] = [];
      this.dateCourseMap[key].push(c);
    }
  }

  getCoursesForDate(date: Date): CourseCalendar[] {
    const courses = this.dateCourseMap[date.toDateString()] || [];
    if (courses.length > 0) {
      console.log(`Courses for ${date.toDateString()}:`, courses);
    }
    return courses;
  }

  prevMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar();
  }

  onDateSelected(date: Date) {
    this.selectedDate = date;
    this.selectedCourses = this.getCoursesForDate(date);

    this.selectedCourses.forEach(c => {
    this.batchSvc.getAll().subscribe(batches => {
      c.batches = batches.filter(b => b.calendarId === c.calendarId);
    });
  });
  }
  
}
