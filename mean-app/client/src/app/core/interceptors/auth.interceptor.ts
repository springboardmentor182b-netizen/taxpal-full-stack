
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service
    const authToken = this.authService.getToken();

    let authReq = req;
    if (authToken && !this.isPublicRoute(req.url)) {
      authReq = this.addTokenHeader(req, authToken);
    }


    authReq = authReq.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isPublicRoute(req.url)) {
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }
  private isPublicRoute(url: string): boolean {
    const publicRoutes = [
      '/user/login',
      '/user/register',
      '/user/forgot-password',
      '/user/request-reset',
      '/user/reset-password/:token'
    ];  
    return publicRoutes.some(route => url.includes(route));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.authService.getRefreshToken();
      
      if (refreshToken) {
        return this.authService.refreshToken().pipe(
          switchMap((token: string) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token);
            
            return next.handle(this.addTokenHeader(request, token));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.authService.logout().subscribe();
            this.router.navigate(['/features/login']);
            return throwError(() => error);
          })
        );
      } else {
        this.isRefreshing = false;
        this.authService.logout().subscribe();
        this.router.navigate(['/features/login']);
        return throwError(() => new Error('No refresh token available'));
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }
}