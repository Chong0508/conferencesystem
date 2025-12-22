import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

// Interface matching your MySQL/Java Entity
export interface ReviewerApplication {
  id: number;
  userId: number; 
  educationLevel: string; 
  evidencePath: string;
  reason: string;
  status: string;
  submittedAt: Date; 
  // Optional fields for UI display if you join with User table in backend
  userName?: string;
  userEmail?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private baseUrl = 'http://localhost:8080/users';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  // ==========================================
  // 1. Author: Submit Application (Real Backend)
  // ==========================================
  // Note: This matches the Multipart request required by your handleReviewerApplication method
  submitReviewerApplication(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply-reviewer`, formData);
  }

  // ==========================================
  // 2. Admin: Get All Applications (Real Backend)
  // ==========================================
  getApplications(): Observable<ReviewerApplication[]> {
    // Fetches the actual records from the MySQL table
    return this.http.get<ReviewerApplication[]>(`${this.baseUrl}/applications`);
  }

  // ==========================================
  // 3. Admin: Process Application (Approve/Reject)
  // ==========================================
  // This updates ReviewerApplication, User Category, and UserRole tables in one transaction
  processApplication(appId: number, status: 'Approved' | 'Rejected'): Observable<any> {
    // Use backticks for template literals and ensure status is passed as a query param
    return this.http.post(`${this.baseUrl}/applications/${appId}/process?status=${status}`, {});
  }

  // ==========================================
  // 4. Evidence Handling: Get File URL
  // ==========================================
  getEvidenceUrl(path: string): string {
    if (!path) return '';
    // Extracts filename from path (e.g., /app/uploads/evidence/file.pdf)
    const fileName = path.split('/').pop();
    return `${this.baseUrl}/applications/evidence/${fileName}`;
  }
}