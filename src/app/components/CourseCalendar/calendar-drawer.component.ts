import { Component } from '@angular/core';
import { CalendarDrawerService } from '../../services/calendar-drawer.service';
import { CalendarListComponent } from './manager-coursecalandar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-drawer',
  standalone: true,
  imports: [CalendarListComponent,CommonModule],
  template: `
    <!-- Backdrop -->
    <div class="drawer-backdrop" *ngIf="isOpen" (click)="close()"></div>

    <!-- Drawer -->
    <div class="drawer" [class.open]="isOpen">
      <button class="close-btn" (click)="close()">✕</button>
      <app-calendar-list></app-calendar-list>
    </div>
  `,
  styleUrls: ['./calendar-drawer.component.css']
})
export class CalendarDrawerComponent {
  isOpen = false;

  constructor(private drawer: CalendarDrawerService) {
    this.drawer.open$.subscribe(v => this.isOpen = v);
  }

  close() {
    this.drawer.close();
  }
}
