import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'TaxPal';
  @HostBinding('class.dark-theme') isDarkMode = false;
  
  private darkModeListener: any;

  ngOnInit() {
    // Check initial dark mode setting from localStorage
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Set initial body class for dark mode
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    
    // Listen for dark mode changes
    this.darkModeListener = window.addEventListener('darkModeChanged', (event: any) => {
      this.isDarkMode = event.detail?.isDarkMode || false;
      
      // Update body class
      if (this.isDarkMode) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    });
  }

  ngOnDestroy() {
    // Clean up event listener
    if (this.darkModeListener) {
      window.removeEventListener('darkModeChanged', this.darkModeListener);
    }
  }
}
