import { Routes } from '@angular/router';

import { Landing } from './components/landing/landing';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { SubmitPaper } from './components/submit-paper/submit-paper';
import { ReviewList } from './components/review-list/review-list';
// 👇 1. Import Grading Component (Import it assuming you created the folder)
import { Grading } from './components/grading/grading';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

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
