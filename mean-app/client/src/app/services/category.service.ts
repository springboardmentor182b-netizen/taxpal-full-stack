import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  _id?: string;            // user-created categories will have _id
  name: string;
  type: 'income' | 'expense';
  createdBy?: string;
  createdAt?: string;
  isDefault?: boolean;     // helps identify default categories
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`; // backend base URL

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getCategories(): Observable<{ success: boolean; data: Category[] }> {
    return this.http.get<{ success: boolean; data: Category[] }>(this.apiUrl, this.getAuthHeaders());
  }

  addCategory(category: Category): Observable<{ success: boolean; data: Category }> {
    return this.http.post<{ success: boolean; data: Category }>(this.apiUrl, category, this.getAuthHeaders());
  }

  updateCategory(id: string, category: Category): Observable<{ success: boolean; data: Category }> {
    return this.http.put<{ success: boolean; data: Category }>(
      `${this.apiUrl}/${id}`,
      category,
      this.getAuthHeaders()
    );
  }

  deleteCategory(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/${id}`,
      this.getAuthHeaders()
    );
  }
}
