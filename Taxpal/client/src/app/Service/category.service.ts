import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Category {
  _id?: string;
  id?: number; // For temporary frontend use
  name: string;
  type: 'expense' | 'income';
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:5000/api/categories'; // Adjust port if needed

  constructor(private http: HttpClient) {}

  // Get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Create a new category
  createCategory(category: Omit<Category, '_id' | 'id'>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category)
      .pipe(catchError(this.handleError));
  }

  // Update a category
  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category)
      .pipe(catchError(this.handleError));
  }

  // Delete a category
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}