import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Category {
  _id?: string;
  id?: number;
  name: string;
  type: 'expense' | 'income';
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  // ✅ Match server prefix and let the proxy handle the port
  private apiUrl = '/api/v1/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  createCategory(category: Pick<Category, 'name' | 'type'>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(catchError(this.handleError));
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category).pipe(catchError(this.handleError));
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    const msg = error?.error?.message || error.message || 'Request failed';
    console.error('[CategoryService] error:', msg, error);
    return throwError(() => msg);
  }
}
