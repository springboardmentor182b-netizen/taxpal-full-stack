import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  template: `
    <section class="main">
      <div class="container">
        <article class="card" style="text-align:center;max-width:720px">
          <h2 style="margin:0 0 8px 0">{{ title }}</h2>
          <p style="color:var(--muted);margin:0">This page is a placeholder. Ask to fill in the design and content.</p>
        </article>
      </div>
    </section>
  `
})
export class PlaceholderComponent { 
  @Input() title = 'Coming soon';
}
