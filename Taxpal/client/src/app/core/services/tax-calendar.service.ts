import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';

export type TaxType = 'reminder' | 'payment';

export interface TaxCalendarItem {
  _id?: string;
  title: string;
  date: string | Date;
  note?: string;
  type: TaxType;
}

export interface TaxCalendarSection {
  monthLabel: string; // e.g. "June 2025"
  items: TaxCalendarItem[];
}

/** Backend event shape */
interface ApiEvent {
  _id: string;
  title: string;
  dueDate: string;
  description?: string;
  createdAt?: string;
}

interface ListResp {
  success: boolean;
  data?: ApiEvent[];
}

interface CreateResp {
  success: boolean;
  data?: ApiEvent;
}

interface DeleteResp {
  success: boolean;
  message?: string;
}

/** Bulk delete response */
interface DeleteManyResp {
  success: boolean;
  deletedCount?: number;
}

@Injectable({ providedIn: 'root' })
export class TaxCalendarService {
  private readonly base = '/api/v1/tax';

  constructor(private http: HttpClient) {}

  /** Get events from backend */
  getItems(): Observable<TaxCalendarItem[]> {
    return this.http.get<ListResp>(`${this.base}/calendar`).pipe(
      map((resp) => {
        const arr: ApiEvent[] = (resp?.success && Array.isArray(resp.data)) ? resp.data! : [];
        const mapped: TaxCalendarItem[] = arr.map((e) => ({
          _id: e._id,
          title: e.title,
          date: e.dueDate,
          note: e.description,
          // narrow the literal to TaxType so TS doesn't widen to string
          type: (/reminder/i.test(e.title) ? 'reminder' : 'payment') as TaxType,
        }));
        return mapped;
      }),
      catchError(() => of([] as TaxCalendarItem[]))
    );
  }

  /** Create an event in backend */
  addItem(item: { title: string; date: string | Date; note?: string }): Observable<TaxCalendarItem | null> {
    const payload = { title: item.title, dueDate: item.date, description: item.note ?? '' };
    return this.http.post<CreateResp>(`${this.base}/calendar`, payload).pipe(
      map((resp) => {
        if (!resp?.success || !resp.data) return null;
        const e = resp.data;
        const out: TaxCalendarItem = {
          _id: e._id,
          title: e.title,
          date: e.dueDate,
          note: e.description,
          type: (/reminder/i.test(e.title) ? 'reminder' : 'payment') as TaxType,
        };
        return out;
      }),
      catchError(() => of(null))
    );
  }

  /** Delete a single event */
  deleteItem(id: string): Observable<boolean> {
    return this.http.delete<DeleteResp>(`${this.base}/calendar/${id}`).pipe(
      map((r) => !!r?.success),
      catchError(() => of(false))
    );
  }

  /** ✅ Delete ALL reminder events (bulk) */
  deleteAllReminders(): Observable<number> {
    return this.http
      .delete<DeleteManyResp>(`${this.base}/calendar`, { params: { type: 'reminder' } })
      .pipe(
        map((r) => (r?.success ? (r.deletedCount ?? 0) : 0)),
        catchError(() => of(0))
      );
  }

  /** ✅ Mark a payment complete (just delete it server-side) */
  completePayment(id: string): Observable<boolean> {
    return this.deleteItem(id);
  }

  /** Group items by month label, preserving chronological order */
  groupByMonth(items: TaxCalendarItem[]): TaxCalendarSection[] {
    const sorted = [...items].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const buckets = new Map<string, TaxCalendarItem[]>();
    for (const it of sorted) {
      const d = new Date(it.date);
      const label = d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
      if (!buckets.has(label)) buckets.set(label, []);
      buckets.get(label)!.push(it);
    }

    return Array.from(buckets.entries()).map(([monthLabel, items]) => ({ monthLabel, items }));
  }
}
