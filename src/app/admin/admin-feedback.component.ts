import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FeedbackService } from '../services/feedback.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { 
  faChartBar, faStar, faChartLine, faUsers, faDownload, 
  faFilter, faSearch, faEye, faEdit, faTrash, faCalendarAlt,
  faGraduationCap, faBook, faThumbsUp, faThumbsDown, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent, FontAwesomeModule],
  template: `
  <div class="admin-section">
    <!-- Section Header -->
    <div class="section-header">
      <div class="header-content">
        <h2>Reports & Analytics</h2>
        <p>Generate comprehensive reports and view training analytics</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" (click)="exportReports()">
          <fa-icon [icon]="faDownload"></fa-icon>
          Export Reports
        </button>
      </div>
    </div>

    <!-- Reports Dashboard -->
    <div class="reports-dashboard">
      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon feedback">
            <fa-icon [icon]="faStar"></fa-icon>
          </div>
          <div class="stat-content">
            <h3>{{ totalFeedbacks }}</h3>
            <p>Total Feedback</p>
            <span class="stat-change positive">Active feedback</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon rating">
            <fa-icon [icon]="faChartLine"></fa-icon>
          </div>
          <div class="stat-content">
            <h3>{{ averageRating }}/5</h3>
            <p>Average Rating</p>
            <span class="stat-change positive">Overall satisfaction</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon batches">
            <fa-icon [icon]="faCalendarAlt"></fa-icon>
          </div>
          <div class="stat-content">
            <h3>{{ feedbackBatches.length }}</h3>
            <p>Batches with Feedback</p>
            <span class="stat-change positive">Active batches</span>
          </div>
        </div>
        
      </div>

      <!-- Search and Filters -->
      <div class="search-section">
        <div class="search-container">
          <fa-icon [icon]="faSearch" class="search-icon"></fa-icon>
          <input 
            [(ngModel)]="searchTerm" 
            placeholder="Search by course, batch, or user..." 
            class="search-input"
            (input)="applyFilters()">
        </div>
        <div class="filter-container">
          <select [(ngModel)]="selectedBatch" (change)="applyFilters()" class="filter-select">
            <option value="">All Batches</option>
            <option *ngFor="let batch of feedbackBatches" [value]="batch.batchId">
              {{ batch.batchName }}
            </option>
          </select>
        </div>
        <div class="filter-stats">
          <span class="stat">{{ filteredFeedbacks.length }} feedback entries</span>
        </div>
      </div>


      <!-- Feedback Table -->
      <div class="table-card">
        <div class="table-header">
          <div class="table-stats">
            <span class="stat">{{ totalFeedbacks }} Total Feedback</span>
            <span class="stat">{{ highRatedFeedbacks }} High Rated (4-5⭐)</span>
            <span class="stat">{{ lowRatedFeedbacks }} Low Rated (1-2⭐)</span>
          </div>
        </div>
        
        <div class="table-container">
          <table class="data-table" *ngIf="paginatedFeedbacks.length > 0">
            <thead>
              <tr>
                <th>Course</th>
                <th>Batch</th>
                <th>User</th>
                <th>Rating</th>
                <th>Feedback</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let f of paginatedFeedbacks" class="data-row">
                <td>
                  <div class="course-info">
                    <div class="course-name">{{ f.courseName || 'Unknown Course' }}</div>
                  </div>
                </td>
                <td>
                  <div class="batch-info">
                    <div class="batch-name">{{ f.batchName || 'Unknown Batch' }}</div>
                    <div class="batch-id" *ngIf="f.batchId">ID: {{ f.batchId }}</div>
                  </div>
                </td>
                <td>
                  <div class="user-info">
                    <div class="user-avatar">{{ (f.username || 'U').charAt(0).toUpperCase() }}</div>
                    <span>{{ f.username || 'Unknown User' }}</span>
                  </div>
                </td>
                <td>
                  <div class="rating-display">
                    <div class="stars">
                      <fa-icon *ngFor="let star of getStars(f.rating || 0)" [icon]="faStar" [class.filled]="star" class="star"></fa-icon>
                    </div>
                    <span class="rating-value">{{ f.rating || 0 }}/5</span>
                  </div>
                </td>
                <td>
                  <div class="feedback-text" [title]="f.feedbackText || 'No feedback text provided'">
                    {{ f.feedbackText ? (f.feedbackText.length > 50 ? (f.feedbackText | slice:0:50) + '...' : f.feedbackText) : 'No feedback text' }}
                  </div>
                </td>
                <td>
                  <div class="date-info">
                    <div class="date">{{ f.submittedOn ? (f.submittedOn | date:'MMM dd, yyyy') : 'Unknown Date' }}</div>
                    <div class="time">{{ f.submittedOn ? (f.submittedOn | date:'shortTime') : '' }}</div>
                  </div>
                </td>
                <td class="actions-cell">
                  <button class="btn btn-sm btn-ghost" (click)="viewFeedback(f)" title="View Details">
                    <i class="icon">👁️</i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Empty State -->
          <div class="empty-state" *ngIf="filteredFeedbacks.length === 0">
            <div class="empty-icon">
              <fa-icon [icon]="faChartBar"></fa-icon>
            </div>
            <h3>No feedback found</h3>
            <p>No feedback matches your search criteria</p>
            <button class="btn btn-outline" (click)="clearFilters()">
              Clear Filters
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <app-pagination
          *ngIf="filteredFeedbacks.length > 0"
          [currentPage]="currentPage"
          [totalItems]="totalItems"
          [pageSize]="pageSize"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)">
        </app-pagination>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .reports-dashboard {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .rating-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .stars {
      display: flex;
      gap: 2px;
    }

    .star {
      font-size: 0.8rem;
      opacity: 0.3;
    }

    .star.filled {
      opacity: 1;
    }

    .rating-value {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--primary);
    }

    .feedback-text {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .feedback-text:empty::before {
      content: "No feedback text";
      color: var(--light-text-secondary);
      font-style: italic;
    }

    .course-info, .batch-info, .user-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .course-name, .batch-name {
      font-weight: 600;
      color: var(--light-text);
    }

    .batch-id {
      font-size: 0.8rem;
      color: var(--light-text-secondary);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .date-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .date {
      font-weight: 600;
      color: var(--light-text);
    }

    .time {
      font-size: 0.8rem;
      color: var(--light-text-secondary);
    }

    body.dark-mode .course-name,
    body.dark-mode .batch-name,
    body.dark-mode .date {
      color: var(--dark-text);
    }

    body.dark-mode .batch-id,
    body.dark-mode .time {
      color: var(--dark-text-secondary);
    }

    /* Admin Section Styles */
    .admin-section {
      padding: 24px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(156, 39, 176, 0.03) 30%, rgba(243, 229, 245, 0.6) 60%, rgba(248, 250, 252, 0.8) 100%);
      min-height: 100vh;
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

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--light-border);
    }

    .header-content h2 {
      margin: 0 0 8px 0;
      color: var(--light-text);
      font-size: 1.75rem;
      font-weight: 600;
    }

    .header-content p {
      margin: 0;
      color: var(--light-text-secondary);
      font-size: 0.95rem;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
    }

    .btn-primary:hover {
      background: var(--primary-hover);
      transform: translateY(-1px);
    }

    .btn-outline {
      background: transparent;
      color: var(--light-text);
      border: 1px solid var(--light-border);
    }

    .btn-outline:hover {
      background: var(--light-surface);
      border-color: var(--primary);
    }

    .btn-sm {
      padding: 8px 16px;
      font-size: 0.85rem;
    }

    .btn-ghost {
      background: transparent;
      color: var(--light-text-secondary);
    }

    .btn-ghost:hover {
      background: var(--light-surface);
      color: var(--light-text);
    }

    .icon {
      font-size: 1rem;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: var(--light-card);
      border: 1px solid var(--light-border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .stat-icon.feedback {
      background: linear-gradient(135deg, #f59e0b, #f97316);
      color: white;
    }

    .stat-icon.rating {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .stat-icon.batches {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
    }

    .stat-icon.completion {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
    }

    .stat-content h3 {
      margin: 0 0 4px 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--light-text);
    }

    .stat-content p {
      margin: 0 0 8px 0;
      color: var(--light-text-secondary);
      font-size: 0.9rem;
    }

    .stat-change {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 6px;
    }

    .stat-change.positive {
      background: #d1fae5;
      color: #065f46;
    }

    /* Search Section */
    .search-section {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .search-container {
      position: relative;
      flex: 1;
      min-width: 300px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--light-text-secondary);
    }

    .search-input {
      width: 100%;
      padding: 12px 12px 12px 40px;
      border: 1px solid var(--light-border);
      border-radius: 8px;
      font-size: 0.9rem;
      background: var(--light-bg);
      color: var(--light-text);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .filter-container {
      min-width: 200px;
    }

    .filter-select {
      width: 100%;
      padding: 12px;
      border: 1px solid var(--light-border);
      border-radius: 8px;
      font-size: 0.9rem;
      background: var(--light-bg);
      color: var(--light-text);
    }

    .filter-stats {
      display: flex;
      align-items: center;
    }

    .stat {
      font-size: 0.9rem;
      color: var(--light-text-secondary);
      font-weight: 500;
    }

    /* Table Card */
    .table-card {
      background: var(--light-card);
      border: 1px solid var(--light-border);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .table-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--light-border);
      background: var(--light-surface);
    }

    .table-stats {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      padding: 16px 20px;
      text-align: left;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--light-text-secondary);
      background: var(--light-surface);
      border-bottom: 1px solid var(--light-border);
      white-space: nowrap;
    }

    .data-table td {
      padding: 16px 20px;
      border-bottom: 1px solid var(--light-border);
      vertical-align: middle;
    }

    .data-row {
      transition: all 0.2s ease;
    }

    .data-row:hover {
      background: var(--light-surface);
    }

    .actions-cell {
      text-align: center;
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 20px;
      opacity: 0.5;
    }

    .empty-state h3 {
      margin: 0 0 12px 0;
      font-size: 1.5rem;
      color: var(--light-text);
    }

    .empty-state p {
      margin: 0 0 20px 0;
      color: var(--light-text-secondary);
      font-size: 1rem;
    }

    /* Dark Mode Support */
    body.dark-mode .admin-section {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(45, 27, 105, 0.4) 30%, rgba(17, 17, 24, 0.9) 100%);
    }
    body.dark-mode .admin-section::before {
      background: 
        radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(156, 39, 176, 0.08) 0%, transparent 60%),
        radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
    }

    body.dark-mode .section-header {
      border-bottom-color: var(--dark-border);
    }

    body.dark-mode .header-content h2 {
      color: var(--dark-text);
    }

    body.dark-mode .header-content p {
      color: var(--dark-text-secondary);
    }

    body.dark-mode .stat-card {
      background: var(--dark-card);
      border-color: var(--dark-border);
    }

    body.dark-mode .stat-content h3 {
      color: var(--dark-text);
    }

    body.dark-mode .stat-content p {
      color: var(--dark-text-secondary);
    }

    body.dark-mode .search-input,
    body.dark-mode .filter-select {
      background: var(--dark-bg);
      border-color: var(--dark-border);
      color: var(--dark-text);
    }

    body.dark-mode .search-input:focus,
    body.dark-mode .filter-select:focus {
      border-color: var(--primary);
    }

    body.dark-mode .table-card {
      background: var(--dark-card);
      border-color: var(--dark-border);
    }

    body.dark-mode .table-header {
      background: var(--dark-surface);
      border-bottom-color: var(--dark-border);
    }

    body.dark-mode .data-table th {
      background: var(--dark-surface);
      border-bottom-color: var(--dark-border);
      color: var(--dark-text-secondary);
    }

    body.dark-mode .data-table td {
      border-bottom-color: var(--dark-border);
    }

    body.dark-mode .data-row:hover {
      background: var(--dark-surface);
    }

    body.dark-mode .empty-state h3 {
      color: var(--dark-text);
    }

    body.dark-mode .empty-state p {
      color: var(--dark-text-secondary);
    }
  `]
})
export class AdminFeedbackComponent implements OnInit {
  feedbacks: any[] = [];
  filteredFeedbacks: any[] = [];
  paginatedFeedbacks: any[] = [];
  searchTerm = '';
  selectedBatch = '';

  // Pagination
  currentPage = 1;
  pageSize = 6;
  totalItems = 0;

  // FontAwesome Icons
  faChartBar = faChartBar;
  faStar = faStar;
  faChartLine = faChartLine;
  faUsers = faUsers;
  faDownload = faDownload;
  faFilter = faFilter;
  faSearch = faSearch;
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
  faCalendarAlt = faCalendarAlt;
  faGraduationCap = faGraduationCap;
  faBook = faBook;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faCheckCircle = faCheckCircle;

  // Statistics
  totalFeedbacks = 0;
  averageRating = 0;
  highRatedFeedbacks = 0;
  lowRatedFeedbacks = 0;
  feedbackBatches: any[] = [];

  constructor(private feedbackSvc: FeedbackService) {}

  ngOnInit() {
    this.loadFeedbacks();
  }

  loadFeedbacks() {
    this.feedbackSvc.getAll().subscribe({
      next: (data) => {
        this.feedbacks = data || [];
        this.filteredFeedbacks = [...this.feedbacks];
        this.totalItems = this.filteredFeedbacks.length;
        this.updatePaginatedFeedbacks();
        this.calculateStatistics();
      },
      error: (error) => {
        console.error('Error loading feedbacks:', error);
        this.feedbacks = [];
        this.filteredFeedbacks = [];
        this.totalItems = 0;
        this.updatePaginatedFeedbacks();
      }
    });
  }

  calculateStatistics() {
    this.totalFeedbacks = this.feedbacks.length;
    
    if (this.totalFeedbacks > 0) {
      // Calculate average rating
      const validRatings = this.feedbacks.filter(f => f.rating && f.rating > 0);
      if (validRatings.length > 0) {
        const totalRating = validRatings.reduce((sum, f) => sum + (f.rating || 0), 0);
        this.averageRating = Math.round((totalRating / validRatings.length) * 10) / 10;
      } else {
        this.averageRating = 0;
      }
      
      // Calculate high/low rated feedbacks
      this.highRatedFeedbacks = this.feedbacks.filter(f => f.rating && f.rating >= 4).length;
      this.lowRatedFeedbacks = this.feedbacks.filter(f => f.rating && f.rating <= 2).length;
      
      // Get unique batches with feedback
      const batchMap = new Map();
      this.feedbacks.forEach(f => {
        if (f.batchName) {
          const key = f.batchId || f.batchName; // Use batchId if available, otherwise use batchName
          batchMap.set(key, { 
            batchId: f.batchId, 
            batchName: f.batchName 
          });
        }
      });
      this.feedbackBatches = Array.from(batchMap.values());
    } else {
      // Reset all values when no feedback
      this.averageRating = 0;
      this.highRatedFeedbacks = 0;
      this.lowRatedFeedbacks = 0;
      this.feedbackBatches = [];
    }
  }

  applyFilters() {
    let filtered = [...this.feedbacks];
    
    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(f => 
        (f.courseName || '').toLowerCase().includes(searchLower) ||
        (f.batchName || '').toLowerCase().includes(searchLower) ||
        (f.username || '').toLowerCase().includes(searchLower) ||
        (f.feedbackText || '').toLowerCase().includes(searchLower)
      );
    }
    
    // Apply batch filter
    if (this.selectedBatch) {
      filtered = filtered.filter(f => 
        f.batchId == this.selectedBatch || 
        f.batchName === this.selectedBatch
      );
    }
    
    this.filteredFeedbacks = filtered;
    this.totalItems = this.filteredFeedbacks.length;
    this.currentPage = 1;
    this.updatePaginatedFeedbacks();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedBatch = '';
    this.filteredFeedbacks = [...this.feedbacks];
    this.totalItems = this.filteredFeedbacks.length;
    this.currentPage = 1;
    this.updatePaginatedFeedbacks();
  }

  updatePaginatedFeedbacks() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedFeedbacks = this.filteredFeedbacks.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedFeedbacks();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.updatePaginatedFeedbacks();
  }

  getStars(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  viewFeedback(feedback: any) {
    const stars = '⭐'.repeat(feedback.rating || 0) + '☆'.repeat(5 - (feedback.rating || 0));
    const message = `Feedback Details:\n\n` +
      `Course: ${feedback.courseName || 'Unknown Course'}\n` +
      `Batch: ${feedback.batchName || 'Unknown Batch'}\n` +
      `User: ${feedback.username || 'Unknown User'}\n` +
      `Rating: ${stars} (${feedback.rating || 0}/5)\n\n` +
      `Feedback: ${feedback.feedbackText || 'No feedback text provided'}\n\n` +
      `Submitted: ${feedback.submittedOn ? new Date(feedback.submittedOn).toLocaleString() : 'Unknown Date'}`;
    
    alert(message);
  }

  exportReports() {
    // Create CSV content
    const headers = ['Course', 'Batch', 'User', 'Rating', 'Feedback', 'Date'];
    const csvContent = [
      headers.join(','),
      ...this.filteredFeedbacks.map(f => [
        `"${f.courseName || 'Unknown Course'}"`,
        `"${f.batchName || 'Unknown Batch'}"`,
        `"${f.username || 'Unknown User'}"`,
        f.rating || 0,
        `"${(f.feedbackText || 'No feedback text').replace(/"/g, '""')}"`,
        `"${f.submittedOn ? new Date(f.submittedOn).toLocaleDateString() : 'Unknown Date'}"`
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `feedback-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
