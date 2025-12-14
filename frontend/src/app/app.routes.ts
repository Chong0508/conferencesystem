import { Routes } from '@angular/router';

// 1. Basic Pages
import { Landing } from './components/landing/landing';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';

// 2. Author Features
import { SubmitPaper } from './components/submit-paper/submit-paper';
import { MySubmissions } from './components/my-submissions/my-submissions';
import { PaperDetails } from './components/paper-details/paper-details';
import { ConferenceRegistration } from './components/conference-registration/conference-registration';

// 3. Reviewer Features
import { ReviewList } from './components/review-list/review-list';
import { Grading } from './components/grading/grading';
import { ReviewHistory } from './components/review-history/review-history';

// 4. Admin Features
import { ConferenceList } from './components/conference-list/conference-list';
import { CreateConference } from './components/create-conference/create-conference';
import { ManageTracks } from './components/manage-tracks/manage-tracks';
import { PaperMaster } from './components/paper-master/paper-master';

// 5. User Management, Schedule & Activity Logs
// Note: Ensure these file paths match your actual file names (e.g., if you used CLI, it might be .component)
import { UserListComponent } from './components/user-list/user-list';
import { ScheduleComponent } from './components/schedule/schedule';
import { ActivityLogsComponent } from './components/activity-logs/activity-logs';

export const routes: Routes = [
  // --- Public Routes ---
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // --- Dashboard Routes ---
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      // 1. Author Routes
      { path: 'submit-paper', component: SubmitPaper },
      { path: 'my-submissions', component: MySubmissions },
      { path: 'paper-details/:id', component: PaperDetails },
      { path: 'registration/:paperId', component: ConferenceRegistration },

      // 2. Reviewer Routes
      { path: 'reviews', component: ReviewList },
      { path: 'review/:id', component: Grading },
      { path: 'review-history', component: ReviewHistory },

      // 3. Admin / Conference Routes
      { path: 'conferences', component: ConferenceList },
      { path: 'create-conference', component: CreateConference },
      { path: 'tracks', component: ManageTracks },
      { path: 'all-papers', component: PaperMaster },

      // 4. New Admin Features
      { path: 'user-management', component: UserListComponent },
      { path: 'schedule', component: ScheduleComponent },

      // 👇 Added Activity Logs Route
      { path: 'activity-logs', component: ActivityLogsComponent }
    ]
  },

  // --- Fallback Route ---
  { path: '**', redirectTo: '' }
];
