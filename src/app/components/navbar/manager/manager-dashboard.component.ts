import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchesListComponent } from './manager-batchlist.component';
import { EnrollmentComponent } from './manager-enrollment.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUsers, faLayerGroup, faTachometerAlt, faUserTie, faClipboardList, faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-manager-home',
  standalone: true,
  imports: [CommonModule, BatchesListComponent, EnrollmentComponent, FontAwesomeModule],
  styleUrls: ['./manager-dashboard.css'],
template: `
    <div class="manager-dashboard">
      <!-- Modern Sidebar -->
      <aside class="manager-sidebar">
        <div class="sidebar-header">
          <div class="manager-brand">
            <div class="brand-icon">
              <fa-icon [icon]="faUserTie"></fa-icon>
            </div>
            <div class="brand-content">
              <h2 class="brand-title">Manager Panel</h2>
              <p class="brand-subtitle">Team Management</p>
            </div>
          </div>
        </div>
        
        <nav class="sidebar-navigation">
          <div class="nav-section">
            <h3 class="nav-section-title">Management</h3>
          <button 
            [class.active]="tab==='enrollments'" 
            (click)="tab='enrollments'"
            class="nav-item">
              <div class="nav-item-icon">
                <fa-icon [icon]="faClipboardList"></fa-icon>
              </div>
              <span class="nav-item-text">Enrollments</span>
              <div class="nav-item-badge" *ngIf="pendingCount > 0">{{ pendingCount }}</div>
              <div class="nav-item-indicator" *ngIf="tab==='enrollments'"></div>
          </button>
            
          <button 
            [class.active]="tab==='batches'" 
            (click)="tab='batches'"
            class="nav-item">
              <div class="nav-item-icon">
                <fa-icon [icon]="faLayerGroup"></fa-icon>
              </div>
              <span class="nav-item-text">Batches</span>
              <div class="nav-item-indicator" *ngIf="tab==='batches'"></div>
          </button>
          </div>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="manager-main">
        <!-- Content Area -->
        <div class="manager-content">
          <div class="content-wrapper">
            <app-enrollment *ngIf="tab==='enrollments'" (pendingChanged)="pendingCount=$event"></app-enrollment>
            <app-batches-list *ngIf="tab==='batches'"></app-batches-list>
          </div>
        </div>
      </main>

    </div>
  `
})
export class ManagerDashboardComponent implements OnInit {
  tab: 'batches' | 'enrollments' = 'enrollments';
  pendingCount = 0;
  totalBatches = 0;
  totalEnrollments = 0;

  // FontAwesome Icons
  faUsers = faUsers;
  faLayerGroup = faLayerGroup;
  faTachometerAlt = faTachometerAlt;
  faUserTie = faUserTie;
  faClipboardList = faClipboardList;
  faCalendarAlt = faCalendarAlt;

  ngOnInit() {
    // Initialize any required data
  }

}