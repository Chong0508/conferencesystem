import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
// 👇 确保这里引入了正确的 NotificationService
import { NotificationService } from './notification';

@Injectable({
  providedIn: 'root'
})
export class PaperService {

  private storageKey = 'mock_papers';

  constructor(
    private notificationService: NotificationService // 👈 必须注入这个
  ) { }

  // --- 1. Get All Papers ---
  getAllPapers(): Observable<any[]> {
    const data = localStorage.getItem(this.storageKey);
    const papers = data ? JSON.parse(data) : [];
    return of(papers).pipe(delay(300));
  }

  // --- 2. Get Single Paper by ID ---
  getPaperById(id: number): Observable<any> {
    const papers = this.getPapersSync();
    const paper = papers.find((p: any) => String(p.id) === String(id));
    return of(paper).pipe(delay(300));
  }

  // --- 3. Create New Paper (Submit) ---
  createPaper(paperData: any): Observable<any> {
    const papers = this.getPapersSync();

    // 1. Generate ID & Status
    paperData.id = Date.now();
    paperData.status = 'Pending Review';

    // 2. Save Paper
    papers.push(paperData);
    this.saveToStorage(papers);

    // 🔥🔥 DEBUG LOG: Check your browser console (F12) when submitting!
    console.log('🔥 Paper Submitted:', paperData.title);

    // 3. Trigger Notification
    this.notificationService.notifyAdminNewSubmission(
      paperData.authorName || 'Unknown Author',
      paperData.title || 'Untitled Paper'
    );
    console.log('🔥 Notification Sent to Admin');

    return of({ success: true, message: 'Paper submitted successfully' }).pipe(delay(500));
  }

  // --- 4. Update Paper ---
  updatePaper(updatedPaper: any): Observable<any> {
    const papers = this.getPapersSync();
    const index = papers.findIndex((p: any) => String(p.id) === String(updatedPaper.id));

    if (index !== -1) {
      const oldPaper = papers[index];
      papers[index] = updatedPaper;
      this.saveToStorage(papers);

      // Trigger: Author Notification
      if (updatedPaper.status === 'Accepted' && oldPaper.status !== 'Accepted') {
        this.notificationService.notifyAuthorApproval(updatedPaper.authorEmail, updatedPaper.title);
      }
      else if (updatedPaper.status === 'Rejected' && oldPaper.status !== 'Rejected') {
        this.notificationService.notifyAuthorRejection(updatedPaper.authorEmail, updatedPaper.title);
      }

      // Trigger: Reviewer Notification
      if (updatedPaper.assignedReviewer && updatedPaper.assignedReviewer !== oldPaper.assignedReviewer) {
        this.notificationService.notifyReviewerAssignment(updatedPaper.assignedReviewer, updatedPaper.title);
      }

      return of(updatedPaper).pipe(delay(300));
    }
    return of(null);
  }

  // --- 5. Delete Paper ---
  deletePaper(id: number): Observable<any> {
    let papers = this.getPapersSync();
    papers = papers.filter((p: any) => String(p.id) !== String(id));
    this.saveToStorage(papers);
    return of({ success: true }).pipe(delay(300));
  }

  // --- Internal Helper Methods ---
  private getPapersSync(): any[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(data: any[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}
