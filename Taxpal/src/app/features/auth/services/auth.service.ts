import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, User, AuthState } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api/v1/auth';
  
  // Signals for reactive state management
  private userSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Public observables
  public user$ = this.userSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  // Computed signals
  public isAuthenticated = computed(() => !!this.tokenSubject.value);
  public currentUser = computed(() => this.userSubject.value);

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      this.tokenSubject.next(token);
      this.userSubject.next(JSON.parse(user));
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          this.tokenSubject.next(response.token);
          this.userSubject.next(response.user);
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.loadingSubject.next(false);
        }),
        catchError(error => {
          this.errorSubject.next(error.error?.message || 'Login failed');
          this.loadingSubject.next(false);
          return of(null as any);
        })
      );
  }

  register(userData: RegisterRequest): Observable<LoginResponse> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.post<LoginResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(response => {
          this.tokenSubject.next(response.token);
          this.userSubject.next(response.user);
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.loadingSubject.next(false);
        }),
        catchError(error => {
          this.errorSubject.next(error.error?.message || 'Registration failed');
          this.loadingSubject.next(false);
          return of(null as any);
        })
      );
  }

  logout(): void {
    this.tokenSubject.next(null);
    this.userSubject.next(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/refresh`, {})
      .pipe(
        tap(response => {
          this.tokenSubject.next(response.token);
          this.userSubject.next(response.user);
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        })
      );
  }

  getAuthState(): AuthState {
    return {
      isAuthenticated: this.isAuthenticated(),
      user: this.currentUser(),
      token: this.tokenSubject.value,
      loading: this.loadingSubject.value,
      error: this.errorSubject.value
    };
  }
}
