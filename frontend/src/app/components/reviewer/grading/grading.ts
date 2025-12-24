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
  errorMessage: string = '';

  comments: string = '';
  recommendation: string = 'Accept';

  // Criteria IDs matched with Database Initializer
  scoreCriteria: any = {
    originality: 0,   // ID: 1
    relevance: 0,     // ID: 2
    quality: 0,       // ID: 3
    presentation: 0   // ID: 4
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
  }

  loadPaper() {
    this.paperService.getPaperById(this.paperId).subscribe({
      next: (paperData) => {
        this.paper = paperData;
      },
      error: (err) => {
        console.error('Error loading paper:', err);
        this.errorMessage = 'Failed to load paper';
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
    let value = this.scoreCriteria[category];
    if (value > 100) {
      this.scoreCriteria[category] = 100;
    } else if (value < 0 || value === null) {
      this.scoreCriteria[category] = 0;
    }
  }

  submitReview() {
    if (this.totalScore === 0) return alert("Please provide scores.");
    if (!this.comments.trim()) return alert("Please add comments.");

    // REFINEMENT: Ensure reviewer_id matches the key stored in your localStorage ('userId' or 'user_id')
    const reviewerId = this.currentUser.userId || this.currentUser.user_id;

    const reviewPayload = {
      review: {
        assignment_id: this.paperId,
        reviewer_id: reviewerId,
        overall_score: this.totalScore,
        comments_to_author: this.comments,
        recommendation: this.recommendation,
        round_number: 1,
        // Send date as string YYYY-MM-DD to match java.sql.Date
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
        alert("✅ Review & Scores saved. Status updated!");
        this.isSubmitting = false;
        this.router.navigate(['/dashboard/reviews']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Backend Error:', err);
        alert(`❌ Submission Failed: ${err.error?.message || 'Check backend logs'}`);
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/reviews']);
  }

  getManuscriptUrl(fileName: string | undefined): string {
    if (!fileName) return '#';
    return `http://localhost:8080/api/papers/download/${fileName}`;
  }

  getCleanFileName(fullPath: string | undefined): string {
    if (!fullPath) return 'Manuscript.pdf';
    const parts = fullPath.split('_');
    return parts.length > 1 ? parts.slice(1).join('_') : fullPath;
  }
}