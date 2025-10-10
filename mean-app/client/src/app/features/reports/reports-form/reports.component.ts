import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';   
import { FormsModule } from '@angular/forms';     
import { RouterModule, Router } from '@angular/router';  // ✅ Import RouterModule + Router

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],  // ✅ Added RouterModule
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  // Sidebar & UI states
  sidebarActive = false;
  collapsed = false;

  // Form fields
  reportType: string = 'Income Statement';
  period: string = 'Current Month';
  format: string = 'PDF';

  // Mock user (for sidebar)
  currentUser = {
    fullName: 'Pavithra Yelluri',
    email: 'pavithra@example.com'
  };
  get userInitials() {
    return this.currentUser.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  // Recent reports list
  recentReports: any[] = [];

  constructor(private router: Router) {}

  // 🔹 Sidebar toggle
  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }

  // 🔹 Collapse sidebar
  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  // 🔹 Close overlay when clicked outside
  closeSidebarOverlay() {
    this.sidebarActive = false;
  }

  // 🔹 Navigate to dashboard
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // 🔹 Logout simulation
  logout() {
    alert('You have been logged out!');
    this.router.navigate(['/login']);
  }

  // 🔹 Generate new report
  generateReport() {
    const report = {
      name: this.reportType,
      generated: new Date().toLocaleString(),
      period: this.period,
      format: this.format
    };
    this.recentReports.push(report);
  }

  // 🔹 Reset form fields
  resetForm() {
    this.reportType = 'Income Statement';
    this.period = 'Current Month';
    this.format = 'PDF';
  }

  // 🔹 Simulate report download
  downloadReport(report: any) {
    console.log('Downloading report:', report);

    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute(
      'download',
      `${report.name}_${Date.now()}.json`
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}
