import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    // ensure icon reflects current mode on load
    this.setModeIcon();
  }

  toggleMode() {
    document.body.classList.toggle('light-mode');
    this.setModeIcon();
  }

  setModeIcon() {
    const el = document.getElementById('modeToggle');
    const icon = el?.querySelector('i');
    if (icon) {
      if (document.body.classList.contains('light-mode')) {
        icon.className = 'fa-solid fa-sun';
      } else {
        icon.className = 'fa-solid fa-moon';
      }
    }
  }
}
