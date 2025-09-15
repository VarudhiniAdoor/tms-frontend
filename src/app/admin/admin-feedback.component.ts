import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackService } from '../services/feedback.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
          <i class="icon">📊</i>
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
            <i class="icon">⭐</i>
          </div>
          <div class="stat-content">
            <h3>{{ totalFeedbacks }}</h3>
            <p>Total Feedback</p>
            <span class="stat-change positive">Active feedback</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon rating">
            <i class="icon">📈</i>
          </div>
          <div class="stat-content">
            <h3>{{ averageRating }}/5</h3>
            <p>Average Rating</p>
            <span class="stat-change positive">Overall satisfaction</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon batches">
            <i class="icon">📅</i>
          </div>
          <div class="stat-content">
            <h3>{{ feedbackBatches.length }}</h3>
            <p>Batches with Feedback</p>
            <span class="stat-change positive">Active batches</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon completion">
            <i class="icon">✅</i>
          </div>
          <div class="stat-content">
            <h3>{{ completionRate }}%</h3>
            <p>Feedback Rate</p>
            <span class="stat-change positive">Response rate</span>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="search-section">
        <div class="search-container">
          <i class="search-icon">🔍</i>
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
            <span class="stat">{{ totalFeedbacks }} Total</span>
            <span class="stat">{{ highRatedFeedbacks }} High Rated (4-5⭐)</span>
            <span class="stat">{{ lowRatedFeedbacks }} Low Rated (1-2⭐)</span>
          </div>
        </div>
        
        <div class="table-container">
          <table class="data-table" *ngIf="filteredFeedbacks.length > 0">
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
              <tr *ngFor="let f of filteredFeedbacks" class="data-row">
                <td>
                  <div class="course-info">
                    <div class="course-name">{{ f.courseName }}</div>
                  </div>
                </td>
                <td>
                  <div class="batch-info">
                    <div class="batch-name">{{ f.batchName }}</div>
                    <div class="batch-id">ID: {{ f.batchId }}</div>
                  </div>
                </td>
                <td>
                  <div class="user-info">
                    <div class="user-avatar">{{ f.username.charAt(0).toUpperCase() }}</div>
                    <span>{{ f.username }}</span>
                  </div>
                </td>
                <td>
                  <div class="rating-display">
                    <div class="stars">
                      <span *ngFor="let star of getStars(f.rating)" [class.filled]="star" class="star">⭐</span>
                    </div>
                    <span class="rating-value">{{ f.rating }}/5</span>
                  </div>
                </td>
                <td>
                  <div class="feedback-text" [title]="f.feedbackText">
                    {{ f.feedbackText.length > 50 ? (f.feedbackText | slice:0:50) + '...' : f.feedbackText }}
                  </div>
                </td>
                <td>
                  <div class="date-info">
                    <div class="date">{{ f.submittedOn | date:'MMM dd, yyyy' }}</div>
                    <div class="time">{{ f.submittedOn | date:'shortTime' }}</div>
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
            <div class="empty-icon">📊</div>
            <h3>No feedback found</h3>
            <p>No feedback matches your search criteria</p>
            <button class="btn btn-outline" (click)="clearFilters()">
              Clear Filters
            </button>
          </div>
        </div>
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
  `]
})
export class AdminFeedbackComponent implements OnInit {
  feedbacks: any[] = [];
  filteredFeedbacks: any[] = [];
  searchTerm = '';
  selectedBatch = '';

  // Statistics
  totalFeedbacks = 0;
  averageRating = 0;
  highRatedFeedbacks = 0;
  lowRatedFeedbacks = 0;
  completionRate = 0;
  feedbackBatches: any[] = [];

  constructor(private feedbackSvc: FeedbackService) {}

  ngOnInit() {
    this.loadFeedbacks();
  }

  loadFeedbacks() {
    this.feedbackSvc.getAll().subscribe(data => {
      this.feedbacks = data;
      this.filteredFeedbacks = [...this.feedbacks];
      this.calculateStatistics();
    });
  }

  calculateStatistics() {
    this.totalFeedbacks = this.feedbacks.length;
    
    if (this.totalFeedbacks > 0) {
      // Calculate average rating
      const totalRating = this.feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0);
      this.averageRating = Math.round((totalRating / this.totalFeedbacks) * 10) / 10;
      
      // Calculate high/low rated feedbacks
      this.highRatedFeedbacks = this.feedbacks.filter(f => f.rating >= 4).length;
      this.lowRatedFeedbacks = this.feedbacks.filter(f => f.rating <= 2).length;
      
      // Calculate completion rate (assuming 100% for now)
      this.completionRate = 100;
      
      // Get unique batches
      const batchMap = new Map();
      this.feedbacks.forEach(f => {
        if (f.batchId && f.batchName) {
          batchMap.set(f.batchId, { batchId: f.batchId, batchName: f.batchName });
        }
      });
      this.feedbackBatches = Array.from(batchMap.values());
    }
  }

  applyFilters() {
    let filtered = [...this.feedbacks];
    
    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(f => 
        f.courseName?.toLowerCase().includes(searchLower) ||
        f.batchName?.toLowerCase().includes(searchLower) ||
        f.username?.toLowerCase().includes(searchLower) ||
        f.feedbackText?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply batch filter
    if (this.selectedBatch) {
      filtered = filtered.filter(f => f.batchId == this.selectedBatch);
    }
    
    this.filteredFeedbacks = filtered;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedBatch = '';
    this.filteredFeedbacks = [...this.feedbacks];
  }

  getStars(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  viewFeedback(feedback: any) {
    alert(`Feedback Details:\n\nCourse: ${feedback.courseName}\nBatch: ${feedback.batchName}\nUser: ${feedback.username}\nRating: ${feedback.rating}/5\n\nFeedback: ${feedback.feedbackText}\n\nSubmitted: ${new Date(feedback.submittedOn).toLocaleString()}`);
  }

  exportReports() {
    // Create CSV content
    const headers = ['Course', 'Batch', 'User', 'Rating', 'Feedback', 'Date'];
    const csvContent = [
      headers.join(','),
      ...this.filteredFeedbacks.map(f => [
        `"${f.courseName || ''}"`,
        `"${f.batchName || ''}"`,
        `"${f.username || ''}"`,
        f.rating || 0,
        `"${(f.feedbackText || '').replace(/"/g, '""')}"`,
        `"${new Date(f.submittedOn).toLocaleDateString()}"`
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
