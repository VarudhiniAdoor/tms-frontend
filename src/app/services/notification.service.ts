import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'chatbot';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  persistent?: boolean; // If true, notification won't auto-dismiss
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor() {
    // Load notifications from localStorage on service initialization
    this.loadNotifications();
  }

  private loadNotifications(): void {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        const notifications = JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount();
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }

  private saveNotifications(): void {
    const notifications = this.notificationsSubject.value;
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  private updateUnreadCount(): void {
    const unreadCount = this.notificationsSubject.value.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): string {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = [newNotification, ...currentNotifications].slice(0, 50); // Keep only last 50 notifications
    
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
    this.saveNotifications();

    return newNotification.id;
  }

  markAsRead(id: string): void {
    const notifications = this.notificationsSubject.value.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(notifications);
    this.updateUnreadCount();
    this.saveNotifications();
  }

  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(notifications);
    this.updateUnreadCount();
    this.saveNotifications();
  }

  removeNotification(id: string): void {
    const notifications = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(notifications);
    this.updateUnreadCount();
    this.saveNotifications();
  }

  clearAllNotifications(): void {
    this.notificationsSubject.next([]);
    this.updateUnreadCount();
    this.saveNotifications();
  }

  // Special method for chatbot welcome notification
  addChatbotWelcomeNotification(username: string): string {
    return this.addNotification({
      type: 'chatbot',
      title: '👋 Welcome back!',
      message: `Hi ${username}! I'm your Training Assistant and I'm here to help you with any questions about your courses, enrollments, or training progress. Feel free to ask me anything!`,
      persistent: true
    });
  }

  // Method to check if user has already received welcome notification today
  hasReceivedWelcomeToday(): boolean {
    const today = new Date().toDateString();
    const notifications = this.notificationsSubject.value;
    
    return notifications.some(n => 
      n.type === 'chatbot' && 
      n.title.includes('Welcome back') && 
      n.timestamp.toDateString() === today
    );
  }

  // Manager-specific notification methods
  addManagerWelcomeNotification(username: string): string {
    return this.addNotification({
      type: 'info',
      title: '👋 Welcome Manager!',
      message: `Hi ${username}! As a manager, you can approve/reject enrollment requests, manage batches, and track your team's training progress. You'll receive notifications for new enrollment requests and important updates.`,
      persistent: true
    });
  }

  addEnrollmentRequestNotification(employeeName: string, courseName: string): string {
    return this.addNotification({
      type: 'info',
      title: '📝 New Enrollment Request',
      message: `${employeeName} has requested enrollment in "${courseName}". Please review and approve or reject the request.`,
      persistent: false
    });
  }

  addEnrollmentApprovedNotification(employeeName: string, courseName: string): string {
    return this.addNotification({
      type: 'success',
      title: '✅ Enrollment Approved',
      message: `You have approved ${employeeName}'s enrollment in "${courseName}". The employee has been notified.`,
      persistent: false
    });
  }

  addEnrollmentRejectedNotification(employeeName: string, courseName: string): string {
    return this.addNotification({
      type: 'warning',
      title: '❌ Enrollment Rejected',
      message: `You have rejected ${employeeName}'s enrollment in "${courseName}". The employee has been notified with the reason.`,
      persistent: false
    });
  }

  addBatchCreatedNotification(batchName: string): string {
    return this.addNotification({
      type: 'success',
      title: '📅 New Batch Created',
      message: `Batch "${batchName}" has been successfully created and is now available for enrollment.`,
      persistent: false
    });
  }

  addManagerCapabilitiesNotification(): string {
    return this.addNotification({
      type: 'info',
      title: '💼 Manager Capabilities',
      message: `As a manager, you can: • Approve/reject enrollment requests • Create and manage batches • View team training progress • Track completion rates • Generate reports • Monitor feedback`,
      persistent: true
    });
  }
}
