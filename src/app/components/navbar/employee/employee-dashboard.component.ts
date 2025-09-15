import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeBatchesComponent } from './employee-batches.component';
import { MyEnrollmentsComponent } from './my-enrollments.component';
import { AuthService } from '../../../core/auth.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { BatchService } from '../../../services/batch.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUsers, faBook, faUser, faGraduationCap
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, EmployeeBatchesComponent, MyEnrollmentsComponent, FontAwesomeModule],
  template: `
    <div class="employee-dashboard">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="employee-logo">
            <fa-icon [icon]="faGraduationCap" class="logo-icon"></fa-icon>
            <span class="logo-text">Employee Panel</span>
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <button 
            [class.active]="tab==='batches'" 
            (click)="tab='batches'"
            class="nav-item">
            <fa-icon [icon]="faUsers" class="nav-icon"></fa-icon>
            <span class="nav-text">Active Batches</span>
            <span *ngIf="availableBatches > 0" class="nav-badge">{{ availableBatches }}</span>
          </button>
          <button 
            [class.active]="tab==='enrollments'" 
            (click)="tab='enrollments'"
            class="nav-item">
            <fa-icon [icon]="faBook" class="nav-icon"></fa-icon>
            <span class="nav-text">My Enrollments</span>
            <span *ngIf="myEnrollments > 0" class="nav-badge">{{ myEnrollments }}</span>
          </button>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="main-content">
        <!-- Header -->
        <header class="content-header">
          <div class="header-left">
            <h1 class="page-title">{{ getPageTitle() }}</h1>
            <p class="page-subtitle">{{ getPageSubtitle() }}</p>
          </div>
          <div class="header-right">
            <div class="stats-overview">
              <div class="stat-item">
                <div class="stat-value">{{ myEnrollments }}</div>
                <div class="stat-label">Enrollments</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ availableBatches }}</div>
                <div class="stat-label">Available</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ completedCourses }}</div>
                <div class="stat-label">Completed</div>
              </div>
            </div>
          </div>
        </header>

        <!-- Content Body -->
        <div class="content-body">
          <app-employee-batches *ngIf="tab==='batches'"></app-employee-batches>
          <app-my-enrollments *ngIf="tab==='enrollments'"></app-my-enrollments>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./employee.style.css']
})
export class EmployeeDashboardComponent implements OnInit {
  tab: 'batches' | 'enrollments' = 'batches'; // Start with batches as landing page
  username: string | null = null;
  
  // Statistics
  myEnrollments = 0;
  availableBatches = 0;
  completedCourses = 0;

  // FontAwesome Icons
  faUsers = faUsers;
  faBook = faBook;
  faUser = faUser;
  faGraduationCap = faGraduationCap;

  constructor(
    private auth: AuthService,
    private enrollmentService: EnrollmentService,
    private batchService: BatchService
  ) {
    this.auth.user$.subscribe(user => {
      this.username = user?.username ?? null;
    });
  }

  ngOnInit() {
    this.loadStatistics();
  }

  loadStatistics() {
    // Load enrollments count
    this.enrollmentService.getMyEnrollments().subscribe(enrollments => {
      this.myEnrollments = enrollments?.length || 0;
      this.completedCourses = enrollments?.filter(e => e.status === 'COMPLETED').length || 0;
    });

    // Load available batches count
    this.batchService.getAll().subscribe(batches => {
      this.availableBatches = batches?.length || 0;
    });
  }

  getPageTitle(): string {
    return this.tab === 'batches' ? 'Active Batches' : 'My Enrollments';
  }

  getPageSubtitle(): string {
    return this.tab === 'batches' 
      ? 'Discover and join available training batches' 
      : 'Track your course enrollments and progress';
  }
}
