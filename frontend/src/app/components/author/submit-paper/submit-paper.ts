import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Removed RouterLink based on your previous check
// 👇 Import Services
import { ConferenceService } from '../../../services/conference';
import { PaperService } from '../../../services/paper';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-submit-paper',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './submit-paper.html',
  styleUrl: './submit-paper.css'
})
export class SubmitPaper implements OnInit {

  tracks: any[] = [];

  paperObj: any = {
    title: '',
    abstract: '',
    trackId: '',
    keywords: '',
    fileName: ''
  };

  isLoading: boolean = false;

  constructor(
    private router: Router,
    private conferenceService: ConferenceService, // 👈 Inject ConferenceService
    private paperService: PaperService,           // 👈 Inject PaperService
    private authService: AuthService              // 👈 Inject AuthService
  ) {}

  ngOnInit() {
    this.loadTracks();
  }

  loadTracks() {
    // 👇 Use Service to get tracks
    this.conferenceService.getAllTracks().subscribe((data: any[]) => {
      this.tracks = data;
    });
  }

  // Handle file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Simple validation: Max 10MB
      if (file.size > 10 * 1024 * 1024) {
        alert("File is too large! Max size is 10MB.");
        return;
      }
      this.paperObj.fileName = file.name;
    }
  }

  // Handle Form Submission
  onSubmit() {
    // 1. Validation
    if (!this.paperObj.title || !this.paperObj.abstract || !this.paperObj.trackId || !this.paperObj.fileName) {
      alert("Please fill in all required fields (*) and upload a file.");
      return;
    }

    this.isLoading = true;

    // 2. Get Current User info from AuthService
    const currentUser = this.authService.getLoggedUser();

    if (!currentUser) {
      alert("Session expired. Please login again.");
      this.router.navigate(['/login']);
      return;
    }

    // 3. Create the Paper Object
    const newPaper = {
      ...this.paperObj,
      authorEmail: currentUser.email,
      authorName: currentUser.firstName + ' ' + currentUser.lastName,
      // 'id' and 'status' will be handled by the Service
    };

    // 4. Use Service to Submit Paper
    this.paperService.createPaper(newPaper).subscribe(() => {
      this.isLoading = false;
      alert("🎉 Paper Submitted Successfully! \nStatus: Pending Review");
      this.resetForm();
      // Optional: Navigate to 'My Submissions'
      // this.router.navigate(['/dashboard/my-submissions']);
    });
  }

  // Reset the form
  resetForm() {
    this.paperObj = { title: '', abstract: '', trackId: '', keywords: '', fileName: '' };
  }
}
