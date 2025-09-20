import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: string;
  name: string;
  email: string;
  country: string;
  income_bracket: 'low' | 'middle' | 'high';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest {
  name: string; email: string; password: string;
  country?: string; income_bracket?: 'low' | 'middle' | 'high';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api/v1/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { this.loadUserFromStorage(); }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(res => { this.setToken(res.token); this.currentUserSubject.next(res.user); this.saveUserToStorage(res.user); })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData).pipe(
      tap(res => { this.setToken(res.token); this.currentUserSubject.next(res.user); this.saveUserToStorage(res.user); })
    );
  }

  // NEW
  forgotPassword(email: string) {
    return this.http.post<{ message: string }>(`${this.API_URL}/forgot-password`, { email });
  }

  // NEW
  resetPassword(token: string, password: string) {
    return this.http.post<AuthResponse>(`${this.API_URL}/reset-password`, { token, password }).pipe(
      tap(res => { this.setToken(res.token); this.currentUserSubject.next(res.user); this.saveUserToStorage(res.user); })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null;
  }
  isAuthenticated(): boolean { return !!this.getToken(); }
  getCurrentUser(): User | null { return this.currentUserSubject.value; }

  private setToken(token: string): void { if (isPlatformBrowser(this.platformId)) localStorage.setItem('token', token); }
  private saveUserToStorage(user: User): void { if (isPlatformBrowser(this.platformId)) localStorage.setItem('user', JSON.stringify(user)); }
  private loadUserFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const token = this.getToken(); const userStr = localStorage.getItem('user');
    if (token && userStr) { try { this.currentUserSubject.next(JSON.parse(userStr)); } catch { this.logout(); } }
  }

  verifyToken(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.API_URL}/me`).pipe(
      tap(r => { this.currentUserSubject.next(r.user); this.saveUserToStorage(r.user); })
    );
  }
}
