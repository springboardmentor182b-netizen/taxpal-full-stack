
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor() {
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    this.isLoadingSubject.next(true);
    
    return new Observable(observer => {
      // Simulate API call
      setTimeout(() => {
        
        if (credentials.username && credentials.password) {
          const user: User = {
            id: '1',
            fullName: 'John Doe',
            email: 'john@example.com',
            username: credentials.username
          };
          
          // In a real app, don't store in localStorage for security
          // This is just for demo purposes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.isLoadingSubject.next(false);
          observer.next(user);
          observer.complete();
        } else {
          this.isLoadingSubject.next(false);
          observer.error({ message: 'Invalid credentials' });
        }
      }, 1500);
    });
  }

  signup(data: SignupRequest): Observable<User> {
    this.isLoadingSubject.next(true);
    
    return new Observable(observer => {
      // Simulate API call
      setTimeout(() => {
        if (data.password !== data.confirmPassword) {
          this.isLoadingSubject.next(false);
          observer.error({ message: 'Passwords do not match' });
          return;
        }
        
        const user: User = {
          id: '1',
          fullName: data.fullName,
          email: data.email,
          username: data.username
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isLoadingSubject.next(false);
        observer.next(user);
        observer.complete();
      }, 1500);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}