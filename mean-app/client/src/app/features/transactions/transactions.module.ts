import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component'; // standalone

const routes: Routes = [
  { path: '', component: TransactionsComponent }
];

@NgModule({
  imports: [
    TransactionsComponent, // ✅ Import the standalone component
    RouterModule.forChild(routes)
  ]
})
export class TransactionsModule { }
