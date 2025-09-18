import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ChatRequest, ChatResponse, ChatHealthResponse } from '../models/chat.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly baseUrl = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) {}

  /**
   * Send a message to the chatbot and get a response
   */
  sendMessage(message: string): Observable<ChatResponse> {
    const request: ChatRequest = { message };
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ChatResponse>(this.baseUrl, request, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Check if the chat service is healthy
   */
  checkHealth(): Observable<ChatHealthResponse> {
    return this.http.get<ChatHealthResponse>(`${this.baseUrl}/health`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unexpected error occurred';
    
    console.error('Full error object:', error);
    console.error('Error status:', error.status);
    console.error('Error message:', error.message);
    console.error('Error error:', error.error);
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else if (error instanceof ProgressEvent) {
      // Network error (CORS, connection refused, etc.)
      errorMessage = 'Network error: Unable to connect to the chat service. This might be a CORS issue or the server is not running.';
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the chat service. Please check if the server is running on http://localhost:5033';
      } else if (error.status === 400) {
        errorMessage = error.error?.error || 'Invalid request. Please try again.';
      } else if (error.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (error.status === 403) {
        errorMessage = 'Access forbidden. You may not have permission to use the chat service.';
      } else if (error.status === 404) {
        errorMessage = 'Chat service not found. Please check the API endpoint.';
      } else if (error.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
      } else if (error.status === 500) {
        errorMessage = error.error?.error || 'Server error. Please try again later.';
      } else if (error.status === 503) {
        errorMessage = 'Chat service is temporarily unavailable. Please try again later.';
      } else {
        errorMessage = `Error ${error.status}: ${error.message || 'Unknown error'}`;
      }
    }

    console.error('Chat service error details:', {
      status: error.status,
      message: error.message,
      error: error.error,
      url: error.url,
      name: error.name
    });
    
    return throwError(() => new Error(errorMessage));
  }
}
