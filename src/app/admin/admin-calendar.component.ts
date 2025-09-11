import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BatchService } from '../services/batch.service';
import { CourseService } from '../services/course.service';
import { CalendarService } from '../services/calendar.service';
import { FeedbackService } from '../services/feedback.service';
import { Course, CourseCalendar, Batch, EnrollmentDto  } from '../models/domain.models';

@Component({
  selector: 'app-admin-calendar',
    standalone: true,  
  imports: [        
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],

  templateUrl: './admin-calendar.component.html',
  styles: [`
    .panel { border:1px solid #eee; padding:12px; margin-bottom:14px; }
table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
th { background: #f4f4f4; }
button { margin: 2px; }
`]
})
export class AdminCalendarComponent implements OnInit {
  courses: Course[] = [];
  calendars: CourseCalendar[] = [];
  batches: Batch[] = [];
  activeBatches: Batch[] = [];
  selectedEnrollments: EnrollmentDto[] = [];
  selectedBatchId: number | null = null;
  feedbacks: any[] = [];

  searchId = '';
  showCreateForm = false;
  batchForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private batchSvc: BatchService,
    private courseSvc: CourseService,
    private calSvc: CalendarService,
    private feedbackSvc: FeedbackService
  ) {}

  ngOnInit(): void {
    this.batchForm = this.fb.group({
      calendarId: ['', Validators.required],
      batchName: ['', Validators.required]
    });

    this.loadData();
  }

  // Load courses, calendars, batches, feedbacks
  loadData() {
    this.courseSvc.getAll().subscribe(c => this.courses = c);
    this.calSvc.getAll().subscribe(cals => this.calendars = cals);
    this.batchSvc.getAll().subscribe(b => {
      this.batches = b;
      this.activeBatches = b.filter(x => x.isActive);
    });
    this.feedbackSvc.getAll().subscribe(f => this.feedbacks = f);
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
  }

  // Create new batch
  submitBatch() {
    if (this.batchForm.invalid) return;

    const { calendarId, batchName } = this.batchForm.value;
    const calendar = this.calendars.find(c => c.calendarId == calendarId);
    if (!calendar) return;

    // Auto-calculate end date based on duration (excluding weekends)
    const startDate = new Date(calendar.startDate);
    let daysLeft = calendar.course?.durationDays ?? 0;
    let current = new Date(startDate);
    while (daysLeft > 0) {
      current.setDate(current.getDate() + 1);
      if (current.getDay() !== 0 && current.getDay() !== 6) daysLeft--; // skip weekends
    }
    const endDate = current.toISOString().split('T')[0];

    this.batchSvc.create({ batchName, calendarId }).subscribe(() => {
      alert(`Batch created! Duration: ${calendar.startDate} - ${endDate}`);
      this.loadData();
      this.batchForm.reset();
      this.showCreateForm = false;
    });
  }

  // Delete batch
  deleteBatch(batchId: number) {
    if (!confirm('Delete this batch?')) return;
    this.batchSvc.delete(batchId).subscribe(() => this.loadData());
  }

  // Show enrollments for selected batch
  showEnrollments(batchId: number) {
    this.selectedBatchId = batchId;
    this.batchSvc.getEnrollments(batchId).subscribe(data => this.selectedEnrollments = data);
  }

  // Search batch by ID
  onSearch() {
    const id = Number(this.searchId);
    if (!id) return;
    this.batchSvc.get(id).subscribe(batch => this.activeBatches = batch ? [batch] : []);
  }

  // Search feedback for a batch
  searchFeedbackByBatch(batchId: number) {
    this.feedbackSvc.getForBatch(batchId).subscribe(data => this.feedbacks = data);
  }
}
