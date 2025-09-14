import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../../services/enrollment.service';
import { EnrollmentDto } from '../../../models/domain.models';

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<h2>Enrollment Requests</h2>
<div *ngIf="loading">Loading...</div>

<!-- Pending -->
<h3>⏳ Pending</h3>
<div *ngIf="pending.length === 0 && !loading">No pending requests.</div>
<div *ngFor="let r of pending" class="enroll-card pending">
  <div class="info">
    <strong>{{r.employeeName}}</strong> requested 
    <em>{{r.courseName}} / {{r.batchName}}</em>
  </div>

  <!-- Actions -->
  <div class="actions">
    <button class="approve" (click)="approve(r.enrollmentId)">Approve</button>
    <button class="reject" (click)="toggleReject(r.enrollmentId)">Reject</button>
  </div>

  <!-- Reject reason box -->
  <div *ngIf="rejectingId === r.enrollmentId" class="reject-box">
    <input type="text" [(ngModel)]="rejectReason" placeholder="Optional reason..." />
    <button class="confirm-reject" (click)="confirmReject(r.enrollmentId)">Confirm Reject</button>
    <button class="cancel-reject" (click)="cancelReject()">Cancel</button>
  </div>
</div>

<!-- Approved -->
<h3>✅ Approved</h3>
<div *ngIf="approved.length === 0 && !loading">No approved enrollments.</div>
<table class="styled-table approved" *ngIf="approved.length > 0">
  <thead>
    <tr>
      <th>Employee</th>
      <th>Course</th>
      <th>Batch</th>
      <th>Approved By</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let r of approved">
      <td>{{r.employeeName}}</td>
      <td>{{r.courseName}}</td>
      <td>{{r.batchName}}</td>
      <td>{{r.approvedBy}}</td>
    </tr>
  </tbody>
</table>

<!-- Rejected -->
<h3>❌ Rejected</h3>
<div *ngIf="rejected.length === 0 && !loading">No rejected enrollments.</div>
<table class="styled-table rejected" *ngIf="rejected.length > 0">
  <thead>
    <tr>
      <th>Employee</th>
      <th>Course</th>
      <th>Batch</th>
      <th>Rejected By</th>
      <th>Reason</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let r of rejected">
      <td>{{r.employeeName}}</td>
      <td>{{r.courseName}}</td>
      <td>{{r.batchName}}</td>
      <td>{{r.approvedBy}}</td>
      <td>{{r.rejectReason || '—'}}</td>
    </tr>
  </tbody>
</table>
  `,
  styles: [`
    .reject-box { margin-top: 8px; }
    .reject-box input { margin-right: 6px; padding: 4px; }
    .approve, .reject, .confirm-reject, .cancel-reject {
      margin-right: 6px;
      padding: 6px 12px;
      border-radius: 4px;
    }
    .approve { background: #4caf50; color: white; }
    .reject { background: #f44336; color: white; }
    .confirm-reject { background: #e53935; color: white; }
    .cancel-reject { background: #9e9e9e; color: white; }
  `]
})
export class EnrollmentComponent implements OnInit {
  pending: EnrollmentDto[] = [];
  approved: EnrollmentDto[] = [];
  rejected: EnrollmentDto[] = [];
  loading = false;

  rejectingId: number | null = null;
  rejectReason: string = '';

  @Output() pendingChanged = new EventEmitter<number>();

  constructor(private enrollSvc: EnrollmentService) {}

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
    this.enrollSvc.approve(id).subscribe(() => {
      this.moveTo(id, 'Approved');
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
    this.enrollSvc.reject(id, this.rejectReason).subscribe(() => {
      this.moveTo(id, 'Rejected', this.rejectReason);
      this.cancelReject();
    });
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
