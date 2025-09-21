import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit, OnDestroy {
  private darkModeListener: any;
  
  ngOnInit() {
    // Check dark mode on init
    console.log('Hero component initialized, checking dark mode');
    
    // Listen for dark mode changes
    this.darkModeListener = () => {
      console.log('Dark mode change detected in hero component');
      // Force change detection by toggling a class
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        heroSection.classList.add('dark-mode-updated');
        setTimeout(() => {
          heroSection.classList.remove('dark-mode-updated');
        }, 10);
      }
    };
    
    window.addEventListener('darkModeChanged', this.darkModeListener);
  }
  
  ngOnDestroy() {
    // Clean up event listener
    if (this.darkModeListener) {
      window.removeEventListener('darkModeChanged', this.darkModeListener);
    }
  }
  
  isDarkMode(): boolean {
    return document.body.classList.contains('dark-mode') || 
           document.body.classList.contains('dark');
  }
}
