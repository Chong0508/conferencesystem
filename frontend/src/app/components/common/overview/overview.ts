import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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

  constructor() { }

  ngOnInit(): void {

    const userStr = localStorage.getItem('loggedUser');
    if (userStr) {
      this.loggedUser = JSON.parse(userStr);
      this.calculateStats();
    }
  }

  calculateStats() {

    const users = JSON.parse(localStorage.getItem('mock_db_users') || '[]');
    const logs = JSON.parse(localStorage.getItem('mock_activity_logs') || '[]');


    const papers = JSON.parse(localStorage.getItem('mock_papers') || '[]');

    // --- Admin --
    if (this.loggedUser.role === 'Admin') {
      this.stats.totalUsers = users.length;
      this.stats.totalPapers = papers.length;
      this.stats.totalConferences = 3; // 假定数据

      //get lasted news
      this.recentLogs = logs.slice(0, 5);
    }

    // --- Author  ---
    if (this.loggedUser.role === 'Author') {
      // choose the papers
      const myPapers = papers.filter((p: any) => p.authorEmail === this.loggedUser.email);
      this.stats.mySubmissions = myPapers.length;
    }

    // --- Reviewer  ---
    if (this.loggedUser.role === 'Reviewer') {
      this.stats.pendingReviews = 0;
    }
  }
}
