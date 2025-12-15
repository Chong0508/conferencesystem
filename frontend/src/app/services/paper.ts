import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaperService { // 👈 Fixed: Class name must be PaperService

  private storageKey = 'mock_papers';

  constructor() { }

  // --- 1. Get All Papers ---
  getAllPapers(): Observable<any[]> {
    const data = localStorage.getItem(this.storageKey);
    const papers = data ? JSON.parse(data) : [];
    // 'of' creates an Observable to mimic an HTTP response
    return of(papers).pipe(delay(300));
  }

  // --- 2. Get Single Paper by ID ---
  getPaperById(id: number): Observable<any> {
    const papers = this.getPapersSync();
    // Ensure ID comparison handles both string/number types
    const paper = papers.find((p: any) => String(p.id) === String(id));
    return of(paper).pipe(delay(300));
  }

  // --- 3. Create New Paper (Submit) ---
  createPaper(paperData: any): Observable<any> {
    const papers = this.getPapersSync();

    // Generate a simple ID (Timestamp)
    paperData.id = Date.now();
    paperData.status = 'Pending Review'; // Default status

    papers.push(paperData);
    this.saveToStorage(papers);

    return of({ success: true, message: 'Paper submitted successfully' }).pipe(delay(500));
  }

  // --- 4. Update Paper (Assign Reviewer, Accept/Reject) ---
  updatePaper(updatedPaper: any): Observable<any> {
    const papers = this.getPapersSync();
    const index = papers.findIndex((p: any) => String(p.id) === String(updatedPaper.id));

    if (index !== -1) {
      papers[index] = updatedPaper;
      this.saveToStorage(papers);
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
