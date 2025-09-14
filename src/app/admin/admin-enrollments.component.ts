import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentService } from '../services/enrollment.service';
import { EnrollmentDto } from '../models/domain.models';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-enrollments',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule],
  template: `
    <h2>👥 All Enrollments</h2>

    <!-- Filters -->
    <section style="margin-bottom:12px;">
      <label>
        Filter by Status:
        <select [(ngModel)]="selectedStatus" (change)="applyFilters()">
          <option value="">-- All --</option>
          <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
        </select>
      </label>

      <label style="margin-left:12px;">
        Search:
        <input [(ngModel)]="searchText" (input)="applyFilters()" placeholder="Employee, Course, Batch"/>
      </label>
    </section>

    <!-- Enrollments Table -->
    <table *ngIf="filteredEnrollments.length; else noEnroll">
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
        <tr *ngFor="let e of filteredEnrollments">
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
  filteredEnrollments: EnrollmentDto[] = [];
  selectedStatus = '';
  searchText = '';
  statuses = ['Pending', 'Approved', 'Rejected']; // Adjust based on your app

  constructor(private enrollmentSvc: EnrollmentService) {}

  ngOnInit() {
    this.enrollmentSvc.getAll().subscribe(data => {
      this.enrollments = data;
      this.filteredEnrollments = data;
    });
  }

  applyFilters() {
    this.filteredEnrollments = this.enrollments.filter(e => {
      const matchesStatus = !this.selectedStatus || e.status === this.selectedStatus;
      const matchesSearch =
        !this.searchText ||
        e.employeeName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        e.courseName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        e.batchName?.toLowerCase().includes(this.searchText.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }
}
