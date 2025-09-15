import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title animate-fadeIn">
            <span class="gradient-text">Training Management System</span>
          </h1>
          <p class="hero-subtitle animate-fadeIn">
            Empowering employees with cutting-edge technical and soft skills training at ABC Inc.
          </p>
          <div class="hero-actions animate-fadeIn">
            <a routerLink="/login" class="btn btn-primary btn-lg">
              <span class="btn-icon">🚀</span>
              Get Started
            </a>
            <a href="#features" class="btn btn-outline btn-lg">
              <span class="btn-icon">📖</span>
              Learn More
            </a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-cards">
            <div class="card card-1">
              <div class="card-icon">📚</div>
              <div class="card-text">Courses</div>
            </div>
            <div class="card card-2">
              <div class="card-icon">👥</div>
              <div class="card-text">Batches</div>
            </div>
            <div class="card card-3">
              <div class="card-icon">✅</div>
              <div class="card-text">Enrollments</div>
            </div>
            <div class="card card-4">
              <div class="card-icon">📊</div>
              <div class="card-text">Analytics</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Why Choose Our Platform?</h2>
          <p class="section-subtitle">Modern, intuitive, and powerful training management</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card animate-scaleIn">
            <div class="feature-icon">🎯</div>
            <h3>Role-Based Access</h3>
            <p>Tailored dashboards for employees, managers, and administrators with appropriate permissions.</p>
          </div>
          
          <div class="feature-card animate-scaleIn">
            <div class="feature-icon">📱</div>
            <h3>Mobile Responsive</h3>
            <p>Access your training dashboard from any device, anywhere, anytime with our responsive design.</p>
          </div>
          
          <div class="feature-card animate-scaleIn">
            <div class="feature-icon">🔒</div>
            <h3>Secure & Reliable</h3>
            <p>Enterprise-grade security with encrypted data transmission and secure authentication.</p>
          </div>
          
          <div class="feature-card animate-scaleIn">
            <div class="feature-icon">📈</div>
            <h3>Analytics & Reports</h3>
            <p>Comprehensive insights into training progress, completion rates, and performance metrics.</p>
          </div>
          
          <div class="feature-card animate-scaleIn">
            <div class="feature-icon">🌙</div>
            <h3>Dark Mode</h3>
            <p>Eye-friendly dark mode option for comfortable viewing in any lighting condition.</p>
          </div>
          
          <div class="feature-card animate-scaleIn">
            <div class="feature-icon">⚡</div>
            <h3>Fast & Efficient</h3>
            <p>Optimized performance with quick loading times and smooth user interactions.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about-section">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2 class="section-title">About ABC Inc.</h2>
            <p class="about-description">
              ABC Inc. is one of the most established organizations in the United States, 
              headquartered in New York with branches worldwide. We are known for our 
              excellence in HR and employee training, helping organizations build 
              high-performing teams through innovative learning solutions.
            </p>
            <div class="stats">
              <div class="stat">
                <div class="stat-number">500+</div>
                <div class="stat-label">Employees</div>
              </div>
              <div class="stat">
                <div class="stat-number">50+</div>
                <div class="stat-label">Courses</div>
              </div>
              <div class="stat">
                <div class="stat-number">95%</div>
                <div class="stat-label">Satisfaction</div>
              </div>
            </div>
          </div>
          <div class="about-visual">
            <div class="visual-card">
              <div class="visual-icon">🏢</div>
              <h4>Global Presence</h4>
              <p>Offices worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Meet Our Team</h2>
          <p class="section-subtitle">The talented individuals behind our success</p>
        </div>
        
        <div class="team-grid">
          <div class="team-member animate-fadeIn">
            <div class="member-avatar">M</div>
            <h4 class="member-name">Madhav</h4>
            <p class="member-role">Lead Developer</p>
          </div>
          
          <div class="team-member animate-fadeIn">
            <div class="member-avatar">V</div>
            <h4 class="member-name">Varudhini</h4>
            <p class="member-role">UI/UX Designer</p>
          </div>
          
          <div class="team-member animate-fadeIn">
            <div class="member-avatar">T</div>
            <h4 class="member-name">Thiru</h4>
            <p class="member-role">Backend Developer</p>
          </div>
          
          <div class="team-member animate-fadeIn">
            <div class="member-avatar">P</div>
            <h4 class="member-name">Prudhvi</h4>
            <p class="member-role">DevOps Engineer</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Transform Your Training?</h2>
          <p class="cta-subtitle">Join thousands of organizations already using our platform</p>
          <div class="cta-actions">
            <a routerLink="/login" class="btn btn-primary btn-lg">
              <span class="btn-icon">🚀</span>
              Start Your Journey
            </a>
            <a href="#contact" class="btn btn-outline btn-lg">
              <span class="btn-icon">📞</span>
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Get in Touch</h2>
          <p class="section-subtitle">We'd love to hear from you</p>
        </div>
        
        <div class="contact-content">
          <div class="contact-info">
            <div class="contact-item">
              <div class="contact-icon">📧</div>
              <div class="contact-details">
                <h4>Email</h4>
                <p>contact@abcinc.com</p>
              </div>
            </div>
            
            <div class="contact-item">
              <div class="contact-icon">📞</div>
              <div class="contact-details">
                <h4>Phone</h4>
                <p>+1-123-456-7890</p>
              </div>
            </div>
            
            <div class="contact-item">
              <div class="contact-icon">📍</div>
              <div class="contact-details">
                <h4>Address</h4>
                <p>New York, NY 10001<br>United States</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      background: var(--gradient-light);
      position: relative;
      overflow: hidden;
    }

    body.dark-mode .hero {
      background: var(--gradient-dark);
    }

    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-3xl);
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--spacing-xl);
      width: 100%;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: var(--spacing-lg);
    }

    .gradient-text {
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: var(--light-text-secondary);
      margin-bottom: var(--spacing-2xl);
      line-height: 1.6;
    }

    body.dark-mode .hero-subtitle {
      color: var(--dark-text-secondary);
    }

    .hero-actions {
      display: flex;
      gap: var(--spacing-lg);
      flex-wrap: wrap;
    }

    .hero-visual {
      position: relative;
      height: 400px;
    }

    .floating-cards {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .floating-cards .card {
      position: absolute;
      background: var(--light-card);
      border-radius: var(--radius-xl);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-xl);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-sm);
      animation: float 6s ease-in-out infinite;
    }

    body.dark-mode .floating-cards .card {
      background: var(--dark-card);
    }

    .card-1 {
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .card-2 {
      top: 20%;
      right: 20%;
      animation-delay: 1.5s;
    }

    .card-3 {
      bottom: 30%;
      left: 20%;
      animation-delay: 3s;
    }

    .card-4 {
      bottom: 10%;
      right: 10%;
      animation-delay: 4.5s;
    }

    .card-icon {
      font-size: 2rem;
    }

    .card-text {
      font-weight: 600;
      color: var(--light-text);
    }

    body.dark-mode .card-text {
      color: var(--dark-text);
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    .features-section {
      padding: var(--spacing-3xl) 0;
      background: var(--light-bg);
    }

    body.dark-mode .features-section {
      background: var(--dark-bg);
    }

    .about-section {
      padding: var(--spacing-3xl) 0;
      background: var(--light-card);
    }

    body.dark-mode .about-section {
      background: var(--dark-card);
    }

    .team-section {
      padding: var(--spacing-3xl) 0;
      background: var(--light-bg);
    }

    body.dark-mode .team-section {
      background: var(--dark-bg);
    }

    .cta-section {
      padding: var(--spacing-3xl) 0;
      background: var(--gradient-primary);
      color: white;
      text-align: center;
    }

    .contact-section {
      padding: var(--spacing-3xl) 0;
      background: var(--light-card);
    }

    body.dark-mode .contact-section {
      background: var(--dark-card);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--spacing-xl);
    }

    .section-header {
      text-align: center;
      margin-bottom: var(--spacing-3xl);
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: var(--spacing-md);
      color: var(--light-text);
    }

    body.dark-mode .section-title {
      color: var(--dark-text);
    }

    .section-subtitle {
      font-size: 1.125rem;
      color: var(--light-text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }

    body.dark-mode .section-subtitle {
      color: var(--dark-text-secondary);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-xl);
    }

    .feature-card {
      background: var(--light-card);
      padding: var(--spacing-2xl);
      border-radius: var(--radius-xl);
      text-align: center;
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-normal);
      border: 1px solid var(--light-border);
    }

    body.dark-mode .feature-card {
      background: var(--dark-card);
      border-color: var(--dark-border);
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-xl);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: var(--spacing-lg);
    }

    .feature-card h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: var(--spacing-md);
      color: var(--light-text);
    }

    body.dark-mode .feature-card h3 {
      color: var(--dark-text);
    }

    .feature-card p {
      color: var(--light-text-secondary);
      line-height: 1.6;
    }

    body.dark-mode .feature-card p {
      color: var(--dark-text-secondary);
    }

    .about-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--spacing-3xl);
      align-items: center;
    }

    .about-description {
      font-size: 1.125rem;
      line-height: 1.7;
      margin-bottom: var(--spacing-2xl);
      color: var(--light-text-secondary);
    }

    body.dark-mode .about-description {
      color: var(--dark-text-secondary);
    }

    .stats {
      display: flex;
      gap: var(--spacing-2xl);
    }

    .stat {
      text-align: center;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: var(--spacing-xs);
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--light-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    body.dark-mode .stat-label {
      color: var(--dark-text-secondary);
    }

    .visual-card {
      background: var(--light-surface);
      padding: var(--spacing-2xl);
      border-radius: var(--radius-xl);
      text-align: center;
      box-shadow: var(--shadow-lg);
    }

    body.dark-mode .visual-card {
      background: var(--dark-surface);
    }

    .visual-icon {
      font-size: 4rem;
      margin-bottom: var(--spacing-lg);
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-xl);
    }

    .team-member {
      background: var(--light-card);
      padding: var(--spacing-2xl);
      border-radius: var(--radius-xl);
      text-align: center;
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-normal);
      border: 1px solid var(--light-border);
    }

    body.dark-mode .team-member {
      background: var(--dark-card);
      border-color: var(--dark-border);
    }

    .team-member:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-xl);
    }

    .member-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
      color: white;
      margin: 0 auto var(--spacing-lg);
    }

    .member-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: var(--spacing-xs);
      color: var(--light-text);
    }

    body.dark-mode .member-name {
      color: var(--dark-text);
    }

    .member-role {
      color: var(--light-text-secondary);
      font-size: 0.875rem;
    }

    body.dark-mode .member-role {
      color: var(--dark-text-secondary);
    }

    .cta-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .cta-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: var(--spacing-lg);
    }

    .cta-subtitle {
      font-size: 1.25rem;
      margin-bottom: var(--spacing-2xl);
      opacity: 0.9;
    }

    .cta-actions {
      display: flex;
      gap: var(--spacing-lg);
      justify-content: center;
      flex-wrap: wrap;
    }

    .contact-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .contact-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-xl);
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
      padding: var(--spacing-xl);
      background: var(--light-surface);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
    }

    body.dark-mode .contact-item {
      background: var(--dark-surface);
    }

    .contact-icon {
      font-size: 2rem;
    }

    .contact-details h4 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: var(--spacing-xs);
      color: var(--light-text);
    }

    body.dark-mode .contact-details h4 {
      color: var(--dark-text);
    }

    .contact-details p {
      color: var(--light-text-secondary);
      margin: 0;
    }

    body.dark-mode .contact-details p {
      color: var(--dark-text-secondary);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
        gap: var(--spacing-xl);
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-actions {
        justify-content: center;
      }

      .about-content {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .stats {
        justify-content: center;
      }

      .cta-title {
        font-size: 2rem;
      }

      .cta-actions {
        flex-direction: column;
        align-items: center;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 2rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .features-grid,
      .team-grid {
        grid-template-columns: 1fr;
      }

      .stats {
        flex-direction: column;
        gap: var(--spacing-lg);
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  ngOnInit() {
    // Add any initialization logic here
  }
}
