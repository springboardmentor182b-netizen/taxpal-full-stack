import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BudgetDto {
    id?: string;
    _id?: string;
    user_id?: string;
    category: string;
    limit: number;
    month: string; // YYYY-MM
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class BudgetService {
    private readonly baseUrl = '/api/budget';

    constructor(private http: HttpClient) { }

    getBudgets(): Observable<BudgetDto[]> {
        return this.http.get<BudgetDto[]>(this.baseUrl, { withCredentials: true });
    }

    createBudget(payload: BudgetDto): Observable<BudgetDto> {
        return this.http.post<BudgetDto>(this.baseUrl, payload, { withCredentials: true });
    }

    updateBudget(id: string, payload: Partial<BudgetDto>): Observable<BudgetDto> {
        return this.http.put<BudgetDto>(`${this.baseUrl}/${id}`, payload, { withCredentials: true });
    }

    deleteBudget(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, { withCredentials: true });
    }
}


