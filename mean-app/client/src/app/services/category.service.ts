import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  _id?: string;
  name: string;
  type: 'expense' | 'income';
  color?: string;        // Added color property
  createdBy?: string;
  createdAt?: Date;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = 'http://localhost:3000/api/v1/categories';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getCategories(): Observable<{ success: boolean; data: Category[] }> {
    return this.http.get<{ success: boolean; data: Category[] }>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  addCategory(category: Category): Observable<any> {
    return this.http.post(this.apiUrl, category, { headers: this.getAuthHeaders() });
  }

  updateCategory(id: string, category: Partial<Category>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, category, { headers: this.getAuthHeaders() });
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
