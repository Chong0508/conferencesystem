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

  // Adjust criteria to 100 each for a 400 total
  scoreCriteria: any = {
    originality: 0,   // ID: 1
    relevance: 0,     // ID: 2
    quality: 0,       // ID: 3
    presentation: 0   // ID: 4
  };

  get totalScore(): number {
    return Object.values(this.scoreCriteria).reduce((a: any, b: any) => a + b, 0) as number;
  }

  submitReview() {
    if (this.totalScore === 0) return alert("Please provide scores.");

    const reviewPayload = {
      // Part 1: General Review Data
      review: {
        assignment_id: this.paperId,
        reviewer_id: this.currentUser.user_id,
        overall_score: this.totalScore,
        comments_to_author: this.comments,
        recommendation: this.recommendation,
        round_number: 1,
        reviewed_at: new Date()
      },
      // Part 2: Individual Scores for the review_score table
      scores: [
        { criterion_id: 1, score: this.scoreCriteria.originality },
        { criterion_id: 2, score: this.scoreCriteria.relevance },
        { criterion_id: 3, score: this.scoreCriteria.quality },
        { criterion_id: 4, score: this.scoreCriteria.presentation }
      ]
    };

    this.isSubmitting = true;
    // Send to a new unified endpoint
    this.http.post('http://localhost:8080/api/reviews/submit-full', reviewPayload).subscribe({
      next: () => {
        alert("✅ Review & Scores saved. Paper status updated!");
        this.router.navigate(['/dashboard/reviews']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/reviews']);
  }

  getManuscriptUrl(fileName: string | undefined): string {
    if (!fileName) return '#';
    // Point directly to the refined endpoint - No .split().pop() needed!
    return `http://localhost:8080/api/papers/download/${fileName}`;
  }

  // Add a simple helper for the UI text
  getCleanFileName(fullPath: string | undefined): string {
    if (!fullPath) return 'Manuscript.pdf';
    const parts = fullPath.split('_');
    return parts.length > 1 ? parts.slice(1).join('_') : fullPath;
  }

  validateScore(category: string) {
    let value = this.scoreCriteria[category];

    // Logic: if input exceeds 100, reset it to 100 automatically
    if (value > 100) {
      this.scoreCriteria[category] = 100;
    } else if (value < 0 || value === null) {
      this.scoreCriteria[category] = 0;
    }
  }
}