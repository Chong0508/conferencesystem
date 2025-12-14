import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-submit-paper',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './submit-paper.html',
  styleUrl: './submit-paper.css'
})
export class SubmitPaper implements OnInit {

  // 1. Tracks are now loaded dynamically, not hardcoded here
  tracks: any[] = [];

  paperObj: any = {
    title: '',
    abstract: '',
    trackId: '', // This will store the selected Track ID
    keywords: '',
    fileName: ''
  };

  isLoading: boolean = false;

  constructor(private router: Router) {}

  // 2. Load Tracks on initialization
  ngOnInit() {
    this.loadTracks();
  }

  loadTracks() {
    const storedTracks = localStorage.getItem('mock_tracks');

    if (storedTracks) {
      // If tracks exist in DB (managed by Admin), use them
      this.tracks = JSON.parse(storedTracks);
    } else {
      // Fallback: Initialize default tracks if DB is empty
      this.tracks = [
        { id: 1, name: 'Artificial Intelligence (AI) & Machine Learning' },
        { id: 2, name: 'Software Engineering (SE) & Architecture' },
        { id: 3, name: 'Cybersecurity & Network Defense' },
        { id: 4, name: 'Internet of Things (IoT) & Smart Systems' },
        { id: 5, name: 'Data Science & Big Data Analytics' }
      ];
      // Save these defaults to storage so Admin can see/edit them later
      localStorage.setItem('mock_tracks', JSON.stringify(this.tracks));
    }
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
      // We only store the name for this mockup
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

    // 2. Get Current User info
    const currentUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');

    // 3. Create the Paper Object
    const newPaper = {
      id: Date.now(), // Generate a unique ID
      ...this.paperObj,
      authorEmail: currentUser.email,
      authorName: currentUser.firstName + ' ' + currentUser.lastName,
      status: 'Pending Review', // Default status
      submittedAt: new Date()
    };

    // 4. Save to LocalStorage (Mock Database)
    const existingPapers = JSON.parse(localStorage.getItem('mock_papers') || '[]');
    existingPapers.push(newPaper);
    localStorage.setItem('mock_papers', JSON.stringify(existingPapers));

    // 5. Simulate Network Delay & Success
    setTimeout(() => {
      this.isLoading = false;
      alert("🎉 Paper Submitted Successfully! \nStatus: Pending Review");
      this.resetForm();

      // Optional: Navigate to 'My Submissions' after success
      // this.router.navigate(['/dashboard/my-submissions']);
    }, 1500);
  }

  // Reset the form
  resetForm() {
    this.paperObj = { title: '', abstract: '', trackId: '', keywords: '', fileName: '' };
  }
}
