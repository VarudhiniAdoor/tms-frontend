import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../services/course.service';
import { Course } from '../models/domain.models';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faBook, faPlus, faSearch, faEdit, faTrash, faClock, 
  faUsers, faStar, faEye, faEllipsisV, faPlay, faPause
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-courses',
  template: `
    <div class="admin-section">
      <!-- Section Header -->
      <div class="section-header">
        <div class="header-content">
        <h2>Course Management</h2>
          <p>Manage your training courses and curriculum</p>
        </div>
        <div class="header-actions">
        <button class="btn btn-primary" (click)="addCourse()">
            <i class="icon">➕</i>
          Add Course
        </button>
        </div>
      </div>

      <!-- Add/Edit Course Form -->
      <div class="form-card" *ngIf="showModal">
        <div class="form-header">
          <h3>{{ isEditMode ? 'Edit Course' : 'Add New Course' }}</h3>
          <button class="btn btn-ghost btn-sm" (click)="closeModal()">
            <i class="icon">✕</i>
          </button>
        </div>
        
        <form [formGroup]="courseForm" (ngSubmit)="onSubmit()" class="course-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="courseName" class="form-label">Course Name *</label>
              <input 
                id="courseName"
                formControlName="courseName" 
                placeholder="Enter course name"
                class="form-input"
                [class.error]="courseForm.get('courseName')?.invalid && courseForm.get('courseName')?.touched">
            </div>
            
            <div class="form-group">
              <label for="durationDays" class="form-label">Duration (Days) *</label>
              <input 
                id="durationDays"
                formControlName="durationDays" 
                type="number"
                placeholder="Enter duration in days"
                class="form-input"
                [class.error]="courseForm.get('durationDays')?.invalid && courseForm.get('durationDays')?.touched"
                min="1">
            </div>
            
            <div class="form-group full-width">
              <label for="description" class="form-label">Description</label>
              <textarea 
                id="description"
                formControlName="description" 
                placeholder="Enter course description"
                class="form-textarea"
                rows="3"></textarea>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="closeModal()">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="courseForm.invalid || isLoading">
              {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Course' : 'Create Course') }}
            </button>
              </div>
        </form>
        
        <div *ngIf="courseMsg" class="alert" [class.success]="courseMsg.includes('success')" [class.error]="courseMsg.includes('Failed')">
          {{ courseMsg }}
              </div>
            </div>

      <!-- Courses Table -->
      <div class="table-card">
        <div class="table-header">
          <div class="table-stats">
            <span class="stat">{{ courses.length }} Courses</span>
          </div>
        </div>
        
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Course</th>
                <th>Duration</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let course of courses" class="data-row">
                <td class="id-cell">{{ course.courseId }}</td>
                <td class="course-cell">
                  <div class="course-info">
                    <div class="course-avatar">
                      <fa-icon [icon]="faBook"></fa-icon>
                    </div>
                    <span>{{ course.courseName }}</span>
                  </div>
                </td>
                <td>
                  <div class="duration-info">
                    <fa-icon [icon]="faClock"></fa-icon>
                    <span>{{ course.durationDays }} days</span>
                  </div>
                </td>
                <td class="description-cell">{{ course.description || 'No description available' }}</td>
                <td class="actions-cell">
                  <button class="btn btn-sm btn-ghost" (click)="editCourse(course)">
                    <i class="icon">✏️</i>
                    Edit
                  </button>
                  <button class="btn btn-sm btn-outline btn-danger" (click)="deleteCourse(course.courseId)">
                    <i class="icon">🗑️</i>
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

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

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-label {
      font-weight: 500;
      color: var(--light-text);
      font-size: 0.9rem;
    }
    body.dark-mode .form-label {
      color: var(--dark-text);
    }

    .form-input, .form-textarea {
      padding: 12px 16px;
      border: 1px solid var(--light-border);
      border-radius: 8px;
      background: var(--light-surface);
      color: var(--light-text);
      font-size: 0.95rem;
      transition: all var(--transition-fast);
    }
    body.dark-mode .form-input, body.dark-mode .form-textarea {
      background: var(--dark-surface);
      border-color: var(--dark-border);
      color: var(--dark-text);
    }

    .form-input:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
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

    .course-cell {
      min-width: 200px;
    }

    .course-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .course-avatar {
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

    .duration-info {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--light-text-secondary);
    }
    body.dark-mode .duration-info {
      color: var(--dark-text-secondary);
    }

    .duration-info fa-icon {
      color: var(--primary);
      font-size: 0.8rem;
    }

    .description-cell {
      max-width: 300px;
      word-wrap: break-word;
      color: var(--light-text-secondary);
    }
    body.dark-mode .description-cell {
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

      .description-cell {
        max-width: 200px;
      }
    }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule]
})
export class AdminCoursesComponent implements OnInit {
  courses: Course[] = [];
  activeMenuId: number | null = null;
  courseForm: FormGroup;
  courseMsg: string = '';
  isLoading: boolean = false;
  showModal: boolean = false;
  isEditMode: boolean = false;
  editingCourse: Course | null = null;

  // Icons
  faBook = faBook;
  faPlus = faPlus;
  faSearch = faSearch;
  faEdit = faEdit;
  faTrash = faTrash;
  faClock = faClock;
  faUsers = faUsers;
  faStar = faStar;
  faEye = faEye;
  faEllipsisV = faEllipsisV;
  faPlay = faPlay;
  faPause = faPause;

  constructor(private courseService: CourseService) {
    this.courseForm = new FormGroup({
      courseName: new FormControl('', [Validators.required]),
      durationDays: new FormControl('', [Validators.required, Validators.min(1)]),
      description: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getAll().subscribe({
      next: (courses: Course[]) => {
        this.courses = courses;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading courses:', error);
        this.courseMsg = 'Failed to load courses';
        this.isLoading = false;
      }
    });
  }

  toggleMenu(courseId: number): void {
    this.activeMenuId = this.activeMenuId === courseId ? null : courseId;
  }


  addCourse(): void {
    this.isEditMode = false;
    this.editingCourse = null;
    this.courseForm.reset();
    this.showModal = true;
    this.courseMsg = '';
  }

  viewCourse(course: Course): void {
    console.log('View course:', course);
    this.activeMenuId = null;
  }

  editCourse(course: Course): void {
    this.isEditMode = true;
    this.editingCourse = course;
    this.courseForm.patchValue({
      courseName: course.courseName,
      durationDays: course.durationDays,
      description: course.description || ''
    });
    this.showModal = true;
    this.courseMsg = '';
  }

  duplicateCourse(course: Course): void {
    this.isEditMode = false;
    this.editingCourse = null;
    this.courseForm.patchValue({
      courseName: `${course.courseName} (Copy)`,
      durationDays: course.durationDays,
      description: course.description || ''
    });
    this.showModal = true;
    this.courseMsg = '';
  }

  deleteCourse(courseId: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.delete(courseId).subscribe({
        next: () => {
          this.loadCourses();
          this.courseMsg = 'Course deleted successfully';
        },
        error: (error: any) => {
          console.error('Error deleting course:', error);
          this.courseMsg = 'Failed to delete course';
        }
      });
    }
    this.activeMenuId = null;
  }



  closeModal(): void {
    this.showModal = false;
    this.isEditMode = false;
    this.editingCourse = null;
    this.courseForm.reset();
    this.courseMsg = '';
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      this.isLoading = true;
      const courseData = this.courseForm.value;

      if (this.isEditMode && this.editingCourse) {
        // Update existing course
        const updatedCourse: Course = {
          ...this.editingCourse,
          courseName: courseData.courseName,
          durationDays: courseData.durationDays,
          description: courseData.description
        };

        this.courseService.update(this.editingCourse.courseId, updatedCourse).subscribe({
          next: () => {
            this.loadCourses();
            this.closeModal();
            this.courseMsg = 'Course updated successfully';
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error('Error updating course:', error);
            this.courseMsg = 'Failed to update course';
            this.isLoading = false;
          }
        });
      } else {
        // Create new course
        this.courseService.create(courseData).subscribe({
          next: () => {
            this.loadCourses();
            this.closeModal();
            this.courseMsg = 'Course created successfully';
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error('Error creating course:', error);
            this.courseMsg = 'Failed to create course';
            this.isLoading = false;
          }
        });
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.courseForm.controls).forEach(key => {
        this.courseForm.get(key)?.markAsTouched();
      });
    }
  }
}