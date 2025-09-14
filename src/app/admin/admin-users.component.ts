import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService, ManagerDto, EmployeeDto, CreateUserDto } from '../services/user.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `

  <h2>User Management</h2>

  <!-- Add User Button -->
  <div class="actions" *ngIf="!showAddForm">
    <button (click)="toggleAddForm()">Add New User</button>
  </div>

  <!-- Add/Edit User Form -->
  <div *ngIf="showAddForm" class="form-panel">
    <form [formGroup]="userForm" (ngSubmit)="saveUser()">
      <input formControlName="username" placeholder="Username">
      <input formControlName="firstName" placeholder="First name">
      <input formControlName="lastName" placeholder="Last name">
      <input formControlName="email" placeholder="Email">
      <input formControlName="password" type="password" placeholder="Password (leave blank to keep same)" />

      <!-- Role dropdown -->
      <select formControlName="roleName" (change)="onRoleChange()">
        <option [ngValue]="null">-- Select Role --</option>
        <option value="Manager">Manager</option>
        <option value="Employee">Employee</option>
      </select>

      <!-- Manager Dropdown (only if Employee) -->
      <select *ngIf="userForm.value.roleName === 'Employee'" formControlName="managerId">
  <option [ngValue]="null">--  Select Manager / Unassigned --</option>
  <option *ngFor="let m of managers" [ngValue]="m.userId">{{ m.username }}</option>
</select>


      <!-- Form actions -->
      <div class="form-actions">
        <button type="submit" [disabled]="userForm.invalid">
          {{ editingUserId ? 'Update' : 'Create' }}
        </button>
        <button type="button" class="cancel-btn" (click)="toggleAddForm()">Cancel</button>
      </div>
    </form>
    <div *ngIf="formMsg" class="msg">{{ formMsg }}</div>
  </div>

  <!-- Users Table -->
  <table class="users-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Username</th>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Manager</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <!-- Managers -->
      <tr *ngFor="let m of managers">
        <td>{{ m.userId }}</td>
        <td>{{ m.username }}</td>
        <td>{{ m.firstName }} {{ m.lastName }}</td>
        <td>{{ m.email }}</td>
        <td>Manager</td>
        <td>-</td>
        <td>
          <button (click)="startEdit(m)">Edit</button>
          <button (click)="deleteUser(m.userId)">Delete</button>
        </td>
      </tr>

      <!-- Employees -->
      <tr *ngFor="let e of employees">
        <td>{{ e.userId }}</td>
        <td>{{ e.username }}</td>
        <td>{{ e.firstName }} {{ e.lastName }}</td>
        <td>{{ e.email }}</td>
        <td>Employee</td>
        <td>
          <span *ngIf="e.manager">{{ e.manager.username }}</span>
          <span *ngIf="!e.manager">Unassigned</span>
        </td>
        <td>
          <button (click)="startEdit(e)">Edit</button>
          <button (click)="deleteUser(e.userId)">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
  `,
  styles: [`
    .actions { margin-bottom: 12px; }
    .form-panel { border: 1px solid #ccc; padding: 12px; margin-bottom: 16px; }
    input, select { margin: 6px; padding: 6px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f4f4f4; }
    .msg { color: green; margin-top: 8px; }
    .form-actions { margin-top: 12px; }
    button { margin-right: 6px; }
  `]
})
export class AdminUsersComponent implements OnInit {
  managers: ManagerDto[] = [];
  employees: EmployeeDto[] = [];
  showAddForm = false;
  formMsg = '';
  editingUserId: number | null = null;

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
    this.loadManagers();
    this.loadEmployees();
  }

  loadManagers() {
    this.userSvc.getManagers().subscribe({
      next: list => this.managers = list,
      error: err => console.error(err)
    });
  }

  loadEmployees() {
    this.userSvc.getEmployees().subscribe({
      next: list => this.employees = list,
      error: err => console.error(err)
    });
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
