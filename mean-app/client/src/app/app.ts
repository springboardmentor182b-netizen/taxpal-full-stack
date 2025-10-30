import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/theme/theme.service';
@Component({
  selector: 'app-root',
  standalone: true,  // ✅ needed if you're not using NgModule
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'] // ✅ should be plural
})
export class App implements OnInit {
  protected readonly title = signal('client');

  // ✅ lowercase "constructor" and correct parameter name
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    console.log('🎯 App component initialized');
    try {
      this.themeService.applyTheme(); // ✅ use the injected service
      console.log('✅ Theme applied successfully');
    } catch (error) {
      console.error('❌ Theme application failed:', error);
    }
  }
}
