import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from './task.service';
import { Task } from './task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  private service = inject(TaskService);

  tasks: Task[] = [];
  title = '';
  description = '';
  loading = false;
  error = '';

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: t => {
        this.tasks = t;
        this.loading = false
      },
      error: e => {
        this.error = e.error?.message || 'Cannot connect to API';
        this.loading = false
      }
    })
  }
  add() {
    if (!this.title.trim()) return;
    this.service.create({
      title: this.title,
      description: this.description
    }).subscribe({
      next: t => {
        this.tasks = [t, ...this.tasks];
        this.title = '';
        this.description = ''
      },
      error: e => this.error = e.error?.message || 'Create failed'
    })
  }
  toggle(t: Task) {
    this.service.update(t._id, { completed: !t.completed }).subscribe({
      next: u => t.completed = u.completed,
      error: e => this.error = e.error?.message || 'Update failed'
    })
  }
  remove(t: Task) {
    this.service.delete(t._id).subscribe({
      next: () => this.tasks = this.tasks.filter(x => x._id !== t._id),
      error: e => this.error = e.error?.message || 'Delete failed'
    })
  }
}
