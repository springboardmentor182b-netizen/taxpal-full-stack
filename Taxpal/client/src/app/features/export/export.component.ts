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
