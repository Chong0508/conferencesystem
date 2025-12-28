import { Routes } from '@angular/router';

// --- Public Pages ---
import { Landing } from './components/common/landing/landing';
import { Login } from './components/common/login/login';
import { Register } from './components/common/register/register';

// --- Dashboard ---
import { Dashboard } from './components/common/dashboard/dashboard';
import { OverviewComponent } from './components/common/overview/overview';
import { MyProfile } from './components/common/my-profile/my-profile';
import { Notifications } from './components/common/notifications/notifications';
import { SearchPapers } from './components/common/search-papers/search-papers';
import { ConferenceRegistration } from './components/common/conference-registration/conference-registration';
import { ConferencePayment } from './components/common/conference-payment/conference-payment';
import { MyConferences } from './components/common/my-conferences/my-conferences';

// --- Author Features ---
import { SubmitPaper } from './components/author/submit-paper/submit-paper';
import { MySubmissions } from './components/author/my-submissions/my-submissions';
import { PaperDetails } from './components/common/paper-details/paper-details';
import { PaperPayment } from './components/author/paper-payment/paper-payment';
import { ApplyReviewerComponent } from './components/author/apply-reviewer/apply-reviewer';

// --- Reviewer Features ---
import { ReviewList } from './components/reviewer/review-list/review-list';
import { Grading } from './components/reviewer/grading/grading';
import { ReviewHistory } from './components/reviewer/review-history/review-history';

// --- Admin Features ---
import { ConferenceList } from './components/common/conference-list/conference-list';
import { CreateConference } from './components/admin/create-conference/create-conference';
import { ManageTracks } from './components/admin/manage-tracks/manage-tracks';
import { PaperMaster } from './components/admin/paper-master/paper-master';
import { ConferenceDetail } from './components/common/conference-detail/conference-detail';
import { UserListComponent } from './components/admin/user-list/user-list';
import { ScheduleComponent } from './components/admin/schedule/schedule';
import { ActivityLogsComponent } from './components/admin/activity-logs/activity-logs';
import { ReviewerApplicationsComponent } from './components/admin/reviewer-applications/reviewer-applications';
import { CreateAdminComponent } from './components/admin/create-admin/create-admin';

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
      // Default route
      { path: '', redirectTo: 'overview', pathMatch: 'full' },

      // Overview
      { path: 'overview', component: OverviewComponent },

      // Author
      { path: 'submit-paper', component: SubmitPaper },
      { path: 'my-submissions', component: MySubmissions },
      { path: 'paper-details/:id', component: PaperDetails },
      { path: 'registration/:paperId', component: PaperPayment },
      { path: 'apply-reviewer', component: ApplyReviewerComponent },

      // Reviewer
      { path: 'reviews', component: ReviewList },
      { path: 'review/:id', component: Grading },
      { path: 'review-history', component: ReviewHistory },

      // Admin / Conference
      { path: 'conferences', component: ConferenceList },
      { path: 'create-conference', component: CreateConference },
      { path: 'tracks', component: ManageTracks },
      { path: 'all-papers', component: PaperMaster },
      { path: 'conference-detail/:id', component: ConferenceDetail },

      // Admin Management
      { path: 'user-management', component: UserListComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'activity-logs', component: ActivityLogsComponent },
      { path: 'applications', component: ReviewerApplicationsComponent },
      { path: 'create-admin', component: CreateAdminComponent },

      // Other
      { path: 'searchPapers', component: SearchPapers },
      { path: 'conference-registration/:id', component: ConferenceRegistration },
      { path: 'conference-payment', component: ConferencePayment },
      { path: 'my-participated', component: MyConferences },
      { path: 'profile', component: MyProfile },
      { path: 'notifications', loadComponent: () => import('./components/common/notifications/notifications').then(m => m.Notifications) },
    ]
  },

  // --- Fallback Route ---
  { path: '**', redirectTo: '' }
];
