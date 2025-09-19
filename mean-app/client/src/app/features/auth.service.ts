import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { catchError, map, finalize, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  token?: string;
  role?: string;
  emailVerified?: boolean;
  profilePicture?: string;
  lastLogin?: string;
}

export interface LoginRequest {
  email: string;        // Direct email field
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  message: string;
  expiresIn?: number;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  username: string;
  password: string;
  country: string;
}

export interface SignupResponse {
  user: User;
  token: string;
  refreshToken?: string;
  message: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: any;
  code?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';
  private readonly REMEMBER_ME_KEY = 'remember_me';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private tokenRefreshTimer: any;

  constructor(private http: HttpClient) {
    console.log('AuthService initialized with API URL:', this.API_URL);
    this.loadUserFromStorage();
  }

  /**
   * Test API connection
   */
  testConnection(): Observable<any> {
    console.log('Testing connection to:', `${this.API_URL}/auth/health`);
    return this.http.get(`${this.API_URL}/auth/health`).pipe(
      map(response => {
        console.log('Connection test successful:', response);
        return response;
      }),
      catchError(error => {
        console.error('Connection test failed:', error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Login user with credentials
   */
  login(credentials: LoginRequest): Observable<User> {
    console.log('Login attempt with:', { ...credentials, password: '[HIDDEN]' });
    console.log('API URL:', `${this.API_URL}/auth/login`);
    
    this.isLoadingSubject.next(true);
    
    // Send email directly to backend
    const requestData = {
      email: credentials.email,
      password: credentials.password,
      rememberMe: credentials.rememberMe
    };
    
    console.log('Sending to backend:', { ...requestData, password: '[HIDDEN]' });
    
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, requestData)
      .pipe(
        retry({
          count: 2,
          delay: (error) => {
            console.log('Login retry for error:', error.status);
            if (error.status === 500 || error.status === 0) {
              return timer(1000);
            }
            return throwError(() => error);
          }
        }),
        map(response => {
          console.log('Login successful:', response);
          const user = { ...response.user, token: response.token };
          this.setAuthData(user, response.token, response.refreshToken);
          
          // Store remember me preference
          if (credentials.rememberMe) {
            localStorage.setItem(this.REMEMBER_ME_KEY, 'true');
          }
          
          return user;
        }),
        catchError(this.handleError.bind(this)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  /**
   * Register new user
   */
  signup(userData: SignupRequest): Observable<User> {
    console.log('Signup attempt with:', { ...userData, password: '[HIDDEN]' });
    console.log('API URL:', `${this.API_URL}/auth/signup`);
    
    this.isLoadingSubject.next(true);
    
    return this.http.post<SignupResponse>(`${this.API_URL}/auth/signup`, userData)
      .pipe(
        retry({
          count: 2,
          delay: (error) => {
            console.log('Signup retry for error:', error.status);
            if (error.status === 500 || error.status === 0) {
              return timer(1000);
            }
            return throwError(() => error);
          }
        }),
        map(response => {
          console.log('Signup successful:', response);
          const user = { ...response.user, token: response.token };
          // Don't auto-login after signup, just return user data
          return user;
        }),
        catchError(this.handleError.bind(this)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  /**
   * Logout user and clear session
   */
  logout(): Observable<any> {
    this.isLoadingSubject.next(true);
    
    const token = this.getToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    
    return this.http.post(`${this.API_URL}/auth/logout`, {}, { headers })
      .pipe(
        finalize(() => {
          this.clearAuthData();
          this.clearTokenRefreshTimer();
          this.isLoadingSubject.next(false);
        }),
        catchError(() => {
          // Even if logout API fails, clear local data
          this.clearAuthData();
          this.clearTokenRefreshTimer();
          return throwError(() => new Error('Logout completed locally'));
        })
      );
  }

  /**
   * Request password reset
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/forgot-password`, { email })
      .pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Reset password with token
   */
  resetPassword(token: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/reset-password/${token}`, {
      newPassword: password,
      confirmPassword: confirmPassword
    }).pipe(
      retry(2),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    const token = this.getToken();
    return !!(user && token && !this.isTokenExpired());
  }

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY) || sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  }

  /**
   * Refresh authentication token (if your backend supports it)
   */
  refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<{token: string, expiresIn?: number}>(`${this.API_URL}/refresh`, {
      refreshToken
    }).pipe(
      map(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        return response.token;
      }),
      catchError(error => {
        // If refresh fails, logout user
        this.logout();
        return this.handleError(error);
      })
    );
  }

  /**
   * Private Methods
   */
  private setAuthData(user: User, token: string, refreshToken?: string): void {
    const storage = localStorage.getItem(this.REMEMBER_ME_KEY) ? localStorage : sessionStorage;
    
    storage.setItem(this.TOKEN_KEY, token);
    storage.setItem(this.USER_KEY, JSON.stringify(user));
    
    if (refreshToken) {
      storage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
    
    this.currentUserSubject.next(user);
  }

  private clearAuthData(): void {
    // Clear from both storages
    [localStorage, sessionStorage].forEach(storage => {
      storage.removeItem(this.TOKEN_KEY);
      storage.removeItem(this.USER_KEY);
      storage.removeItem(this.REFRESH_TOKEN_KEY);
      storage.removeItem(this.REMEMBER_ME_KEY);
    });
    
    this.currentUserSubject.next(null);
  }

  private loadUserFromStorage(): void {
    // Check localStorage first, then sessionStorage
    let token = localStorage.getItem(this.TOKEN_KEY);
    let userData = localStorage.getItem(this.USER_KEY);
    
    if (!token || !userData) {
      token = sessionStorage.getItem(this.TOKEN_KEY);
      userData = sessionStorage.getItem(this.USER_KEY);
    }
    
    if (token && userData && !this.isTokenExpired()) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearAuthData();
      }
    } else {
      this.clearAuthData();
    }
  }

  private clearTokenRefreshTimer(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred. Please try again.';
    
    console.error('Full HTTP Error Object:', error);
    console.error('Error Status:', error.status);
    console.error('Error URL:', error.url);
    console.error('Error Message:', error.message);
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client-side error:', error.error.message);
      errorMessage = error.error.message;
    } else {
      // Server-side error
      console.error('Server-side error. Status:', error.status);
      console.error('Error body:', error.error);
      
      switch (error.status) {
        case 400:
          errorMessage = error.error?.error || error.error?.message || 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = error.error?.error || error.error?.message || 'Invalid credentials. Please try again.';
          break;
        case 403:
          errorMessage = error.error?.error || error.error?.message || 'Access forbidden.';
          break;
        case 404:
          errorMessage = 'Service not found. Please verify your server is running.';
          break;
        case 409:
          errorMessage = error.error?.error || error.error?.message || 'User may already exist.';
          break;
        case 422:
          errorMessage = error.error?.error || error.error?.message || 'Validation error.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 0:
          errorMessage = `Unable to connect to server at ${this.API_URL}. Please check:
1. Your backend server is running
2. Your internet connection
3. CORS configuration`;
          break;
        default:
          errorMessage = error.error?.error || error.error?.message || `Error ${error.status}: ${error.statusText}`;
      }
    }

    console.error('Processed error message:', errorMessage);
    return throwError(() => ({ 
      message: errorMessage, 
      status: error.status,
      errors: error.error?.errors 
    }));
  }
}