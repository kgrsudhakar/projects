import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);

  private api = 'http://localhost:5000/api/tasks';

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.api);
  }

  create(data: Pick<Task, 'title' | 'description'>): Observable<Task> {
    return this.http.post<Task>(this.api, data);
  }

  update(id: string, data: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.api}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
