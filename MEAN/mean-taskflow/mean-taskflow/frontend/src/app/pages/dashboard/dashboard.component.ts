import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from '../../core/models/models';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import { SocketService } from '../../core/services/socket.service';

const PALETTE = ['#3e6ae1', '#e8a33d', '#2f8f7a', '#d6455a', '#8355e8', '#0f9bb8'];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  projects = signal<Project[]>([]);
  loading = signal(true);
  showCreate = signal(false);
  creating = signal(false);
  newName = '';
  newDescription = '';
  errorMsg = signal('');

  private subs: Subscription[] = [];

  constructor(
    private projectService: ProjectService,
    public auth: AuthService,
    private socket: SocketService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchProjects();
    this.socket.connect();

    this.subs.push(
      this.socket.on<Project>('project:created').subscribe((p) => {
        if (!this.projects().some((existing) => existing._id === p._id)) {
          this.projects.update((list) => [p, ...list]);
        }
      }),
      this.socket.on<Project>('project:updated').subscribe((p) => {
        this.projects.update((list) => list.map((x) => (x._id === p._id ? p : x)));
      }),
      this.socket.on<{ _id: string }>('project:deleted').subscribe(({ _id }) => {
        this.projects.update((list) => list.filter((x) => x._id !== _id));
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }

  fetchProjects() {
    this.loading.set(true);
    this.projectService.list().subscribe({
      next: ({ projects }) => {
        this.projects.set(projects);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openCreate() {
    this.newName = '';
    this.newDescription = '';
    this.errorMsg.set('');
    this.showCreate.set(true);
  }

  createProject() {
    if (!this.newName.trim()) {
      this.errorMsg.set('Give your project a name.');
      return;
    }
    this.creating.set(true);
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    this.projectService.create({ name: this.newName.trim(), description: this.newDescription.trim(), color }).subscribe({
      next: ({ project }) => {
        this.creating.set(false);
        this.showCreate.set(false);
        this.router.navigate(['/projects', project._id]);
      },
      error: (err) => {
        this.creating.set(false);
        this.errorMsg.set(err?.error?.message || 'Could not create project.');
      }
    });
  }

  openProject(id: string) {
    this.router.navigate(['/projects', id]);
  }

  initials(name: string): string {
    return name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  logout() {
    this.socket.disconnect();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
