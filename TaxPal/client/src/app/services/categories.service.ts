import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoryDto {
  _id?: string;
  name: string;
  description?: string;
  type: 'expense' | 'income';
  isActive?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly baseUrl = '/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(type?: 'expense' | 'income', q?: string): Observable<CategoryDto[]> {
    let url = this.baseUrl;
    const params: any = {};
    if (type) params.type = type;
    if (q) params.q = q;
    return this.http.get<CategoryDto[]>(url, { params, withCredentials: true });
  }

  createCategory(category: Partial<CategoryDto>): Observable<CategoryDto> {
    return this.http.post<CategoryDto>(this.baseUrl, category, { withCredentials: true });
  }

  updateCategory(id: string, category: Partial<CategoryDto>): Observable<CategoryDto> {
    return this.http.put<CategoryDto>(`${this.baseUrl}/${id}`, category, { withCredentials: true });
  }

  deleteCategory(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
}
