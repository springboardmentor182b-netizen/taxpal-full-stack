import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private socket = io('http://localhost:5000');
  private apiUrl = 'http://localhost:5000/api/notifications';

  constructor(private http: HttpClient) {}

  listenForNotifications(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('notification', (data) => subscriber.next(data));
    });
  }

  getUserNotifications(userId: string) {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  markAsRead(id: string) {
    return this.http.put(`${this.apiUrl}/${id}/read`, {});
  }
}
