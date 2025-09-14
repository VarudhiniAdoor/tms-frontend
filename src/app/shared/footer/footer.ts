import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <p>© 2025 Training Management System - ABC Inc.</p>
    </footer>
  `,
  styleUrls: ['./footer.css'],
})
export class Footer {}
