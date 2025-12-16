import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
// 👇 Import ConferenceService
import { ConferenceService } from '../../../services/conference';

@Component({
  selector: 'app-create-conference',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './create-conference.html',
  styleUrl: './create-conference.css',
})
export class CreateConference {

  // Data model binding to the form
  newConference: any = {
    title: '',
    description: '',
    date: '',
    venue: '',
    category: 'Computer Science', // Default value
    status: 'Upcoming' // Default status
  };

  constructor(
    private conferenceService: ConferenceService,
    private router: Router
  ) {}

  createConference() {
    // 1. Basic Validation
    if (!this.newConference.title || !this.newConference.date || !this.newConference.venue) {
      alert('Please fill in all required fields (Title, Date, Venue).');
      return;
    }

    // 2. Call Service to save data (This saves to LocalStorage)
    // Once saved, Author/Reviewer will see it because they read from the same Service.
    this.conferenceService.createConference(this.newConference).subscribe(() => {
      alert('✅ Conference created successfully!');

      // 3. Redirect to Admin Conference List
      this.router.navigate(['/dashboard/conferences']);
    });
  }
}
