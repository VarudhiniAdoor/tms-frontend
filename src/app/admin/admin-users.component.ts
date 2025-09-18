import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserService, ManagerDto, EmployeeDto, CreateUserDto } from '../services/user.service';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { 
  faEdit, faTrash, faPlus, faTimes, faUser, faUserTie, faEnvelope, faIdCard, faCrown, faUserCheck
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent, FontAwesomeModule],
  template: `
  <div class="admin-section">
    <!-- Section Header -->
    <div class="section-header">
      <div class="header-content">
  <h2>User Management</h2>
        <p>Manage users, roles, and permissions across your organization</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" (click)="toggleAddForm()" *ngIf="!showAddForm">
          <fa-icon [icon]="faPlus"></fa-icon>
          Add User
        </button>
      </div>
  </div>

  <!-- Add/Edit User Form -->
    <div class="form-card" *ngIf="showAddForm">
      <div class="form-header">
        <h3>{{ editingUserId ? 'Edit User' : 'Add New User' }}</h3>
        <button class="btn btn-ghost btn-sm" (click)="toggleAddForm()">
          <fa-icon [icon]="faTimes"></fa-icon>
        </button>
      </div>
      
      <form [formGroup]="userForm" (ngSubmit)="saveUser()" class="user-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="username" class="form-label">Username *</label>
            <input 
              id="username"
              formControlName="username" 
              placeholder="Enter username"
              class="form-input"
              [class.error]="userForm.get('username')?.invalid && userForm.get('username')?.touched">
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              id="email"
              formControlName="email" 
              placeholder="Enter email"
              class="form-input"
              type="email">
          </div>
          
          <div class="form-group">
            <label for="firstName" class="form-label">First Name</label>
            <input 
              id="firstName"
              formControlName="firstName" 
              placeholder="Enter first name"
              class="form-input">
          </div>
          
          <div class="form-group">
            <label for="lastName" class="form-label">Last Name</label>
            <input 
              id="lastName"
              formControlName="lastName" 
              placeholder="Enter last name"
              class="form-input">
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input 
              id="password"
              formControlName="password" 
              type="password" 
              placeholder="Enter password (leave blank to keep same)"
              class="form-input">
          </div>
          
          <div class="form-group">
            <label for="role" class="form-label">Role *</label>
            <select 
              id="role"
              formControlName="roleName" 
              (change)="onRoleChange()"
              class="form-select">
        <option [ngValue]="null">-- Select Role --</option>
        <option value="Manager">Manager</option>
        <option value="Employee">Employee</option>
      </select>
          </div>
          
          <div class="form-group" *ngIf="userForm.value.roleName === 'Employee'">
            <label for="manager" class="form-label">Manager</label>
            <select 
              id="manager"
              formControlName="managerId"
              class="form-select">
              <option [ngValue]="null">-- Select Manager / Unassigned --</option>
  <option *ngFor="let m of managers" [ngValue]="m.userId">{{ m.username }}</option>
</select>
          </div>
        </div>

        <!-- Form Actions -->
      <div class="form-actions">
          <button type="button" class="btn btn-outline" (click)="toggleAddForm()">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" [disabled]="userForm.invalid">
            {{ editingUserId ? 'Update User' : 'Create User' }}
        </button>
        </div>
      </form>
      
      <div *ngIf="formMsg" class="alert" [class.success]="formMsg.includes('success')" [class.error]="formMsg.includes('failed')">
        {{ formMsg }}
      </div>
  </div>

    <!-- Users Table -->
    <div class="table-card">
      <div class="table-header">
        <div class="table-stats">
          <span class="stat">{{ managers.length }} Managers</span>
          <span class="stat">{{ employees.length }} Employees</span>
        </div>
      </div>
      
      <div class="table-container">
        <table class="data-table">
    <thead>
      <tr>
        <th class="id-column">
          <fa-icon [icon]="faIdCard"></fa-icon>
          ID
        </th>
        <th class="user-column">
          <fa-icon [icon]="faUser"></fa-icon>
          User
        </th>
        <th class="email-column">
          <fa-icon [icon]="faEnvelope"></fa-icon>
          Email
        </th>
        <th class="role-column">
          <fa-icon [icon]="faCrown"></fa-icon>
          Role
        </th>
        <th class="manager-column">
          <fa-icon [icon]="faUserTie"></fa-icon>
          Manager
        </th>
        <th class="actions-column">Actions</th>
      </tr>
    </thead>
    <tbody>
      <!-- Users -->
            <tr *ngFor="let user of paginatedUsers" class="data-row">
              <td class="id-cell">{{ user.userId }}</td>
              <td class="user-cell">
                <div class="user-info">
                  <div class="user-avatar">
                    <fa-icon [icon]="'manager' in user ? faUser : faUserTie"></fa-icon>
                  </div>
                  <div class="user-details">
                    <div class="username">{{ user.username }}</div>
                    <div class="fullname">{{ user.firstName }} {{ user.lastName }}</div>
                  </div>
                </div>
              </td>
              <td class="email-cell">{{ user.email || 'No email' }}</td>
              <td class="role-cell">
                <span class="role-badge" [class.manager]="!('manager' in user)" [class.employee]="'manager' in user">
                  <fa-icon [icon]="'manager' in user ? faUser : faUserTie"></fa-icon>
                  {{ 'manager' in user ? 'Employee' : 'Manager' }}
                </span>
              </td>
              <td class="manager-cell">
                <span *ngIf="'manager' in user && user.manager" class="manager-name">
                  <fa-icon [icon]="faUserTie"></fa-icon>
                  {{ user.manager.username }}
                </span>
                <span *ngIf="!('manager' in user) || !user.manager" class="unassigned">
                  <fa-icon [icon]="faUserCheck"></fa-icon>
                  Self-managed
                </span>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button class="btn btn-sm btn-edit" (click)="startEdit(user)" title="Edit User">
                    <fa-icon [icon]="faEdit"></fa-icon>
                  </button>
                  <button class="btn btn-sm btn-delete" (click)="deleteUser(user.userId)" title="Delete User">
                    <fa-icon [icon]="faTrash"></fa-icon>
                  </button>
                </div>
        </td>
      </tr>
    </tbody>
  </table>
      </div>
    </div>

    <!-- Pagination -->
    <app-pagination
      [currentPage]="currentPage"
      [totalItems]="totalItems"
      [pageSize]="pageSize"
      (pageChange)="onPageChange($event)"
      (pageSizeChange)="onPageSizeChange($event)">
    </app-pagination>
  </div>
  `,
  styles: [`
    .admin-section {
      padding: 24px;
      background: var(--light-bg);
      min-height: 100vh;
      transition: background var(--transition-normal);
    }
    body.dark-mode .admin-section {
      background: var(--dark-bg);
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

    .form-card {
      background: var(--light-card);
      border: 1px solid var(--light-border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-normal);
    }
    body.dark-mode .form-card {
      background: var(--dark-card);
      border-color: var(--dark-border);
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--light-border);
    }
    body.dark-mode .form-header {
      border-bottom-color: var(--dark-border);
    }

    .form-header h3 {
      margin: 0;
      color: var(--light-text);
      font-size: 1.25rem;
      font-weight: 600;
    }
    body.dark-mode .form-header h3 {
      color: var(--dark-text);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-weight: 500;
      color: var(--light-text);
      font-size: 0.9rem;
    }
    body.dark-mode .form-label {
      color: var(--dark-text);
    }

    .form-input, .form-select {
      padding: 12px 16px;
      border: 1px solid var(--light-border);
      border-radius: 8px;
      background: var(--light-surface);
      color: var(--light-text);
      font-size: 0.95rem;
      transition: all var(--transition-fast);
    }
    body.dark-mode .form-input, body.dark-mode .form-select {
      background: var(--dark-surface);
      border-color: var(--dark-border);
      color: var(--dark-text);
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 16px;
      border-top: 1px solid var(--light-border);
    }
    body.dark-mode .form-actions {
      border-top-color: var(--dark-border);
    }

    .alert {
      padding: 12px 16px;
      border-radius: 8px;
      margin-top: 16px;
      font-size: 0.9rem;
    }
    .alert.success {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }
    .alert.error {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
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

    .stat {
      padding: 4px 12px;
      background: var(--primary);
      color: white;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
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

    .username-cell {
      min-width: 150px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
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

    .role-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .role-badge.manager {
      background: #dbeafe;
      color: #1e40af;
    }
    body.dark-mode .role-badge.manager {
      background: #1e3a8a;
      color: #dbeafe;
    }

    .role-badge.employee {
      background: #dcfce7;
      color: #166534;
    }
    body.dark-mode .role-badge.employee {
      background: #14532d;
      color: #dcfce7;
    }

    .manager-name {
      color: var(--primary);
      font-weight: 500;
    }

    .unassigned {
      color: var(--light-text-secondary);
      font-style: italic;
    }
    body.dark-mode .unassigned {
      color: var(--dark-text-secondary);
    }

    .actions-cell {
      white-space: nowrap;
    }

    .actions-cell .btn {
      margin-right: 8px;
    }

    .btn-danger {
      color: #dc2626;
      border-color: #dc2626;
    }

    .btn-danger:hover {
      background: #dc2626;
      color: white;
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
      
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .table-container {
        font-size: 0.85rem;
      }
      
      .data-table th,
      .data-table td {
        padding: 12px 16px;
      }
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  managers: ManagerDto[] = [];
  employees: EmployeeDto[] = [];
  allUsers: (ManagerDto | EmployeeDto)[] = [];
  paginatedUsers: (ManagerDto | EmployeeDto)[] = [];
  showAddForm = false;
  formMsg = '';
  editingUserId: number | null = null;
  
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 6;
  totalItems: number = 0;

  // FontAwesome Icons
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlus;
  faTimes = faTimes;
  faUser = faUser;
  faUserTie = faUserTie;
  faEnvelope = faEnvelope;
  faIdCard = faIdCard;
  faCrown = faCrown;
  faUserCheck = faUserCheck;

  userForm = new FormGroup({
    username: new FormControl('', Validators.required),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    roleName: new FormControl('Manager', Validators.required),
    managerId: new FormControl<number | null>(null) 
  });

  constructor(private userSvc: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loadManagers();
    this.loadEmployees();
  }

  loadManagers() {
    this.userSvc.getManagers().subscribe({
      next: list => {
        this.managers = list;
        this.updateAllUsers();
      },
      error: err => console.error(err)
    });
  }

  loadEmployees() {
    this.userSvc.getEmployees().subscribe({
      next: list => {
        this.employees = list;
        this.updateAllUsers();
      },
      error: err => console.error(err)
    });
  }

  updateAllUsers() {
    this.allUsers = [...this.managers, ...this.employees];
    this.totalItems = this.allUsers.length;
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.allUsers.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedUsers();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1; // Reset to first page
    this.updatePaginatedUsers();
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    this.formMsg = '';
    this.editingUserId = null;
    this.userForm.reset({ roleName: null, managerId: null });
  }

  onRoleChange() {
    if (this.userForm.value.roleName === 'Manager') {
      this.userForm.patchValue({ managerId: null });
    }
  }

  startEdit(user: any) {
    this.showAddForm = true;
    this.editingUserId = user.userId;
    this.userForm.patchValue({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      roleName: user.manager ? 'Employee' : 'Manager',
      managerId: user.manager ? user.manager.userId : null
    });
  }

  saveUser() {
    const val = this.userForm.value;
    const dto: CreateUserDto = {
      username: val.username!,
      password: val.password || '', // send empty if unchanged
      email: val.email ?? '',
      firstName: val.firstName ?? '',
      lastName: val.lastName ?? '',
      roleName: val.roleName!,
      managerId: val.roleName === 'Employee' ? val.managerId : null
    };

    if (this.editingUserId) {
      // Update existing user
      this.userSvc.updateUser(this.editingUserId, dto).subscribe({
        next: () => {
          this.formMsg = 'User updated successfully';
          this.toggleAddForm();
          this.loadManagers();
          this.loadEmployees();
        },
        error: e => this.formMsg = 'Update failed: ' + (e?.error ?? JSON.stringify(e))
      });
    } else {
      // Create new user
      this.userSvc.createUser(dto).subscribe({
        next: () => {
          this.formMsg = 'User created successfully';
          this.toggleAddForm();
          this.loadManagers();
          this.loadEmployees();
        },
        error: e => this.formMsg = 'Create failed: ' + (e?.error ?? JSON.stringify(e))
      });
    }
  }

  deleteUser(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.userSvc.deleteUser(id).subscribe({
      next: () => {
        this.loadManagers();
        this.loadEmployees();
      },
      error: e => alert('Delete failed: ' + (e?.error ?? JSON.stringify(e)))
    });
  }
}
