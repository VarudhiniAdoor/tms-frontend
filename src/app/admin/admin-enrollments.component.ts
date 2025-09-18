import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EnrollmentService } from '../services/enrollment.service';
import { EnrollmentDto } from '../models/domain.models';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { 
  faUser, faUserTie, faEnvelope, faCalendarAlt, faCheck, faTimes, 
  faEye, faEdit, faTrash, faGraduationCap, faBook
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-enrollments',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule, FontAwesomeModule, PaginationComponent],
  styles: [`
    .admin-section {
      padding: 24px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(156, 39, 176, 0.03) 30%, rgba(243, 229, 245, 0.6) 60%, rgba(248, 250, 252, 0.8) 100%);
      min-height: 100vh;
      transition: background var(--transition-normal);
      position: relative;
    }
    .admin-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(156, 39, 176, 0.05) 0%, transparent 60%),
        radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
    }
    body.dark-mode .admin-section {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(45, 27, 105, 0.4) 30%, rgba(17, 17, 24, 0.9) 100%);
    }
    body.dark-mode .admin-section::before {
      background: 
        radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(156, 39, 176, 0.08) 0%, transparent 60%),
        radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--light-border);
    }
    body.dark-mode .section-header {
      border-bottom-color: var(--dark-border);
    }

    .header-content h2 {
      margin: 0 0 8px 0;
      color: var(--light-text);
      font-size: 1.75rem;
      font-weight: 600;
    }
    body.dark-mode .header-content h2 {
      color: var(--dark-text);
    }

    .header-content p {
      margin: 0;
      color: var(--light-text-secondary);
      font-size: 0.95rem;
    }
    body.dark-mode .header-content p {
      color: var(--dark-text-secondary);
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .search-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      gap: 16px;
    }

    .search-container {
      position: relative;
      flex: 1;
      max-width: 400px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--light-text-secondary);
      font-size: 1rem;
    }
    body.dark-mode .search-icon {
      color: var(--dark-text-secondary);
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 40px;
      border: 1px solid var(--light-border);
      border-radius: 8px;
      background: var(--light-surface);
      color: var(--light-text);
      font-size: 0.95rem;
      transition: all var(--transition-fast);
    }
    body.dark-mode .search-input {
      background: var(--dark-surface);
      border-color: var(--dark-border);
      color: var(--dark-text);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .filter-container {
      display: flex;
      align-items: center;
    }

    .filter-select {
      padding: 12px 16px;
      border: 1px solid var(--light-border);
      border-radius: 8px;
      background: var(--light-surface);
      color: var(--light-text);
      font-size: 0.95rem;
      transition: all var(--transition-fast);
    }
    body.dark-mode .filter-select {
      background: var(--dark-surface);
      border-color: var(--dark-border);
      color: var(--dark-text);
    }

    .filter-select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .filter-stats {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .stat {
      padding: 4px 12px;
      background: var(--primary);
      color: white;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .table-card {
      background: var(--light-card);
      border: 1px solid var(--light-border);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-normal);
    }
    body.dark-mode .table-card {
      background: var(--dark-card);
      border-color: var(--dark-border);
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: var(--light-surface);
      border-bottom: 1px solid var(--light-border);
    }
    body.dark-mode .table-header {
      background: var(--dark-surface);
      border-bottom-color: var(--dark-border);
    }

    .table-header h3 {
      margin: 0;
      color: var(--light-text);
      font-size: 1.1rem;
      font-weight: 600;
    }
    body.dark-mode .table-header h3 {
      color: var(--dark-text);
    }

    .table-stats {
      display: flex;
      gap: 16px;
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      background: var(--light-surface);
      color: var(--light-text-secondary);
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 16px 20px;
      text-align: left;
      border-bottom: 1px solid var(--light-border);
    }
    body.dark-mode .data-table th {
      background: var(--dark-surface);
      color: var(--dark-text-secondary);
      border-bottom-color: var(--dark-border);
    }

    .data-row {
      border-bottom: 1px solid var(--light-border);
      transition: background var(--transition-fast);
    }
    body.dark-mode .data-row {
      border-bottom-color: var(--dark-border);
    }

    .data-row:hover {
      background: var(--light-card-hover);
    }
    body.dark-mode .data-row:hover {
      background: var(--dark-card-hover);
    }

    .data-row td {
      padding: 16px 20px;
      color: var(--light-text);
      font-size: 0.9rem;
    }
    body.dark-mode .data-row td {
      color: var(--dark-text);
    }

    .id-cell {
      font-family: 'Courier New', monospace;
      font-size: 0.8rem;
      color: var(--light-text-secondary);
      width: 60px;
    }
    body.dark-mode .id-cell {
      color: var(--dark-text-secondary);
    }

    .employee-cell {
      min-width: 150px;
    }

    .employee-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .employee-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .course-info, .batch-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .course-name, .batch-name {
      font-weight: 500;
      color: var(--light-text);
    }
    body.dark-mode .course-name, body.dark-mode .batch-name {
      color: var(--dark-text);
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-approved {
      background: #dcfce7;
      color: #166534;
    }
    body.dark-mode .status-approved {
      background: #14532d;
      color: #dcfce7;
    }

    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }
    body.dark-mode .status-pending {
      background: #78350f;
      color: #fef3c7;
    }

    .status-rejected {
      background: #fef2f2;
      color: #dc2626;
    }
    body.dark-mode .status-rejected {
      background: #7f1d1d;
      color: #fef2f2;
    }

    .status-default {
      background: #f3f4f6;
      color: #374151;
    }
    body.dark-mode .status-default {
      background: #374151;
      color: #f3f4f6;
    }

    .approver {
      color: var(--primary);
      font-weight: 500;
    }

    .no-approver {
      color: var(--light-text-secondary);
      font-style: italic;
    }
    body.dark-mode .no-approver {
      color: var(--dark-text-secondary);
    }

    .actions-cell {
      white-space: nowrap;
    }

    .actions-cell .btn {
      margin-right: 8px;
    }

    .btn-success {
      color: #166534;
      border-color: #166534;
    }

    .btn-success:hover {
      background: #166534;
      color: white;
    }

    .btn-warning {
      color: #92400e;
      border-color: #92400e;
    }

    .btn-warning:hover {
      background: #92400e;
      color: white;
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
      font-size: 3rem;
      margin-bottom: 16px;
      opacity: 0.6;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      color: var(--light-text);
      font-size: 1.25rem;
      font-weight: 600;
    }
    body.dark-mode .empty-state h3 {
      color: var(--dark-text);
    }

    .empty-state p {
      margin: 0 0 20px 0;
      color: var(--light-text-secondary);
      font-size: 0.95rem;
    }
    body.dark-mode .empty-state p {
      color: var(--dark-text-secondary);
    }

    @media (max-width: 768px) {
      .admin-section {
        padding: 16px;
      }
      
      .section-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
      
      .search-section {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-container {
        max-width: none;
      }
      
      .table-container {
        font-size: 0.85rem;
      }
      
      .data-table th,
      .data-table td {
        padding: 12px 16px;
      }
    }
  `],
  template: `
  <div class="admin-section">
    <!-- Section Header -->
    <div class="section-header">
      <div class="header-content">
        <h2>Enrollment Management</h2>
        <p>Track and manage course enrollments across your organization</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" (click)="exportEnrollments()">
          <i class="icon">📊</i>
          Export
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="search-section">
      <div class="search-container">
        <i class="search-icon">🔍</i>
        <input 
          [(ngModel)]="searchText" 
          placeholder="Search by employee, course, or batch..." 
          class="search-input"
          (input)="applyFilters()">
      </div>
      <div class="filter-container">
        <select [(ngModel)]="selectedStatus" (change)="applyFilters()" class="filter-select">
          <option value="">All Statuses</option>
          <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
        </select>
      </div>
      <div class="filter-stats">
        <span class="stat">{{ filteredEnrollments.length }} enrollments</span>
      </div>
    </div>

    <!-- Enrollments Table -->
    <div class="table-card">
      <div class="table-header">
        <div class="table-stats">
          <span class="stat">{{ enrollments.length }} Total</span>
          <span class="stat">{{ getStatusCount('Approved') }} Approved</span>
          <span class="stat">{{ getStatusCount('Pending') }} Pending</span>
        </div>
      </div>
      
      <div class="table-container">
        <table class="data-table" *ngIf="filteredEnrollments.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Course</th>
              <th>Batch</th>
              <th>Status</th>
              <th>Approved By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let enrollment of paginatedEnrollments" class="data-row">
              <td class="id-cell">{{ enrollment.enrollmentId }}</td>
              <td class="employee-cell">
                <div class="employee-info">
                  <div class="employee-avatar">{{ enrollment.employeeName.charAt(0).toUpperCase() || 'E' }}</div>
                  <span>{{ enrollment.employeeName }}</span>
                </div>
              </td>
              <td>
                <div class="course-info">
                  <div class="course-name">{{ enrollment.courseName }}</div>
                </div>
              </td>
              <td>
                <div class="batch-info">
                  <div class="batch-name">{{ enrollment.batchName }}</div>
                </div>
              </td>
              <td>
                <span class="status-badge" [class]="getStatusClass(enrollment.status)">
                  {{ enrollment.status }}
                </span>
              </td>
              <td>
                <span *ngIf="enrollment.approvedBy" class="approver">{{ enrollment.approvedBy }}</span>
                <span *ngIf="!enrollment.approvedBy" class="no-approver">-</span>
              </td>
              <td class="actions-cell">
                <button class="btn btn-sm btn-ghost" (click)="viewEnrollment(enrollment)">
                  <i class="icon">👁️</i>
                  View
                </button>
                <button 
                  class="btn btn-sm btn-outline" 
                  [class.btn-success]="enrollment.status === 'Pending'"
                  [class.btn-warning]="enrollment.status === 'Approved'"
                  (click)="toggleEnrollmentStatus(enrollment)">
                  <i class="icon">{{ enrollment.status === 'Pending' ? '✅' : '⏸️' }}</i>
                  {{ enrollment.status === 'Pending' ? 'Approve' : 'Suspend' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <app-pagination
          *ngIf="filteredEnrollments.length > 0"
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="totalItems"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)">
        </app-pagination>
        
        <!-- Empty State -->
        <div class="empty-state" *ngIf="filteredEnrollments.length === 0 && enrollments.length === 0">
          <div class="empty-icon">📋</div>
          <h3>No enrollments found</h3>
          <p>Enrollments will appear here when employees register for courses</p>
        </div>

        <!-- No Search Results -->
        <div class="empty-state" *ngIf="filteredEnrollments.length === 0 && enrollments.length > 0">
          <div class="empty-icon">🔍</div>
          <h3>No enrollments match your search</h3>
          <p>Try adjusting your search terms or filters</p>
          <button class="btn btn-outline" (click)="clearFilters()">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  </div>
  `
})
export class AdminEnrollmentsComponent implements OnInit {
  enrollments: EnrollmentDto[] = [];
  filteredEnrollments: EnrollmentDto[] = [];
  paginatedEnrollments: EnrollmentDto[] = [];
  selectedStatus = '';
  searchText = '';
  statuses = ['Pending', 'Approved', 'Rejected']; // Adjust based on your app

  // Pagination properties
  currentPage = 1;
  pageSize = 6;
  totalItems = 0;

  // FontAwesome Icons
  faUser = faUser;
  faUserTie = faUserTie;
  faEnvelope = faEnvelope;
  faCalendarAlt = faCalendarAlt;
  faCheck = faCheck;
  faTimes = faTimes;
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
  faGraduationCap = faGraduationCap;
  faBook = faBook;

  constructor(private enrollmentSvc: EnrollmentService) {}

  ngOnInit() {
    this.loadEnrollments();
  }

  loadEnrollments() {
    this.enrollmentSvc.getAll().subscribe(data => {
      this.enrollments = data;
      this.filteredEnrollments = data;
      this.updatePagination();
    });
  }

  updatePagination() {
    this.totalItems = this.filteredEnrollments.length;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEnrollments = this.filteredEnrollments.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.updatePagination();
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
    this.currentPage = 1; // Reset to first page when filtering
    this.updatePagination();
  }

  getStatusCount(status: string): number {
    return this.enrollments.filter(e => e.status === status).length;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-default';
    }
  }

  viewEnrollment(enrollment: EnrollmentDto) {
    const details = `
Enrollment Details:
==================
ID: ${enrollment.enrollmentId}
Employee: ${enrollment.employeeName}
Course: ${enrollment.courseName}
Batch: ${enrollment.batchName}
Status: ${enrollment.status}
Approved By: ${enrollment.approvedBy || 'Not approved yet'}
    `.trim();
    
    alert(details);
  }

  toggleEnrollmentStatus(enrollment: EnrollmentDto) {
    const newStatus = enrollment.status === 'Pending' ? 'Approved' : 'Pending';
    const action = enrollment.status === 'Pending' ? 'approve' : 'suspend';
    
    if (confirm(`Are you sure you want to ${action} this enrollment?`)) {
      // Update the enrollment status
      enrollment.status = newStatus;
      if (newStatus === 'Approved') {
        enrollment.approvedBy = 'Admin'; // You can get this from auth service
      } else {
        enrollment.approvedBy = null;
      }
      
      // Here you would typically call an API to update the enrollment
      // this.enrollmentSvc.updateStatus(enrollment.enrollmentId, newStatus).subscribe(...)
      
      alert(`Enrollment ${action}d successfully!`);
    }
  }

  exportEnrollments() {
    const csvContent = this.generateEnrollmentsCSV();
    this.downloadCSV(csvContent, 'enrollments.csv');
  }

  private generateEnrollmentsCSV(): string {
    const headers = ['ID', 'Employee', 'Course', 'Batch', 'Status', 'Approved By'];
    const rows = this.enrollments.map(e => [
      e.enrollmentId,
      e.employeeName || 'Unknown',
      e.courseName || 'Unknown',
      e.batchName || 'Unknown',
      e.status,
      e.approvedBy || 'Not approved'
    ]);
    
    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
  }

  private downloadCSV(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  clearFilters() {
    this.searchText = '';
    this.selectedStatus = '';
    this.applyFilters();
  }
}
