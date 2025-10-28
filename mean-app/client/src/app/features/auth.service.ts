
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { catchError, map, finalize, retry, retryWhen, delayWhen } from 'rxjs/operators';
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
  email: string;
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
  confirmPassword: string;
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
    this.loadUserFromStorage();
    this.setupTokenRefresh();
  }

  /**
   * Login user with credentials
   */
    login(credentials: LoginRequest): Observable<LoginResponse>
   {
      this.isLoadingSubject.next(true);
      
      return this.http.post<{ user: User; token: string; message: string; refreshToken?: string; expiresIn?: number }>(`${this.API_URL}/user/login`, credentials)
        .pipe(
          retry({
            count: 2,
            delay: (error) => {
              if (error.status === 500 || error.status === 0) {
                return timer(1000); // Retry after 1 second for server errors
              }
              return throwError(() => error);
            }
          }),
          map(response => {
            const user = { ...response.user, token: response.token };
            this.setAuthData(user, response.token, response.refreshToken);
            
            // Set up auto token refresh if expires_in is provided
            if (response.expiresIn) {
              this.setupTokenRefresh(response.expiresIn);
            }

            // Store remember me preference
            if (credentials.rememberMe) {
              localStorage.setItem(this.REMEMBER_ME_KEY, 'true');
            }
            
            return { user, token: response.token, refreshToken: response.refreshToken, message: response.message, expiresIn: response.expiresIn };
          }),
          catchError(this.handleError.bind(this)),
          finalize(() => this.isLoadingSubject.next(false))
        );
    }

  /**
   * Register new user
   */
  signup(userData: SignupRequest): Observable<User> {
    this.isLoadingSubject.next(true);
    
    return this.http.post<SignupResponse>(`${this.API_URL}/user/register`, userData)
      .pipe(
        retry({
          count: 2,
          delay: (error) => {
            if (error.status === 500 || error.status === 0) {
              return timer(1000);
            }
            return throwError(() => error);
          }
        }),
        map(response => {
          const user = { ...response.user, token: response.token };
          // this.setAuthData(user, response.token, response.refreshToken);
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
   * Refresh authentication token
   */
  refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<{token: string, expiresIn?: number}>(`${this.API_URL}/auth/refresh`, {
      refreshToken
    }).pipe(
      map(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        
        // Setup next refresh
        if (response.expiresIn) {
          this.setupTokenRefresh(response.expiresIn);
        }
        
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
   * Verify email address
   */
  verifyEmail(token: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/verify-email`, { token })
      .pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Request password reset
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/user/request-reset`, { email })
      .pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Reset password with token
   */
  resetPassword(token: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/user/reset-password/${token}`, {
      password,
      confirmPassword
    });
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
   * Backwards-compatible alias for components expecting isLoggedIn()
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
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

  // Remove accidental whitespace
  const cleanToken = token.trim();

  // Check if token looks like a JWT
  const parts = cleanToken.split('.');
  if (parts.length !== 3) {
    console.warn('Token is not a valid JWT:', token);
    return true;
  }

  try {
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return true; // no expiration field
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
}


  /**
   * Update user profile
   */
  updateProfile(userData: Partial<User>): Observable<User> {
    this.isLoadingSubject.next(true);
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.put<{user: User}>(`${this.API_URL}/auth/profile`, userData, { headers })
      .pipe(
        map(response => {
          const updatedUser = response.user;
          this.updateStoredUser(updatedUser);
          return updatedUser;
        }),
        catchError(this.handleError.bind(this)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  /**
   * Change password
   */
  changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    this.isLoadingSubject.next(true);
    
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post(`${this.API_URL}/auth/change-password`, {
      currentPassword,
      newPassword,
      confirmPassword
    }, { headers }).pipe(
      catchError(this.handleError.bind(this)),
      finalize(() => this.isLoadingSubject.next(false))
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

  private updateStoredUser(user: User): void {
    const storage = localStorage.getItem(this.USER_KEY) ? localStorage : sessionStorage;
    storage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
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

  private setupTokenRefresh(expiresIn?: number): void {
    this.clearTokenRefreshTimer();
    
    if (!expiresIn) {
      // Default to refresh 5 minutes before expiration if not provided
      const token = this.getToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          expiresIn = payload.exp * 1000 - Date.now();
        } catch (error) {
          console.error('Error parsing token for refresh setup:', error);
          return;
        }
      }
    }

    if (expiresIn && expiresIn > 300000) { // Only setup if more than 5 minutes
      // Refresh 5 minutes before expiration
      const refreshTime = expiresIn - 300000;
      
      this.tokenRefreshTimer = setTimeout(() => {
        this.refreshToken().subscribe({
          error: (error) => {
            console.error('Auto token refresh failed:', error);
            this.logout();
          }
        });
      }, refreshTime);
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
    let errorCode = '';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = error.error?.message || 'Invalid credentials. Please try again.';
          errorCode = 'INVALID_CREDENTIALS';
          // Don't clear auth data here for login failures
          break;
        case 403:
          errorMessage = error.error?.message || 'Access forbidden. You do not have permission.';
          errorCode = 'ACCESS_FORBIDDEN';
          break;
        case 404:
          errorMessage = 'Service not found. Please try again later.';
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflict. User may already exist.';
          errorCode = 'USER_EXISTS';
          break;
        case 422:
          errorMessage = error.error?.message || 'Validation error. Please check your input.';
          errorCode = 'VALIDATION_ERROR';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          errorCode = 'RATE_LIMIT';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          errorCode = 'SERVER_ERROR';
          break;
        case 0:
          errorMessage = 'Network error. Please check your connection.';
          errorCode = 'NETWORK_ERROR';
          break;
        default:
          errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
      }
    }

    console.error('Auth Service Error:', error);
    return throwError(() => ({ 
      message: errorMessage, 
      status: error.status,
      code: errorCode,
      errors: error.error?.errors 
    }));
  }
}