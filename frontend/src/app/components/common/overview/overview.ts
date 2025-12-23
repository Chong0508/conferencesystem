import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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

  constructor(
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
      }
    }

  loadStatistics() {

      // ===== ADMIN =====
      if (this.loggedUser.role === 'Admin' || this.loggedUser.role === 'Super Admin') {

        // Users
        this.userService.getAllUsers().subscribe({
          next: users => this.stats.totalUsers = users.length,
          error: () => this.stats.totalUsers = 0
        });

        // Papers
        this.paperService.getAllPapers().subscribe({
          next: papers => this.stats.totalPapers = papers.length,
          error: () => this.stats.totalPapers = 0
        });

        // Conferences
        this.conferenceService.getAllConferences().subscribe({
          next: confs => this.stats.totalConferences = confs.length,
          error: () => this.stats.totalConferences = 0
        });

        // Recent Activity Logs
        this.logActivityService.getRecentLogs(5).subscribe({
          next: (logs: LogActivity[]) => {
            this.recentLogs = logs.map(log => ({
              action: log.action,
              user: `User ID ${log.user_id}`,
              type: 'info',
              timestamp: log.login_time || log.logout_time
            }));
          },
          error: () => this.recentLogs = []
        });
      }
    }
  }
