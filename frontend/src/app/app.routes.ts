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
import { ReviewHistory } from './components/review-history/review-history'; // 👈 NEW Import

// 4. Admin Features
import { ConferenceList } from './components/conference-list/conference-list';
import { CreateConference } from './components/create-conference/create-conference';

export const routes: Routes = [
  // Public Routes
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Dashboard Routes
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      // --- Author Routes ---
      { path: 'submit-paper', component: SubmitPaper },
      { path: 'my-submissions', component: MySubmissions },
      { path: 'paper-details/:id', component: PaperDetails },
      { path: 'registration/:paperId', component: ConferenceRegistration },

      // --- Reviewer Routes ---
      { path: 'reviews', component: ReviewList },         // 待评审
      { path: 'review/:id', component: Grading },         // 评分页面
      { path: 'review-history', component: ReviewHistory }, // 👈 NEW: 历史记录

      // --- Admin / Conference Routes ---
      { path: 'conferences', component: ConferenceList },
      { path: 'create-conference', component: CreateConference }
    ]
  },

  { path: '**', redirectTo: '' }
];
