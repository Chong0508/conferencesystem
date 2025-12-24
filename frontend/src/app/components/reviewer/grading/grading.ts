import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../../../services/review.service';
import { PaperService } from '../../../services/paper.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-grading',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grading.html',
  styleUrl: './grading.css'
})
export class Grading implements OnInit {
  paperId: any;
  paper: any = null;
  currentUser: any = {};
  isSubmitting: boolean = false;
  isViewOnly: boolean = false; // Flag to disable form if already submitted
  errorMessage: string = '';

  comments: string = '';
  recommendation: string = 'Accept';

  scoreCriteria: any = {
    originality: 0,
    relevance: 0,
    quality: 0,
    presentation: 0
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private paperService: PaperService
  ) {}

  ngOnInit() {
    this.paperId = this.route.snapshot.paramMap.get('id');
    const userJson = localStorage.getItem('loggedUser');
    if (userJson) {
      this.currentUser = JSON.parse(userJson);
    }

    this.loadPaper();
    this.loadExistingReview();
  }

  loadPaper() {
    this.paperService.getPaperById(this.paperId).subscribe({
      next: (paperData) => { this.paper = paperData; },
      error: (err) => { this.errorMessage = 'Failed to load paper'; }
    });
  }

  loadExistingReview() {
    const reviewerId = this.currentUser.userId || this.currentUser.user_id;
    if (!reviewerId || !this.paperId) return;

    this.reviewService.getReviewsByReviewer(reviewerId).subscribe({
      next: (reviews: any[]) => {
        // Find the review that matches this paper ID
        const existing = reviews.find(r => (r.assignment_id || r.assignmentId) == this.paperId);
        
        if (existing) {
          this.isViewOnly = true;
          this.comments = existing.comments_to_author;
          this.recommendation = existing.recommendation;
          
          // Populate scores (assuming backend includes them or you fetch them separately)
          // For now, we use the overall_score as a reference if breakdown isn't available
          if (existing.scores) {
            existing.scores.forEach((s: any) => {
              if (s.criterion_id === 1) this.scoreCriteria.originality = s.score;
              if (s.criterion_id === 2) this.scoreCriteria.relevance = s.score;
              if (s.criterion_id === 3) this.scoreCriteria.quality = s.score;
              if (s.criterion_id === 4) this.scoreCriteria.presentation = s.score;
            });
          }
        }
      }
    });
  }

  get totalScore(): number {
    return Number(this.scoreCriteria.originality) + 
           Number(this.scoreCriteria.relevance) + 
           Number(this.scoreCriteria.quality) + 
           Number(this.scoreCriteria.presentation);
  }

  validateScore(category: string) {
    if (this.isViewOnly) return; 
    let value = this.scoreCriteria[category];
    if (value > 100) this.scoreCriteria[category] = 100;
    else if (value < 0 || value === null) this.scoreCriteria[category] = 0;
  }

  submitReview() {
    if (this.isViewOnly) return;
    if (this.totalScore === 0) return alert("Please provide scores.");
    
    const reviewerId = this.currentUser.userId || this.currentUser.user_id;
    const reviewPayload = {
      review: {
        assignment_id: this.paperId,
        reviewer_id: reviewerId,
        overall_score: this.totalScore,
        comments_to_author: this.comments,
        recommendation: this.recommendation,
        round_number: 1,
        due_date: new Date().toISOString().split('T')[0] 
      },
      scores: [
        { criterion_id: 1, score: this.scoreCriteria.originality },
        { criterion_id: 2, score: this.scoreCriteria.relevance },
        { criterion_id: 3, score: this.scoreCriteria.quality },
        { criterion_id: 4, score: this.scoreCriteria.presentation }
      ]
    };

    this.isSubmitting = true;
    this.http.post('http://localhost:8080/api/reviews/submit-full', reviewPayload).subscribe({
      next: () => {
        alert("✅ Review saved!");
        this.router.navigate(['/dashboard/reviews']);
      },
      error: () => { this.isSubmitting = false; }
    });
  }

  cancel() { this.router.navigate(['/dashboard/reviews']); }

  getManuscriptUrl(fileName: string | undefined): string {
    return `http://localhost:8080/api/papers/download/${fileName}`;
  }

  getCleanFileName(fullPath: string | undefined): string {
    if (!fullPath) return 'Manuscript.pdf';
    const parts = fullPath.split('_');
    return parts.length > 1 ? parts.slice(1).join('_') : fullPath;
  }
}