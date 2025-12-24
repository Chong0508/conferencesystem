import { Routes } from '@angular/router';

// 1. Basic Pages
import { Landing } from './components/common/landing/landing';
import { Login } from './components/common/login/login';
import { Register } from './components/common/register/register';
import { Dashboard } from './components/common/dashboard/dashboard';

// 2. Overview (Dashboard Home)
import { OverviewComponent } from './components/common/overview/overview';


// 3. Author Features
import { SubmitPaper } from './components/author/submit-paper/submit-paper';
import { MySubmissions } from './components/author/my-submissions/my-submissions';
import { PaperDetails } from './components/common/paper-details/paper-details';
import { PaperPayment } from './components/author/paper-payment/paper-payment';

// 4. Reviewer Features
import { ReviewList } from './components/reviewer/review-list/review-list';
import { Grading } from './components/reviewer/grading/grading';
import { ReviewHistory } from './components/reviewer/review-history/review-history';

// 5. Admin Features
import { ConferenceList } from './components/common/conference-list/conference-list';
import { CreateConference } from './components/admin/create-conference/create-conference';
import { ManageTracks } from './components/admin/manage-tracks/manage-tracks';
import { PaperMaster } from './components/admin/paper-master/paper-master';
import { ConferenceDetail } from './components/common/conference-detail/conference-detail';

// 6. Admin Management Features (User, Schedule, Logs, Applications)
import { UserListComponent } from './components/admin/user-list/user-list';
import { ScheduleComponent } from './components/admin/schedule/schedule';
import { ActivityLogsComponent } from './components/admin/activity-logs/activity-logs';
// 👇 NEW: Import the Reviewer Applications Component
import { ReviewerApplicationsComponent } from './components/admin/reviewer-applications/reviewer-applications';

// 7. Profile & Settings (Assuming you have a component for this path)
import { MyProfile } from './components/common/my-profile/my-profile';
import { ApplyReviewerComponent } from './components/author/apply-reviewer/apply-reviewer';

import { CreateAdminComponent } from './components/admin/create-admin/create-admin';
import { SearchPapers } from './components/common/search-papers/search-papers';
import { ConferenceRegistration } from './components/common/conference-registration/conference-registration';
import { ConferencePayment } from './components/common/conference-payment/conference-payment';
import { MyConferences } from './components/common/my-conferences/my-conferences';


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
      // 1. Default Route: Redirect to Overview
      { path: '', redirectTo: 'overview', pathMatch: 'full' },

      // 2. Overview Page
      { path: 'overview', component: OverviewComponent },
      { path: 'create-admin', component: CreateAdminComponent },
      { path: 'searchPapers', component: SearchPapers },
      { path: 'conference-registration/:id', component: ConferenceRegistration },
      { path: 'conference-payment', component: ConferencePayment },
      { path: 'my-participated', component: MyConferences },

      // 3. Author Routes
      { path: 'submit-paper', component: SubmitPaper },
      { path: 'my-submissions', component: MySubmissions },
      { path: 'paper-details/:id', component: PaperDetails },
      { path: 'registration/:paperId', component: PaperPayment },

      // 4. Reviewer Routes
      { path: 'reviews', component: ReviewList },
      { path: 'review/:id', component: Grading },
      { path: 'review-history', component: ReviewHistory },

      // 5. Admin / Conference Routes
      { path: 'conferences', component: ConferenceList },
      { path: 'create-conference', component: CreateConference },
      { path: 'tracks', component: ManageTracks },
      { path: 'all-papers', component: PaperMaster },
      { path: 'conference-detail/:id', component: ConferenceDetail },

      // 6. Admin Management Routes
      { path: 'user-management', component: UserListComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'activity-logs', component: ActivityLogsComponent },
      { path: 'applications', component: ReviewerApplicationsComponent }, // 👈 NEW Route added

      // 7. Settings
      { path: 'profile', component: MyProfile },
      { path: 'applications', component: ReviewerApplicationsComponent},
      { path: 'paper-details/:id', component: PaperDetails },
      { path: 'review/:id', component: Grading },
      { path: 'notifications', loadComponent: () => import('./components/common/notifications/notifications').then(m => m.Notifications) },
      { path: 'apply-reviewer', component: ApplyReviewerComponent },
    ]
  },

  // --- Fallback Route ---
  { path: '**', redirectTo: '' }
];
