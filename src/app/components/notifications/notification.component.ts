import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NotificationService, Notification } from '../../services/notification.service';
import { 
  faBell, faTimes, faCheck, faExclamationTriangle, 
  faInfoCircle, faCheckCircle, faTimesCircle, faRobot
} from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="notifications-container">
      <!-- Notification Bell -->
      <div class="notification-bell" (click)="toggleNotifications()" [class.has-unread]="unreadCount > 0">
        <fa-icon [icon]="faBell"></fa-icon>
        <div class="notification-badge" *ngIf="unreadCount > 0">{{ unreadCount }}</div>
      </div>

      <!-- Notifications Dropdown -->
      <div class="notifications-dropdown" [class.open]="showNotifications">
        <div class="notifications-header">
          <h3>Notifications</h3>
          <div class="header-actions">
            <button class="btn-mark-all" (click)="markAllAsRead()" *ngIf="unreadCount > 0">
              <fa-icon [icon]="faCheck"></fa-icon>
              Mark all as read
            </button>
            <button class="btn-close" (click)="closeNotifications()">
              <fa-icon [icon]="faTimes"></fa-icon>
            </button>
          </div>
        </div>

        <div class="notifications-list">
          <div *ngIf="notifications.length === 0" class="no-notifications">
            <fa-icon [icon]="faBell"></fa-icon>
            <p>No notifications yet</p>
          </div>

          <div 
            *ngFor="let notification of notifications" 
            class="notification-item"
            [class.unread]="!notification.read"
            [class.persistent]="notification.persistent"
            (click)="markAsRead(notification.id)">
            
            <div class="notification-icon" [class]="notification.type">
              <fa-icon [icon]="getNotificationIcon(notification.type)"></fa-icon>
            </div>
            
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">{{ getTimeAgo(notification.timestamp) }}</div>
            </div>
            
            <div class="notification-actions">
              <button 
                class="btn-remove" 
                (click)="removeNotification(notification.id, $event)"
                title="Remove notification">
                <fa-icon [icon]="faTimes"></fa-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: relative;
      display: inline-block;
    }

    .notification-bell {
      position: relative;
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--primary), #8b5cf6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .notification-bell:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
    }

    .notification-bell.has-unread {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
      50% { box-shadow: 0 4px 12px rgba(99, 102, 241, 0.6), 0 0 0 8px rgba(99, 102, 241, 0.1); }
      100% { box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
    }

    .notification-bell fa-icon {
      color: white;
      font-size: 18px;
    }

    .notification-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      animation: bounce 0.5s ease;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }

    .notifications-dropdown {
      position: absolute;
      top: 50px;
      right: 0;
      width: 350px;
      max-height: 500px;
      background: var(--light-card);
      border: 1px solid var(--light-border);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transform: translateY(-10px) scale(0.95);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
    }

    .notifications-dropdown.open {
      transform: translateY(0) scale(1);
      opacity: 1;
      visibility: visible;
    }

    body.dark-mode .notifications-dropdown {
      background: var(--dark-card);
      border-color: var(--dark-border);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .notifications-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--light-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    body.dark-mode .notifications-header {
      border-bottom-color: var(--dark-border);
    }

    .notifications-header h3 {
      margin: 0;
      color: var(--light-text);
      font-size: 1.1rem;
      font-weight: 600;
    }

    body.dark-mode .notifications-header h3 {
      color: var(--dark-text);
    }

    .header-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .btn-mark-all, .btn-close {
      background: none;
      border: none;
      color: var(--light-text-secondary);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
    }

    .btn-mark-all:hover, .btn-close:hover {
      background: var(--light-surface);
      color: var(--light-text);
    }

    body.dark-mode .btn-mark-all:hover, body.dark-mode .btn-close:hover {
      background: var(--dark-surface);
      color: var(--dark-text);
    }

    .notifications-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .no-notifications {
      padding: 40px 20px;
      text-align: center;
      color: var(--light-text-secondary);
    }

    .no-notifications fa-icon {
      font-size: 2rem;
      margin-bottom: 12px;
      opacity: 0.5;
    }

    body.dark-mode .no-notifications {
      color: var(--dark-text-secondary);
    }

    .notification-item {
      padding: 16px 20px;
      border-bottom: 1px solid var(--light-border);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .notification-item:hover {
      background: var(--light-surface);
    }

    .notification-item.unread {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(248, 250, 252, 0.8) 100%);
      border-left: 3px solid var(--primary);
    }

    .notification-item.persistent {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(248, 250, 252, 0.8) 100%);
    }

    body.dark-mode .notification-item {
      border-bottom-color: var(--dark-border);
    }

    body.dark-mode .notification-item:hover {
      background: var(--dark-surface);
    }

    body.dark-mode .notification-item.unread {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(17, 17, 24, 0.8) 100%);
    }

    body.dark-mode .notification-item.persistent {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(17, 17, 24, 0.8) 100%);
    }

    .notification-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .notification-icon.info {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
    }

    .notification-icon.success {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .notification-icon.warning {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
    }

    .notification-icon.error {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
    }

    .notification-icon.chatbot {
      background: linear-gradient(135deg, var(--primary), #8b5cf6);
      color: white;
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      font-weight: 600;
      color: var(--light-text);
      margin-bottom: 4px;
      font-size: 0.9rem;
    }

    body.dark-mode .notification-title {
      color: var(--dark-text);
    }

    .notification-message {
      color: var(--light-text-secondary);
      font-size: 0.85rem;
      line-height: 1.4;
      margin-bottom: 6px;
    }

    body.dark-mode .notification-message {
      color: var(--dark-text-secondary);
    }

    .notification-time {
      color: var(--light-text-secondary);
      font-size: 0.75rem;
      opacity: 0.8;
    }

    body.dark-mode .notification-time {
      color: var(--dark-text-secondary);
    }

    .notification-actions {
      display: flex;
      align-items: center;
    }

    .btn-remove {
      background: none;
      border: none;
      color: var(--light-text-secondary);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
      opacity: 0;
    }

    .notification-item:hover .btn-remove {
      opacity: 1;
    }

    .btn-remove:hover {
      background: var(--light-surface);
      color: #ef4444;
    }

    body.dark-mode .btn-remove:hover {
      background: var(--dark-surface);
    }

    /* Responsive */
    @media (max-width: 480px) {
      .notifications-dropdown {
        width: 300px;
        right: -10px;
      }
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  showNotifications = false;
  private destroy$ = new Subject<void>();

  // FontAwesome Icons
  faBell = faBell;
  faTimes = faTimes;
  faCheck = faCheck;
  faExclamationTriangle = faExclamationTriangle;
  faInfoCircle = faInfoCircle;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faRobot = faRobot;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
      });

    this.notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadCount = count;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  closeNotifications(): void {
    this.showNotifications = false;
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  removeNotification(id: string, event: Event): void {
    event.stopPropagation();
    this.notificationService.removeNotification(id);
  }

  getNotificationIcon(type: string) {
    switch (type) {
      case 'info': return faInfoCircle;
      case 'success': return faCheckCircle;
      case 'warning': return faExclamationTriangle;
      case 'error': return faTimesCircle;
      case 'chatbot': return faRobot;
      default: return faInfoCircle;
    }
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  }
}
