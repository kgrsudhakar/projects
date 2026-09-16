import { Component, OnDestroy, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, debounceTime, Subject } from 'rxjs';
import { Comment, PresenceUser, Project, Task, TaskStatus, User } from '../../core/models/models';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { SocketService } from '../../core/services/socket.service';

interface Column {
  key: TaskStatus;
  label: string;
  accent: string;
}

const COLUMNS: Column[] = [
  { key: 'todo', label: 'To do', accent: 'var(--ink-soft)' },
  { key: 'in-progress', label: 'In progress', accent: 'var(--accent-blue)' },
  { key: 'done', label: 'Done', accent: 'var(--accent-teal)' }
];

const PRIORITY_COLOR: Record<string, string> = {
  low: 'var(--ink-soft)',
  medium: 'var(--accent-amber)',
  high: 'var(--danger)'
};

@Component({
  selector: 'app-project-board',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './project-board.component.html',
  styleUrl: './project-board.component.scss'
})
export class ProjectBoardComponent implements OnInit, OnDestroy {
  columns = COLUMNS;
  priorityColor = PRIORITY_COLOR;

  projectId = '';
  project = signal<Project | null>(null);
  tasks = signal<Task[]>([]);
  presence = signal<PresenceUser[]>([]);
  loading = signal(true);

  showAddTask = signal<TaskStatus | null>(null);
  newTaskTitle = '';

  showInvite = signal(false);
  inviteEmail = '';
  inviteError = signal('');
  inviteBusy = signal(false);

  showSettings = signal(false);

  selectedTask = signal<Task | null>(null);
  comments = signal<Comment[]>([]);
  newComment = '';
  typingUsers = signal<string[]>([]);
  draggingTaskId: string | null = null;

  private typingSubject = new Subject<void>();
  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private taskService: TaskService,
    private socket: SocketService,
    public auth: AuthService
  ) {}

  tasksFor(status: TaskStatus) {
    return this.tasks()
      .filter((t) => t.status === status)
      .sort((a, b) => a.order - b.order);
  }

  isOwner = computed(() => this.project()?.owner._id === this.auth.currentUser()?._id);

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.loadProject();
    this.loadTasks();

    this.socket.connect();
    this.socket.joinProject(this.projectId);

    this.subs.push(
      this.socket.on<Project>('project:updated').subscribe((p) => {
        if (p._id === this.projectId) this.project.set(p);
      }),
      this.socket.on<{ _id: string }>('project:deleted').subscribe(({ _id }) => {
        if (_id === this.projectId) this.router.navigate(['/dashboard']);
      }),
      this.socket.on<Task>('task:created').subscribe((t) => {
        if (t.project === this.projectId && !this.tasks().some((x) => x._id === t._id)) {
          this.tasks.update((list) => [...list, t]);
        }
      }),
      this.socket.on<Task>('task:updated').subscribe((t) => this.upsertTask(t)),
      this.socket.on<Task>('task:moved').subscribe((t) => this.upsertTask(t)),
      this.socket.on<{ _id: string }>('task:deleted').subscribe(({ _id }) => {
        this.tasks.update((list) => list.filter((t) => t._id !== _id));
        if (this.selectedTask()?._id === _id) this.selectedTask.set(null);
      }),
      this.socket.on<PresenceUser[]>('presence:update').subscribe((list) => this.presence.set(list)),
      this.socket.on<{ taskId: string; comment: Comment }>('comment:created').subscribe(({ taskId, comment }) => {
        if (this.selectedTask()?._id === taskId && !this.comments().some((c) => c._id === comment._id)) {
          this.comments.update((list) => [...list, comment]);
        }
      }),
      this.socket.on<{ taskId: string; commentId: string }>('comment:deleted').subscribe(({ taskId, commentId }) => {
        if (this.selectedTask()?._id === taskId) {
          this.comments.update((list) => list.filter((c) => c._id !== commentId));
        }
      }),
      this.socket.on<{ taskId: string; user: { id: string; name: string } }>('typing:start').subscribe(({ taskId, user }) => {
        if (this.selectedTask()?._id === taskId) {
          this.typingUsers.update((list) => (list.includes(user.name) ? list : [...list, user.name]));
        }
      }),
      this.socket.on<{ taskId: string; user: { id: string; name: string } }>('typing:stop').subscribe(({ taskId, user }) => {
        if (this.selectedTask()?._id === taskId) {
          this.typingUsers.update((list) => list.filter((n) => n !== user.name));
        }
      }),
      this.typingSubject.pipe(debounceTime(1500)).subscribe(() => {
        const task = this.selectedTask();
        if (task) this.socket.emitTypingStop(this.projectId, task._id);
      })
    );
  }

  ngOnDestroy() {
    this.socket.leaveProject(this.projectId);
    this.subs.forEach((s) => s.unsubscribe());
  }

  private upsertTask(t: Task) {
    this.tasks.update((list) => (list.some((x) => x._id === t._id) ? list.map((x) => (x._id === t._id ? t : x)) : [...list, t]));
    if (this.selectedTask()?._id === t._id) this.selectedTask.set(t);
  }

  loadProject() {
    this.projectService.get(this.projectId).subscribe({
      next: ({ project }) => this.project.set(project),
      error: () => this.router.navigate(['/dashboard'])
    });
  }

  loadTasks() {
    this.loading.set(true);
    this.taskService.list(this.projectId).subscribe({
      next: ({ tasks }) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  initials(name: string): string {
    return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  // ---- Add task ----
  openAddTask(status: TaskStatus) {
    this.newTaskTitle = '';
    this.showAddTask.set(status);
  }

  submitAddTask() {
    const status = this.showAddTask();
    if (!status || !this.newTaskTitle.trim()) return;
    this.taskService.create(this.projectId, { title: this.newTaskTitle.trim(), status }).subscribe(({ task }) => {
      this.tasks.update((list) => (list.some((x) => x._id === task._id) ? list : [...list, task]));
      this.showAddTask.set(null);
    });
  }

  // ---- Drag and drop ----
  onDragStart(task: Task) {
    this.draggingTaskId = task._id;
  }

  onDrop(status: TaskStatus) {
    if (!this.draggingTaskId) return;
    const task = this.tasks().find((t) => t._id === this.draggingTaskId);
    this.draggingTaskId = null;
    if (!task || task.status === status) return;
    const order = this.tasksFor(status).length;
    this.taskService.move(task._id, status, order).subscribe(({ task: updated }) => this.upsertTask(updated));
  }

  moveTask(task: Task, status: TaskStatus) {
    if (task.status === status) return;
    const order = this.tasksFor(status).length;
    this.taskService.move(task._id, status, order).subscribe(({ task: updated }) => this.upsertTask(updated));
  }

  // ---- Task detail ----
  openTask(task: Task) {
    this.selectedTask.set(task);
    this.comments.set([]);
    this.typingUsers.set([]);
    this.taskService.getComments(task._id).subscribe(({ comments }) => this.comments.set(comments));
  }

  closeTask() {
    this.selectedTask.set(null);
    this.newComment = '';
  }

  updateSelectedTask(patch: Partial<Task>) {
    const task = this.selectedTask();
    if (!task) return;
    this.taskService.update(task._id, patch).subscribe(({ task: updated }) => this.upsertTask(updated));
  }

  deleteTask(task: Task) {
    if (!confirm(`Delete "${task.title}"? This can't be undone.`)) return;
    this.taskService.delete(task._id).subscribe(() => {
      this.tasks.update((list) => list.filter((t) => t._id !== task._id));
      this.closeTask();
    });
  }

  onCommentInput() {
    const task = this.selectedTask();
    if (!task) return;
    this.socket.emitTypingStart(this.projectId, task._id);
    this.typingSubject.next();
  }

  submitComment() {
    const task = this.selectedTask();
    if (!task || !this.newComment.trim()) return;
    this.taskService.addComment(task._id, this.newComment.trim()).subscribe(({ comment }) => {
      this.comments.update((list) => (list.some((c) => c._id === comment._id) ? list : [...list, comment]));
      this.newComment = '';
      this.socket.emitTypingStop(this.projectId, task._id);
    });
  }

  deleteComment(comment: Comment) {
    this.taskService.deleteComment(comment._id).subscribe(() => {
      this.comments.update((list) => list.filter((c) => c._id !== comment._id));
    });
  }

  // ---- Members / invite ----
  submitInvite() {
    if (!this.inviteEmail.trim()) return;
    this.inviteBusy.set(true);
    this.inviteError.set('');
    this.projectService.addMember(this.projectId, this.inviteEmail.trim()).subscribe({
      next: ({ project }) => {
        this.project.set(project);
        this.inviteEmail = '';
        this.inviteBusy.set(false);
        this.showInvite.set(false);
      },
      error: (err) => {
        this.inviteBusy.set(false);
        this.inviteError.set(err?.error?.message || 'Could not add that member.');
      }
    });
  }

  removeMember(userId: string) {
    if (!confirm('Remove this member from the project?')) return;
    this.projectService.removeMember(this.projectId, userId).subscribe(({ project }) => this.project.set(project));
  }

  deleteProject() {
    const project = this.project();
    if (!project) return;
    if (!confirm(`Delete "${project.name}" and all of its tasks? This can't be undone.`)) return;
    this.projectService.delete(project._id).subscribe(() => this.router.navigate(['/dashboard']));
  }

  isPresent(userId: string): boolean {
    return this.presence().some((p) => p.userId === userId);
  }
}
