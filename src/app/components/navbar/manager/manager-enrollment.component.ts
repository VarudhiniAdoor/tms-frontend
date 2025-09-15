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
import { EnrollmentService } from '../../../services/enrollment.service';
import { EnrollmentDto } from '../../../models/domain.models';

@Component({
  selector: 'app-enrollment',
  standalone: true,
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
    MatRippleModule
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
  <!-- Header Section -->
  <div class="header-section">
    <div class="header-content">
      <h1 class="page-title">
        <mat-icon class="title-icon">school</mat-icon>
        Enrollment Management
      </h1>
      <div class="header-actions">
        <mat-chip-listbox>
          <mat-chip-option [selected]="true">
            <mat-icon matChipAvatar>pending</mat-icon>
            Pending ({{pending.length}})
          </mat-chip-option>
          <mat-chip-option>
            <mat-icon matChipAvatar>check_circle</mat-icon>
            Approved ({{approved.length}})
          </mat-chip-option>
          <mat-chip-option>
            <mat-icon matChipAvatar>cancel</mat-icon>
            Rejected ({{rejected.length}})
          </mat-chip-option>
        </mat-chip-listbox>
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

        <div *ngFor="let r of pending; trackBy: trackByEnrollmentId" 
             class="enrollment-card pending-card" 
             [@fadeIn]
             (mouseenter)="onCardHover($event, true)"
             (mouseleave)="onCardHover($event, false)">
          <div class="card-content">
            <div class="employee-info">
              <div class="avatar">
                <mat-icon>person</mat-icon>
              </div>
              <div class="info-text">
                <h4 class="employee-name">{{r.employeeName}}</h4>
                <p class="course-info">
                  <mat-icon class="info-icon">book</mat-icon>
                  {{r.courseName}}
                </p>
                <p class="batch-info">
                  <mat-icon class="info-icon">group</mat-icon>
                  {{r.batchName}}
                </p>
              </div>
            </div>

            <div class="card-actions">
              <button mat-raised-button 
                      color="primary" 
                      class="action-button approve-button"
                      (click)="approve(r.enrollmentId)"
                      [disabled]="processingId === r.enrollmentId">
                <mat-icon>check</mat-icon>
                Approve
              </button>
              <button mat-stroked-button 
                      color="warn" 
                      class="action-button reject-button"
                      (click)="toggleReject(r.enrollmentId)"
                      [disabled]="processingId === r.enrollmentId">
                <mat-icon>close</mat-icon>
                Reject
              </button>
            </div>
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
                <table mat-table [dataSource]="approved" class="results-table">
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

                  <ng-container matColumnDef="approvedBy">
                    <th mat-header-cell *matHeaderCellDef>Approved By</th>
                    <td mat-cell *matCellDef="let element">
                      <mat-chip class="approver-chip">
                        <mat-icon matChipAvatar>verified</mat-icon>
                        {{element.approvedBy}}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="approvedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: approvedColumns;" [@fadeIn]></tr>
                </table>
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
                <table mat-table [dataSource]="rejected" class="results-table">
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

                  <ng-container matColumnDef="rejectedBy">
                    <th mat-header-cell *matHeaderCellDef>Rejected By</th>
                    <td mat-cell *matCellDef="let element">
                      <mat-chip class="rejector-chip">
                        <mat-icon matChipAvatar>block</mat-icon>
                        {{element.approvedBy}}
                      </mat-chip>
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
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
    }

    .header-section {
      margin-bottom: 32px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .page-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      font-size: 2.5rem;
      font-weight: 300;
      color: #2c3e50;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .title-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      color: #3498db;
    }

    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
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
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      border: none;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .section-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    }

    .pending-section {
      background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      font-weight: 500;
      color: #2c3e50;
      margin: 0;
    }

    .section-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .section-icon.pending {
      color: #f39c12;
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
      border-radius: 12px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      overflow: hidden;
      border-left: 4px solid #f39c12;
    }

    .enrollment-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .enrollment-card[data-hover="true"] {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .card-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      gap: 16px;
    }

    .employee-info {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3498db, #2980b9);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
    }

    .info-text {
      flex: 1;
    }

    .employee-name {
      margin: 0 0 8px 0;
      font-size: 1.2rem;
      font-weight: 500;
      color: #2c3e50;
    }

    .course-info, .batch-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 4px 0;
      color: #666;
      font-size: 0.95rem;
    }

    .info-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      color: #95a5a6;
    }

    .card-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .action-button {
      min-width: 120px;
      height: 40px;
      border-radius: 8px;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
    }

    .approve-button {
      background: linear-gradient(135deg, #27ae60, #2ecc71);
      color: white;
    }

    .approve-button:hover:not(:disabled) {
      background: linear-gradient(135deg, #229954, #27ae60);
      transform: translateY(-2px);
    }

    .reject-button {
      border-color: #e74c3c;
      color: #e74c3c;
    }

    .reject-button:hover:not(:disabled) {
      background: #e74c3c;
      color: white;
      transform: translateY(-2px);
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
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }

    .table-container {
      overflow-x: auto;
    }

    .results-table {
      width: 100%;
      background: white;
    }

    .results-table th {
      background: #f8f9fa;
      color: #2c3e50;
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .results-table td {
      padding: 16px 8px;
      border-bottom: 1px solid #ecf0f1;
    }

    .employee-cell, .course-cell, .batch-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cell-icon {
      font-size: 1.1rem;
      width: 1.1rem;
      height: 1.1rem;
      color: #95a5a6;
    }

    .approver-chip, .rejector-chip {
      font-size: 0.85rem;
      height: 28px;
    }

    .approver-chip {
      background: #d5f4e6;
      color: #27ae60;
    }

    .rejector-chip {
      background: #fadbd8;
      color: #e74c3c;
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

      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .page-title {
        font-size: 2rem;
      }

      .card-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .card-actions {
        width: 100%;
        justify-content: space-between;
      }

      .action-button {
        flex: 1;
        min-width: auto;
      }

      .employee-info {
        width: 100%;
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
  loading = false;

  rejectingId: number | null = null;
  rejectReason: string = '';
  processingId: number | null = null;

  // Table column definitions
  approvedColumns: string[] = ['employee', 'course', 'batch', 'approvedBy'];
  rejectedColumns: string[] = ['employee', 'course', 'batch', 'rejectedBy', 'reason'];

  @Output() pendingChanged = new EventEmitter<number>();

  constructor(
    private enrollSvc: EnrollmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loading = true;
    this.enrollSvc.getManaged().subscribe({
      next: data => {
        this.pending = data.filter(e => e.status === 'Requested');
        this.approved = data.filter(e => e.status === 'Approved');
        this.rejected = data.filter(e => e.status === 'Rejected');
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
  }
}
