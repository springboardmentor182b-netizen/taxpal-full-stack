import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.getInitialDarkMode());
  public darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    // Listen for changes in the document class
    const observer = new MutationObserver(() => {
      this.darkModeSubject.next(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  private getInitialDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }

  toggleDarkMode(): void {
    const isDark = !document.documentElement.classList.contains('dark');
    this.setDarkMode(isDark);
  }

  setDarkMode(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    this.darkModeSubject.next(isDark);
  }
}
