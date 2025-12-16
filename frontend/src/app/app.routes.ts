// File: src/app/app.routes.ts
import { Routes } from '@angular/router';

// 1. Basic Pages (Public)
import { Landing } from './components/common/landing/landing';
import { Login } from './components/common/login/login';
import { Register } from './components/common/register/register';

// 2. Dashboard Layout
import { Dashboard } from './components/common/dashboard/dashboard';

// 3. Dashboard Children Components
import { OverviewComponent } from './components/common/overview/overview';
import { MyProfile } from './components/common/my-profile/my-profile';
// 👇 Import Notifications Component (Make sure path matches your teammate's file structure)
import { Notifications } from './components/common/notifications/notifications'; // or './components/common/notification/notification'

// --- Shared Components ---
import { ConferenceList } from './components/common/conference-list/conference-list';

// --- Author Features ---
import { SubmitPaper } from './components/author/submit-paper/submit-paper';
import { MySubmissions } from './components/author/my-submissions/my-submissions';
import { PaperDetails } from './components/common/paper-details/paper-details';
import { ConferenceRegistration } from './components/author/conference-registration/conference-registration';

// --- Reviewer Features ---
import { ReviewList } from './components/reviewer/review-list/review-list';
import { Grading } from './components/reviewer/grading/grading';
import { ReviewHistory } from './components/reviewer/review-history/review-history';

// --- Admin Features ---
import { CreateConference } from './components/admin/create-conference/create-conference';
import { ManageTracks } from './components/admin/manage-tracks/manage-tracks';
import { PaperMaster } from './components/admin/paper-master/paper-master';

// --- Admin Management Features ---
import { UserListComponent } from './components/admin/user-list/user-list';
import { ScheduleComponent } from './components/admin/schedule/schedule';
import { ActivityLogsComponent } from './components/admin/activity-logs/activity-logs';

export const routes: Routes = [
  // --- Public Routes ---
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // --- Dashboard Routes (Protected) ---
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'profile', component: MyProfile },

      // ✨ NEW: Notifications Route
      { path: 'notifications', component: Notifications },

      // ===========================
      // Shared Routes
      // ===========================
      { path: 'conference-list', component: ConferenceList },
      { path: 'conferences', component: ConferenceList },

      // ===========================
      // Author Routes
      // ===========================
      { path: 'submit-paper', component: SubmitPaper },
      { path: 'my-submissions', component: MySubmissions },
      { path: 'paper-details/:id', component: PaperDetails },
      { path: 'registration/:paperId', component: ConferenceRegistration },

      // ===========================
      // Reviewer Routes
      // ===========================
      { path: 'reviews', component: ReviewList },
      { path: 'review/:id', component: Grading },
      { path: 'review-history', component: ReviewHistory },

      // ===========================
      // Admin Routes
      // ===========================
      { path: 'create-conference', component: CreateConference },
      { path: 'edit-conference/:id', component: CreateConference },
      { path: 'tracks', component: ManageTracks },
      { path: 'all-papers', component: PaperMaster },
      { path: 'user-management', component: UserListComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'activity-logs', component: ActivityLogsComponent }
    ]
  },

  { path: '**', redirectTo: '' }
];
