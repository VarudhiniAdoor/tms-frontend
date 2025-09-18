import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { animate, style, transition, trigger, state } from '@angular/animations';
import { PaginationComponent } from '../../pagination/pagination.component';
import { EnrollmentService } from '../../../services/enrollment.service';
import { EnrollmentDto } from '../../../models/domain.models';

@Component({
  selector: 'app-enrollment',
  standalone: true,
  styleUrls: ['./manager-dashboard.css'],
  imports: [
    CommonModule, 
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatBadgeModule,
    MatDividerModule,
    MatExpansionModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatRippleModule,
    PaginationComponent
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('400ms ease-out', style({ transform: 'translateX(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('cardHover', [
      state('normal', style({ transform: 'translateY(0)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' })),
      state('hovered', style({ transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' })),
      transition('normal <=> hovered', animate('200ms ease-in-out'))
    ])
  ],
  template: `
<div class="enrollment-container" [@fadeIn]>
  <!-- Professional Section Header -->
  <div class="manager-section-header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="section-title">Enrollment Management</h1>
        <p class="section-description">Manage employee enrollments, approve requests, and track training progress across all batches</p>
      </div>
      <div class="header-stats">
        <div class="stat-button total">
          <div class="stat-icon">
            <i class="material-icons">assignment</i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ enrollments.length }}</span>
            <span class="stat-label">Total Enrollments</span>
          </div>
        </div>
        <div class="stat-button approved">
          <div class="stat-icon">
            <i class="material-icons">check_circle</i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ getApprovedCount() }}</span>
            <span class="stat-label">Approved</span>
          </div>
        </div>
        <div class="stat-button pending">
          <div class="stat-icon">
            <i class="material-icons">pending</i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ getPendingCount() }}</span>
            <span class="stat-label">Pending</span>
          </div>
        </div>
        <div class="stat-button rejected">
          <div class="stat-icon">
            <i class="material-icons">cancel</i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ getRejectedCount() }}</span>
            <span class="stat-label">Rejected</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div *ngIf="loading" class="loading-container">
    <mat-spinner diameter="50"></mat-spinner>
    <p class="loading-text">Loading enrollment requests...</p>
  </div>

  <!-- Main Content -->
  <div *ngIf="!loading" class="content-container">
    <!-- Pending Requests Section -->
    <mat-card class="section-card pending-section" [@fadeIn]>
      <mat-card-header>
        <mat-card-title class="section-title">
          <mat-icon class="section-icon pending">pending_actions</mat-icon>
          Pending Requests
          <mat-badge [matBadge]="pending.length" matBadgeColor="warn" matBadgeSize="medium"></mat-badge>
        </mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div *ngIf="pending.length === 0" class="empty-state">
          <mat-icon class="empty-icon">inbox</mat-icon>
          <h3>No pending requests</h3>
          <p>All enrollment requests have been processed.</p>
        </div>

        <div *ngFor="let r of paginatedPending; trackBy: trackByEnrollmentId" 
             class="enrollment-card pending-card" 
             [@fadeIn]
             (mouseenter)="onCardHover($event, true)"
             (mouseleave)="onCardHover($event, false)">
          <div class="card-header">
            <div class="employee-avatar">
              <mat-icon>person</mat-icon>
            </div>
            <div class="employee-details">
              <h4 class="employee-name">{{r.employeeName}}</h4>
              <div class="enrollment-meta">
                <span class="enrollment-id">#{{r.enrollmentId}}</span>
                <span class="enrollment-date">{{r.createdAt | date:'MMM dd, yyyy'}}</span>
              </div>
            </div>
            <div class="status-badge pending">
              <mat-icon>pending</mat-icon>
              <span>Pending</span>
            </div>
          </div>

          <div class="card-body">
            <div class="course-info">
              <div class="info-item">
                <mat-icon class="info-icon">book</mat-icon>
                <div class="info-content">
                  <span class="info-label">Course</span>
                  <span class="info-value">{{r.courseName}}</span>
                </div>
              </div>
              <div class="info-item">
                <mat-icon class="info-icon">group</mat-icon>
                <div class="info-content">
                  <span class="info-label">Batch</span>
                  <span class="info-value">{{r.batchName}}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card-actions">
            <button mat-raised-button 
                    color="primary" 
                    class="action-button approve-button"
                    (click)="approve(r.enrollmentId)"
                    [disabled]="processingId === r.enrollmentId">
              <mat-icon>check</mat-icon>
              <span>Approve</span>
            </button>
            <button mat-stroked-button 
                    color="warn" 
                    class="action-button reject-button"
                    (click)="toggleReject(r.enrollmentId)"
                    [disabled]="processingId === r.enrollmentId">
              <mat-icon>close</mat-icon>
              <span>Reject</span>
            </button>
          </div>

          <!-- Reject Reason Input -->
          <mat-expansion-panel *ngIf="rejectingId === r.enrollmentId" 
                               class="reject-panel" 
                               [expanded]="true"
                               [@slideIn]>
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>edit</mat-icon>
                Rejection Reason
              </mat-panel-title>
            </mat-expansion-panel-header>
            <div class="reject-content">
              <mat-form-field appearance="outline" class="reason-input">
                <mat-label>Optional rejection reason</mat-label>
                <textarea matInput 
                          [(ngModel)]="rejectReason" 
                          placeholder="Please provide a reason for rejection..."
                          rows="3"></textarea>
              </mat-form-field>
              <div class="reject-actions">
                <button mat-raised-button 
                        color="warn" 
                        (click)="confirmReject(r.enrollmentId)"
                        [disabled]="processingId === r.enrollmentId">
                  <mat-icon>check</mat-icon>
                  Confirm Reject
                </button>
                <button mat-stroked-button 
                        (click)="cancelReject()"
                        [disabled]="processingId === r.enrollmentId">
                  <mat-icon>cancel</mat-icon>
                  Cancel
                </button>
              </div>
            </div>
          </mat-expansion-panel>
        </div>

        <!-- Pagination for Pending -->
        <app-pagination
          *ngIf="pending.length > 0"
          [currentPage]="pendingPage"
          [totalItems]="pendingTotal"
          [pageSize]="pageSize"
          (pageChange)="onPendingPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)">
        </app-pagination>
      </mat-card-content>
    </mat-card>

    <!-- Approved & Rejected Tabs -->
    <mat-tab-group class="results-tabs" [@fadeIn]>
      <!-- Approved Tab -->
      <mat-tab label="Approved">
        <ng-template matTabContent>
          <mat-card class="results-card">
            <mat-card-content>
              <div *ngIf="approved.length === 0" class="empty-state">
                <mat-icon class="empty-icon">check_circle_outline</mat-icon>
                <h3>No approved enrollments</h3>
                <p>Approved enrollments will appear here.</p>
              </div>

              <div *ngIf="approved.length > 0" class="table-container">
                <table mat-table [dataSource]="paginatedApproved" class="results-table">
                  <ng-container matColumnDef="employee">
                    <th mat-header-cell *matHeaderCellDef>Employee</th>
                    <td mat-cell *matCellDef="let element">
                      <div class="employee-cell">
                        <mat-icon class="cell-icon">person</mat-icon>
                        {{element.employeeName}}
                      </div>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="course">
                    <th mat-header-cell *matHeaderCellDef>Course</th>
                    <td mat-cell *matCellDef="let element">
                      <div class="course-cell">
                        <mat-icon class="cell-icon">book</mat-icon>
                        {{element.courseName}}
                      </div>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="batch">
                    <th mat-header-cell *matHeaderCellDef>Batch</th>
                    <td mat-cell *matCellDef="let element">
                      <div class="batch-cell">
                        <mat-icon class="cell-icon">group</mat-icon>
                        {{element.batchName}}
                      </div>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Status</th>
                    <td mat-cell *matCellDef="let element">
                      <mat-chip class="status-chip approved">
                        <mat-icon matChipAvatar>check_circle</mat-icon>
                        Approved
                      </mat-chip>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="approvedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: approvedColumns;" [@fadeIn]></tr>
                </table>

                <!-- Pagination for Approved -->
                <app-pagination
                  *ngIf="approved.length > 0"
                  [currentPage]="approvedPage"
                  [totalItems]="approvedTotal"
                  [pageSize]="pageSize"
                  (pageChange)="onApprovedPageChange($event)"
                  (pageSizeChange)="onPageSizeChange($event)">
                </app-pagination>
              </div>
            </mat-card-content>
          </mat-card>
        </ng-template>
      </mat-tab>

      <!-- Rejected Tab -->
      <mat-tab label="Rejected">
        <ng-template matTabContent>
          <mat-card class="results-card">
            <mat-card-content>
              <div *ngIf="rejected.length === 0" class="empty-state">
                <mat-icon class="empty-icon">cancel_outline</mat-icon>
                <h3>No rejected enrollments</h3>
                <p>Rejected enrollments will appear here.</p>
              </div>

              <div *ngIf="rejected.length > 0" class="table-container">
                <table mat-table [dataSource]="paginatedRejected" class="results-table">
                  <ng-container matColumnDef="employee">
                    <th mat-header-cell *matHeaderCellDef>Employee</th>
                    <td mat-cell *matCellDef="let element">
                      <div class="employee-cell">
                        <mat-icon class="cell-icon">person</mat-icon>
                        {{element.employeeName}}
                      </div>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="course">
                    <th mat-header-cell *matHeaderCellDef>Course</th>
                    <td mat-cell *matCellDef="let element">
                      <div class="course-cell">
                        <mat-icon class="cell-icon">book</mat-icon>
                        {{element.courseName}}
                      </div>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="batch">
                    <th mat-header-cell *matHeaderCellDef>Batch</th>
                    <td mat-cell *matCellDef="let element">
                      <div class="batch-cell">
                        <mat-icon class="cell-icon">group</mat-icon>
                        {{element.batchName}}
                      </div>
                    </td>
                  </ng-container>


                  <ng-container matColumnDef="reason">
                    <th mat-header-cell *matHeaderCellDef>Reason</th>
                    <td mat-cell *matCellDef="let element">
                      <span class="reason-text">{{element.rejectReason || 'No reason provided'}}</span>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="rejectedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: rejectedColumns;" [@fadeIn]></tr>
                </table>

                <!-- Pagination for Rejected -->
                <app-pagination
                  *ngIf="rejected.length > 0"
                  [currentPage]="rejectedPage"
                  [totalItems]="rejectedTotal"
                  [pageSize]="pageSize"
                  (pageChange)="onRejectedPageChange($event)"
                  (pageSizeChange)="onPageSizeChange($event)">
                </app-pagination>
              </div>
            </mat-card-content>
          </mat-card>
        </ng-template>
      </mat-tab>
    </mat-tab-group>
  </div>
</div>
  `,
  styles: [`
    .enrollment-container {
      padding: 0;
      max-width: 100%;
      margin: 0;
      background: transparent;
      min-height: auto;
    }

    .status-overview {
      margin-bottom: 24px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .status-chips {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .status-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .status-chip.pending {
      background: #f1f5f9;
      color: #64748b;
    }

    .status-chip.approved {
      background: #f0fdf4;
      color: #16a34a;
    }

    .status-chip.rejected {
      background: #fef2f2;
      color: #dc2626;
    }

    .status-chip mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px;
      text-align: center;
    }

    .loading-text {
      margin-top: 16px;
      color: #666;
      font-size: 1.1rem;
    }

    .content-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .section-card {
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .section-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .pending-section {
      background: white;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a202c;
      margin: 0;
    }

    .section-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .section-icon.pending {
      color: #64748b;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: #666;
    }

    .empty-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #bdc3c7;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 16px 0 8px 0;
      color: #7f8c8d;
      font-weight: 400;
    }

    .empty-state p {
      margin: 0;
      font-size: 1rem;
    }

    .enrollment-card {
      background: white;
      border-radius: 8px;
      margin-bottom: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
      overflow: hidden;
      position: relative;
    }

    .enrollment-card.pending-card {
      border-left: 4px solid #fbbf24;
      border-bottom: 2px solid #f3f4f6;
    }

    .enrollment-card.pending-card:not(:last-child) {
      border-bottom: 2px solid #e5e7eb;
    }

    .enrollment-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .enrollment-card[data-hover="true"] {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px 16px 24px;
      border-bottom: 1px solid #f1f5f9;
    }

    .employee-avatar {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      font-size: 20px;
      flex-shrink: 0;
      border: 1px solid #e2e8f0;
    }

    .employee-details {
      flex: 1;
    }

    .employee-name {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: #1a202c;
    }

    .enrollment-meta {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .enrollment-id {
      font-size: 12px;
      color: #64748b;
      background: #f1f5f9;
      padding: 4px 8px;
      border-radius: 6px;
      font-weight: 500;
    }

    .enrollment-date {
      font-size: 12px;
      color: #94a3b8;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #d97706;
      border: 1px solid #fbbf24;
    }

    .status-badge mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .status-badge.pending mat-icon {
      color: #d97706;
    }

    .card-body {
      padding: 16px 24px;
    }

    .course-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .info-icon {
      font-size: 18px;
      color: #94a3b8;
      width: 20px;
      text-align: center;
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .info-label {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 14px;
      color: #1a202c;
      font-weight: 500;
    }

    .card-actions {
      display: flex;
      gap: 12px;
      padding: 16px 24px 20px 24px;
      background: #fafbfc;
      border-top: 1px solid #f1f5f9;
    }

    .action-button {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 120px;
      height: 40px;
      border-radius: 8px;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      flex: 1;
      justify-content: center;
    }

    .approve-button {
      background: #10b981;
      color: white;
      border: none;
    }

    .approve-button:hover:not(:disabled) {
      background: #059669;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
    }

    .reject-button {
      background: #f8fafc;
      color: #64748b;
      border: 1px solid #e2e8f0;
    }

    .reject-button:hover:not(:disabled) {
      background: #f1f5f9;
      color: #374151;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .reject-panel {
      margin-top: 0;
      border-top: 1px solid #ecf0f1;
    }

    .reject-content {
      padding: 20px;
      background: #f8f9fa;
    }

    .reason-input {
      width: 100%;
      margin-bottom: 16px;
    }

    .reject-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .results-tabs {
      margin-top: 24px;
    }

    .results-card {
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }

    .table-container {
      overflow-x: auto;
    }

    .results-table {
      width: 100%;
      background: white;
    }

    .results-table th {
      background: #f8fafc;
      color: #374151;
      font-weight: 600;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .results-table td {
      padding: 12px 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .employee-cell, .course-cell, .batch-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cell-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      color: #9ca3af;
    }

    .status-chip {
      font-size: 0.85rem;
      height: 28px;
    }

    .status-chip.approved {
      background: #f0fdf4;
      color: #16a34a;
    }

    .reason-text {
      font-style: italic;
      color: #666;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .enrollment-container {
        padding: 16px;
      }

      .status-overview {
        padding: 16px;
      }

      .status-chips {
        flex-direction: column;
        gap: 8px;
      }

      .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .employee-details {
        width: 100%;
      }

      .enrollment-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .course-info {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .card-actions {
        flex-direction: column;
        gap: 8px;
      }

      .action-button {
        width: 100%;
        min-width: auto;
      }

      .table-container {
        font-size: 0.9rem;
      }

      .results-table th,
      .results-table td {
        padding: 12px 4px;
      }
    }

    @media (max-width: 480px) {
      .enrollment-container {
        padding: 12px;
      }

      .page-title {
        font-size: 1.5rem;
      }

      .title-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }

      .card-content {
        padding: 16px;
      }

      .avatar {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
      }

      .employee-name {
        font-size: 1.1rem;
      }

      .action-button {
        height: 36px;
        font-size: 0.9rem;
      }
    }

    /* Animation classes */
    .fade-in {
      animation: fadeIn 0.3s ease-in;
    }

    .slide-in {
      animation: slideIn 0.4s ease-out;
    }

    .scale-in {
      animation: scaleIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideIn {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }

    @keyframes scaleIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    /* Snackbar custom styles */
    ::ng-deep .success-snackbar {
      background: #27ae60;
      color: white;
    }

    ::ng-deep .error-snackbar {
      background: #e74c3c;
      color: white;
    }
  `]
})
export class EnrollmentComponent implements OnInit {
  pending: EnrollmentDto[] = [];
  approved: EnrollmentDto[] = [];
  rejected: EnrollmentDto[] = [];
  paginatedPending: EnrollmentDto[] = [];
  paginatedApproved: EnrollmentDto[] = [];
  paginatedRejected: EnrollmentDto[] = [];
  loading = false;

  // Pagination for each section
  pendingPage = 1;
  approvedPage = 1;
  rejectedPage = 1;
  pageSize = 6;
  pendingTotal = 0;
  approvedTotal = 0;
  rejectedTotal = 0;

  rejectingId: number | null = null;
  rejectReason: string = '';
  processingId: number | null = null;

  // Table column definitions
  approvedColumns: string[] = ['employee', 'course', 'batch', 'status'];
  rejectedColumns: string[] = ['employee', 'course', 'batch', 'reason'];

  @Output() pendingChanged = new EventEmitter<number>();

  constructor(
    private enrollSvc: EnrollmentService,
    private snackBar: MatSnackBar
  ) {}

  get enrollments(): EnrollmentDto[] {
    return [...this.pending, ...this.approved, ...this.rejected];
  }

  getApprovedCount(): number {
    return this.approved.length;
  }

  getPendingCount(): number {
    return this.pending.length;
  }

  getRejectedCount(): number {
    return this.rejected.length;
  }

  ngOnInit() {
    this.loading = true;
    this.enrollSvc.getManaged().subscribe({
      next: data => {
        this.pending = data.filter(e => e.status === 'Requested');
        this.approved = data.filter(e => e.status === 'Approved');
        this.rejected = data.filter(e => e.status === 'Rejected');
        
        this.pendingTotal = this.pending.length;
        this.approvedTotal = this.approved.length;
        this.rejectedTotal = this.rejected.length;
        
        this.updatePaginatedData();
        this.loading = false;
        this.pendingChanged.emit(this.pending.length);
      },
      error: () => { this.loading = false; }
    });
  }

  approve(id: number) {
    this.processingId = id;
    this.enrollSvc.approve(id).subscribe({
      next: () => {
        this.moveTo(id, 'Approved');
        this.snackBar.open('Enrollment approved successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.processingId = null;
      },
      error: (error) => {
        this.snackBar.open('Failed to approve enrollment. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.processingId = null;
        console.error('Approval error:', error);
      }
    });
  }

  toggleReject(id: number) {
    this.rejectingId = id;
    this.rejectReason = '';
  }

  cancelReject() {
    this.rejectingId = null;
    this.rejectReason = '';
  }

  confirmReject(id: number) {
    this.processingId = id;
    this.enrollSvc.reject(id, this.rejectReason).subscribe({
      next: () => {
        this.moveTo(id, 'Rejected', this.rejectReason);
        this.cancelReject();
        this.snackBar.open('Enrollment rejected successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.processingId = null;
      },
      error: (error) => {
        this.snackBar.open('Failed to reject enrollment. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.processingId = null;
        console.error('Rejection error:', error);
      }
    });
  }

  // Track by function for better performance
  trackByEnrollmentId(index: number, item: EnrollmentDto): number {
    return item.enrollmentId;
  }

  // Card hover animation
  onCardHover(event: Event, isHovered: boolean) {
    const card = (event.target as HTMLElement).closest('.enrollment-card');
    if (card) {
      card.setAttribute('data-hover', isHovered.toString());
    }
  }

  private moveTo(id: number, status: 'Approved' | 'Rejected', reason?: string) {
    const item = this.pending.find(r => r.enrollmentId === id);
    if (!item) return;

    this.pending = this.pending.filter(r => r.enrollmentId !== id);
    this.pendingChanged.emit(this.pending.length);

    if (status === 'Approved') {
      this.approved.push({ ...item, status, approvedBy: 'Me' });
    } else {
      this.rejected.push({ ...item, status, approvedBy: 'Me', rejectReason: reason });
    }

    // Update totals and pagination
    this.pendingTotal = this.pending.length;
    this.approvedTotal = this.approved.length;
    this.rejectedTotal = this.rejected.length;
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    // Update pending pagination
    const pendingStart = (this.pendingPage - 1) * this.pageSize;
    const pendingEnd = pendingStart + this.pageSize;
    this.paginatedPending = this.pending.slice(pendingStart, pendingEnd);

    // Update approved pagination
    const approvedStart = (this.approvedPage - 1) * this.pageSize;
    const approvedEnd = approvedStart + this.pageSize;
    this.paginatedApproved = this.approved.slice(approvedStart, approvedEnd);

    // Update rejected pagination
    const rejectedStart = (this.rejectedPage - 1) * this.pageSize;
    const rejectedEnd = rejectedStart + this.pageSize;
    this.paginatedRejected = this.rejected.slice(rejectedStart, rejectedEnd);
  }

  onPendingPageChange(page: number) {
    this.pendingPage = page;
    this.updatePaginatedData();
  }

  onApprovedPageChange(page: number) {
    this.approvedPage = page;
    this.updatePaginatedData();
  }

  onRejectedPageChange(page: number) {
    this.rejectedPage = page;
    this.updatePaginatedData();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.pendingPage = 1;
    this.approvedPage = 1;
    this.rejectedPage = 1;
    this.updatePaginatedData();
  }
}
