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
  styleUrls: ['./admin-dashboard.css'],
  template: `
  <div class="admin-dashboard">
    <!-- Modern Sidebar -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <div class="admin-brand">
          <div class="brand-icon">
            <fa-icon [icon]="faUserCog"></fa-icon>
          </div>
          <div class="brand-content">
            <h2 class="brand-title">Admin Panel</h2>
            <p class="brand-subtitle">TMS Management</p>
          </div>
        </div>
      </div>
      
      <nav class="sidebar-navigation">
        <div class="nav-section">
          <h3 class="nav-section-title">Overview</h3>
        <button (click)="onDashboardClick()" [class.active]="tab==='dashboard'" class="nav-item">
            <div class="nav-item-icon">
          <fa-icon [icon]="faTachometerAlt"></fa-icon>
            </div>
            <span class="nav-item-text">Dashboard</span>
            <div class="nav-item-indicator"></div>
</button>
        </div>

        <div class="nav-section">
          <h3 class="nav-section-title">Management</h3>
          <button (click)="tab='users'" [class.active]="tab==='users'" class="nav-item">
            <div class="nav-item-icon">
              <fa-icon [icon]="faUsers"></fa-icon>
            </div>
            <span class="nav-item-text">Users</span>
            <div class="nav-item-badge" *ngIf="stats.totalUsers > 0">{{ stats.totalUsers }}</div>
          </button>
          
          <button (click)="tab='courses'" [class.active]="tab==='courses'" class="nav-item">
            <div class="nav-item-icon">
              <fa-icon [icon]="faBook"></fa-icon>
            </div>
            <span class="nav-item-text">Courses</span>
            <div class="nav-item-badge" *ngIf="stats.totalCourses > 0">{{ stats.totalCourses }}</div>
          </button>
          
          <button (click)="tab='batches'" [class.active]="tab==='batches'" class="nav-item">
            <div class="nav-item-icon">
              <fa-icon [icon]="faCalendarAlt"></fa-icon>
            </div>
            <span class="nav-item-text">Batches</span>
          </button>
          
          <button (click)="tab='enrollments'" [class.active]="tab==='enrollments'" class="nav-item">
            <div class="nav-item-icon">
              <fa-icon [icon]="faClipboardList"></fa-icon>
            </div>
            <span class="nav-item-text">Enrollments</span>
            <div class="nav-item-badge" *ngIf="stats.totalEnrollments > 0">{{ stats.totalEnrollments }}</div>
          </button>
        </div>
        
        <div class="nav-section">
          <h3 class="nav-section-title">Analytics</h3>
          <button (click)="tab='reports'" [class.active]="tab==='reports'" class="nav-item">
            <div class="nav-item-icon">
              <fa-icon [icon]="faChartBar"></fa-icon>
            </div>
            <span class="nav-item-text">Reports</span>
          </button>
        </div>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="admin-main">
      <!-- Content Area -->
      <div class="admin-content">
        <!-- Dashboard View -->
        <div *ngIf="tab === 'dashboard'" class="dashboard-view">
          <!-- Loading State -->
          <div *ngIf="isLoading" class="loading-state">
            <div class="loading-spinner">
              <fa-icon [icon]="faSpinner" class="spinner-icon"></fa-icon>
            </div>
            <h3>Loading Dashboard</h3>
            <p>Please wait while we fetch your data...</p>
          </div>

          <!-- Dashboard Content -->
          <div *ngIf="!isLoading" class="dashboard-content">
            <!-- Hero Stats -->
            <div class="hero-stats">
              <div class="stat-card hero-stat">
                <div class="stat-card-background">
                  <div class="stat-icon users-icon">
                  <fa-icon [icon]="faUsers"></fa-icon>
                  </div>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.totalUsers }}</div>
                  <div class="stat-label">Total Users</div>
                  <div class="stat-trend positive">
                    <fa-icon [icon]="faChartLine"></fa-icon>
                    <span>Active users</span>
                  </div>
                </div>
              </div>
              
              <div class="stat-card hero-stat">
                <div class="stat-card-background">
                  <div class="stat-icon courses-icon">
                  <fa-icon [icon]="faBook"></fa-icon>
                  </div>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.totalCourses }}</div>
                  <div class="stat-label">Active Courses</div>
                  <div class="stat-trend positive">
                    <fa-icon [icon]="faChartLine"></fa-icon>
                    <span>Available courses</span>
                  </div>
                </div>
              </div>
              
              <div class="stat-card hero-stat">
                <div class="stat-card-background">
                  <div class="stat-icon enrollments-icon">
                    <fa-icon [icon]="faGraduationCap"></fa-icon>
                  </div>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.totalEnrollments }}</div>
                  <div class="stat-label">Total Enrollments</div>
                  <div class="stat-trend positive">
                    <fa-icon [icon]="faChartLine"></fa-icon>
                    <span>Active enrollments</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions & Recent Activity -->
            <div class="dashboard-grid">
              <!-- Quick Actions -->
              <div class="dashboard-card quick-actions-card">
                <div class="card-header">
                  <h3 class="card-title">
                    <fa-icon [icon]="faPlus" class="card-title-icon"></fa-icon>
                    Quick Actions
                  </h3>
                  <p class="card-subtitle">Manage your system efficiently</p>
                </div>
                <div class="card-body">
                  <div class="quick-actions-grid">
                    <button class="quick-action" (click)="tab='users'">
                      <div class="quick-action-icon users">
                        <fa-icon [icon]="faUsers"></fa-icon>
                      </div>
                      <div class="quick-action-content">
                        <h4>Add User</h4>
                        <p>Create new user account</p>
                      </div>
                    </button>
                    
                    <button class="quick-action" (click)="tab='courses'">
                      <div class="quick-action-icon courses">
                        <fa-icon [icon]="faBook"></fa-icon>
                      </div>
                      <div class="quick-action-content">
                        <h4>Create Course</h4>
                        <p>Add new training course</p>
                      </div>
                    </button>
                    
                    <button class="quick-action" (click)="tab='batches'">
                      <div class="quick-action-icon batches">
                        <fa-icon [icon]="faCalendarAlt"></fa-icon>
                      </div>
                      <div class="quick-action-content">
                        <h4>Schedule Batch</h4>
                        <p>Plan new training batch</p>
                      </div>
                    </button>
                    
                    <button class="quick-action" (click)="tab='reports'">
                      <div class="quick-action-icon reports">
                        <fa-icon [icon]="faChartBar"></fa-icon>
                      </div>
                      <div class="quick-action-content">
                        <h4>Generate Report</h4>
                        <p>View analytics & insights</p>
                      </div>
                </button>
              </div>
                </div>
              </div>

              <!-- Recent Activity -->
              <div class="dashboard-card recent-activity-card">
                <div class="card-header">
                  <h3 class="card-title">
                    <fa-icon [icon]="faClock" class="card-title-icon"></fa-icon>
                    Recent Activity
                  </h3>
                  <p class="card-subtitle">Latest system updates</p>
                </div>
                <div class="card-body">
                  <div class="activity-list">
                    <div class="activity-item" *ngFor="let activity of recentActivities">
                      <div class="activity-icon">
                        <fa-icon [icon]="activity.icon"></fa-icon>
                      </div>
                      <div class="activity-content">
                        <p class="activity-message">{{ activity.message }}</p>
                        <span class="activity-time">{{ activity.time }}</span>
                      </div>
                    </div>
                    
                    <div *ngIf="recentActivities.length === 0" class="empty-activity">
                      <fa-icon [icon]="faClock" class="empty-icon"></fa-icon>
                      <p>No recent activity</p>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Other Tab Content -->
        <div *ngIf="tab !== 'dashboard'" class="tab-content">
      <div [ngSwitch]="tab">
        <app-admin-users *ngSwitchCase="'users'"></app-admin-users>
        <app-admin-courses *ngSwitchCase="'courses'"></app-admin-courses>
        <app-admin-calendar *ngSwitchCase="'batches'"></app-admin-calendar>
        <app-admin-enrollments *ngSwitchCase="'enrollments'"></app-admin-enrollments>
        <app-admin-feedback *ngSwitchCase="'reports'"></app-admin-feedback>
          </div>
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
    
    // Load all data in parallel, then load recent activities
    Promise.all([
      this.loadUsers(),
      this.loadCourses(),
      this.loadBatches(),
      this.loadEnrollments()
    ]).then(() => {
      // Load recent activities after all data is loaded
      this.loadRecentActivities();
    }).finally(() => {
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
      .slice(0, 2);
    
    recentEnrollments.forEach(enrollment => {
      this.recentActivities.push({
        type: 'enrollment',
        message: `${enrollment.employeeName || 'Employee'} enrolled in ${enrollment.courseName || 'Course'}`,
        time: this.getTimeAgo(enrollment.createdAt),
        icon: faGraduationCap
      });
    });

    // Add recent courses
    const recentCourses = this.courses
      .sort((a, b) => new Date(b.createdOn || 0).getTime() - new Date(a.createdOn || 0).getTime())
      .slice(0, 2);
    
    recentCourses.forEach(course => {
      this.recentActivities.push({
        type: 'course',
        message: `Course "${course.courseName}" was created`,
        time: this.getTimeAgo(course.createdOn),
        icon: faBook
      });
    });

    // Add recent batches
    const recentBatches = this.batches
      .sort((a, b) => new Date(b.createdOn || 0).getTime() - new Date(a.createdOn || 0).getTime())
      .slice(0, 1);
    
    recentBatches.forEach(batch => {
      this.recentActivities.push({
        type: 'batch',
        message: `Batch "${batch.batchName}" was scheduled`,
        time: this.getTimeAgo(batch.createdOn),
        icon: faCalendarAlt
      });
    });

    // Sort all activities by time
    this.recentActivities.sort((a, b) => {
      const timeA = this.getTimeInHours(a.time);
      const timeB = this.getTimeInHours(b.time);
      return timeA - timeB;
    });

    // Limit to 5 most recent activities
    this.recentActivities = this.recentActivities.slice(0, 5);
  }

  private getTimeInHours(timeStr: string): number {
    if (timeStr === 'Just now') return 0;
    if (timeStr.includes('hours ago')) return parseInt(timeStr.split(' ')[0]);
    if (timeStr.includes('days ago')) return parseInt(timeStr.split(' ')[0]) * 24;
    return 999; // Unknown time goes to end
  }

  private getTimeAgo(date: any): string {
    if (!date) return 'Recently';
    
    const now = new Date();
    const past = new Date(date);
    
    // Check if date is valid
    if (isNaN(past.getTime())) return 'Recently';
    
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} weeks ago`;
  }

  // Method to refresh recent activities (can be called when new data is added)
  refreshRecentActivities() {
    this.loadRecentActivities();
  }

  // Method called when dashboard tab is clicked
  onDashboardClick() {
    this.tab = 'dashboard';
    // Refresh all data when returning to dashboard to show latest activities
    this.loadDashboardData();
  }


}
