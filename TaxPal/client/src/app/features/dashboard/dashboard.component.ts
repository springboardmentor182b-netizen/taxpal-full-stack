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
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private pieChart: any = null;
  private barChart: any = null;

  // summary object bound to template
  dashboardSummary: any = { totalIncome: 0, totalExpenses: 0, netBalance: 0 };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDashboardSummary();
  }

  // 🔹 GET /api/dashboard/summary
  fetchDashboardSummary(): void {
    const token = localStorage.getItem('jwt'); // assume JWT is stored after login
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get('http://localhost:5000/api/dashboard/summary', { headers })
      .subscribe({
        next: (res: any) => {
          console.log("Dashboard summary:", res);
          this.dashboardSummary = res;
          this.updateCharts(res);
        },
        error: (err) => {
          console.error("Error fetching dashboard summary:", err);
        }
      });
  }

  // 🔹 POST /api/transactions (example method)
  addTransaction(transaction: any): void {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:5000/api/transactions', transaction, { headers })
      .subscribe({
        next: (res) => console.log("Transaction saved:", res),
        error: (err) => console.error("Error saving transaction:", err)
      });
  }

  // 🔹 Update charts dynamically
  updateCharts(data: any): void {
    if (this.barChart) {
      this.barChart.data.datasets[0].data = [data.totalIncome];
      this.barChart.data.datasets[1].data = [data.totalExpenses];
      this.barChart.update();
    }
    if (this.pieChart) {
      this.pieChart.data.datasets[0].data = [
        data.totalExpenses,
        data.totalIncome - data.totalExpenses
      ];
      this.pieChart.update();
    }
  }

  ngAfterViewInit(): void {
    // Theme toggle remains the same...
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

    // Initialize static charts first (will be updated later by API)
    try {
      const Chart = (window as any).Chart;

      // Pie chart
      const pieCtx = (document.getElementById('pieChart') as HTMLCanvasElement).getContext('2d');
      this.pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: ['Expenses', 'Remaining'],
          datasets: [{
            data: [0, 0],
            backgroundColor: [
              getComputedStyle(document.documentElement).getPropertyValue('--pie-blue'),
              getComputedStyle(document.documentElement).getPropertyValue('--pie-green')
            ]
          }]
        },
        options: {
          plugins: { legend: { display: true } },
          responsive: true,
          maintainAspectRatio: false
        }
      });

      // Bar chart
      const barCtx = (document.getElementById('barChart') as HTMLCanvasElement).getContext('2d');
      this.barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['Summary'],
          datasets: [
            {
              label: 'Income',
              data: [0],
              backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--graph-income')
            },
            {
              label: 'Expenses',
              data: [0],
              backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--graph-expense')
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: {
                color: getComputedStyle(document.documentElement).getPropertyValue('--muted') || '#9aa8b8'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.03)' },
              ticks: {
                color: getComputedStyle(document.documentElement).getPropertyValue('--muted') || '#9aa8b8'
              }
            },
            x: {
              grid: { color: 'transparent' },
              ticks: {
                color: getComputedStyle(document.documentElement).getPropertyValue('--muted') || '#9aa8b8'
              }
            }
          }
        }
      });
    } catch (e) {
      console.warn('Chart initialization skipped — Chart.js not found globally.', e);
    }
  }

  ngOnDestroy(): void {
    try {
      if (this.pieChart) this.pieChart.destroy();
      if (this.barChart) this.barChart.destroy();
    } catch (e) {}
  }
}
