import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { EnrollmentService } from '../../../services/enrollment.service';
import { FeedbackService } from '../../../services/feedback.service';

@Component({
  selector: 'app-my-enrollments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="enrollments-content">
    <!-- Loading State -->
    <div *ngIf="loading" class="loading-container">
      <div class="spinner">⏳</div>
      <p>Loading your enrollments...</p>
    </div>

    <!-- Enrollments Table -->
    <div class="enrollments-table-container" *ngIf="!loading && enrollments.length > 0">
      <div class="table-header">
        <div class="table-stats">
          <span class="stat">{{ enrollments.length }} Total Enrollments</span>
          <span class="stat">{{ getApprovedCount() }} Approved</span>
          <span class="stat">{{ getPendingCount() }} Pending</span>
          <span class="stat">{{ getFeedbackCount() }} With Feedback</span>
        </div>
      </div>
      
      <div class="table-wrapper">
        <table class="enrollments-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Batch</th>
              <th>Status</th>
              <th>Approved By</th>
              <th>Feedback</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let e of enrollments" class="enrollment-row" [class]="getStatusClass(e.status)">
              <td class="course-cell">
                <div class="course-info">
                  <div class="course-icon">📚</div>
                  <div class="course-details">
                    <div class="course-name">{{ e.courseName }}</div>
                  </div>
                </div>
              </td>
              <td class="batch-cell">
                <div class="batch-info">
                  <div class="batch-name">{{ e.batchName }}</div>
                </div>
              </td>
              <td class="status-cell">
                <span class="status-badge" [class]="getStatusClass(e.status)">
                  {{ e.status }}
                </span>
              </td>
              <td class="approver-cell">
                <div class="approver-info" *ngIf="e.approvedBy; else noApprover">
                  <i class="approver-icon">👤</i>
                  <span class="approver-name">{{ e.approvedBy }}</span>
                </div>
                <ng-template #noApprover>
                  <span class="no-approver">—</span>
                </ng-template>
              </td>
              <td class="feedback-cell">
                <div class="feedback-status" *ngIf="e.feedback; else noFeedback">
                  <div class="feedback-rating">
                    <span *ngFor="let star of getStars(e.feedback.rating)" 
                          [class.filled]="star" 
                          class="star">⭐</span>
                    <span class="rating-text">{{ e.feedback.rating }}/5</span>
                  </div>
                  <div class="feedback-preview" [title]="e.feedback.feedbackText">
                    {{ e.feedback.feedbackText.length > 30 ? (e.feedback.feedbackText | slice:0:30) + '...' : e.feedback.feedbackText }}
                  </div>
                </div>
                <ng-template #noFeedback>
                  <span class="no-feedback">No feedback yet</span>
                </ng-template>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <!-- Rejection Reason Button -->
                  <button 
                    *ngIf="e.status==='Rejected' && e.rejectReason" 
                    class="btn btn-sm btn-outline btn-warning"
                    (click)="showRejectionReason(e.rejectReason)"
                    title="View rejection reason">
                    <i class="btn-icon">⚠️</i>
                  </button>
                  
                  <!-- Feedback Button -->
                  <button 
                    *ngIf="canGiveFeedback(e)" 
                    class="btn btn-sm btn-primary"
                    (click)="toggleFeedbackForm(e)"
                    [class.active]="selectedEnrollment === e">
                    <i class="btn-icon">💬</i>
                    Feedback
                  </button>
                  
                  <!-- Feedback Not Allowed Message -->
                  <div 
                    *ngIf="!canGiveFeedback(e) && e.status === 'Approved'" 
                    class="feedback-restriction">
                    <i class="restriction-icon">⏳</i>
                    <span class="restriction-text">Feedback not allowed until this batch finishes.</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Feedback Modal -->
    <div *ngIf="showFeedbackModal" class="feedback-modal-overlay" (click)="closeFeedbackModal()">
      <div class="feedback-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="modal-icon">💬</i>
            Share Your Feedback
          </h3>
          <button class="close-btn" (click)="closeFeedbackModal()">
            <i class="close-icon">✕</i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="course-info-header">
            <div class="course-icon">📚</div>
            <div class="course-details">
              <div class="course-name">{{ selectedEnrollment?.courseName }}</div>
              <div class="batch-name">{{ selectedEnrollment?.batchName }}</div>
            </div>
          </div>
          
          <form class="feedback-form">
            <div class="form-group">
              <label class="form-label">Your Rating</label>
              <div class="rating-container">
                <div class="star-rating">
                  <span 
                    *ngFor="let star of [1,2,3,4,5]; let i = index" 
                    class="star" 
                    [class.filled]="i < toNumber(rating.value)"
                    (click)="setRating(i + 1)">
                    ⭐
                  </span>
                </div>
                <div class="rating-text" *ngIf="rating.value">
                  {{ rating.value }} Star{{ toNumber(rating.value) > 1 ? 's' : '' }}
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Your Feedback</label>
              <textarea 
                [formControl]="feedbackText" 
                placeholder="Share your thoughts about this course..."
                class="feedback-textarea"
                rows="4"></textarea>
            </div>
          </form>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="closeFeedbackModal()">
            Cancel
          </button>
          <button 
            class="btn btn-primary"
            (click)="submitFeedback(selectedEnrollment)"
            [disabled]="!rating.value || !feedbackText.value">
            <i class="btn-icon">📤</i>
            Submit Feedback
          </button>
        </div>
      </div>
    </div>

    <!-- Rejection Reason Modal -->
    <div *ngIf="showRejectionModal" class="rejection-modal-overlay" (click)="closeRejectionModal()">
      <div class="rejection-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="modal-icon">⚠️</i>
            Rejection Reason
          </h3>
          <button class="close-btn" (click)="closeRejectionModal()">
            <i class="close-icon">✕</i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="rejection-content">
            <p class="rejection-text">{{ rejectionReason }}</p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-primary" (click)="closeRejectionModal()">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div *ngIf="!loading && enrollments.length === 0" class="empty-state">
      <div class="empty-icon">📚</div>
      <h3>No enrollments found</h3>
      <p>You haven't enrolled in any courses yet. Check out the available batches to get started!</p>
    </div>
  </div>
`,
  styles: [`
    .enrollments-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* Loading State */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .spinner {
      font-size: 2rem;
      margin-bottom: 16px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Table Container */
    .enrollments-table-container {
      background: var(--light-card);
      border-radius: 16px;
      border: 1px solid var(--light-border);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
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

    .stat {
      font-size: 0.9rem;
      color: var(--light-text-secondary);
      font-weight: 500;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .enrollments-table {
      width: 100%;
      border-collapse: collapse;
    }

    .enrollments-table th {
      padding: 16px 20px;
      text-align: left;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--light-text-secondary);
      background: var(--light-surface);
      border-bottom: 1px solid var(--light-border);
      white-space: nowrap;
    }

    .enrollments-table td {
      padding: 16px 20px;
      border-bottom: 1px solid var(--light-border);
      vertical-align: middle;
    }

    .enrollment-row {
      transition: all 0.2s ease;
    }

    .enrollment-row:hover {
      background: var(--light-surface);
    }

    .enrollment-row.approved {
      border-left: 4px solid #10b981;
    }

    .enrollment-row.pending {
      border-left: 4px solid #f59e0b;
    }

    .enrollment-row.rejected {
      border-left: 4px solid #ef4444;
    }

    /* Course Cell */
    .course-cell {
      min-width: 200px;
    }

    .course-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .course-icon {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--primary), #8b5cf6);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .course-details {
      flex: 1;
      min-width: 0;
    }

    .course-name {
      font-weight: 600;
      color: var(--light-text);
      font-size: 0.95rem;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Batch Cell */
    .batch-cell {
      min-width: 150px;
    }

    .batch-info {
      display: flex;
      flex-direction: column;
    }

    .batch-name {
      font-weight: 500;
      color: var(--light-text);
      font-size: 0.9rem;
      margin: 0;
    }

    /* Status Cell */
    .status-cell {
      min-width: 100px;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.approved {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.rejected {
      background: #fee2e2;
      color: #991b1b;
    }

    /* Approver Cell */
    .approver-cell {
      min-width: 120px;
    }

    .approver-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .approver-icon {
      font-size: 1rem;
    }

    .approver-name {
      font-size: 0.9rem;
      color: var(--light-text);
      font-weight: 500;
    }

    .no-approver {
      color: var(--light-text-secondary);
      font-style: italic;
    }

    /* Feedback Cell */
    .feedback-cell {
      min-width: 200px;
    }

    .feedback-status {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .feedback-rating {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .feedback-rating .star {
      font-size: 0.8rem;
      opacity: 0.3;
    }

    .feedback-rating .star.filled {
      opacity: 1;
    }

    .rating-text {
      font-size: 0.8rem;
      color: var(--primary);
      font-weight: 600;
      margin-left: 4px;
    }

    .feedback-preview {
      font-size: 0.8rem;
      color: var(--light-text-secondary);
      line-height: 1.3;
      max-width: 180px;
    }

    .no-feedback {
      color: var(--light-text-secondary);
      font-style: italic;
      font-size: 0.85rem;
    }

    /* Actions Cell */
    .actions-cell {
      min-width: 200px;
    }

    .action-buttons {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 500;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 0.8rem;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
    }

    .btn-primary:hover {
      background: var(--primary-hover);
      transform: translateY(-1px);
    }

    .btn-primary.active {
      background: var(--primary-hover);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
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

    .btn-warning {
      color: #f59e0b;
      border-color: #f59e0b;
    }

    .btn-warning:hover {
      background: #fef3c7;
    }

    .btn-icon {
      font-size: 0.9rem;
    }

    /* Feedback Restriction */
    .feedback-restriction {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 8px;
      font-size: 0.8rem;
      color: #92400e;
      max-width: 200px;
    }

    .restriction-icon {
      font-size: 0.9rem;
      flex-shrink: 0;
    }

    .restriction-text {
      font-weight: 500;
      line-height: 1.3;
    }

    /* Modal Styles */
    .feedback-modal-overlay,
    .rejection-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .feedback-modal,
    .rejection-modal {
      background: var(--light-card);
      border-radius: 16px;
      box-shadow: var(--shadow-xl);
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px 24px 0 24px;
      border-bottom: 1px solid var(--light-border);
      margin-bottom: 24px;
    }

    .modal-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--light-text);
    }

    .modal-icon {
      font-size: 1.5rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--light-text-secondary);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: var(--light-surface);
      color: var(--light-text);
    }

    .modal-body {
      padding: 0 24px 24px 24px;
    }

    .course-info-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: var(--light-surface);
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .course-info-header .course-icon {
      width: 48px;
      height: 48px;
      font-size: 1.75rem;
    }

    .course-info-header .course-name {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .course-info-header .batch-name {
      font-size: 0.9rem;
      color: var(--light-text-secondary);
      margin: 0;
    }

    .feedback-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-weight: 600;
      color: var(--light-text);
      font-size: 0.9rem;
    }

    .rating-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .star-rating {
      display: flex;
      gap: 4px;
    }

    .star {
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.3;
      transition: all 0.2s ease;
    }

    .star.filled {
      opacity: 1;
    }

    .star:hover {
      transform: scale(1.1);
    }

    .rating-text {
      font-size: 0.9rem;
      color: var(--primary);
      font-weight: 600;
    }

    .feedback-textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid var(--light-border);
      border-radius: 8px;
      font-size: 0.9rem;
      font-family: inherit;
      resize: vertical;
      min-height: 100px;
      background: var(--light-bg);
      color: var(--light-text);
    }

    .feedback-textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 24px;
      border-top: 1px solid var(--light-border);
      background: var(--light-surface);
    }

    .rejection-content {
      padding: 20px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 12px;
    }

    .rejection-text {
      margin: 0;
      color: #991b1b;
      font-size: 0.95rem;
      line-height: 1.5;
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
      margin: 0;
      color: var(--light-text-secondary);
      font-size: 1rem;
      max-width: 400px;
    }

    /* Dark Mode Support */
    body.dark-mode .enrollments-table-container {
      background: var(--dark-card);
      border-color: var(--dark-border);
    }

    body.dark-mode .table-header {
      background: var(--dark-surface);
      border-bottom-color: var(--dark-border);
    }

    body.dark-mode .enrollments-table th {
      background: var(--dark-surface);
      border-bottom-color: var(--dark-border);
      color: var(--dark-text-secondary);
    }

    body.dark-mode .enrollments-table td {
      border-bottom-color: var(--dark-border);
    }

    body.dark-mode .enrollment-row:hover {
      background: var(--dark-surface);
    }

    body.dark-mode .course-name,
    body.dark-mode .batch-name,
    body.dark-mode .approver-name {
      color: var(--dark-text);
    }

    body.dark-mode .no-approver {
      color: var(--dark-text-secondary);
    }

    body.dark-mode .feedback-modal,
    body.dark-mode .rejection-modal {
      background: var(--dark-card);
    }

    body.dark-mode .modal-header {
      border-bottom-color: var(--dark-border);
    }

    body.dark-mode .modal-title {
      color: var(--dark-text);
    }

    body.dark-mode .close-btn {
      color: var(--dark-text-secondary);
    }

    body.dark-mode .close-btn:hover {
      background: var(--dark-surface);
      color: var(--dark-text);
    }

    body.dark-mode .course-info-header {
      background: var(--dark-surface);
    }

    body.dark-mode .course-info-header .course-name {
      color: var(--dark-text);
    }

    body.dark-mode .course-info-header .batch-name {
      color: var(--dark-text-secondary);
    }

    body.dark-mode .form-label {
      color: var(--dark-text);
    }

    body.dark-mode .feedback-textarea {
      background: var(--dark-bg);
      border-color: var(--dark-border);
      color: var(--dark-text);
    }

    body.dark-mode .feedback-textarea:focus {
      border-color: var(--primary);
    }

    body.dark-mode .modal-footer {
      border-top-color: var(--dark-border);
      background: var(--dark-surface);
    }

    body.dark-mode .empty-state h3 {
      color: var(--dark-text);
    }

    body.dark-mode .empty-state p {
      color: var(--dark-text-secondary);
    }

    body.dark-mode .rating-text {
      color: var(--primary);
    }

    body.dark-mode .feedback-preview {
      color: var(--dark-text-secondary);
    }

    body.dark-mode .no-feedback {
      color: var(--dark-text-secondary);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .table-stats {
        gap: 16px;
      }

      .enrollments-table th,
      .enrollments-table td {
        padding: 12px 16px;
      }

      .course-cell,
      .batch-cell {
        min-width: 150px;
      }

      .actions-cell {
        min-width: 150px;
      }

      .action-buttons {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }

      .feedback-restriction {
        max-width: 150px;
        font-size: 0.75rem;
      }

      .feedback-modal,
      .rejection-modal {
        margin: 10px;
        max-height: 95vh;
      }

      .modal-header {
        padding: 20px 20px 0 20px;
      }

      .modal-body {
        padding: 0 20px 20px 20px;
      }

      .modal-footer {
        padding: 16px 20px;
        flex-direction: column;
      }

      .modal-footer .btn {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .table-stats {
        flex-direction: column;
        gap: 8px;
      }

      .enrollments-table th,
      .enrollments-table td {
        padding: 10px 12px;
        font-size: 0.85rem;
      }

      .course-icon {
        width: 32px;
        height: 32px;
        font-size: 1.25rem;
      }

      .status-badge {
        padding: 4px 8px;
        font-size: 0.75rem;
      }

      .btn-sm {
        padding: 4px 8px;
        font-size: 0.75rem;
      }

      .feedback-restriction {
        max-width: 120px;
        font-size: 0.7rem;
        padding: 6px 8px;
      }
    }
  `]
})
export class MyEnrollmentsComponent implements OnInit {
  enrollments: any[] = [];
  loading = false;
  
  // Modal states
  showFeedbackModal = false;
  showRejectionModal = false;
  selectedEnrollment: any = null;
  rejectionReason = '';

  // Form controls
  rating = new FormControl('');
  feedbackText = new FormControl('');

  constructor(
    private enrollmentService: EnrollmentService,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit() {
    this.loadEnrollments();
  }

  loadEnrollments() {
    this.loading = true;
    this.enrollmentService.getMyEnrollments().subscribe({
      next: (data) => {
        this.enrollments = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading enrollments:', error);
        this.loading = false;
      }
    });
  }

  getApprovedCount(): number {
    return this.enrollments.filter(e => e.status === 'Approved').length;
  }

  getPendingCount(): number {
    return this.enrollments.filter(e => e.status === 'Pending').length;
  }

  getFeedbackCount(): number {
    return this.enrollments.filter(e => e.feedback).length;
  }

  getStars(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  canGiveFeedback(enrollment: any): boolean {
    // For demo purposes, allow feedback only for completed batches
    // In real app, check if batch end date has passed
    return enrollment.status === 'Approved' && enrollment.batchEndDate && 
           new Date(enrollment.batchEndDate) < new Date();
  }

  toggleFeedbackForm(enrollment: any) {
    this.selectedEnrollment = enrollment;
    this.showFeedbackModal = true;
    this.rating.setValue('');
    this.feedbackText.setValue('');
  }

  closeFeedbackModal() {
    this.showFeedbackModal = false;
    this.selectedEnrollment = null;
    this.rating.setValue('');
    this.feedbackText.setValue('');
  }

  setRating(rating: number) {
    this.rating.setValue(rating.toString());
  }

  submitFeedback(enrollment: any) {
    if (!this.rating.value || !this.feedbackText.value) {
      return;
    }

    const feedbackData = {
      rating: Number(this.rating.value) || 0,
      feedbackText: this.feedbackText.value || ''
    };

    this.feedbackService.submit(Number(enrollment.batchId), feedbackData).subscribe({
      next: (response: any) => {
        console.log('Feedback submitted successfully:', response);
        this.closeFeedbackModal();
        // Show success message
        alert('Feedback submitted successfully!');
      },
      error: (error: any) => {
        console.error('Error submitting feedback:', error);
        alert('Error submitting feedback. Please try again.');
      }
    });
  }

  showRejectionReason(reason: string) {
    this.rejectionReason = reason;
    this.showRejectionModal = true;
  }

  closeRejectionModal() {
    this.showRejectionModal = false;
    this.rejectionReason = '';
  }

  // Helper method for template
  toNumber(value: any): number {
    return Number(value) || 0;
  }
}