import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ConferenceService } from '../../../services/conference.service';

@Component({
  selector: 'app-create-conference',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-conference.html',
  styleUrl: './create-conference.css',
})
export class CreateConference implements OnInit {

  conferenceObj: any = {
    title: '',
    acronym: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    website_url: '',
    createdBy: null
  };

  isLoading: boolean = false;

  constructor(
    private confService: ConferenceService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get logged-in user ID for 'created_by'
    const userStr = localStorage.getItem('loggedUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.conferenceObj.createdBy = user.id || user.user_id;
    }
  }

  onSubmit() {
    if (!this.conferenceObj.title || !this.conferenceObj.start_date || !this.conferenceObj.location) {
      alert('Please fill in required fields.');
      return;
    }

    this.isLoading = true;

    this.confService.createConference(this.conferenceObj).subscribe({
      next: (res) => {
        this.isLoading = false;
        alert('Conference Created Successfully!');
        this.router.navigate(['/dashboard/conferences']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error:', err);
        alert('Failed to save. Check your Backend connection.');
      }
    });
  }
}
