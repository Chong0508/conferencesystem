import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit-paper',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './submit-paper.html',
  styleUrl: './submit-paper.css'
})
export class SubmitPaper {

  // Mock Data for Tracks
  tracks = [
    { id: 1, name: 'Artificial Intelligence (AI) & Machine Learning' },
    { id: 2, name: 'Software Engineering (SE) & Architecture' },
    { id: 3, name: 'Cybersecurity & Network Defense' },
    { id: 4, name: 'Internet of Things (IoT) & Smart Systems' },
    { id: 5, name: 'Data Science & Big Data Analytics' }
  ];

  paperObj: any = {
    title: '',
    abstract: '',
    trackId: '',
    keywords: '',
    fileName: ''
  };

  isLoading: boolean = false;

  constructor(private router: Router) {}

  // Handle File Selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Simple Validation for demo (e.g., max size 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File is too large! Max size is 10MB.");
        return;
      }
      this.paperObj.fileName = file.name;
    }
  }

  onSubmit() {
    // Basic Validation
    if (!this.paperObj.title || !this.paperObj.abstract || !this.paperObj.trackId || !this.paperObj.fileName) {
      alert("Please fill in all required fields (*) and upload a file.");
      return;
    }

    this.isLoading = true;

    // --- SIMULATION START ---
    const currentUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');

    const newPaper = {
      id: Date.now(), // Generate a unique ID
      ...this.paperObj,
      authorEmail: currentUser.email,
      authorName: currentUser.firstName + ' ' + currentUser.lastName,
      status: 'Pending Review',
      submittedAt: new Date()
    };

    const existingPapers = JSON.parse(localStorage.getItem('mock_papers') || '[]');
    existingPapers.push(newPaper);
    localStorage.setItem('mock_papers', JSON.stringify(existingPapers));
    // --- SIMULATION END ---

    // Simulate network delay
    setTimeout(() => {
      this.isLoading = false;
      alert("🎉 Paper Submitted Successfully! \nStatus: Pending Review");
      this.resetForm();
      // Optional: Navigate somewhere else
      // this.router.navigateByUrl('/dashboard');
    }, 1500);
  }

  resetForm() {
    this.paperObj = { title: '', abstract: '', trackId: '', keywords: '', fileName: '' };
  }
}
