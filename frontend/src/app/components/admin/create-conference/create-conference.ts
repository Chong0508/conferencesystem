import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ConferenceService } from '../../../services/conference.service';
import { NotificationService } from '../../../services/notification.service';

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
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
      // 1. Check what is actually in LocalStorage
      const userStr = localStorage.getItem('loggedUser');
      console.log("🔍 DEBUG: Raw LocalStorage 'loggedUser':", userStr);

      // If that returns null, try the other common key name
      const altUserStr = localStorage.getItem('user');
      console.log("🔍 DEBUG: Raw LocalStorage 'user':", altUserStr);

      const validUserStr = userStr || altUserStr;

      if (validUserStr) {
        const user = JSON.parse(validUserStr);
        console.log("🔍 DEBUG: Parsed User Object:", user);

        // 2. Try to find the ID
        // It might be 'id', 'user_id', 'userId', or even inside a nested object like 'user.data.id'
        this.conferenceObj.createdBy = user.id || user.user_id || user.userId;

        console.log("✅ DEBUG: Final Set CreatedBy ID:", this.conferenceObj.createdBy);
      } else {
        console.error("❌ DEBUG: No user found in LocalStorage! Are you logged in?");
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

          // ============================================================
          // 3. TRIGGER NOTIFICATION (The Code You Need)
          // ============================================================
          if (this.conferenceObj.createdBy) {
             console.log("🚀 Triggering Notification...");

             this.notificationService.createNotification(
               Number(this.conferenceObj.createdBy),
               `Conference "${this.conferenceObj.title}" created successfully.`,
               'success'
             );
          } else {
             console.error("⚠️ Cannot send notification: User ID is missing in conferenceObj");
          }

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
