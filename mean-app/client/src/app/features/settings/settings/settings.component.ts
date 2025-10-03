import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class Settings {
  showCategoriesModal = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Check the current URL
      this.showCategoriesModal = this.router.url.endsWith('/categories');
    });
  }

  closeCategories() {
    this.showCategoriesModal = false;
  }
}
