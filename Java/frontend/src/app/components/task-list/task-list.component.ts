import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, TaskItemComponent],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <header class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight mb-1">
            My Daily Goals
          </h1>
          <p class="text-slate-500">Stay focused and crush your tasks today.</p>
        </div>

        <div class="flex gap-3 text-sm">
          <div class="bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm font-medium text-slate-600">
            Total: <span class="text-slate-900">{{ tasks.length }}</span>
          </div>
          <div class="bg-green-50 px-3 py-1 rounded-full border border-green-100 shadow-sm font-medium text-green-700">
            Done: <span class="text-green-900">{{ getCompletedCount() }}</span>
          </div>
        </div>
      </header>

      <section class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-10 transition-all hover:shadow-md">
        <app-task-form (taskAdded)="refreshTasks()"></app-task-form>
      </section>

      <div class="grid gap-3">
        <app-task-item
          *ngFor="let task of tasks"
          [task]="task"
          (onToggle)="handleToggle(task)"
          (onDelete)="handleDelete(task.id!)">
        </app-task-item>
      </div>

      <div *ngIf="tasks.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">🍃</div>
        <h3 class="text-slate-800 font-semibold text-xl mb-1">All clear!</h3>
        <p class="text-slate-400">No pending tasks. Time to relax or plan something new.</p>
      </div>
    </div>
  `
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.refreshTasks();
  }

  refreshTasks(): void {
    this.taskService.getTasks().subscribe(data => this.tasks = data);
  }

  handleToggle(task: Task): void {
    task.completed = !task.completed;
    this.taskService.updateTask(task.id!, task).subscribe(() => this.refreshTasks());
  }

  handleDelete(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => this.refreshTasks());
  }

  getCompletedCount(): number {
    return this.tasks.filter(t => t.completed).length;
  }
}
