import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-root">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  title = 'TaxPal';
}
