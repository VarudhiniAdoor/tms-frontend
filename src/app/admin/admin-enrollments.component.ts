import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentService } from '../services/enrollment.service';
import { EnrollmentDto } from '../models/domain.models';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-admin-enrollments',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  template: `
    <h2>👥 All Enrollments</h2>

    <table *ngIf="enrollments.length; else noEnroll">
      <thead>
        <tr>
          <th>ID</th>
          <th>Employee</th>
          <th>Course</th>
          <th>Batch</th>
          <th>Status</th>
          <th>Approved By</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let e of enrollments">
          <td>{{ e.enrollmentId }}</td>
          <td>{{ e.employeeName }}</td>
          <td>{{ e.courseName }}</td>
          <td>{{ e.batchName }}</td>
          <td>{{ e.status }}</td>
          <td>{{ e.approvedBy || '-' }}</td>
        </tr>
      </tbody>
    </table>

    <ng-template #noEnroll>
      <em>No enrollments found</em>
    </ng-template>
  `
})
export class AdminEnrollmentsComponent implements OnInit {
  enrollments: EnrollmentDto[] = [];

  constructor(private enrollmentSvc: EnrollmentService) {}

  ngOnInit() {
    this.enrollmentSvc.getAll().subscribe(data => this.enrollments = data);
  }
}
