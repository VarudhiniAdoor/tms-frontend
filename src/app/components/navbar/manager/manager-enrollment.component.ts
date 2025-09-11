import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentService } from '../../../services/enrollment.service';
import { EnrollmentDto } from '../../../models/domain.models';

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Enrollment Requests</h2>
    <div *ngIf="loading">Loading...</div>

    <!-- Pending -->
    <h3>⏳ Pending</h3>
    <div *ngIf="pending.length === 0 && !loading">No pending requests.</div>
    <div *ngFor="let r of pending" class="enroll-card">
      <div class="info">
        <strong>{{r.employeeName}}</strong> requested 
        <em>{{r.courseName}} / {{r.batchName}}</em>
      </div>
      <div class="status">Status: {{r.status}}</div>
      <div class="actions">
        <button class="approve" (click)="approve(r.enrollmentId)">Approve</button>
        <button class="reject" (click)="reject(r.enrollmentId)">Reject</button>
      </div>
    </div>

    <!-- Approved -->
    <h3 class="mt-4 text-green-600">✅ Approved</h3>
    <div *ngIf="approved.length === 0 && !loading">No approved enrollments.</div>
    <div *ngFor="let r of approved" class="enroll-card">
      <div class="info">
        <strong>{{r.employeeName}}</strong> - {{r.courseName}} / {{r.batchName}}
      </div>
      <div class="status">Approved By: {{r.approvedBy}}</div>
    </div>

    <!-- Rejected -->
    <h3 class="mt-4 text-red-600">❌ Rejected</h3>
    <div *ngIf="rejected.length === 0 && !loading">No rejected enrollments.</div>
    <div *ngFor="let r of rejected" class="enroll-card">
      <div class="info">
        <strong>{{r.employeeName}}</strong> - {{r.courseName}} / {{r.batchName}}
      </div>
      <div class="status">Rejected By: {{r.approvedBy}}</div>
    </div>
  `
})
export class EnrollmentComponent implements OnInit {
  pending: EnrollmentDto[] = [];
  approved: EnrollmentDto[] = [];
  rejected: EnrollmentDto[] = [];
  loading = false;

  constructor(private enrollSvc: EnrollmentService) {}

  ngOnInit() {
    this.loading = true;
    this.enrollSvc.getManaged().subscribe({
      next: data => {
        this.pending = data.filter(e => e.status === 'Requested');
        this.approved = data.filter(e => e.status === 'Approved');
        this.rejected = data.filter(e => e.status === 'Rejected');
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  approve(id: number) {
    this.enrollSvc.approve(id).subscribe(() => {
      this.moveTo(id, 'Approved');
    });
  }

  reject(id: number) {
    this.enrollSvc.reject(id).subscribe(() => {
      this.moveTo(id, 'Rejected');
    });
  }

  private moveTo(id: number, status: 'Approved' | 'Rejected') {
    const item = this.pending.find(r => r.enrollmentId === id);
    if (!item) return;
    this.pending = this.pending.filter(r => r.enrollmentId !== id);
    if (status === 'Approved') {
      this.approved.push({ ...item, status, approvedBy: 'Me' });
    } else {
      this.rejected.push({ ...item, status, approvedBy: 'Me' });
    }
  }
}
