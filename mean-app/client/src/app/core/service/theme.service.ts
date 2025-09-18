
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { theme, Theme } from '../theme/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<Theme>(theme);
  public theme$ = this.currentTheme.asObservable();

  constructor() {
    this.applyTheme(theme);
  }

  private applyTheme(themeConfig: Theme): void {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--primary-50', themeConfig.palette.primary[50]);
    root.style.setProperty('--primary-100', themeConfig.palette.primary[100]);
    root.style.setProperty('--primary-200', themeConfig.palette.primary[200]);
    root.style.setProperty('--primary-300', themeConfig.palette.primary[300]);
    root.style.setProperty('--primary-400', themeConfig.palette.primary[400]);
    root.style.setProperty('--primary-500', themeConfig.palette.primary[500]);
    root.style.setProperty('--primary-600', themeConfig.palette.primary[600]);
    root.style.setProperty('--primary-700', themeConfig.palette.primary[700]);
    root.style.setProperty('--primary-800', themeConfig.palette.primary[800]);
    root.style.setProperty('--primary-900', themeConfig.palette.primary[900]);
    
    root.style.setProperty('--accent-500', themeConfig.palette.accent[500]);
    root.style.setProperty('--warn-500', themeConfig.palette.warn[500]);
    
    root.style.setProperty('--background-default', themeConfig.palette.background.default);
    root.style.setProperty('--background-paper', themeConfig.palette.background.paper);
    
    root.style.setProperty('--text-primary', themeConfig.palette.text.primary);
    root.style.setProperty('--text-secondary', themeConfig.palette.text.secondary);
    
    root.style.setProperty('--font-family', themeConfig.typography.fontFamily);
    root.style.setProperty('--font-size', themeConfig.typography.fontSize + 'px');
    root.style.setProperty('--border-radius', themeConfig.shape.borderRadius + 'px');
  }

  getCurrentTheme(): Theme {
    return this.currentTheme.value;
  }
}