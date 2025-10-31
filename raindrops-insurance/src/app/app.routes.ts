import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { PlansComponent } from './components/plans/plans';
import { PlanDetailsComponent } from './components/plan-details/plan-details';
import { BookingComponent } from './components/booking/booking';
import { SuccessComponent } from './components/success/success';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'plans', component: PlansComponent },
  { path: 'plan-details/:id', component: PlanDetailsComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'success', component: SuccessComponent },
  { path: '**', redirectTo: '' }
];