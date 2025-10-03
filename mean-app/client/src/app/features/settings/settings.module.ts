import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsRoutingModule } from './settings-routing.module';
import { CategoriesComponent } from './categories/categories.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SettingsRoutingModule,
    CategoriesComponent  // standalone component import
  ]
})
export class SettingsModule {}
