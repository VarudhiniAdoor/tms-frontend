import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { BatchService } from '../services/batch.service';
import { CourseService } from '../services/course.service';
import { CalendarService } from '../services/calendar.service';
import { FeedbackService } from '../services/feedback.service';
import { Course, CourseCalendar, Batch, EnrollmentDto } from '../models/domain.models';
import { 
  faPlus, faTimes, faSearch, faEdit, faTrash, faCalendarAlt, 
  faUsers, faClock, faBook, faEye, faCheck, faTimes as faX
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-calendar',
  standalone: true,  
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, PaginationComponent],
  template: `
  <div class="admin-section">
    <!-- Section Header -->
    <div class="section-header">
      <div class="header-content">
        <h2>Batch Management</h2>
        <p>Schedule and manage training batches for your courses</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" (click)="toggleCreateForm()" *ngIf="!showCreateForm">
          <fa-icon [icon]="faPlus"></fa-icon>
          Create Batch
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="search-section">
      <div class="search-container">
        <fa-icon [icon]="faSearch" class="search-icon"></fa-icon>
        <input 
          [(ngModel)]="searchId" 
          placeholder="Search batches by name or ID..." 
          class="search-input"
          (input)="onSearch()">
      </div>
      <div class="filter-stats">
        <span class="stat">{{ getActiveBatchesCount() }} active batches</span>
        <span class="stat">{{ batches.length }} total batches</span>
        <button 
          class="btn btn-sm btn-outline" 
          (click)="toggleInactiveBatches()"
          [class.active]="showInactiveBatches">
          {{ showInactiveBatches ? 'Hide' : 'Show' }} Inactive
        </button>
      </div>
    </div>

    <!-- Create/Edit Batch Form -->
    <div class="form-card" *ngIf="showCreateForm">
      <div class="form-header">
        <h3>{{ editingBatchId ? 'Edit Batch' : 'Create New Batch' }}</h3>
        <button class="btn btn-ghost btn-sm" (click)="toggleCreateForm()">
          <fa-icon [icon]="faTimes"></fa-icon>
        </button>
      </div>
      
      <form [formGroup]="batchForm" (ngSubmit)="submitBatch()" class="batch-form">
        <div class="form-grid">
          <div class="form-group calendar-group">
            <label for="calendarId" class="form-label">Course Calendar *</label>
            <div class="calendar-select-container">
              <select 
                id="calendarId"
                formControlName="calendarId"
                class="form-select">
                <option value="">-- Select Course Calendar --</option>
                <option *ngFor="let c of calendars" [value]="c.calendarId">
                  {{ c.course?.courseName }} ({{ c.startDate | date:'short' }} - {{ c.endDate | date:'short' }})
                </option>
              </select>
              <button type="button" class="btn btn-outline btn-sm" (click)="showCreateCalendar = !showCreateCalendar">
                <fa-icon [icon]="faPlus"></fa-icon>
                Create Calendar
              </button>
            </div>
            <!-- Selected Calendar Info -->
            <div class="selected-calendar-info" *ngIf="batchForm.get('calendarId')?.value">
              <div class="calendar-preview">
                <fa-icon [icon]="faCalendarAlt"></fa-icon>
                <span>{{ getSelectedCalendarInfo() }}</span>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="batchName" class="form-label">Batch Name *</label>
            <input 
              id="batchName"
              formControlName="batchName" 
              placeholder="Enter batch name"
              class="form-input"
              [class.error]="batchForm.get('batchName')?.invalid && batchForm.get('batchName')?.touched">
          </div>
        </div>

        <!-- Create Calendar Form -->
        <div class="calendar-creation-form" *ngIf="showCreateCalendar">
          <div class="form-divider">
            <span>Create New Calendar</span>
          </div>
          
          
          <form [formGroup]="calendarForm">
            <div class="form-grid">
              <div class="form-group">
                <label for="courseId" class="form-label">Course *</label>
                <select 
                  id="courseId"
                  formControlName="courseId"
                  class="form-select">
                  <option value="">-- Select Course --</option>
                  <option *ngFor="let course of courses" [value]="course.courseId">
                    {{ course.courseName }} ({{ course.durationDays }} days)
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="startDate" class="form-label">Start Date *</label>
                <input 
                  id="startDate"
                  type="date"
                  formControlName="startDate"
                  class="form-input">
              </div>
              
              <div class="form-group">
                <label for="endDate" class="form-label">End Date *</label>
                <input 
                  id="endDate"
                  type="date"
                  formControlName="endDate"
                  class="form-input">
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-outline" (click)="cancelCreateCalendar()">
                Cancel
              </button>
              <button type="button" class="btn btn-primary" (click)="createCalendar()">
                Create Calendar
              </button>
            </div>
          </form>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn btn-outline" (click)="toggleCreateForm()">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" [disabled]="batchForm.invalid">
            {{ editingBatchId ? 'Update Batch' : 'Create Batch' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Batches Table -->
    <div class="table-card">
      <div class="table-header">
        <div class="table-stats">
          <span class="stat">{{ activeBatches.length }} Active</span>
        </div>
      </div>
      
      <div class="table-container">
        <table class="data-table" *ngIf="paginatedBatches.length > 0">
          <thead>
            <tr>
              <th>Batch Name</th>
              <th>Course</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let batch of paginatedBatches" class="data-row" [class.inactive-batch]="!batch.isActive">
              <td class="batch-name-cell">
                <div class="batch-info">
                  <div class="batch-icon">
                    <fa-icon [icon]="faCalendarAlt"></fa-icon>
                  </div>
                  <div>
                    <div class="batch-title">{{ batch.batchName }}</div>
                    <div class="batch-id">ID: {{ batch.batchId }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="course-info">
                  <div class="course-name">{{ batch.calendar?.course?.courseName }}</div>
                  <div class="course-duration">{{ batch.calendar?.course?.durationDays }} days</div>
                </div>
              </td>
              <td>
                <div class="date-info">
                  <div class="date">{{ batch.calendar?.startDate | date:'MMM dd, yyyy' }}</div>
                  <div class="time">{{ batch.calendar?.startDate | date:'shortTime' }}</div>
                </div>
              </td>
              <td>
                <div class="date-info">
                  <div class="date">{{ batch.calendar?.endDate | date:'MMM dd, yyyy' }}</div>
                  <div class="time">{{ batch.calendar?.endDate | date:'shortTime' }}</div>
                </div>
              </td>
              <td>
                <div class="duration-info">
                  <span class="duration-badge">{{ getDurationDays(batch) }} days</span>
                </div>
              </td>
              <td class="actions-cell">
                <button class="btn btn-sm btn-ghost" (click)="toggleCreateForm(batch)">
                  <fa-icon [icon]="faEdit"></fa-icon>
                  Edit
                </button>
                <button class="btn btn-sm btn-outline btn-danger" (click)="deleteBatch(batch.batchId)">
                  <fa-icon [icon]="faTrash"></fa-icon>
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <app-pagination
          *ngIf="activeBatches.length > 0"
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="totalItems"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)">
        </app-pagination>
        
        <!-- Empty State -->
        <div class="empty-state" *ngIf="activeBatches.length === 0">
          <div class="empty-icon">
            <fa-icon [icon]="faCalendarAlt"></fa-icon>
          </div>
          <h3>No active batches</h3>
          <p>Create your first batch to get started</p>
          <button class="btn btn-primary" (click)="toggleCreateForm()">
            <fa-icon [icon]="faPlus"></fa-icon>
            Create Batch
          </button>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .admin-section {
      padding: 24px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(156, 39, 176, 0.03) 30%, rgba(243, 229, 245, 0.6) 60%, rgba(248, 250, 252, 0.8) 100%);
      min-height: 100vh;
      transition: background var(--transition-normal);
      position: relative;
    }
    .admin-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(156, 39, 176, 0.05) 0%, transparent 60%),
        radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
    }
    body.dark-mode .admin-section {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(45, 27, 105, 0.4) 30%, rgba(17, 17, 24, 0.9) 100%);
    }
    body.dark-mode .admin-section::before {
      background: 
        radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(156, 39, 176, 0.08) 0%, transparent 60%),
        radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--light-border);
    }
    body.dark-mode .section-header {
      border-bottom-color: var(--dark-border);
    }

    .header-content h2 {
      margin: 0 0 8px 0;
      color: var(--light-text);
      font-size: 1.75rem;
      font-weight: 600;
    }
    body.dark-mode .header-content h2 {
      color: var(--dark-text);
    }

    .header-content p {
      margin: 0;
      color: var(--light-text-secondary);
      font-size: 0.95rem;
    }
    body.dark-mode .header-content p {
      color: var(--dark-text-secondary);
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .search-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      gap: 16px;
    }

    .search-container {
      position: relative;
      flex: 1;
      max-width: 400px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--light-text-secondary);
      font-size: 1rem;
    }
    body.dark-mode .search-icon {
      color: var(--dark-text-secondary);
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 40px;
      border: 1px solid var(--light-border);
      border-radius: 8px;
      background: var(--light-surface);
      color: var(--light-text);
      font-size: 0.95rem;
      transition: all var(--transition-fast);
    }
    body.dark-mode .search-input {
      background: var(--dark-surface);
      border-color: var(--dark-border);
      color: var(--dark-text);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .filter-stats {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .filter-stats .btn {
      margin-left: 8px;
    }

    .filter-stats .btn.active {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .stat {
      padding: 4px 12px;
      background: var(--primary);
      color: white;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .form-card {
      background: var(--light-card);
      border: 1px solid var(--light-border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-normal);
    }
    body.dark-mode .form-card {
      background: var(--dark-card);
      border-color: var(--dark-border);
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--light-border);
    }
    body.dark-mode .form-header {
      border-bottom-color: var(--dark-border);
    }

    .form-header h3 {
      margin: 0;
      color: var(--light-text);
      font-size: 1.25rem;
      font-weight: 600;
    }
    body.dark-mode .form-header h3 {
      color: var(--dark-text);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .form-group.calendar-group {
      grid-column: 1 / -1;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-weight: 500;
      color: var(--light-text);
      font-size: 0.9rem;
    }
    body.dark-mode .form-label {
      color: var(--dark-text);
    }

    .form-input, .form-select {
      padding: 12px 16px;
      border: 1px solid var(--light-border);
      border-radius: 8px;
      background: var(--light-surface);
      color: var(--light-text);
      font-size: 0.95rem;
      transition: all var(--transition-fast);
    }
    body.dark-mode .form-input, body.dark-mode .form-select {
      background: var(--dark-surface);
      border-color: var(--dark-border);
      color: var(--dark-text);
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 16px;
      border-top: 1px solid var(--light-border);
    }
    body.dark-mode .form-actions {
      border-top-color: var(--dark-border);
    }

    .calendar-select-container {
      display: flex;
      gap: 12px;
      align-items: flex-end;
    }

    .calendar-select-container .form-select {
      flex: 1;
    }

    .calendar-select-container .btn {
      white-space: nowrap;
      min-width: 140px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .selected-calendar-info {
      margin-top: 8px;
    }

    .calendar-preview {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: #dbeafe;
      border: 1px solid #93c5fd;
      border-radius: 6px;
      font-size: 0.9rem;
      color: #1e40af;
    }
    body.dark-mode .calendar-preview {
      background: #1e3a8a;
      border-color: #3b82f6;
      color: #dbeafe;
    }

    .calendar-creation-form {
      margin-top: 24px;
      padding: 20px;
      background: var(--light-surface);
      border-radius: 8px;
      border: 1px solid var(--light-border);
    }
    body.dark-mode .calendar-creation-form {
      background: var(--dark-surface);
      border-color: var(--dark-border);
    }

    .form-divider {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      font-weight: 600;
      color: var(--light-text);
      font-size: 0.9rem;
    }
    body.dark-mode .form-divider {
      color: var(--dark-text);
    }

    .form-divider::before {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--light-border);
      margin-right: 12px;
    }
    body.dark-mode .form-divider::before {
      background: var(--dark-border);
    }

    .table-card {
      background: var(--light-card);
      border: 1px solid var(--light-border);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-normal);
    }
    body.dark-mode .table-card {
      background: var(--dark-card);
      border-color: var(--dark-border);
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: var(--light-surface);
      border-bottom: 1px solid var(--light-border);
    }
    body.dark-mode .table-header {
      background: var(--dark-surface);
      border-bottom-color: var(--dark-border);
    }

    .table-header h3 {
      margin: 0;
      color: var(--light-text);
      font-size: 1.1rem;
      font-weight: 600;
    }
    body.dark-mode .table-header h3 {
      color: var(--dark-text);
    }

    .table-stats {
      display: flex;
      gap: 16px;
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      background: var(--light-surface);
      color: var(--light-text-secondary);
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 16px 20px;
      text-align: left;
      border-bottom: 1px solid var(--light-border);
    }
    body.dark-mode .data-table th {
      background: var(--dark-surface);
      color: var(--dark-text-secondary);
      border-bottom-color: var(--dark-border);
    }

    .data-row {
      border-bottom: 1px solid var(--light-border);
      transition: background var(--transition-fast);
    }
    body.dark-mode .data-row {
      border-bottom-color: var(--dark-border);
    }

    .data-row:hover {
      background: var(--light-card-hover);
    }
    body.dark-mode .data-row:hover {
      background: var(--dark-card-hover);
    }

    .inactive-batch {
      opacity: 0.6;
      background: rgba(156, 163, 175, 0.1);
    }
    body.dark-mode .inactive-batch {
      background: rgba(75, 85, 99, 0.2);
    }

    .inactive-batch .batch-name {
      text-decoration: line-through;
      color: #6b7280;
    }
    body.dark-mode .inactive-batch .batch-name {
      color: #9ca3af;
    }

    .data-row td {
      padding: 16px 20px;
      color: var(--light-text);
      font-size: 0.9rem;
    }
    body.dark-mode .data-row td {
      color: var(--dark-text);
    }

    .batch-name-cell {
      min-width: 200px;
    }

    .batch-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .batch-icon {
      width: 32px;
      height: 32px;
      background: var(--primary);
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .batch-title {
      font-weight: 600;
      color: var(--light-text);
      margin-bottom: 2px;
    }
    body.dark-mode .batch-title {
      color: var(--dark-text);
    }

    .batch-id {
      font-size: 0.8rem;
      color: var(--light-text-secondary);
      font-family: 'Courier New', monospace;
    }
    body.dark-mode .batch-id {
      color: var(--dark-text-secondary);
    }

    .course-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .course-name {
      font-weight: 500;
      color: var(--light-text);
    }
    body.dark-mode .course-name {
      color: var(--dark-text);
    }

    .course-duration {
      font-size: 0.8rem;
      color: var(--light-text-secondary);
    }
    body.dark-mode .course-duration {
      color: var(--dark-text-secondary);
    }

    .date-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .date {
      font-weight: 500;
      color: var(--light-text);
    }
    body.dark-mode .date {
      color: var(--dark-text);
    }

    .time {
      font-size: 0.8rem;
      color: var(--light-text-secondary);
    }
    body.dark-mode .time {
      color: var(--dark-text-secondary);
    }

    .duration-info {
      display: flex;
      align-items: center;
    }

    .duration-badge {
      padding: 4px 8px;
      background: #dbeafe;
      color: #1e40af;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    body.dark-mode .duration-badge {
      background: #1e3a8a;
      color: #dbeafe;
    }

    .actions-cell {
      white-space: nowrap;
    }

    .actions-cell .btn {
      margin-right: 8px;
    }

    .btn-danger {
      color: #dc2626;
      border-color: #dc2626;
    }

    .btn-danger:hover {
      background: #dc2626;
      color: white;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 16px;
      opacity: 0.6;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      color: var(--light-text);
      font-size: 1.25rem;
      font-weight: 600;
    }
    body.dark-mode .empty-state h3 {
      color: var(--dark-text);
    }

    .empty-state p {
      margin: 0 0 20px 0;
      color: var(--light-text-secondary);
      font-size: 0.95rem;
    }
    body.dark-mode .empty-state p {
      color: var(--dark-text-secondary);
    }

    @media (max-width: 768px) {
      .admin-section {
        padding: 16px;
      }
      
      .section-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
      
      .search-section {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-container {
        max-width: none;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .table-container {
        font-size: 0.85rem;
      }
      
      .data-table th,
      .data-table td {
        padding: 12px 16px;
      }
    }
  `]
})
export class AdminCalendarComponent implements OnInit {
  courses: Course[] = [];
  calendars: CourseCalendar[] = [];
  batches: Batch[] = [];
  activeBatches: Batch[] = [];
  paginatedBatches: Batch[] = [];
  selectedEnrollments: EnrollmentDto[] = [];
  selectedBatchId: number | null = null;
  feedbacks: any[] = [];

  // Pagination properties
  currentPage = 1;
  pageSize = 6;
  totalItems = 0;

  // Filter properties
  showInactiveBatches = false;

  // FontAwesome Icons
  faPlus = faPlus;
  faTimes = faTimes;
  faSearch = faSearch;
  faEdit = faEdit;
  faTrash = faTrash;
  faCalendarAlt = faCalendarAlt;
  faUsers = faUsers;
  faClock = faClock;
  faBook = faBook;
  faEye = faEye;
  faCheck = faCheck;
  faX = faX;

  searchId = '';
  showCreateForm = false;
  showCreateCalendar = false;
  editingBatchId: number | null = null;
  batchForm!: FormGroup;
  calendarForm!: FormGroup;

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

    this.calendarForm = this.fb.group({
      courseId: [null, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    this.loadData();
  }

  loadData() {
    this.courseSvc.getAll().subscribe(c => this.courses = c);
    this.calSvc.getAll().subscribe(cals => this.calendars = cals);
    this.batchSvc.getAll().subscribe(b => {
      this.batches = b;
      // Automatically deactivate batches that have ended
      this.batches = this.batches.map(batch => {
        if (batch.calendar?.endDate) {
          const endDate = new Date(batch.calendar.endDate);
          const today = new Date();
          // If batch has ended, mark as inactive
          if (endDate < today && batch.isActive !== false) {
            batch.isActive = false;
          }
        }
        // Ensure isActive is defined (default to true if undefined)
        if (batch.isActive === undefined) {
          batch.isActive = true;
        }
        return batch;
      });
      this.updateActiveBatches();
      this.updatePagination();
    });
    this.feedbackSvc.getAll().subscribe(f => this.feedbacks = f);
  }

  updateActiveBatches() {
    if (this.showInactiveBatches) {
      this.activeBatches = this.batches; // Show all batches
    } else {
      this.activeBatches = this.batches.filter(x => x.isActive === true); // Show only active batches
    }
  }

  toggleInactiveBatches() {
    this.showInactiveBatches = !this.showInactiveBatches;
    this.updateActiveBatches();
    this.currentPage = 1; // Reset to first page
    this.updatePagination();
  }

  updatePagination() {
    this.totalItems = this.activeBatches.length;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedBatches = this.activeBatches.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.updatePagination();
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
      this.calendarForm.reset(); // Reset calendar creation form
      this.showCreateCalendar = false;
    }
  }

  submitBatch() {
    if (this.batchForm.invalid) {
      alert('Please fill in all required fields');
      return;
    }

    const { calendarId, batchName } = this.batchForm.value;
    const calendar = this.calendars.find(c => c.calendarId == calendarId);
    if (!calendar) {
      alert('Please select a valid course calendar');
      return;
    }

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
    // If search is empty, show batches based on current filter
    this.updateActiveBatches();
  } else {
    // Filter by search term and current filter
    const baseBatches = this.showInactiveBatches ? this.batches : this.batches.filter(b => b.isActive === true);
    this.activeBatches = baseBatches.filter(b =>
      b.batchName?.toLowerCase().includes(searchTerm)
    );
  }
  this.currentPage = 1; // Reset to first page when searching
  this.updatePagination();
}

  getActiveBatchesCount(): number {
    return this.batches.filter(b => b.isActive === true).length;
  }

  getDurationDays(batch: Batch): number {
    if (!batch.calendar?.startDate || !batch.calendar?.endDate) {
      return 0;
    }
    
    const startDate = new Date(batch.calendar.startDate);
    const endDate = new Date(batch.calendar.endDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  createCalendar() {
    if (this.calendarForm.invalid) {
      alert('Please fill in all calendar fields');
      return;
    }

    const formValue = this.calendarForm.value;

    // Convert courseId to number for comparison
    const courseId = Number(formValue.courseId);
    const course = this.courses.find(c => c.courseId === courseId);
    if (!course) {
      alert('Selected course not found');
      return;
    }

    const calendarData = {
      courseId: courseId,
      startDate: formValue.startDate,
      endDate: formValue.endDate
    };

    this.calSvc.create(calendarData).subscribe({
      next: (newCalendar) => {
        alert('Calendar created successfully!');
        
        // Add the new calendar to the calendars array
        this.calendars.push(newCalendar);
        
        // Automatically select the newly created calendar in the batch form
        this.batchForm.patchValue({
          calendarId: newCalendar.calendarId
        });
        
        // Close the calendar creation form
        this.cancelCreateCalendar();
        
        // Reload data to ensure everything is up to date
        this.loadData();
      },
      error: (err) => {
        console.error('Error creating calendar:', err);
        alert('Failed to create calendar');
      }
    });
  }

  cancelCreateCalendar() {
    this.showCreateCalendar = false;
    this.calendarForm.reset();
  }

  getSelectedCalendarInfo(): string {
    const calendarId = this.batchForm.get('calendarId')?.value;
    if (!calendarId) return '';
    
    const calendar = this.calendars.find(c => c.calendarId == calendarId);
    if (!calendar) return '';
    
    const startDate = new Date(calendar.startDate).toLocaleDateString();
    const endDate = new Date(calendar.endDate).toLocaleDateString();
    
    return `${calendar.course?.courseName} - ${startDate} to ${endDate}`;
  }
}
