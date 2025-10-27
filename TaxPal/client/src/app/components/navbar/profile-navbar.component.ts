import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-profile-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile-navbar.component.html',
  styleUrls: ['./profile-navbar.component.css']
})
export class ProfileNavbarComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  floatingEmojis: { symbol: string, style: any }[] = [];
  private emojis = ['💰', '💵', '💸', '💲', '💸', '💸'];
  private maxEmojis = 15;
  private animationInterval: any;
  showProfileMenu = false; // Add this property
  isMobileMenuOpen = false;

  constructor(private router: Router) {
    // Check for saved preference on component initialization
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      this.isDarkMode = true;
      this.applyDarkMode();
    }
  }

  ngOnInit() {
    this.startEmojiAnimation();
    
    // Apply dark mode if needed on component init
    if (this.isDarkMode) {
      setTimeout(() => {
        this.applyDarkMode();
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  private startEmojiAnimation() {
    this.animationInterval = setInterval(() => {
      // Only add new emoji if we haven't reached the max
      if (this.floatingEmojis.length < this.maxEmojis) {
        this.addFloatingEmoji();
      }
      
      // Remove completed animations
      this.floatingEmojis = this.floatingEmojis.filter(emoji => 
        Date.now() - emoji.style.createdAt < 8000
      );
    }, 800);
  }

  private addFloatingEmoji() {
    const randomEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
    const left = Math.random() * 100; // Random horizontal position (0-100%)
    const rotationStart = Math.random() * 360; // Random initial rotation
    const scale = 0.8 + Math.random() * 0.4; // Random scale between 0.8 and 1.2
    const duration = 6 + Math.random() * 4; // Random duration between 6-10s
    
    this.floatingEmojis.push({
      symbol: randomEmoji,
      style: {
        left: `${left}%`,
        bottom: '-20px',
        transform: `rotate(${rotationStart}deg) scale(${scale})`,
        animationDuration: `${duration}s`,
        createdAt: Date.now()
      }
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    
    setTimeout(() => {
      this.applyDarkMode();
    }, 0);
    
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  private applyDarkMode() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark-mode');
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    }
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('darkModeChanged', { 
      detail: { isDarkMode: this.isDarkMode } 
    }));
  }
  
  isActiveRoute(route: string): boolean {
    return window.location.pathname === route;
  }
  
  closeMenu() {
    this.showProfileMenu = false;
  }

  toggleMobileMenu(event?: Event) {
    if (event) event.stopPropagation();
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  navigateTo(route: string, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.closeMobileMenu();
    this.router.navigate([route]);
  }

  getUserName(): string {
    return localStorage.getItem('user_name') || 'User';
  }

  getUserEmail(): string {
    return localStorage.getItem('user_email') || '';
  }

  getUserInitial(): string {
    const name = this.getUserName();
    return name.charAt(0).toUpperCase();
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  closeProfileMenu() {
    this.showProfileMenu = false;
  }

  logout() {
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    this.closeProfileMenu();
    window.location.href = '/';
  }
}