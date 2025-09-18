import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeBatchesComponent } from './employee-batches.component';
import { MyEnrollmentsComponent } from './my-enrollments.component';
import { ChatbotComponent } from '../../chatbot/chatbot.component';
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
  imports: [CommonModule, EmployeeBatchesComponent, MyEnrollmentsComponent, ChatbotComponent, FontAwesomeModule],
  styleUrls: ['./employee-dashboard.css'],
  template: `
    <div class="employee-dashboard">
      <!-- Modern Sidebar -->
      <aside class="employee-sidebar">
        <div class="sidebar-header">
          <div class="employee-brand">
            <div class="brand-icon">
              <fa-icon [icon]="faGraduationCap"></fa-icon>
            </div>
            <div class="brand-content">
              <h2 class="brand-title">Employee Panel</h2>
              <p class="brand-subtitle">Learning Hub</p>
            </div>
          </div>
        </div>
        
        <nav class="sidebar-navigation">
          <div class="nav-section">
            <h3 class="nav-section-title">Learning</h3>
            <button 
              [class.active]="tab==='batches'" 
              (click)="tab='batches'"
              class="nav-item">
              <div class="nav-item-icon">
                <fa-icon [icon]="faUsers"></fa-icon>
              </div>
              <span class="nav-item-text">Active Batches</span>
              <div class="nav-item-badge" *ngIf="availableBatches > 0">{{ availableBatches }}</div>
              <div class="nav-item-indicator" *ngIf="tab==='batches'"></div>
            </button>
            
            <button 
              [class.active]="tab==='enrollments'" 
              (click)="tab='enrollments'"
              class="nav-item">
              <div class="nav-item-icon">
                <fa-icon [icon]="faBook"></fa-icon>
              </div>
              <span class="nav-item-text">My Enrollments</span>
              <div class="nav-item-badge" *ngIf="myEnrollments > 0">{{ myEnrollments }}</div>
              <div class="nav-item-indicator" *ngIf="tab==='enrollments'"></div>
            </button>
          </div>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="employee-main">
        <!-- Content Area -->
        <div class="employee-content">
          <div class="content-wrapper">
            <app-employee-batches *ngIf="tab==='batches'"></app-employee-batches>
            <app-my-enrollments *ngIf="tab==='enrollments'"></app-my-enrollments>
          </div>
        </div>
      </main>

      <!-- Chatbot -->
      <app-chatbot></app-chatbot>
    </div>
  `
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

}
