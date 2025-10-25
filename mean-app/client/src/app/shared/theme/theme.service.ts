import { Injectable } from '@angular/core';
import { theme } from './theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  applyTheme(): void {
    const root = document.documentElement;

    // Colors
    Object.entries(theme.colors).forEach(([colorName, shades]) => {
      if (typeof shades === 'object') {
        Object.entries(shades).forEach(([shade, value]) => {
          if (typeof value === 'string') {
            root.style.setProperty(`--color-${colorName}-${shade}`, value);
          }
        });
      }
    });

    // Typography
    Object.entries(theme.typography).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, String(value));
    });

    // Shape
    root.style.setProperty('--border-radius', `${theme.shape.borderRadius}px`);

    // Shadows
    theme.shadows.forEach((shadow, i) => {
      root.style.setProperty(`--box-shadow-${i + 1}`, shadow);
    });
  }
}
