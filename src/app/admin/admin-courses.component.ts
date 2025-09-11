import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../services/course.service';
import { Course } from '../models/domain.models';

@Component({
  selector: 'app-admin-courses',
  template: `
  <h2>Admin — Courses</h2>

<!-- Search -->
<input [(ngModel)]="searchTerm" placeholder="Search courses..." class="search"/><br>

<!-- Toggle Create Course -->
<button (click)="showCreateCourse = !showCreateCourse">
  {{ showCreateCourse ? 'Close Form' : 'Add New Course' }}
</button>

<!-- Create Course Form -->
<section *ngIf="showCreateCourse" class="panel">
  <form [formGroup]="courseForm" (ngSubmit)="createCourse()">
    <input formControlName="courseName" placeholder="Course Name" required/>
    <input formControlName="description" placeholder="Description"/>
    <input formControlName="durationDays" type="number" placeholder="Duration (days)" required/>
    <button type="submit" [disabled]="courseForm.invalid">Create Course</button>
  </form>
  <div *ngIf="courseMsg">{{courseMsg}}</div>
</section>

<!-- Courses List -->
<div class="courses-container">
  <div *ngFor="let c of filteredCourses()" class="course-card">
    <div class="course-header">
      <strong>{{c.courseName}}</strong>
    </div>
    <p>{{c.description}}</p>
    <p>Duration: {{c.durationDays}} days</p>
    <button (click)="deleteCourse(c.courseId)">Delete</button>
  </div>
</div>
`,
  styles: [`
    .panel { border:1px solid #eee; padding:12px; margin-bottom:14px; }
.courses-container { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px; }
.course-card { border:1px solid #ddd; padding:12px; width: 220px; border-radius:6px; background:#fafafa; }
.course-header { display: flex; justify-content: space-between; align-items: center; }
.course-language { font-size: 0.85em; color: #555; }
button { margin-top: 6px; }
.search { margin: 10px 0; padding: 6px; width: 300px; }
`],
imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class AdminCoursesComponent implements OnInit {
  courses: Course[] = [];
  searchTerm = '';
  showCreateCourse = false;

  // Create course form
  courseForm = new FormGroup({
    courseName: new FormControl('', Validators.required),
    description: new FormControl(''),
    durationDays: new FormControl(0, Validators.required),
    language: new FormControl('', Validators.required)  // optional: icon or language type
  });

  courseMsg = '';

  constructor(private courseSvc: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.courseSvc.getAll().subscribe({
      next: (data) => (this.courses = data),
      error: (err) => console.error('Error loading courses', err)
    });
  }

  filteredCourses() {
    if (!this.searchTerm) return this.courses;
    const term = this.searchTerm.toLowerCase();
    return this.courses.filter(
      (c) =>
        c.courseName.toLowerCase().includes(term) ||
        (c.description?.toLowerCase().includes(term)) ||
        c.courseId.toString().includes(term)
    );
  }

  createCourse() {
    if (this.courseForm.invalid) return;

    const val = this.courseForm.value;
    this.courseSvc.create({
      courseName: val.courseName!,
      description: val.description ?? '',
      durationDays: val.durationDays ?? 0
    }).subscribe({
      next: () => {
        this.courseMsg = 'Course created successfully';
        this.courseForm.reset();
        this.showCreateCourse = false;
        this.loadCourses();
      },
      error: (err) => {
        console.error('Create course failed', err);
        this.courseMsg = 'Create course failed';
      }
    });
  }

  deleteCourse(courseId: number) {
    if (!confirm('Delete this course?')) return;
    this.courseSvc.delete(courseId).subscribe({
      next: () => this.loadCourses(),
      error: (err) => console.error('Delete course failed', err)
    });
  }
}
