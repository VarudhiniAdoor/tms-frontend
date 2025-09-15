import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchService } from '../../../services/batch.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Batch } from '../../../models/domain.models';

@Component({
  selector: 'app-employee-batches',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="batches-content">
      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <div class="spinner">⏳</div>
        <p>Loading available batches...</p>
      </div>

      <!-- Warning Message -->
      <div *ngIf="warning" class="alert alert-warning">
        <i class="alert-icon">⚠️</i>
        {{ warning }}
      </div>

      <!-- Batches Grid -->
      <div class="batches-grid" *ngIf="!loading && batches.length > 0">
        <div *ngFor="let b of batches" class="batch-card" [class.enrolled]="getStatus(b.batchId) !== 'Not Enrolled'">
          <div class="batch-header">
            <div class="batch-icon">
              <i class="icon">📚</i>
            </div>
            <div class="batch-info">
              <h3 class="batch-title">{{ b.batchName }}</h3>
              <p class="batch-id">Batch #{{ b.batchId }}</p>
            </div>
            <div class="batch-status">
              <span class="status-badge" [class]="getStatusClass(b.batchId)">
                {{ getStatus(b.batchId) }}
              </span>
            </div>
          </div>
          
          <div class="batch-content">
            <div class="course-info">
              <div class="info-item">
                <i class="info-icon">🎓</i>
                <div class="info-content">
                  <span class="info-label">Course</span>
                  <span class="info-value">{{ b.calendar?.course?.courseName ?? 'Course not specified' }}</span>
                </div>
              </div>
              <div class="info-item" *ngIf="b.calendar?.course?.durationDays">
                <i class="info-icon">⏱️</i>
                <div class="info-content">
                  <span class="info-label">Duration</span>
                  <span class="info-value">{{ b.calendar?.course?.durationDays }} days</span>
                </div>
              </div>
            </div>
            
            <div class="date-info">
              <div class="date-item">
                <i class="info-icon">📅</i>
                <div class="date-content">
                  <span class="date-label">Start Date</span>
                  <span class="date-value">{{ b.calendar?.startDate | date:'MMM dd, yyyy' }}</span>
                </div>
              </div>
              <div class="date-item">
                <i class="info-icon">🏁</i>
                <div class="date-content">
                  <span class="date-label">End Date</span>
                  <span class="date-value">{{ b.calendar?.endDate | date:'MMM dd, yyyy' }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="batch-actions">
            <button 
              (click)="request(b.batchId)" 
              [disabled]="getStatus(b.batchId) !== 'Not Enrolled'"
              class="btn btn-primary"
              [class.btn-disabled]="getStatus(b.batchId) !== 'Not Enrolled'">
              <i class="btn-icon">{{ getStatus(b.batchId) === 'Not Enrolled' ? '📝' : '✅' }}</i>
              <span>{{ getStatus(b.batchId) === 'Not Enrolled' ? 'Request Enrollment' : 'Already Enrolled' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && batches.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <h3>No batches available</h3>
        <p>There are currently no training batches available for enrollment.</p>
        <button class="btn btn-outline" (click)="loadBatches()">
          <i class="btn-icon">🔄</i>
          Refresh
      </button>
      </div>
    </div>
  `,
  styles: [`
    .batches-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

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
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
      color: var(--primary);
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .loading-container p {
      margin: 0;
      color: var(--light-text-secondary);
      font-size: 1rem;
    }

    .alert {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-radius: 8px;
      font-weight: 500;
      margin: 16px 0;
    }

    .alert-warning {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeaa7;
    }

    .alert-icon {
      font-size: 1.2rem;
    }

    .batches-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
    }

    .batch-card {
      background: var(--light-card);
      border: 1px solid var(--light-border);
      border-radius: 16px;
      padding: 24px;
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-normal);
      position: relative;
      overflow: hidden;
    }

    .batch-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, var(--primary), #8b5cf6);
    }

    .batch-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary);
    }

    .batch-card.enrolled {
      border-color: #10b981;
    }

    .batch-card.enrolled::before {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .batch-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 20px;
    }

    .batch-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--primary), #8b5cf6);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .batch-icon .icon {
      font-size: 1.5rem;
    }

    .batch-info {
      flex: 1;
      min-width: 0;
    }

    .batch-title {
      margin: 0 0 4px 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--light-text);
      line-height: 1.3;
    }

    .batch-id {
      margin: 0;
      font-size: 0.85rem;
      color: var(--light-text-secondary);
      font-family: 'Courier New', monospace;
    }

    .batch-status {
      flex-shrink: 0;
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

    .status-badge.not-enrolled {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-badge.pending {
      background: #fff3e0;
      color: #f57c00;
    }

    .status-badge.approved {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .status-badge.rejected {
      background: #ffebee;
      color: #c62828;
    }

    .batch-content {
      margin-bottom: 20px;
    }

    .course-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .info-icon {
      font-size: 1rem;
      width: 16px;
      text-align: center;
      color: var(--primary);
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .info-label {
      font-size: 0.8rem;
      color: var(--light-text-secondary);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 0.95rem;
      color: var(--light-text);
      font-weight: 600;
    }

    .date-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .date-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .date-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .date-label {
      font-size: 0.8rem;
      color: var(--light-text-secondary);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .date-value {
      font-size: 0.95rem;
      color: var(--light-text);
      font-weight: 600;
    }

    .batch-actions {
      display: flex;
      justify-content: flex-end;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all var(--transition-fast);
      text-decoration: none;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
    }

    .btn-primary:hover:not(.btn-disabled) {
      background: var(--primary-hover);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .btn-disabled {
      background: #10b981;
      color: white;
      cursor: not-allowed;
      opacity: 0.8;
    }

    .btn-outline {
      border: 2px solid var(--primary);
      background: transparent;
      color: var(--primary);
    }

    .btn-outline:hover {
      background: var(--primary);
      color: white;
      transform: translateY(-1px);
    }

    .btn-icon {
      font-size: 1rem;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--light-text-secondary);
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 16px;
      opacity: 0.6;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      font-size: 1.2rem;
      color: var(--light-text);
    }

    .empty-state p {
      margin: 0 0 24px 0;
      font-size: 0.95rem;
    }

    /* Dark mode support */

    body.dark-mode .loading-container p {
      color: var(--dark-text-secondary);
    }

    body.dark-mode .alert-warning {
      background: #2d2a1a;
      color: #f1c40f;
      border-color: #f39c12;
    }

    body.dark-mode .batch-card {
      background: var(--dark-card);
      border-color: var(--dark-border);
    }

    body.dark-mode .batch-title {
      color: var(--dark-text);
    }

    body.dark-mode .batch-id {
      color: var(--dark-text-secondary);
    }

    body.dark-mode .info-value,
    body.dark-mode .date-value {
      color: var(--dark-text);
    }

    body.dark-mode .info-label,
    body.dark-mode .date-label {
      color: var(--dark-text-secondary);
    }

    body.dark-mode .empty-state h3 {
      color: var(--dark-text);
    }

    body.dark-mode .empty-state {
      color: var(--dark-text-secondary);
    }

    /* Responsive design */
    @media (max-width: 768px) {

      .batches-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .date-info {
        grid-template-columns: 1fr;
        gap: 12px;
      }
    }

    @media (max-width: 480px) {
      .stats-overview {
        flex-direction: column;
        gap: 12px;
      }

      .stat-item {
        min-width: auto;
      }
    }
  `]
})
export class EmployeeBatchesComponent implements OnInit {
  batches: Batch[] = [];
  loading = false;
  warning?: string;
  statusByBatch = new Map<number,string>();

  constructor(private batchSvc: BatchService, private enrollSvc: EnrollmentService) {}

  ngOnInit() {
    this.loadBatches();
  }

  loadBatches() {
    this.loading = true;
    this.batchSvc.getAll().subscribe({
      next: data => {
        this.batches = data;
        this.loading = false;
        this.enrollSvc.getMyEnrollments().subscribe(list => {
          (list || []).forEach(e => {
            const matching = this.batches.find(b => b.batchName === e.batchName);
            if (matching) this.statusByBatch.set(matching.batchId, e.status);
          });
        });
      },
      error: () => this.loading = false
    });
  }

  getStatus(batchId:number) {
    return this.statusByBatch.get(batchId) ?? 'Not Enrolled';
  }

  getStatusClass(batchId: number): string {
    const status = this.getStatus(batchId);
    return status.toLowerCase().replace(' ', '-');
  }

  getEnrolledCount(): number {
    return Array.from(this.statusByBatch.values()).filter(status => status !== 'Not Enrolled').length;
  }

  request(batchId:number) {
    this.enrollSvc.requestEnrollment(batchId).subscribe({
      next: dto => { this.statusByBatch.set(batchId, dto.status); alert('Enrollment requested!'); }
    });
  }
}
