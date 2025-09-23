import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

// ⬇️ Import your standalone modals (paths assume: src/app/features/modals/...)
import { IncomeModalComponent } from '../auth/components/income/income';
import { ExpenseModalComponent } from '../auth/components/expense/expense';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IncomeModalComponent, ExpenseModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  // toggles for your forms
  showIncome = false;
  showExpense = false;

  // optional local lists to store what the forms emit
  incomes: any[] = [];
  expenses: any[] = [];

  // button handlers
  openIncome()  { this.showIncome = true; }
  openExpense() { this.showExpense = true; }
  closeIncome() { this.showIncome = false; }
  closeExpense(){ this.showExpense = false; }

  // handlers used by (save)="..." in your template
  onIncomeSave(data: any) {
    this.incomes.push(data);
    this.closeIncome();
  }

  onExpenseSave(data: any) {
    this.expenses.push(data);
    this.closeExpense();
  }

  ngAfterViewInit(): void {
  // ----- Bar chart -----
  const ctx1 = document.getElementById('barChart') as HTMLCanvasElement | null;
  if (ctx1) {
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [
          { label: 'Income',   data: [400, 500, 450], backgroundColor: '#656ED3' },
          { label: 'Expenses', data: [200, 300, 250], backgroundColor: '#25295A' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // ----- Pie chart -----
  const ctx2: HTMLCanvasElement | null =
    document.getElementById('pieChart') as HTMLCanvasElement | null;
  if (ctx2) {
    new Chart(ctx2, {
      type: 'pie',
      data: {
        labels: ['Rent', 'Food', 'Transport', 'Other'],
        datasets: [{
          data: [500, 200, 150, 100],
          backgroundColor: ['#656ED3', '#25295A', '#8B95F9', '#A1A6D3']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  }
}

}
