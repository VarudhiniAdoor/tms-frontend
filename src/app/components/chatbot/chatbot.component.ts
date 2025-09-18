import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faComments, faTimes, faExpand, faCompress, faMinus, faPlus, faPaperPlane, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../models/chat.models';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  template: `
    <!-- Chatbot Toggle Button -->
    <div class="chatbot-toggle" (click)="toggleChat()" [class.active]="isOpen">
      <div class="chatbot-icon">
        <fa-icon [icon]="isOpen ? faTimes : faComments"></fa-icon>
      </div>
      <div class="chatbot-badge" *ngIf="unreadCount > 0">{{ unreadCount }}</div>
    </div>

    <!-- Chatbot Window -->
    <div class="chatbot-window" [class.open]="isOpen" [class.minimized]="isMinimized" [class.expanded]="isExpanded">
      <!-- Header -->
      <div class="chatbot-header">
        <div class="chatbot-title">
          <div class="chatbot-avatar">
            <i class="icon">🤖</i>
          </div>
          <div class="chatbot-info">
            <h3>Training Assistant</h3>
            <span class="status" [class.online]="isOnline" [class.offline]="!isOnline">
              {{ isOnline ? 'Online' : 'Offline' }}
            </span>
          </div>
        </div>
        <div class="chatbot-controls">
          <button class="control-btn expand" (click)="toggleExpand()" [title]="isExpanded ? 'Collapse' : 'Expand'">
            <fa-icon [icon]="isExpanded ? faCompress : faExpand"></fa-icon>
          </button>
          <button class="control-btn minimize" (click)="toggleMinimize()" title="Minimize">
            <fa-icon [icon]="isMinimized ? faPlus : faMinus"></fa-icon>
          </button>
          <button class="control-btn close" (click)="closeChat()" title="Close">
            <fa-icon [icon]="faTimes"></fa-icon>
          </button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="chatbot-messages" #messagesContainer *ngIf="!isMinimized">
        <div class="messages-container">
          <!-- Welcome Message -->
          <div class="message bot-message welcome" *ngIf="messages.length === 0">
            <div class="message-avatar">
              <fa-icon [icon]="faComments"></fa-icon>
            </div>
            <div class="message-content">
              <div class="message-bubble">
                <p>Hello! I'm your Training Management Assistant. I can help you with:</p>
                <ul>
                  <li>📚 <strong>Active Batches</strong> - View available training batches and their details</li>
                  <li>📝 <strong>Enrollment Requests</strong> - Request enrollment in training batches</li>
                  <li>📋 <strong>My Enrollments</strong> - Track your enrollment status and history</li>
                  <li>💬 <strong>Feedback Submission</strong> - Submit feedback for completed courses</li>
                  <li>📊 <strong>Dashboard Stats</strong> - View your training progress and statistics</li>
                </ul>
                <p>How can I assist you today?</p>
              </div>
              <div class="message-time">{{ getCurrentTime() }}</div>
            </div>
          </div>

          <!-- Chat Messages -->
          <div 
            *ngFor="let message of messages" 
            class="message"
            [class.user-message]="message.isUser"
            [class.bot-message]="!message.isUser"
            [class.typing]="message.isTyping"
          >
            <div class="message-avatar" *ngIf="!message.isUser">
              <fa-icon [icon]="faComments"></fa-icon>
            </div>
            <div class="message-content">
              <div class="message-bubble">
                <div *ngIf="message.isTyping" class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div *ngIf="!message.isTyping" [innerHTML]="formatMessage(message.content)"></div>
              </div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chatbot-input" *ngIf="!isMinimized">
        <div class="input-container">
          <textarea
            [(ngModel)]="currentMessage"
            (keydown.enter)="onKeyDown($event)"
            placeholder="Type your message here..."
            [disabled]="isLoading"
            class="message-input"
            rows="1"
            #messageInput
          ></textarea>
          <button 
            class="send-button" 
            (click)="sendMessage()" 
            [disabled]="!currentMessage.trim() || isLoading"
            [class.loading]="isLoading"
          >
            <fa-icon [icon]="faPaperPlane" *ngIf="!isLoading"></fa-icon>
            <fa-icon [icon]="faSpinner" *ngIf="isLoading" class="loading"></fa-icon>
          </button>
        </div>
        <div class="input-footer">
          <small class="char-count">{{ currentMessage.length }}/500</small>
          <small class="help-text">Press Enter to send, Shift+Enter for new line</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Chatbot Toggle Button */
    .chatbot-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 56px;
      height: 56px;
      background: #374151;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      z-index: 1000;
      border: 1px solid #e5e7eb;
    }

    .chatbot-toggle:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      background: #4b5563;
    }

    .chatbot-toggle.active {
      background: #1f2937;
    }

    .chatbot-icon {
      font-size: 20px;
      color: white;
    }

    .chatbot-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #dc2626;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      border: 2px solid white;
    }

    /* Chatbot Window */
    .chatbot-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 380px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      display: flex;
      flex-direction: column;
      transform: translateY(100%) scale(0.8);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 999;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }

    .chatbot-window.open {
      transform: translateY(0) scale(1);
      opacity: 1;
    }

    .chatbot-window.minimized {
      height: 60px;
    }

    .chatbot-window.expanded {
      width: 500px;
      height: 600px;
    }

    /* Header */
    .chatbot-header {
      background: #f8fafc;
      color: #374151;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 12px 12px 0 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .chatbot-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .chatbot-avatar {
      width: 36px;
      height: 36px;
      background: #e5e7eb;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #6b7280;
    }

    .chatbot-info h3 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: #111827;
    }

    .status {
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status.online {
      color: #059669;
    }

    .status.offline {
      color: #dc2626;
    }

    .chatbot-controls {
      display: flex;
      gap: 8px;
    }

    .control-btn {
      width: 28px;
      height: 28px;
      border: none;
      background: #e5e7eb;
      color: #6b7280;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      font-size: 12px;
    }

    .control-btn fa-icon {
      font-size: 12px;
    }

    .control-btn:hover {
      background: #d1d5db;
      color: #374151;
    }

    /* Messages */
    .chatbot-messages {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .message {
      display: flex;
      gap: 12px;
      animation: messageSlide 0.3s ease-out;
    }

    .user-message {
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
    }

    .message-avatar fa-icon {
      font-size: 14px;
    }

    .bot-message .message-avatar {
      background: #f3f4f6;
      color: #6b7280;
    }

    .user-message .message-avatar {
      background: #e5e7eb;
      color: #6b7280;
    }

    .message-content {
      max-width: 80%;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .user-message .message-content {
      align-items: flex-end;
    }

    .message-bubble {
      background: #f3f4f6;
      padding: 10px 14px;
      border-radius: 8px;
      position: relative;
      word-wrap: break-word;
      border: 1px solid #e5e7eb;
      font-weight: 400;
      line-height: 1.5;
    }

    .user-message .message-bubble {
      background: #374151;
      color: white;
      border: 1px solid #4b5563;
    }

    .bot-message .message-bubble {
      background: #f9fafb;
      color: #374151;
      border: 1px solid #e5e7eb;
    }

    .welcome .message-bubble {
      background: #f0f9ff;
      color: #1e40af;
      border: 1px solid #bfdbfe;
    }

    .welcome .message-bubble ul {
      margin: 8px 0;
      padding-left: 20px;
    }

    .welcome .message-bubble li {
      margin: 4px 0;
    }

    .message-time {
      font-size: 10px;
      color: #9ca3af;
      margin-top: 4px;
      font-weight: 500;
    }

    .user-message .message-time {
      text-align: right;
    }

    /* Typing Indicator */
    .typing-indicator {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #999;
      animation: typing 1.4s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

    /* Input Area */
    .chatbot-input {
      padding: 16px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }

    .input-container {
      display: flex;
      gap: 12px;
      align-items: flex-end;
    }

    .message-input {
      flex: 1;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 14px;
      resize: none;
      outline: none;
      transition: all 0.2s ease;
      max-height: 100px;
      min-height: 40px;
      background: white;
      color: #374151;
    }

    .message-input:focus {
      border-color: #6b7280;
      box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
    }

    .message-input:disabled {
      background: #f3f4f6;
      cursor: not-allowed;
      color: #9ca3af;
    }

    .send-button {
      width: 40px;
      height: 40px;
      border: none;
      background: #374151;
      color: white;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .send-button:hover:not(:disabled) {
      background: #4b5563;
      transform: scale(1.02);
    }

    .send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #9ca3af;
    }

    .send-button.loading {
      animation: pulse 1.5s infinite;
    }

    .send-button fa-icon {
      font-size: 14px;
    }

    .send-button .loading {
      animation: spin 1s linear infinite;
    }

    .input-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }

    .char-count {
      color: #9ca3af;
      font-size: 10px;
      font-weight: 500;
    }

    .help-text {
      color: #9ca3af;
      font-size: 10px;
      font-weight: 500;
    }

    /* Animations */
    @keyframes messageSlide {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes typing {
      0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    /* Dark Mode Support */
    body.dark-mode .chatbot-window {
      background: var(--dark-card);
      color: var(--dark-text);
    }

    body.dark-mode .message-bubble {
      background: var(--dark-surface);
      color: var(--dark-text);
    }

    body.dark-mode .chatbot-input {
      background: var(--dark-surface);
      border-top-color: var(--dark-border);
    }

    body.dark-mode .message-input {
      background: var(--dark-bg);
      border-color: var(--dark-border);
      color: var(--dark-text);
    }

    body.dark-mode .message-input:focus {
      border-color: #667eea;
    }

    body.dark-mode .input-footer .char-count,
    body.dark-mode .input-footer .help-text {
      color: var(--dark-text-secondary);
    }

    /* Responsive Design */
    @media (max-width: 480px) {
      .chatbot-window {
        width: calc(100vw - 40px);
        right: 20px;
        left: 20px;
      }
      
      .chatbot-window.expanded {
        width: calc(100vw - 40px);
        height: calc(100vh - 120px);
        max-height: 600px;
      }
    }
  `]
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  isOpen = false;
  isMinimized = false;
  isExpanded = false;
  isLoading = false;
  isOnline = true;
  unreadCount = 0;
  currentMessage = '';
  messages: ChatMessage[] = [];

  // Font Awesome icons
  faComments = faComments;
  faTimes = faTimes;
  faExpand = faExpand;
  faCompress = faCompress;
  faMinus = faMinus;
  faPlus = faPlus;
  faPaperPlane = faPaperPlane;
  faSpinner = faSpinner;

  private destroy$ = new Subject<void>();

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.checkServiceHealth();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.unreadCount = 0;
      setTimeout(() => {
        this.messageInput?.nativeElement?.focus();
      }, 300);
    }
  }

  closeChat() {
    this.isOpen = false;
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  onKeyDown(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage() {
    if (!this.currentMessage.trim() || this.isLoading) return;

    const userMessage: ChatMessage = {
      id: this.generateId(),
      content: this.currentMessage.trim(),
      isUser: true,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    const messageToSend = this.currentMessage.trim();
    this.currentMessage = '';

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: this.generateId(),
      content: '',
      isUser: false,
      timestamp: new Date(),
      isTyping: true
    };
    this.messages.push(typingMessage);

    this.isLoading = true;
    console.log('Sending message to chat service:', messageToSend);

    this.chatService.sendMessage(messageToSend)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Chat service response received:', response);
          // Remove typing indicator
          this.messages = this.messages.filter(m => !m.isTyping);
          
          // Add bot response
          const botMessage: ChatMessage = {
            id: this.generateId(),
            content: response.response,
            isUser: false,
            timestamp: new Date()
          };
          this.messages.push(botMessage);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Chat service error in sendMessage:', error);
          // Remove typing indicator
          this.messages = this.messages.filter(m => !m.isTyping);
          
          // Add error message
          const errorMessage: ChatMessage = {
            id: this.generateId(),
            content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
            isUser: false,
            timestamp: new Date()
          };
          this.messages.push(errorMessage);
          this.isLoading = false;
        }
      });
  }

  private checkServiceHealth() {
    console.log('Checking chat service health...');
    this.chatService.checkHealth()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (health) => {
          console.log('Chat service health response:', health);
          this.isOnline = health.status === 'Healthy';
        },
        error: (error) => {
          console.error('Chat service health check failed:', error);
          this.isOnline = false;
        }
      });
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatMessage(content: string): string {
    // Simple formatting for better readability
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }
}
