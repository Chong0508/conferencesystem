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

  newConference: any = {
    title: '',
    date: '',
    venue: '',
    description: ''
  };

  constructor(
    private conferenceService: ConferenceService,
    private router: Router
  ) {}

  createConference() {
    if(this.newConference.title) {
      // 👇 Use Service to create
      // Note: Ensure createConference() exists in ConferenceService
      this.conferenceService.createConference(this.newConference).subscribe(() => {
        alert('Conference created successfully!');
        this.router.navigate(['/dashboard/manage-conferences']);
      });
    }
  }
}
