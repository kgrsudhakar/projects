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
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <header class="mb-10 text-center sm:text-left">
          <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            📋 Task Manager
          </h1>
          <p class="text-gray-600">Keep track of your daily goals and stay productive.</p>
        </header>

        <section class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <app-task-form (taskAdded)="refreshTasks()"></app-task-form>
        </section>

        <div class="space-y-3">
          <app-task-item
            *ngFor="let task of tasks"
            [task]="task"
            (onToggle)="handleToggle(task)"
            (onDelete)="handleDelete(task.id!)">
          </app-task-item>
        </div>

        <div *ngIf="tasks.length === 0" class="text-center py-12">
          <p class="text-gray-400 text-lg italic">No tasks found. Add some to get started!</p>
        </div>
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
}
