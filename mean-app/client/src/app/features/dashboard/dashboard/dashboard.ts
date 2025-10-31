import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { IncomeForm } from '../../income/income-form/income-form';
import { ExpensesForm } from '../../expenses/expenses-form/expenses-form';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <button mat-raised-button color="primary" (click)="openIncome()">Add Income</button>
    <button mat-raised-button color="accent" (click)="openExpenses()">Add Expense</button>
  `
})
export class Dashboard {
  constructor(private dialog: MatDialog) {}

  openIncome() {
    const dialogRef = this.dialog.open(IncomeForm, { width: '500px' });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Income submitted:', result); // ✅ get data from form
      } else {
        console.log('Dialog closed without saving');
      }
    });
  }
  
  openExpenses() {
    const dialogRef = this.dialog.open(ExpensesForm, { width: '500px' });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Expenses submitted:', result); // ✅ get data from form
      } else {
        console.log('Dialog closed without saving');
      }
    });
  }
}
