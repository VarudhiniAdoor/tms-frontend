import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FeedbackCreateDto } from '../models/domain.models';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service'; 
@Injectable({ providedIn: 'root' })
export class FeedbackService {
    private baseUrl = `${environment.apiUrl}/feedback`;
  constructor(private http: HttpClient, private authService: AuthService) {}

  submit(batchId: number, dto: FeedbackCreateDto) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    console.log('Sending feedback to:', `${this.baseUrl}/${batchId}`);
    console.log('Data being sent:', dto);
    
    return this.http.post(`${this.baseUrl}/${batchId}`, dto, { headers });
  }

 getAll(): Observable<any[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
  
  console.log('Fetching all feedbacks from:', `${this.baseUrl}`);
  return this.http.get<any[]>(`${this.baseUrl}`, { headers });
}

getForBatch(batchId: number): Observable<any[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
  
  console.log('Fetching feedback for batch:', batchId, 'from:', `${this.baseUrl}/batch/${batchId}`);
  return this.http.get<any[]>(`${this.baseUrl}/batch/${batchId}`, { headers });
}

}
