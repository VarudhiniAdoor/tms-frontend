import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchService } from '../../../services/batch.service';
import { Batch } from '../../../models/domain.models';

@Component({
  selector: 'app-batches-list',
  standalone: true,
  imports: [CommonModule],
  template: `
 <h2>Available Batches</h2>
    <div *ngIf="loading">Loading batches...</div>

    <table *ngIf="!loading && batches.length > 0" class="styled-table">
      <thead>
        <tr>
          <th>Batch</th>
          <th>Course</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Enrollments</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let b of batches">
          <td>{{ b.batchName }}</td>
          <td>{{ b.calendar?.course?.courseName || 'N/A' }}</td>
          <td>{{ b.calendar?.startDate | date:'mediumDate' }}</td>
          <td>{{ b.calendar?.endDate | date:'mediumDate' }}</td>
          <td>{{ b.enrollmentCount }}</td>
        </tr>
      </tbody>
    </table>

    <div *ngIf="!loading && batches.length === 0">
      No batches available.
    </div>
  `
})
export class BatchesListComponent implements OnInit {
  batches: any[] = [];
  loading = false;

  constructor(private batchSvc: BatchService) {}

  ngOnInit() {
    this.loading = true;
    this.batchSvc.getAll().subscribe({
      next: data => { this.batches = data; this.loading = false; },
      error: () => { this.batches = []; this.loading = false; }
    });
  }
}