import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Import standalone components
import { Settings } from './settings/settings.component';
import { Profile } from './profile/profile';
import { Categories } from './categories/categories.component';
import { Notifications } from './notifications/notifications';
import { Security } from './security/security';

@NgModule({
 
  imports: [
    CommonModule,
    RouterModule,
    Settings,
    Profile,
    Categories,
    Notifications,
    Security
  ]
})
export class SettingsModule {}
