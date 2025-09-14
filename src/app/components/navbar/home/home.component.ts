import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero">
      <h1 class="fade-in">Training Management System</h1>
      <p class="slide-up">Empowering employees with technical and soft skills training at ABC Inc.</p>
      <a routerLink="/login" class="cta">🚀 Get Started</a>
    </section>

    <section class="section fade-in">
      <h2>About Us</h2>
      <p>ABC Inc. is one of the most established organizations in the United States, headquartered in New York with branches worldwide. Known for excellence in HR and employee training.</p>
    </section>

    <section class="section slide-up">
      <h2>Our Vision</h2>
      <p>We aim to simplify training management with paperless operations, role-based dashboards, and empowering employees to choose their learning path.</p>
    </section>

    <section class="section fade-in">
      <h2>Our Team</h2>
      <div class="team">
        <div class="team-member">Madhav</div>
        <div class="team-member">Varudhini</div>
        <div class="team-member">Thiru</div>
        <div class="team-member">Prudhvi</div>
      </div>
    </section>

    <section class="section slide-up">
      <h2>Contact</h2>
      <p>📧 contact@abcinc.com</p>
      <p>📞 +1-123-456-7890</p>
    </section>
  `,
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {}
