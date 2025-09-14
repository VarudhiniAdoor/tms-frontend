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
    <h2>👥 Active Batches</h2>
    <div *ngIf="loading">Loading batches...</div>
    <div *ngIf="warning" class="warning">{{warning}}</div>
    <div *ngFor="let b of batches" class="batch-card">
      <div class="title">{{b.batchName}}</div>
      <div>Course: {{b.calendar?.course?.courseName ?? '—'}}</div>
      <div>Start: {{b.calendar?.startDate | date}} → {{b.calendar?.endDate | date}}</div>
      <div>Status: <strong>{{getStatus(b.batchId)}}</strong></div>
      <button (click)="request(b.batchId)" [disabled]="getStatus(b.batchId) !== 'Not Enrolled'">
        Request Enrollment
      </button>
    </div>
  `
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

  request(batchId:number) {
    this.enrollSvc.requestEnrollment(batchId).subscribe({
      next: dto => { this.statusByBatch.set(batchId, dto.status); alert('Enrollment requested!'); }
    });
  }
}
