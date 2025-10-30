import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // ✅ Import added

@Component({
  selector: 'app-notifications',
  standalone: true, // Important for standalone components
  imports: [CommonModule, DatePipe], // Fix for *ngIf, *ngFor, and date pipe
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.css']
})
export class Notifications implements OnInit {
  notifications = [
    {
      _id: '1',
      title: 'Tax Reminder',
      message: 'Your quarterly tax filing is due in 3 days.',
      isRead: false,
      createdAt: new Date()
    },
    {
      _id: '2',
      title: 'New Feature!',
      message: 'We’ve added a new Tax Estimator tool. Check it out!',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5)
    },
    {
      _id: '3',
      title: 'Budget Alert',
      message: 'You’ve exceeded your budget limit for this month.',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
    }
  ];

  ngOnInit() {}

  markAsRead(id: string) {
    const notif = this.notifications.find(n => n._id === id);
    if (notif) notif.isRead = true;
  }
}