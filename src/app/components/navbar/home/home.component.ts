import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<button class="theme-toggle" (click)="toggleTheme()">Switch Theme</button>

    <section class="hero">
      <h1>Training Management System</h1>
      <p>Empowering employees with technical and soft skills training at ABC Inc.</p>
      <a routerLink="/login">Get Started</a>
    </section>

    <section class="section">
      <h2>About Us</h2>
      <p>ABC, Inc. is a leading organization founded 10 years ago in New York, known for its excellence in Human Resource Management and employee training worldwide.</p>
    </section>

    <section class="section">
      <h2>Our Vision</h2>
      <p>We aim to simplify training management by reducing paperwork, offering role-based dashboards, and giving employees the freedom to choose their learning path.</p>
    </section>

    <section class="section">
      <h2>Our Team</h2>
      <div class="team">
        <div class="team-member">Madhav</div>
        <div class="team-member">Varudhini</div>
        <div class="team-member">Thiru</div>
        <div class="team-member">Prudhvi</div>
      </div>
    </section>

    <section class="section">
      <h2>Contact</h2>
      <p>Email: contact@abcinc.com</p>
      <p>Phone: +1-123-456-7890</p>
    </section>

    <footer>
      <p>© 2025 Training Management System - ABC Inc.</p>
    </footer>
  `,
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
   toggleTheme() {
    document.body.classList.toggle('dark-mode');
  }
}



// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
//   template: `
//     <h1>Welcome to the Training Management System</h1>
//     <p>Use the navigation to access your dashboard. Login or register to get started.</p>
//     <p><a routerLink="/login">Login</a> | <a routerLink="/register">Register</a></p>
//   `,
//   styles: [`
//     h1 { margin-top: 0; }
//   `]
// })
// export class HomeComponent {}
