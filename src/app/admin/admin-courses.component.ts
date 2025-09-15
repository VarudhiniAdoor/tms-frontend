import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../services/course.service';
import { Course } from '../models/domain.models';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faBook, faPlus, faSearch, faEdit, faTrash, faClock, 
  faGraduationCap, faFilter, faSort, faEye, faDownload,
  faChartLine, faUsers, faCalendarAlt, faCheckCircle,
  faTimes, faSave, faXmark, faEllipsisV, faStar,
  faPlay, faPause, faStop, faRefresh, faCog
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-courses',
  template: `
  <div class="admin-section">
    <!-- Hero Header -->
    <div class="hero-header">
      <div class="hero-content">
        <div class="hero-icon">
          <fa-icon [icon]="faGraduationCap"></fa-icon>
        </div>
        <div class="hero-text">
          <h1>Course Management</h1>
          <p>Design, create, and manage comprehensive training programs for your organization</p>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat-item">
          <div class="stat-value">{{ courses.length }}</div>
          <div class="stat-label">Total Courses</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ getActiveCourses() }}</div>
          <div class="stat-label">Active</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ getAverageDuration() }}</div>
          <div class="stat-label">Avg. Duration</div>
        </div>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <div class="search-filters">
        <div class="search-container">
          <fa-icon [icon]="faSearch" class="search-icon"></fa-icon>
          <input 
            [(ngModel)]="searchTerm" 
            placeholder="Search courses by name, description, or ID..." 
            class="search-input"
            (input)="onSearchChange()">
          <button class="clear-search" (click)="clearSearch()" *ngIf="searchTerm">
            <fa-icon [icon]="faTimes"></fa-icon>
          </button>
        </div>
        
        <div class="filter-actions">
          <select class="filter-select" [(ngModel)]="sortBy" (change)="onSortChange()">
            <option value="name">Sort by Name</option>
            <option value="duration">Sort by Duration</option>
            <option value="created">Sort by Created</option>
          </select>
          
          <button class="btn btn-outline btn-sm" (click)="toggleView()">
            <fa-icon [icon]="viewMode === 'grid' ? faSort : faFilter"></fa-icon>
            {{ viewMode === 'grid' ? 'List View' : 'Grid View' }}
          </button>
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-outline" (click)="exportCourses()">
          <fa-icon [icon]="faDownload"></fa-icon>
          Export
        </button>
        <button class="btn btn-primary" (click)="toggleCreateCourse()" *ngIf="!showCreateCourse">
          <fa-icon [icon]="faPlus"></fa-icon>
          Create Course
        </button>
      </div>
    </div>

    <!-- Create Course Modal -->
    <div class="modal-overlay" *ngIf="showCreateCourse" (click)="toggleCreateCourse()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">
            <fa-icon [icon]="faPlus" class="modal-icon"></fa-icon>
            <h3>Create New Course</h3>
          </div>
          <button class="close-btn" (click)="toggleCreateCourse()">
            <fa-icon [icon]="faXmark"></fa-icon>
          </button>
        </div>
        
        <form [formGroup]="courseForm" (ngSubmit)="createCourse()" class="course-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="courseName" class="form-label">
                <fa-icon [icon]="faBook"></fa-icon>
                Course Name *
              </label>
              <input 
                id="courseName"
                formControlName="courseName" 
                placeholder="Enter course name"
                class="form-input"
                [class.error]="courseForm.get('courseName')?.invalid && courseForm.get('courseName')?.touched">
            </div>
            
            <div class="form-group">
              <label for="durationDays" class="form-label">
                <fa-icon [icon]="faClock"></fa-icon>
                Duration (Days) *
              </label>
              <input 
                id="durationDays"
                formControlName="durationDays" 
                type="number" 
                placeholder="Enter duration in days"
                class="form-input"
                min="1"
                [class.error]="courseForm.get('durationDays')?.invalid && courseForm.get('durationDays')?.touched">
            </div>
            
            <div class="form-group full-width">
              <label for="description" class="form-label">
                <fa-icon [icon]="faEdit"></fa-icon>
                Description
              </label>
              <textarea 
                id="description"
                formControlName="description" 
                placeholder="Enter course description"
                class="form-textarea"
                rows="4"></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="toggleCreateCourse()">
              <fa-icon [icon]="faTimes"></fa-icon>
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="courseForm.invalid || isLoading">
              <fa-icon [icon]="faSave"></fa-icon>
              {{ isLoading ? 'Creating...' : 'Create Course' }}
            </button>
          </div>
        </form>
        
        <div *ngIf="courseMsg" class="alert" [class.success]="courseMsg.includes('success')" [class.error]="courseMsg.includes('failed')">
          {{ courseMsg }}
        </div>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="results-summary" *ngIf="!isLoading && filteredCourses().length > 0">
      <div class="summary-text">
        <fa-icon [icon]="faCheckCircle" class="summary-icon"></fa-icon>
        <span>{{ filteredCourses().length }} course{{ filteredCourses().length !== 1 ? 's' : '' }} found</span>
      </div>
      <div class="summary-actions">
        <button class="btn btn-sm btn-outline" (click)="refreshCourses()">
          <fa-icon [icon]="faRefresh"></fa-icon>
          Refresh
        </button>
      </div>
    </div>

    <!-- Courses Display -->
    <div class="courses-container" *ngIf="!isLoading">
      <!-- Grid View -->
      <div class="courses-grid" *ngIf="viewMode === 'grid'">
        <div *ngFor="let course of filteredCourses()" class="course-card">
          <div class="course-header">
            <div class="course-icon">
              <fa-icon [icon]="faBook"></fa-icon>
            </div>
            <div class="course-info">
              <h3 class="course-title">{{ course.courseName }}</h3>
              <p class="course-id">ID: {{ course.courseId }}</p>
            </div>
            <div class="course-menu">
              <button class="menu-btn" (click)="toggleCourseMenu(course.courseId)">
                <fa-icon [icon]="faEllipsisV"></fa-icon>
              </button>
              <div class="menu-dropdown" *ngIf="activeMenu === course.courseId">
                <button (click)="viewCourse(course)">
                  <fa-icon [icon]="faEye"></fa-icon>
                  View Details
                </button>
                <button (click)="editCourse(course)">
                  <fa-icon [icon]="faEdit"></fa-icon>
                  Edit Course
                </button>
                <button (click)="duplicateCourse(course)">
                  <fa-icon [icon]="faPlus"></fa-icon>
                  Duplicate
                </button>
                <button (click)="deleteCourse(course.courseId)" class="danger">
                  <fa-icon [icon]="faTrash"></fa-icon>
                  Delete
                </button>
              </div>
            </div>
          </div>
          
          <div class="course-content">
            <p class="course-description" *ngIf="course.description" [title]="course.description">
              {{ course.description }}
            </p>
            <p class="course-description no-description" *ngIf="!course.description">
              No description provided
            </p>
          </div>
          
          <div class="course-metrics">
            <div class="metric">
              <fa-icon [icon]="faClock"></fa-icon>
              <span>{{ course.durationDays }} days</span>
            </div>
            <div class="metric">
              <fa-icon [icon]="faUsers"></fa-icon>
              <span>{{ getEnrollmentCount(course.courseId) }} enrolled</span>
            </div>
            <div class="metric">
              <fa-icon [icon]="faStar"></fa-icon>
              <span>{{ getAverageRating(course.courseId) }}/5</span>
            </div>
          </div>
          
          <div class="course-footer">
            <div class="course-status">
              <span class="status-badge active">
                <fa-icon [icon]="faCheckCircle"></fa-icon>
                Active
              </span>
            </div>
            <div class="course-actions">
              <button class="btn btn-sm btn-outline" (click)="viewCourse(course)">
                <fa-icon [icon]="faEye"></fa-icon>
                View
              </button>
              <button class="btn btn-sm btn-primary" (click)="editCourse(course)">
                <fa-icon [icon]="faEdit"></fa-icon>
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div class="courses-list" *ngIf="viewMode === 'list'">
        <div class="list-header">
          <div class="list-column">Course</div>
          <div class="list-column">Duration</div>
          <div class="list-column">Enrollments</div>
          <div class="list-column">Rating</div>
          <div class="list-column">Status</div>
          <div class="list-column">Actions</div>
        </div>
        <div *ngFor="let course of filteredCourses()" class="list-row">
          <div class="list-cell course-cell">
            <div class="course-info">
              <div class="course-icon">
                <fa-icon [icon]="faBook"></fa-icon>
              </div>
              <div class="course-details">
                <h4 class="course-title">{{ course.courseName }}</h4>
                <p class="course-id">ID: {{ course.courseId }}</p>
              </div>
            </div>
          </div>
          <div class="list-cell">
            <span class="duration-badge">
              <fa-icon [icon]="faClock"></fa-icon>
              {{ course.durationDays }} days
            </span>
          </div>
          <div class="list-cell">
            <span class="enrollment-count">
              <fa-icon [icon]="faUsers"></fa-icon>
              {{ getEnrollmentCount(course.courseId) }}
            </span>
          </div>
          <div class="list-cell">
            <div class="rating-display">
              <fa-icon [icon]="faStar" *ngFor="let star of getStars(getAverageRating(course.courseId))" 
                [class.filled]="star"></fa-icon>
              <span class="rating-value">{{ getAverageRating(course.courseId) }}/5</span>
            </div>
          </div>
          <div class="list-cell">
            <span class="status-badge active">
              <fa-icon [icon]="faCheckCircle"></fa-icon>
              Active
            </span>
          </div>
          <div class="list-cell">
            <div class="action-buttons">
              <button class="btn btn-sm btn-outline" (click)="viewCourse(course)" title="View">
                <fa-icon [icon]="faEye"></fa-icon>
              </button>
              <button class="btn btn-sm btn-outline" (click)="editCourse(course)" title="Edit">
                <fa-icon [icon]="faEdit"></fa-icon>
              </button>
              <button class="btn btn-sm btn-outline btn-danger" (click)="deleteCourse(course.courseId)" title="Delete">
                <fa-icon [icon]="faTrash"></fa-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div class="loading-container" *ngIf="isLoading">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <h3>Loading Courses</h3>
      <p>Please wait while we fetch your course data...</p>
    </div>

    <!-- Empty State -->
    <div class="empty-state" *ngIf="!isLoading && courses.length === 0">
      <div class="empty-illustration">
        <fa-icon [icon]="faBook" class="empty-icon"></fa-icon>
        <div class="empty-decoration"></div>
      </div>
      <h3>No Courses Yet</h3>
      <p>Start building your training program by creating your first course</p>
      <div class="empty-actions">
        <button class="btn btn-primary" (click)="toggleCreateCourse()">
          <fa-icon [icon]="faPlus"></fa-icon>
          Create Your First Course
        </button>
        <button class="btn btn-outline" (click)="loadSampleCourses()">
          <fa-icon [icon]="faDownload"></fa-icon>
          Load Sample Courses
        </button>
      </div>
    </div>

    <!-- No Search Results -->
    <div class="empty-state" *ngIf="!isLoading && courses.length > 0 && filteredCourses().length === 0">
      <div class="empty-illustration">
        <fa-icon [icon]="faSearch" class="empty-icon"></fa-icon>
        <div class="empty-decoration"></div>
      </div>
      <h3>No Matching Courses</h3>
      <p>We couldn't find any courses matching your search criteria</p>
      <div class="empty-actions">
        <button class="btn btn-outline" (click)="clearSearch()">
          <fa-icon [icon]="faTimes"></fa-icon>
          Clear Search
        </button>
        <button class="btn btn-primary" (click)="toggleCreateCourse()">
          <fa-icon [icon]="faPlus"></fa-icon>
          Create New Course
        </button>
      </div>
    </div>
  </div>
`,
  styles: [`
    .admin-section {
      padding: 24px;
      background: var(--light-bg);
      min-height: 100vh;
      transition: background var(--transition-normal);
    }
    body.dark-mode .admin-section {
      background: var(--dark-bg);
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

    .form-group.full-width {
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

    .form-input, .form-textarea {
      padding: 12px 16px;
      border: 1px solid var(--light-border);
      border-radius: 8px;
      background: var(--light-surface);
      color: var(--light-text);
      font-size: 0.95rem;
      transition: all var(--transition-fast);
      font-family: inherit;
    }
    body.dark-mode .form-input, body.dark-mode .form-textarea {
      background: var(--dark-surface);
      border-color: var(--dark-border);
      color: var(--dark-text);
    }

    .form-input:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
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

    .alert {
      padding: 12px 16px;
      border-radius: 8px;
      margin-top: 16px;
      font-size: 0.9rem;
    }
    .alert.success {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }
    .alert.error {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .course-card {
      background: var(--light-card);
      border: 1px solid var(--light-border);
      border-radius: 16px;
      padding: 24px;
      transition: all var(--transition-normal);
      box-shadow: var(--shadow-sm);
      position: relative;
      overflow: hidden;
    }
    body.dark-mode .course-card {
      background: var(--dark-card);
      border-color: var(--dark-border);
    }

    .course-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary);
    }

    .course-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--primary), #8b5cf6);
    }

    .course-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--light-border);
    }
    body.dark-mode .course-header {
      border-bottom-color: var(--dark-border);
    }

    .course-icon {
      font-size: 1.75rem;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--primary), #8b5cf6);
      color: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .course-info {
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }

    .course-title {
      margin: 0 0 6px 0;
      color: var(--light-text);
      font-size: 1.2rem;
      font-weight: 700;
      line-height: 1.4;
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
      max-width: 100%;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    body.dark-mode .course-title {
      color: var(--dark-text);
    }

    .course-id {
      margin: 0;
      color: var(--light-text-secondary);
      font-size: 0.85rem;
      font-family: 'Courier New', monospace;
      background: var(--light-surface);
      padding: 2px 8px;
      border-radius: 6px;
      display: inline-block;
    }
    body.dark-mode .course-id {
      color: var(--dark-text-secondary);
      background: var(--dark-surface);
    }

    .course-actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
      opacity: 0;
      transition: opacity var(--transition-fast);
    }

    .course-card:hover .course-actions {
      opacity: 1;
    }

    .course-content {
      margin-bottom: 16px;
    }

    .course-description {
      margin: 0;
      color: var(--light-text-secondary);
      font-size: 0.9rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    body.dark-mode .course-description {
      color: var(--dark-text-secondary);
    }

    .course-description.no-description {
      font-style: italic;
      opacity: 0.7;
    }

    .course-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid var(--light-border);
    }
    body.dark-mode .course-footer {
      border-top-color: var(--dark-border);
    }

    .course-duration {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--light-text-secondary);
      font-size: 0.85rem;
    }
    body.dark-mode .course-duration {
      color: var(--dark-text-secondary);
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.active {
      background: #dcfce7;
      color: #166534;
    }
    body.dark-mode .status-badge.active {
      background: #14532d;
      color: #dcfce7;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
      color: var(--light-text-secondary);
    }
    body.dark-mode .loading-container {
      color: var(--dark-text-secondary);
    }

    .spinner {
      font-size: 2rem;
      margin-bottom: 16px;
      animation: spin 1s linear infinite;
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

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
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
      
      .courses-grid {
        grid-template-columns: 1fr;
      }
    }
`],
imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule]
})
export class AdminCoursesComponent implements OnInit {
  courses: Course[] = [];
  searchTerm = '';
  showCreateCourse = false;
  isLoading = false;
  viewMode: 'grid' | 'list' = 'grid';
  sortBy = 'name';
  activeMenu: number | null = null;

  // Create course form
  courseForm = new FormGroup({
    courseName: new FormControl('', Validators.required),
    description: new FormControl(''),
    durationDays: new FormControl(0, Validators.required),
    language: new FormControl('', Validators.required)
  });

  courseMsg = '';

  // FontAwesome Icons
  faBook = faBook;
  faPlus = faPlus;
  faSearch = faSearch;
  faEdit = faEdit;
  faTrash = faTrash;
  faClock = faClock;
  faGraduationCap = faGraduationCap;
  faFilter = faFilter;
  faSort = faSort;
  faEye = faEye;
  faDownload = faDownload;
  faChartLine = faChartLine;
  faUsers = faUsers;
  faCalendarAlt = faCalendarAlt;
  faCheckCircle = faCheckCircle;
  faTimes = faTimes;
  faSave = faSave;
  faXmark = faXmark;
  faEllipsisV = faEllipsisV;
  faStar = faStar;
  faPlay = faPlay;
  faPause = faPause;
  faStop = faStop;
  faRefresh = faRefresh;
  faCog = faCog;

  constructor(private courseSvc: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading = true;
    this.courseSvc.getAll().subscribe({
      next: (data) => {
        this.courses = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading courses', err);
        this.isLoading = false;
      }
    });
  }

  toggleCreateCourse() {
    this.showCreateCourse = !this.showCreateCourse;
    this.courseMsg = '';
    this.courseForm.reset();
  }

  onSearchChange() {
    // Search is handled by filteredCourses() method
  }

  clearSearch() {
    this.searchTerm = '';
  }

  editCourse(course: Course) {
    // TODO: Implement edit functionality
    console.log('Edit course:', course);
  }

  filteredCourses() {
    if (!this.searchTerm) return this.courses;
    const term = this.searchTerm.toLowerCase();
    return this.courses.filter(
      (c) =>
        c.courseName.toLowerCase().includes(term) ||
        (c.description?.toLowerCase().includes(term)) ||
        c.courseId.toString().includes(term)
    );
  }

  createCourse() {
    if (this.courseForm.invalid) return;

    this.isLoading = true;
    const val = this.courseForm.value;
    this.courseSvc.create({
      courseName: val.courseName!,
      description: val.description ?? '',
      durationDays: val.durationDays ?? 0
    }).subscribe({
      next: () => {
        this.courseMsg = 'Course created successfully';
        this.courseForm.reset();
        this.showCreateCourse = false;
        this.loadCourses();
      },
      error: (err) => {
        console.error('Create course failed', err);
        this.courseMsg = 'Create course failed';
        this.isLoading = false;
      }
    });
  }

  deleteCourse(courseId: number) {
    if (!confirm('Delete this course?')) return;
    this.courseSvc.delete(courseId).subscribe({
      next: () => this.loadCourses(),
      error: (err) => console.error('Delete course failed', err)
    });
  }

  // New methods for enhanced functionality
  getActiveCourses(): number {
    return this.courses.length; // All courses are considered active for now
  }

  getAverageDuration(): string {
    if (this.courses.length === 0) return '0';
    const total = this.courses.reduce((sum, course) => sum + (course.durationDays || 0), 0);
    return Math.round(total / this.courses.length).toString();
  }

  toggleView() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  onSortChange() {
    // Implement sorting logic
    this.courses.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.courseName.localeCompare(b.courseName);
        case 'duration':
          return (a.durationDays || 0) - (b.durationDays || 0);
        case 'created':
          return b.courseId - a.courseId; // Assuming higher ID = newer
        default:
          return 0;
      }
    });
  }

  exportCourses() {
    // Implement export functionality
    console.log('Exporting courses...');
  }

  refreshCourses() {
    this.loadCourses();
  }

  toggleCourseMenu(courseId: number) {
    this.activeMenu = this.activeMenu === courseId ? null : courseId;
  }

  viewCourse(course: Course) {
    console.log('Viewing course:', course);
    // Implement view functionality
  }

  duplicateCourse(course: Course) {
    console.log('Duplicating course:', course);
    // Implement duplicate functionality
  }

  getEnrollmentCount(courseId: number): number {
    // Mock data - replace with actual service call
    return Math.floor(Math.random() * 50) + 1;
  }

  getAverageRating(courseId: number): number {
    // Mock data - replace with actual service call
    return Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 to 5.0
  }

  getStars(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= Math.floor(rating));
    }
    return stars;
  }

  loadSampleCourses() {
    // Implement sample courses loading
    console.log('Loading sample courses...');
  }
}
