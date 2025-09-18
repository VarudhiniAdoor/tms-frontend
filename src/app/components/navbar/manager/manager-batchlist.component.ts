import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaginationComponent } from '../../pagination/pagination.component';
import { 
  faLayerGroup, faBook, faCalendarAlt, faUsers, faClock, faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import { BatchService } from '../../../services/batch.service';
import { Batch } from '../../../models/domain.models';

@Component({
  selector: 'app-batches-list',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, PaginationComponent],
  styleUrls: ['./manager-dashboard.css'],
  template: `
    <div class="batches-container">
      <!-- Professional Section Header -->
      <div class="manager-section-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="section-title">Batch Management</h1>
            <p class="section-description">Manage and monitor training batches, track enrollments, and ensure smooth course delivery</p>
          </div>
          <div class="header-stats">
            <div class="stat-button total">
              <div class="stat-icon">
                <fa-icon [icon]="faLayerGroup"></fa-icon>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ batches.length }}</span>
                <span class="stat-label">Total Batches</span>
              </div>
            </div>
            <div class="stat-button active">
              <div class="stat-icon">
                <fa-icon [icon]="faCalendarAlt"></fa-icon>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ getActiveBatchesCount() }}</span>
                <span class="stat-label">Active</span>
              </div>
            </div>
            <div class="stat-button upcoming">
              <div class="stat-icon">
                <fa-icon [icon]="faClock"></fa-icon>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ getUpcomingBatchesCount() }}</span>
                <span class="stat-label">Upcoming</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <div class="spinner">
          <fa-icon [icon]="faClock" class="spinner-icon"></fa-icon>
        </div>
        <p class="loading-text">Loading batches...</p>
      </div>

      <!-- Batches Grid -->
      <div class="batches-grid" *ngIf="!loading && paginatedBatches.length > 0">
        <div *ngFor="let batch of paginatedBatches" class="batch-card">
          <div class="batch-header">
            <div class="batch-icon">
              <fa-icon [icon]="faGraduationCap"></fa-icon>
            </div>
            <div class="batch-info">
              <h3 class="batch-name">{{ batch.batchName }}</h3>
              <p class="course-name">
                <fa-icon [icon]="faBook" class="info-icon"></fa-icon>
                {{ batch.calendar?.course?.courseName || 'No Course' }}
              </p>
            </div>
          </div>

          <div class="batch-details">
            <div class="detail-item">
              <fa-icon [icon]="faCalendarAlt" class="detail-icon"></fa-icon>
              <div class="detail-content">
                <span class="detail-label">Start Date</span>
                    <span class="detail-value">{{ batch.calendar?.startDate ? (batch.calendar.startDate | date:'MMM dd, yyyy') : 'TBD' }}</span>
              </div>
            </div>
            <div class="detail-item">
              <fa-icon [icon]="faCalendarAlt" class="detail-icon"></fa-icon>
              <div class="detail-content">
                <span class="detail-label">End Date</span>
                    <span class="detail-value">{{ batch.calendar?.endDate ? (batch.calendar.endDate | date:'MMM dd, yyyy') : 'TBD' }}</span>
              </div>
            </div>
            <div class="detail-item">
              <fa-icon [icon]="faUsers" class="detail-icon"></fa-icon>
              <div class="detail-content">
                <span class="detail-label">Enrollments</span>
                <span class="detail-value">{{ batch.enrollmentCount || 0 }}</span>
              </div>
            </div>
          </div>

          
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && batches.length === 0" class="empty-state">
        <div class="empty-icon">
          <fa-icon [icon]="faLayerGroup"></fa-icon>
        </div>
        <h3>No batches available</h3>
        <p>There are currently no training batches scheduled.</p>
        <button class="btn btn-primary" (click)="loadBatches()">
          <fa-icon [icon]="faClock"></fa-icon>
          Refresh
        </button>
      </div>

      <!-- Pagination -->
      <app-pagination
        *ngIf="!loading && batches.length > 0"
        [currentPage]="currentPage"
        [totalItems]="totalItems"
        [pageSize]="pageSize"
        (pageChange)="onPageChange($event)"
        (pageSizeChange)="onPageSizeChange($event)">
      </app-pagination>
    </div>
  `,
  styles: [`
    .batches-container {
      padding: 0;
      max-width: 100%;
      margin: 0;
      background: transparent;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e2e8f0;
    }

    .header-content h2 {
      margin: 0 0 8px 0;
      color: #1a202c;
      font-size: 1.75rem;
      font-weight: 600;
    }

    .header-content p {
      margin: 0;
      color: #64748b;
      font-size: 0.95rem;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .batch-stats {
      display: flex;
      gap: 16px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 20px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 12px;
      color: white;
      min-width: 100px;
    }

    .stat-icon {
      font-size: 20px;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 12px;
      font-weight: 500;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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
      width: 50px;
      height: 50px;
      border: 3px solid #e2e8f0;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .spinner-icon {
      font-size: 20px;
      color: #667eea;
    }

    .loading-text {
      color: #64748b;
      font-size: 16px;
      margin: 0;
    }

    .batches-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .batch-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
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
      background: linear-gradient(135deg, #667eea, #764ba2);
    }

    .batch-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
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
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      flex-shrink: 0;
    }

    .batch-info {
      flex: 1;
    }

    .batch-name {
      font-size: 18px;
      font-weight: 600;
      color: #1a202c;
      margin: 0 0 8px 0;
    }

    .course-name {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #64748b;
      font-size: 14px;
      margin: 0;
    }

    .info-icon {
      font-size: 14px;
      color: #94a3b8;
    }

    .batch-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 20px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .detail-icon {
      font-size: 16px;
      color: #94a3b8;
      width: 20px;
      text-align: center;
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .detail-label {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-value {
      font-size: 14px;
      color: #1a202c;
      font-weight: 500;
    }

    .batch-actions {
      display: flex;
      gap: 12px;
      margin-top: auto;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      flex: 1;
      justify-content: center;
    }

    .action-btn.primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .action-btn.primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .action-btn.secondary {
      background: #f8fafc;
      color: #64748b;
      border: 1px solid #e2e8f0;
    }

    .action-btn.secondary:hover {
      background: #e2e8f0;
      color: #1a202c;
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
      font-size: 64px;
      color: #cbd5e1;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      font-size: 20px;
      font-weight: 600;
      color: #1a202c;
      margin: 0 0 8px 0;
    }

    .empty-state p {
      color: #64748b;
      margin: 0 0 24px 0;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .batches-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .batch-stats {
        width: 100%;
        justify-content: center;
      }

      .batch-actions {
        flex-direction: column;
      }
    }

    @media (max-width: 480px) {
      .batch-card {
        padding: 20px;
      }

      .batch-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .batch-icon {
        width: 40px;
        height: 40px;
        font-size: 18px;
      }
    }
  `]
})
export class BatchesListComponent implements OnInit {
  batches: any[] = [];
  paginatedBatches: any[] = [];
  loading = false;
  
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 6;
  totalItems: number = 0;

  // Font Awesome icons
  faLayerGroup = faLayerGroup;
  faBook = faBook;
  faCalendarAlt = faCalendarAlt;
  faUsers = faUsers;
  faClock = faClock;
  faGraduationCap = faGraduationCap;

  constructor(private batchSvc: BatchService) {}

  getActiveBatchesCount(): number {
    const now = new Date();
    return this.batches.filter(batch => {
      const startDate = batch.calendar?.startDate ? new Date(batch.calendar.startDate) : null;
      const endDate = batch.calendar?.endDate ? new Date(batch.calendar.endDate) : null;
      return startDate && endDate && now >= startDate && now <= endDate;
    }).length;
  }

  getUpcomingBatchesCount(): number {
    const now = new Date();
    return this.batches.filter(batch => {
      const startDate = batch.calendar?.startDate ? new Date(batch.calendar.startDate) : null;
      return startDate && startDate > now;
    }).length;
  }

  ngOnInit() {
    this.loadBatches();
  }

  loadBatches() {
    this.loading = true;
    this.batchSvc.getAll().subscribe({
      next: data => { 
        this.batches = data; 
        this.totalItems = data.length;
        this.updatePaginatedBatches();
        this.loading = false; 
      },
      error: () => { 
        this.batches = []; 
        this.totalItems = 0;
        this.paginatedBatches = [];
        this.loading = false; 
      }
    });
  }

  updatePaginatedBatches() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedBatches = this.batches.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedBatches();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1; // Reset to first page
    this.updatePaginatedBatches();
  }
}