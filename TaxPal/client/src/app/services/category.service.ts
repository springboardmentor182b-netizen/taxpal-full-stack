import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Category {
  _id?: string;
  name: string;
  type: 'income' | 'expense';
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = '/api/categories';
  
  constructor(private http: HttpClient) { }
  
  // Get all categories for a user
  getUserCategories(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`).pipe(
      catchError(this.handleError('getUserCategories', { success: false, data: null }))
    );
  }
  
  // Add a single category
  addCategory(userId: string, category: Category): Observable<any> {
    const payload = { userId, ...category };
    return this.http.post(this.baseUrl, payload).pipe(
      catchError(this.handleError('addCategory', null))
    );
  }
  
  // Save multiple categories at once
  saveCategories(userId: string, categories: Category[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/batch`, { userId, categories }).pipe(
      catchError(this.handleError('saveCategories', null))
    );
  }
  
  // Update a category
  updateCategory(categoryId: string, categoryData: Partial<Category>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${categoryId}`, categoryData).pipe(
      catchError(this.handleError('updateCategory', null))
    );
  }
  
  // Delete a category
  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${categoryId}`).pipe(
      catchError(this.handleError('deleteCategory', null))
    );
  }
  
  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      // Return a safe result or rethrow
      return of(result as T);
    };
  }
}
