import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chatbot-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="test-container">
      <h3>Chatbot Connection Test</h3>
      <button (click)="testConnection()" [disabled]="testing">
        {{ testing ? 'Testing...' : 'Test Connection' }}
      </button>
      <div *ngIf="result" class="result">
        <h4>Test Result:</h4>
        <pre>{{ result }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .test-container {
      padding: 20px;
      border: 1px solid #ccc;
      margin: 20px;
      border-radius: 8px;
    }
    .result {
      margin-top: 20px;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  `]
})
export class ChatbotTestComponent implements OnInit {
  testing = false;
  result: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.testConnection();
  }

  testConnection() {
    this.testing = true;
    this.result = 'Testing connection...\n';
    
    console.log('Starting connection test...');
    
    // Test health endpoint
    this.chatService.checkHealth().subscribe({
      next: (health) => {
        this.result += `✅ Health check successful: ${JSON.stringify(health, null, 2)}\n`;
        console.log('Health check successful:', health);
        
        // Test sending a message
        this.testSendMessage();
      },
      error: (error) => {
        this.result += `❌ Health check failed: ${error.message}\n`;
        this.result += `Error details: ${JSON.stringify(error, null, 2)}\n`;
        console.error('Health check failed:', error);
        this.testing = false;
      }
    });
  }

  private testSendMessage() {
    this.result += '\nTesting message sending...\n';
    
    this.chatService.sendMessage('Hello, this is a test message').subscribe({
      next: (response) => {
        this.result += `✅ Message sent successfully: ${JSON.stringify(response, null, 2)}\n`;
        console.log('Message sent successfully:', response);
        this.testing = false;
      },
      error: (error) => {
        this.result += `❌ Message sending failed: ${error.message}\n`;
        this.result += `Error details: ${JSON.stringify(error, null, 2)}\n`;
        console.error('Message sending failed:', error);
        this.testing = false;
      }
    });
  }
}
