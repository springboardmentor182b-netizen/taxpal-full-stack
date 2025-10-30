import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './security.html',
  styleUrls: ['./security.css']
})
export class Security {
  lastPasswordChange = new Date(Date.now() - 1000 * 60 * 60 * 24 * 45); // 45 days ago
  twoFactorEnabled = true;
  trustedDevices = [
    { name: 'Chrome on Windows', lastUsed: '2025-10-25 10:35 AM' },
    { name: 'Safari on iPhone', lastUsed: '2025-10-21 8:10 PM' },
  ];

  toggleTwoFactor() {
    this.twoFactorEnabled = !this.twoFactorEnabled;
  }

  revokeDevice(device: any) {
    this.trustedDevices = this.trustedDevices.filter(d => d !== device);
  }
}