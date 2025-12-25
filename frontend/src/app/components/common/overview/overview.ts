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
    const userStr = localStorage.getItem('loggedUser');
    if (!userStr) return;
    
    this.loggedUser = JSON.parse(userStr);
    const currentUserId = this.loggedUser.user_id || this.loggedUser.userId || this.loggedUser.id;
    const userRole = (this.loggedUser.category || this.loggedUser.role || '').toLowerCase();
    
    console.log(`Loading stats for Role: ${userRole}, ID: ${currentUserId}`);

    // === ADMIN STATS ===
    if (userRole === 'admin' || userRole === 'super admin') {
      this.userService.getAllUsers().subscribe({
        next: (users) => {
          this.stats.totalUsers = users ? users.length : 0;
          console.log('Total users:', this.stats.totalUsers);
        },
        error: (err) => {
          console.error('Error fetching users:', err);
          this.stats.totalUsers = 0;
        }
      });

      this.paperService.getAllPapers().subscribe({
        next: (papers) => {
          this.stats.totalPapers = papers ? papers.length : 0;
          console.log('Total papers:', this.stats.totalPapers);
        },
        error: (err) => {
          console.error('Error fetching papers:', err);
          this.stats.totalPapers = 0;
        }
      });

      this.conferenceService.getAllConferences().subscribe({
        next: (confs) => {
          this.stats.totalConferences = confs ? confs.length : 0;
          console.log('Total conferences:', this.stats.totalConferences);
        },
        error: (err) => {
          console.error('Error fetching conferences:', err);
          this.stats.totalConferences = 0;
        }
      });
    }

    // === AUTHOR STATS (My Submissions) ===
    if (userRole === 'author' || userRole === 'reviewer') {
      this.paperService.getPapersByAuthor(Number(currentUserId)).subscribe({
        next: (papers) => {
          this.stats.mySubmissions = papers ? papers.length : 0;
          console.log('Author papers:', this.stats.mySubmissions);
        },
        error: (err) => {
          console.error('Error fetching author papers:', err);
          this.stats.mySubmissions = 0;
        }
      });
    }

    // === REVIEWER STATS (UPDATED TO PREVENT SELF-REVIEW) ===
    if (userRole === 'reviewer') {
      const idToCheck = Number(currentUserId);
      if (!idToCheck || isNaN(idToCheck)) {
        console.warn('Cannot load reviewer stats: Invalid User ID', currentUserId);
        return;
      }

      // Get all papers with "Pending Review" status that are NOT authored by the reviewer
      this.paperService.getAllPapers().subscribe({
        next: (papers) => {
          const pendingPapers = papers.filter(p => {
            // Must be "Pending Review" status
            const isPendingStatus = p.status === 'Pending Review';
            
            // Must NOT be authored by the current reviewer (prevent self-review)
            const authorId = p.author_id || p.authorId;
            const isNotMyPaper = Number(authorId) !== idToCheck;
            
            return isPendingStatus && isNotMyPaper;
          });
          
          this.stats.pendingReviews = pendingPapers.length;
          console.log(`Pending Review papers (excluding self-authored): ${this.stats.pendingReviews}`);
          console.log('Pending papers:', pendingPapers.map(p => ({
            paperId: p.paperId || p.paper_id,
            title: p.title,
            authorId: p.author_id || p.authorId,
            status: p.status
          })));
        },
        error: (err) => {
          console.error('Failed to get papers for pending reviews:', err);
          this.stats.pendingReviews = 0;
        }
      });
    }
  }

  // --- 2. LOGIC FOR LOADING USERS & LOGS ---
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
    this.logActivityService.getRecentLogs(5).subscribe({
      next: (logs: LogActivity[]) => {
        if (!logs) {
          this.recentLogs = [];
          return;
        }

        const sortedLogs = logs.sort((a: any, b: any) => {
          const dateA = new Date(a.login_time || 0).getTime();
          const dateB = new Date(b.login_time || 0).getTime();
          return dateB - dateA;
        }).slice(0, 5);

        this.recentLogs = sortedLogs.map(log => {
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
      error: (err) => {
        console.error('Error fetching recent logs:', err);
        this.recentLogs = [];
      }
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