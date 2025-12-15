import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// 👇 Import All Services
import { AuthService } from '../../../services/auth';
import { PaperService } from '../../../services/paper';
import { UserService } from '../../../services/user';
import { ConferenceService } from '../../../services/conference';

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
    private authService: AuthService,
    private paperService: PaperService,
    private userService: UserService,
    private conferenceService: ConferenceService
  ) { }

  ngOnInit(): void {
    this.loggedUser = this.authService.getLoggedUser();
    if (this.loggedUser) {
      this.calculateStats();
    }
  }

  calculateStats() {
    // 1. Fetch Users
    this.userService.getAllUsers().subscribe((users: any[]) => {
      if (this.loggedUser.role === 'Admin') {
        this.stats.totalUsers = users.length;
      }
    });

    // 2. Fetch Papers
    this.paperService.getAllPapers().subscribe((papers: any[]) => {

      if (this.loggedUser.role === 'Admin') {
        this.stats.totalPapers = papers.length;
      }

      if (this.loggedUser.role === 'Author') {
        const myPapers = papers.filter((p: any) => p.authorEmail === this.loggedUser.email);
        this.stats.mySubmissions = myPapers.length;
      }

      if (this.loggedUser.role === 'Reviewer') {
        // Simple logic for pending reviews
        const pending = papers.filter((p: any) => p.assignedReviewer === this.loggedUser.email && p.status !== 'Reviewed');
        this.stats.pendingReviews = pending.length;
      }
    });

    // 3. Fetch Conferences
    this.conferenceService.getAllConferences().subscribe((confs: any[]) => {
      if (this.loggedUser.role === 'Admin') {
        this.stats.totalConferences = confs.length;
      }
    });

    // 4. Fetch Logs (Admin Only)
    if (this.loggedUser.role === 'Admin') {
      this.authService.getActivityLogs().subscribe((logs: any[]) => {
        this.recentLogs = logs.slice(0, 5);
      });
    }
  }
}
