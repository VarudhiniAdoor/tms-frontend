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
    <div *ngIf="!loading && batches.length===0">No batches available.</div>
    <ul *ngIf="!loading">
      <li *ngFor="let b of batches" class="card">
        <strong>{{ b.batchName }}</strong> 
        <div>Course: {{ b.calendar?.course?.courseName }}</div>
        <div>Start: {{ b.calendar?.startDate | date }}</div>
        <div>End: {{ b.calendar?.endDate | date }}</div>
        <div>Enrollments: {{ b.enrollmentCount }}</div><hr>
      </li>
    </ul>
  `
//  styles: [.card {border:1px solid #ddd; padding:10px; margin:8px 0; border-radius:5px;}]
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