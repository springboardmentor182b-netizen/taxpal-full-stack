import { Component, AfterViewInit } from '@angular/core';

declare const Chart: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.initCharts();
  }

  initCharts() {
    try {
      const pieEl = document.getElementById('pieChart') as HTMLCanvasElement | null;
      if (pieEl) {
        const pieCtx = pieEl.getContext('2d');
        new Chart(pieCtx, {
          type: 'pie',
          data: {
            labels: ['Rent/Mortgage','Utilities','Groceries','Others'],
            datasets: [{
              data: [32,20,25,23],
              backgroundColor: [
                getComputedStyle(document.documentElement).getPropertyValue('--pie-blue').trim() || '#3b82f6',
                getComputedStyle(document.documentElement).getPropertyValue('--pie-light-blue').trim() || '#60a5fa',
                getComputedStyle(document.documentElement).getPropertyValue('--pie-teal').trim() || '#14b8a6',
                getComputedStyle(document.documentElement).getPropertyValue('--pie-green').trim() || '#34d399'
              ]
            }]
          },
          options: { plugins:{legend:{display:false}}, responsive: true, maintainAspectRatio: false }
        });
      }

      const barEl = document.getElementById('barChart') as HTMLCanvasElement | null;
      if (barEl) {
        const barCtx = barEl.getContext('2d');
        new Chart(barCtx, {
          type: 'bar',
          data: {
            labels: ['Jan','Feb','Mar','Apr','May','Jun'],
            datasets: [
              { label: 'Income', data:[8700,7700,9500,5600,8800,7900], backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--graph-income').trim() || '#60a5fa' },
              { label: 'Expenses', data:[3200,3100,3900,2800,3500,3000], backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--graph-expense').trim() || '#475569' }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true } },
            scales: {
              y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#9aa8b8' } },
              x: { grid: { color: 'transparent' }, ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#9aa8b8' } }
            }
          }
        });
      }
    } catch (e) {
      console.error('Chart init error', e);
    }
  }
}
