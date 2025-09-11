import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackService } from '../services/feedback.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    
  <h3>Feedback</h3>
  <input type="number" #batchSearch placeholder="Batch ID"/>
  <button (click)="searchFeedbackByBatch(+batchSearch.value)">Search Feedback</button> <br>
  <table *ngIf="feedbacks.length; else noFeedback">
    <thead>
      <tr><th>Course</th><th>Batch</th><th>User</th><th>Rating</th><th>Feedback</th><th>Date</th></tr>
    </thead>
    <tbody>
      <tr *ngFor="let f of feedbacks">
        <td>{{f.courseName}}</td>
        <td>{{f.batchName}}</td>
        <td>{{f.username}}</td>
        <td>⭐ {{f.rating}}</td>
        <td>{{f.feedbackText}}</td>
        <td>{{f.submittedOn | date:'short'}}</td>
      </tr>
    </tbody>
  </table>
  <ng-template #noFeedback><em>No feedback</em></ng-template>

  `
})
export class AdminFeedbackComponent implements OnInit {
  batchId: number | null = null;
  feedbacks: any[] = [];

  constructor(private feedbackSvc: FeedbackService) {}

  ngOnInit() {
    this.feedbackSvc.getAll().subscribe(data => this.feedbacks = data);
  }

  // Search feedback for a batch
  searchFeedbackByBatch(batchId: number) {
    this.feedbackSvc.getForBatch(batchId).subscribe(data => this.feedbacks = data);
  }
}
