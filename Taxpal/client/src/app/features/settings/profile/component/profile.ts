import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Profile, ProfileService } from '@/app/core/services/profile.service';

@Component({
  selector: 'app-settings-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsProfileComponent implements OnInit {
  private api = inject(ProfileService);

  loading = true;
  saving  = false;
  error   = '';

  viewOnly = true; // start in view mode
  mobileNavOpen = false; // drawer state

  model: Profile = {
    id: '',
    name: '',
    email: '',
    country: 'US',
    income_bracket: 'middle'
  };

  // keep a copy to restore on cancel
  private snapshot: Profile | null = null;

  ngOnInit(): void {
    this.fetch();
  }

  /* ===== Drawer controls ===== */
  toggleDrawer() { this.mobileNavOpen = !this.mobileNavOpen; }
  closeDrawer()  { this.mobileNavOpen = false; }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.mobileNavOpen) {
      e.preventDefault();
      this.closeDrawer();
    }
  }

  /* ===== Data ===== */
  fetch() {
    this.loading = true;
    this.error = '';
    this.api.getMe().subscribe({
      next: (u) => {
        this.model = { ...u };
        this.snapshot = { ...u };
        this.loading = false;
      },
      error: (e) => {
        this.error = e?.error?.message || 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  enableEdit() {
    this.viewOnly = false;
    this.snapshot = { ...this.model };
  }

  cancel() {
    if (this.snapshot) this.model = { ...this.snapshot };
    this.viewOnly = true;
  }

  save() {
    this.saving = true;
    this.error = '';
    const { name, email, country, income_bracket } = this.model;
    this.api.updateMe({ name, email, country, income_bracket }).subscribe({
      next: (u) => {
        this.model = { ...u };
        this.viewOnly = true;
        this.saving = false;
      },
      error: (e) => {
        this.error = e?.error?.message || 'Failed to save profile';
        this.saving = false;
      }
    });
  }
}
