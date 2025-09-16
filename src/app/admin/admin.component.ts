import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUsersComponent } from './admin-users.component';
import { AdminCoursesComponent } from './admin-courses.component';
import { AdminCalendarComponent } from './admin-batches.component';
import { AdminEnrollmentsComponent } from './admin-enrollments.component';
import { AdminFeedbackComponent } from './admin-feedback.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUsers, faBook, faCalendarAlt, faClipboardList, faChartBar, 
  faTachometerAlt, faGraduationCap, faUserTie, faUserCheck, 
  faChartLine, faExclamationTriangle, faClock,
  faEye, faEdit, faTrash, faPlus, faFilter,
  faSearch, faCog, faBell, faSignOutAlt, faUserCog, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../services/user.service';
import { CourseService } from '../services/course.service';
import { BatchService } from '../services/batch.service';
import { EnrollmentService } from '../services/enrollment.service';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    AdminUsersComponent,
    AdminCoursesComponent,
    AdminCalendarComponent,
    AdminEnrollmentsComponent,
    AdminFeedbackComponent,
    FontAwesomeModule
  ],
  template: `
  <div class="admin-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="admin-logo">
          <fa-icon [icon]="faUserCog" class="logo-icon"></fa-icon>
          <span class="logo-text">Admin Panel</span>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <button (click)="tab='dashboard'" [class.active]="tab==='dashboard'" class="nav-item">
          <fa-icon [icon]="faTachometerAlt"></fa-icon>
          <span>Dashboard</span>
        </button>
        <button (click)="tab='users'" [class.active]="tab==='users'" class="nav-item">
          <fa-icon [icon]="faUsers"></fa-icon>
          <span>Users</span>
</button>
        <button (click)="tab='courses'" [class.active]="tab==='courses'" class="nav-item">
          <fa-icon [icon]="faBook"></fa-icon>
          <span>Courses</span>
</button>
        <button (click)="tab='batches'" [class.active]="tab==='batches'" class="nav-item">
          <fa-icon [icon]="faCalendarAlt"></fa-icon>
          <span>Batches</span>
</button>
        <button (click)="tab='enrollments'" [class.active]="tab==='enrollments'" class="nav-item">
          <fa-icon [icon]="faClipboardList"></fa-icon>
          <span>Enrollments</span>
</button>
        <button (click)="tab='reports'" [class.active]="tab==='reports'" class="nav-item">
          <fa-icon [icon]="faChartBar"></fa-icon>
          <span>Reports</span>
</button>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Dashboard Content -->
      <div class="content-body" *ngIf="tab === 'dashboard'">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="loading-container">
          <fa-icon [icon]="faSpinner" class="spinner"></fa-icon>
          <p>Loading dashboard data...</p>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-grid" *ngIf="!isLoading">
          <div class="stat-card">
            <div class="stat-icon users">
              <fa-icon [icon]="faUsers"></fa-icon>
            </div>
            <div class="stat-content">
              <h3>{{ stats.totalUsers }}</h3>
              <p>Total Users</p>
              <span class="stat-change" [class.positive]="stats.totalUsers > 0" [class.neutral]="stats.totalUsers === 0">
                {{ stats.totalUsers > 0 ? 'Active users' : 'No users yet' }}
              </span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon courses">
              <fa-icon [icon]="faBook"></fa-icon>
            </div>
            <div class="stat-content">
              <h3>{{ stats.totalCourses }}</h3>
              <p>Active Courses</p>
              <span class="stat-change" [class.positive]="stats.totalCourses > 0" [class.neutral]="stats.totalCourses === 0">
                {{ stats.totalCourses > 0 ? 'Available courses' : 'No courses yet' }}
              </span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon enrollments">
              <fa-icon [icon]="faGraduationCap"></fa-icon>
            </div>
            <div class="stat-content">
              <h3>{{ stats.totalEnrollments }}</h3>
              <p>Total Enrollments</p>
              <span class="stat-change" [class.positive]="stats.totalEnrollments > 0" [class.neutral]="stats.totalEnrollments === 0">
                {{ stats.totalEnrollments > 0 ? 'Active enrollments' : 'No enrollments yet' }}
              </span>
            </div>
          </div>
          
        </div>


        <!-- Quick Actions and Recent Items -->
        <div class="quick-actions-grid">
          <div class="quick-actions-card">
            <h3>Quick Actions</h3>
            <div class="quick-actions">
              <button class="quick-action-btn" (click)="tab='users'">
                <fa-icon [icon]="faPlus"></fa-icon>
                <span>Add User</span>
              </button>
              <button class="quick-action-btn" (click)="tab='courses'">
                <fa-icon [icon]="faBook"></fa-icon>
                <span>Create Course</span>
              </button>
              <button class="quick-action-btn" (click)="tab='batches'">
                <fa-icon [icon]="faCalendarAlt"></fa-icon>
                <span>Schedule Batch</span>
              </button>
              <button class="quick-action-btn" (click)="tab='reports'">
                <fa-icon [icon]="faChartBar"></fa-icon>
                <span>Generate Report</span>
              </button>
            </div>
          </div>

          <div class="recent-items-card">
            <h3>Recent Items</h3>
            <div class="recent-items">
              <div class="recent-item" (click)="tab='users'">
                <div class="item-icon">
                  <fa-icon [icon]="faUsers"></fa-icon>
                </div>
                <div class="item-content">
                  <p>User Management</p>
                  <span>{{ users.length }} users registered</span>
                </div>
                <button class="btn btn-sm btn-ghost">
                  <fa-icon [icon]="faEye"></fa-icon>
                </button>
              </div>
              <div class="recent-item" (click)="tab='courses'">
                <div class="item-icon">
                  <fa-icon [icon]="faBook"></fa-icon>
                </div>
                <div class="item-content">
                  <p>Course Catalog</p>
                  <span>{{ courses.length }} courses available</span>
                </div>
                <button class="btn btn-sm btn-ghost">
                  <fa-icon [icon]="faEye"></fa-icon>
                </button>
              </div>
              <div class="recent-item" (click)="tab='batches'">
                <div class="item-icon">
                  <fa-icon [icon]="faCalendarAlt"></fa-icon>
                </div>
                <div class="item-content">
                  <p>Batch Schedule</p>
                  <span>{{ batches.length }} batches scheduled</span>
                </div>
                <button class="btn btn-sm btn-ghost">
                  <fa-icon [icon]="faEye"></fa-icon>
                </button>
              </div>
              <div class="recent-item" (click)="tab='enrollments'">
                <div class="item-icon">
                  <fa-icon [icon]="faClipboardList"></fa-icon>
                </div>
                <div class="item-content">
                  <p>Enrollments</p>
                  <span>{{ enrollments.length }} total enrollments</span>
                </div>
                <button class="btn btn-sm btn-ghost">
                  <fa-icon [icon]="faEye"></fa-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Other Tab Content -->
      <div class="content-body" *ngIf="tab !== 'dashboard'">
      <div [ngSwitch]="tab">
        <app-admin-users *ngSwitchCase="'users'"></app-admin-users>
        <app-admin-courses *ngSwitchCase="'courses'"></app-admin-courses>
        <app-admin-calendar *ngSwitchCase="'batches'"></app-admin-calendar>
        <app-admin-enrollments *ngSwitchCase="'enrollments'"></app-admin-enrollments>
        <app-admin-feedback *ngSwitchCase="'reports'"></app-admin-feedback>
        </div>
      </div>
    </main>
  </div>
  `
})
export class AdminComponent implements OnInit {
  tab: 'dashboard' | 'users' | 'courses' | 'batches' | 'enrollments' | 'reports' = 'dashboard';
  
  // FontAwesome Icons
  faUsers = faUsers;
  faBook = faBook;
  faCalendarAlt = faCalendarAlt;
  faClipboardList = faClipboardList;
  faChartBar = faChartBar;
  faTachometerAlt = faTachometerAlt;
  faGraduationCap = faGraduationCap;
  faUserTie = faUserTie;
  faUserCheck = faUserCheck;
  faChartLine = faChartLine;
  faExclamationTriangle = faExclamationTriangle;
  faClock = faClock;
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlus;
  faFilter = faFilter;
  faSearch = faSearch;
  faCog = faCog;
  faBell = faBell;
  faSignOutAlt = faSignOutAlt;
  faUserCog = faUserCog;

  // Dashboard Statistics
  stats = {
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0
  };

  // Loading states
  isLoading = true;
  faSpinner = faSpinner;

  // Real data arrays
  users: any[] = [];
  courses: any[] = [];
  batches: any[] = [];
  enrollments: any[] = [];
  recentActivities: any[] = [];

  constructor(
    private library: FaIconLibrary,
    private userService: UserService,
    private courseService: CourseService,
    private batchService: BatchService,
    private enrollmentService: EnrollmentService,
    private feedbackService: FeedbackService
  ) {
    library.addIcons(
      faUsers, faBook, faCalendarAlt, faClipboardList, faChartBar,
      faTachometerAlt, faGraduationCap, faUserTie, faUserCheck,
      faChartLine, faExclamationTriangle, faClock,
      faEye, faEdit, faTrash, faPlus, faFilter,
      faSearch, faCog, faBell, faSignOutAlt, faUserCog, faSpinner
    );
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Load all data in parallel
    Promise.all([
      this.loadUsers(),
      this.loadCourses(),
      this.loadBatches(),
      this.loadEnrollments(),
      this.loadRecentActivities()
    ]).finally(() => {
      this.isLoading = false;
    });
  }

  private loadUsers() {
    return this.userService.getEmployees().toPromise().then(employees => {
      this.users = employees || [];
      this.stats.totalUsers = this.users.length;
    }).catch(error => {
      console.error('Error loading users:', error);
      this.users = [];
    });
  }

  private loadCourses() {
    return this.courseService.getAll().toPromise().then(courses => {
      this.courses = courses || [];
      this.stats.totalCourses = this.courses.length;
    }).catch(error => {
      console.error('Error loading courses:', error);
      this.courses = [];
    });
  }

  private loadBatches() {
    return this.batchService.getAll().toPromise().then(batches => {
      this.batches = batches || [];
    }).catch(error => {
      console.error('Error loading batches:', error);
      this.batches = [];
    });
  }

  private loadEnrollments() {
    return this.enrollmentService.getAll().toPromise().then(enrollments => {
      this.enrollments = enrollments || [];
      this.stats.totalEnrollments = this.enrollments.length;
    }).catch(error => {
      console.error('Error loading enrollments:', error);
      this.enrollments = [];
    });
  }

  private loadRecentActivities() {
    // Create recent activities based on real data
    this.recentActivities = [];
    
    // Add recent enrollments
    const recentEnrollments = this.enrollments
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 3);
    
    recentEnrollments.forEach(enrollment => {
      this.recentActivities.push({
        type: 'enrollment',
        message: `New enrollment in batch ${enrollment.batchId}`,
        time: this.getTimeAgo(enrollment.createdAt),
        icon: faGraduationCap
      });
    });
  }

  private getTimeAgo(date: any): string {
    if (!date) return 'Unknown time';
    
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }

}
