import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Settings } from './settings/settings.component'; // Adjusted import path
import { Profile } from './profile/profile';
import { Notifications } from './notifications/notifications';
import { Categories } from './categories/categories.component';
import { Security } from './security/security';
import { AuthGuard } from '../auth.guard';
const routes: Routes = [
  {
    path: 'settings',
    component: Settings, // standalone
    canActivate: [AuthGuard], // only allow logged-in users
    children: [
      { path: 'profile', component: Profile },
      { path: 'categories', component: Categories },
      { path: 'notifications', component: Notifications },
      { path: 'security', component: Security },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
