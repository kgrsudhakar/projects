import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment, Task } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}

  list(projectId: string): Observable<{ tasks: Task[] }> {
    return this.http.get<{ tasks: Task[] }>(`/api/tasks/project/${projectId}`);
  }

  create(projectId: string, data: Partial<Task>): Observable<{ task: Task }> {
    return this.http.post<{ task: Task }>(`/api/tasks/project/${projectId}`, data);
  }

  update(id: string, data: Partial<Task>): Observable<{ task: Task }> {
    return this.http.put<{ task: Task }>(`/api/tasks/${id}`, data);
  }

  move(id: string, status: string, order: number): Observable<{ task: Task }> {
    return this.http.patch<{ task: Task }>(`/api/tasks/${id}/move`, { status, order });
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/tasks/${id}`);
  }

  getComments(taskId: string): Observable<{ comments: Comment[] }> {
    return this.http.get<{ comments: Comment[] }>(`/api/comments/task/${taskId}`);
  }

  addComment(taskId: string, text: string): Observable<{ comment: Comment }> {
    return this.http.post<{ comment: Comment }>(`/api/comments/task/${taskId}`, { text });
  }

  deleteComment(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/comments/${id}`);
  }
}
