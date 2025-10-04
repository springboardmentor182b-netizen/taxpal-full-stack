import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
//import { Categories } from '../categories/categories.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class Settings {
  showCategoriesModal = false;

  constructor(private router: Router,private route:ActivatedRoute) {}
  
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
