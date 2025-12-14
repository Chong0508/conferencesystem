import { Routes } from '@angular/router';

import { Landing } from './components/landing/landing';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { SubmitPaper } from './components/submit-paper/submit-paper';
import { ReviewList } from './components/review-list/review-list';
import { Grading } from './components/grading/grading';

// Import your new components
import { ConferenceList } from './components/conference-list/conference-list';
import { CreateConference } from './components/create-conference/create-conference';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Add routes for your new components
  { path: 'conference-list', component: ConferenceList },
  { path: 'create-conference', component: CreateConference },

  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      { path: 'submit-paper', component: SubmitPaper },
      { path: 'reviews', component: ReviewList },
      { path: 'review/:id', component: Grading }
    ]
  },

  { path: '**', redirectTo: '' }
];
