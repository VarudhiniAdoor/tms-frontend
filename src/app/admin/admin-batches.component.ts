import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BatchService } from '../services/batch.service';
import { CourseService } from '../services/course.service';
import { CalendarService } from '../services/calendar.service';
import { FeedbackService } from '../services/feedback.service';
import { Course, CourseCalendar, Batch, EnrollmentDto } from '../models/domain.models';

@Component({
  selector: 'app-admin-calendar',
  standalone: true,  
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-batches.component.html',
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
  editingBatchId: number | null = null;
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

  loadData() {
    this.courseSvc.getAll().subscribe(c => this.courses = c);
    this.calSvc.getAll().subscribe(cals => this.calendars = cals);
    this.batchSvc.getAll().subscribe(b => {
      this.batches = b;
      this.activeBatches = b.filter(x => x.isActive);
    });
    this.feedbackSvc.getAll().subscribe(f => this.feedbacks = f);
  }

  toggleCreateForm(batch?: Batch) {
    this.showCreateForm = !this.showCreateForm;

    if (batch) {
      // Edit mode
      this.editingBatchId = batch.batchId;
      this.batchForm.patchValue({
        batchName: batch.batchName,
        calendarId: batch.calendarId
      });
    } else {
      // Create mode
      this.editingBatchId = null;
      this.batchForm.reset();
    }
  }

  submitBatch() {
    if (this.batchForm.invalid) return;

    const { calendarId, batchName } = this.batchForm.value;
    const calendar = this.calendars.find(c => c.calendarId == calendarId);
    if (!calendar) return;

    // Calculate end date (skip weekends) for display
    const startDate = new Date(calendar.startDate);
    let daysLeft = calendar.course?.durationDays ?? 0;
    let current = new Date(startDate);
    while (daysLeft > 0) {
      current.setDate(current.getDate() + 1);
      if (current.getDay() !== 0 && current.getDay() !== 6) daysLeft--;
    }
    const endDate = current.toISOString().split('T')[0];

    if (this.editingBatchId) {
      // Update existing batch
      const existingBatch = this.activeBatches.find(b => b.batchId === this.editingBatchId);
      if (!existingBatch) return;

      const updatedBatch: Batch = {
        ...existingBatch,
        batchName,
        calendarId,
        calendar: calendar
      };

      this.batchSvc.update(this.editingBatchId, updatedBatch).subscribe(() => {
        alert(`Batch updated! Duration: ${calendar.startDate} - ${endDate}`);
        this.loadData();
        this.showCreateForm = false;
      });

    } else {
      // Create new batch
      const newBatch: Partial<Batch> = { batchName, calendarId };
      this.batchSvc.create(newBatch).subscribe(() => {
        alert(`Batch created! Duration: ${calendar.startDate} - ${endDate}`);
        this.loadData();
        this.showCreateForm = false;
      });
    }
  }

  deleteBatch(batchId: number) {
    if (!confirm('Delete this batch?')) return;
    this.batchSvc.delete(batchId).subscribe(() => this.loadData());
  }

  showEnrollments(batchId: number) {
    this.selectedBatchId = batchId;
    this.batchSvc.getEnrollments(batchId).subscribe(data => this.selectedEnrollments = data);
  }

 onSearch() {
  const searchTerm = this.searchId.trim().toLowerCase();
  if (!searchTerm) {
    // If search is empty, show all active batches
    this.activeBatches = this.batches.filter(b => b.isActive);
    return;
  }

  this.activeBatches = this.batches.filter(b =>
    b.batchName?.toLowerCase().includes(searchTerm)
  );
}

}
