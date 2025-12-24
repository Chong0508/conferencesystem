import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { PaperService } from '../../../services/paper.service';
import { ReviewService } from '../../../services/review.service';
import { ConferenceService } from '../../../services/conference.service';
import { LogActivityService, LogActivity } from '../../../services/log-activity.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './overview.html',
  styleUrls: ['./overview.css']
})
export class OverviewComponent implements OnInit {

  loggedUser: any = null;

  stats = {
    totalUsers: 0,
    totalPapers: 0,
    totalConferences: 0,
    mySubmissions: 0,
    pendingReviews: 0
  };

  recentLogs: any[] = [];
  userMap: { [key: number]: string } = {};

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private paperService: PaperService,
    private reviewService: ReviewService,
    private conferenceService: ConferenceService,
    private logActivityService: LogActivityService
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('loggedUser');
    if (userStr) {
      this.loggedUser = JSON.parse(userStr);
      this.loadStatistics();

      // Only load logs if user is Admin
      if (this.loggedUser.role === 'Admin' || this.loggedUser.role === 'Super Admin') {
        this.loadUsersAndLogs();
      }
    }
  }

  // --- 1. STATISTICS LOGIC ---
  loadStatistics() {
    // 1. Debug: Check what user data actsually exists
    console.log('Current Logged User:', this.loggedUser);

    if (!this.loggedUser) return;

    // 2. Safe ID Extraction: Try all common variations
    const currentUserId = this.loggedUser.user_id || this.loggedUser.id || this.loggedUser.userId;

    if (!currentUserId) {
      console.error('❌ Error: Could not find a valid ID in loggedUser object');
      return;
    }

    const userRole = (this.loggedUser.role || '').toLowerCase();
    console.log(`Processing stats for Role: ${userRole}, ID: ${currentUserId}`);

    // ===== ADMIN =====
    if (userRole === 'admin' || userRole === 'super admin') {
      this.userService.getAllUsers().subscribe({
        next: users => this.stats.totalUsers = users.length,
        error: (err) => console.error('Error fetching users:', err)
      });

      this.paperService.getAllPapers().subscribe({
        next: papers => this.stats.totalPapers = papers.length,
        error: (err) => console.error('Error fetching papers:', err)
      });

      this.conferenceService.getAllConferences().subscribe({
        next: confs => this.stats.totalConferences = confs.length,
        error: (err) => console.error('Error fetching conferences:', err)
      });
    }

    // ===== AUTHOR =====
    if (userRole === 'author') {
      console.log(`Fetching papers for Author ID: ${currentUserId}`);

      this.paperService.getPapersByAuthor(currentUserId).subscribe({
        next: (papers) => {
          console.log('Papers found for author:', papers);
          this.stats.mySubmissions = papers.length;
        },
        error: (err) => {
          console.error('❌ Failed to fetch author papers:', err);
          this.stats.mySubmissions = 0;
        }
      });
    }

    // ===== REVIEWER =====
    if (userRole === 'reviewer') {
      console.log(`Fetching reviews for Reviewer ID: ${currentUserId}`);

      // Ensure reviewService is imported and injected in constructor
      this.reviewService.getReviewsByReviewer(currentUserId).subscribe({
        next: (reviews: any[]) => {
          console.log('Reviews found:', reviews);
          // Filter checks if overallScore is null/undefined
          this.stats.pendingReviews = reviews.filter(
            r => r.overallScore === null || r.overallScore === undefined
          ).length;
        },
        error: (err) => {
          console.error('❌ Failed to fetch reviews:', err);
          this.stats.pendingReviews = 0;
        }
      });
    }
  }

  // --- 2. LOGIC FOR LOADING USERS & LOGS (Moved OUT of loadStatistics) ---
  loadUsersAndLogs() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        users.forEach((u: any) => {
          const id = u.user_id || u.id;
          this.userMap[id] = `${u.first_name || u.firstName} ${u.last_name || u.lastName}`;
        });
        this.fetchRecentLogs();
      },
      error: (err) => {
        console.error('Failed to load users for overview:', err);
        this.fetchRecentLogs();
      }
    });
  }

  fetchRecentLogs() {
    // Get only 5 recent logs
    this.logActivityService.getRecentLogs(5).subscribe({
      next: (logs: LogActivity[]) => {
        this.recentLogs = logs.map(log => {
          let userName = 'Guest / System';
          if (log.user_id) {
            userName = this.userMap[log.user_id] || `User #${log.user_id}`;
          }

          return {
            action: log.action || 'Unknown',
            user: userName,
            type: this.determineLogType(log.action),
            timestamp: log.login_time
              ? new Date(log.login_time).toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })
              : '-'
          };
        });
      },
      error: () => this.recentLogs = []
    });
  }

  // --- 3. HELPER ---
  determineLogType(action?: string): 'info' | 'warning' | 'success' | 'danger' {
    const act = (action || '').toLowerCase();
    if (act.includes('delete') || act.includes('error')) return 'danger';
    if (act.includes('warning') || act.includes('update')) return 'warning';
    if (act.includes('success') || act.includes('login') || act.includes('register')) return 'success';
    return 'info';
  }
}
