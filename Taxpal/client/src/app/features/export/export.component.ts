import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ExportService } from '@/app/core/services/export.service';

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [CommonModule],
  providers: [ExportService],
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent {
  @Input() data: any[] = [];
  @Input() fileName = 'data';
  menuOpen = false;

  constructor(private exportservice: ExportService, private location: Location) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

   exportAsCSV() {
    this.exportservice.exportCSV().subscribe(blob => {
      this.downloadBlob(blob, `${this.fileName}.csv`);
    });
    this.menuOpen = false;
  }

  exportAsExcel() {
    this.exportservice.exportExcel().subscribe(blob => {
      this.downloadBlob(blob, `${this.fileName}.xlsx`);
    });
    this.menuOpen = false;
  }

  private downloadBlob(blob: Blob, fileName: string) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  exportAsCSV1() {
    this.exportservice.downloadCSV(this.data, this.fileName);
    this.menuOpen = false;
  }

  exportAsPDF() {
    this.exportservice.downloadPDF(this.data, this.fileName);
    this.menuOpen = false;
  }

  printPage() {
    window.print();
  }

  goBack() {
    this.location.back();
  }
}
