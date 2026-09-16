import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private http: HttpClient) {}

  list(): Observable<{ projects: Project[] }> {
    return this.http.get<{ projects: Project[] }>('/api/projects');
  }

  get(id: string): Observable<{ project: Project }> {
    return this.http.get<{ project: Project }>(`/api/projects/${id}`);
  }

  create(data: { name: string; description?: string; color?: string }): Observable<{ project: Project }> {
    return this.http.post<{ project: Project }>('/api/projects', data);
  }

  update(id: string, data: Partial<Project>): Observable<{ project: Project }> {
    return this.http.put<{ project: Project }>(`/api/projects/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/projects/${id}`);
  }

  addMember(id: string, email: string): Observable<{ project: Project }> {
    return this.http.post<{ project: Project }>(`/api/projects/${id}/members`, { email });
  }

  removeMember(id: string, userId: string): Observable<{ project: Project }> {
    return this.http.delete<{ project: Project }>(`/api/projects/${id}/members/${userId}`);
  }
}
