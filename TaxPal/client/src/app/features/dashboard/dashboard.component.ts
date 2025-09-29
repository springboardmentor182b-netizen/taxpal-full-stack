import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  private pieChart: any = null;
  private barChart: any = null;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    // Theme toggle (dark/light)
    const modeToggle = document.getElementById('modeToggle');
    const setModeIcon = () => {
      const iconEl = modeToggle?.querySelector('i');
      if (!iconEl) return;
      if (document.body.classList.contains('light-mode')) {
        iconEl.className = 'fa-solid fa-sun';
      } else {
        iconEl.className = 'fa-solid fa-moon';
      }
    };
    if (modeToggle) {
      modeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        setModeIcon();
      });
    }
    setModeIcon();

    // Charts: assume Chart.js is loaded globally (via CDN in index.html) or installed and exposed.
    try {
      const Chart = (window as any).Chart;
      const pieCtx = (document.getElementById('pieChart') as HTMLCanvasElement).getContext('2d');
      this.pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: ['Rent/Mortgage', 'Utilities', 'Groceries', 'Others'],
          datasets: [{
            data: [32, 20, 25, 23],
            backgroundColor: [getComputedStyle(document.documentElement).getPropertyValue('--pie-blue'), getComputedStyle(document.documentElement).getPropertyValue('--pie-light-blue'), getComputedStyle(document.documentElement).getPropertyValue('--pie-teal'), getComputedStyle(document.documentElement).getPropertyValue('--pie-green')]
          }]
        },
        options: { plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }
      });

      const barCtx = (document.getElementById('barChart') as HTMLCanvasElement).getContext('2d');
      this.barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            { label: 'Income', data: [8700, 7700, 9500, 5600, 8800, 7900], backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--graph-income') },
            { label: 'Expenses', data: [3200, 3100, 3900, 2800, 3500, 3000], backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--graph-expense') }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: true, labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--muted') || '#9aa8b8' } } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--muted') || '#9aa8b8' } },
            x: { grid: { color: 'transparent' }, ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--muted') || '#9aa8b8' } }
          }
        }
      });
    } catch (e) {
      console.warn('Chart initialization skipped — Chart.js not found globally. See README to add Chart.js.', e);
    }
  }

  ngOnDestroy(): void {
    try {
      if (this.pieChart) this.pieChart.destroy();
      if (this.barChart) this.barChart.destroy();
    } catch (e) { }
  }
}