import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-layout',
  standalone: true,  // 👈 mark standalone
  imports: [RouterModule], 
  template: `
    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-gray-800 text-white h-screen p-4">
        <nav class="space-y-2">
          <a routerLink="/dashboard" routerLinkActive="font-bold">Dashboard</a>
          <a routerLink="/budgets" routerLinkActive="font-bold">Budgets</a>
          <a routerLink="/transactions" routerLinkActive="font-bold">Transactions</a>
          <a routerLink="/tax-estimator" routerLinkActive="font-bold">Tax Estimator</a>
          <a routerLink="/reports" routerLinkActive="font-bold">Reports</a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: []
})
export class LayoutComponent {}
