import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow border border-gray-200">
      <div class="flex items-center gap-3">
        <input
          type="checkbox"
          [checked]="task.completed"
          (change)="onToggle.emit()"
          class="w-5 h-5 cursor-pointer">
        <span [class.line-through]="task.completed" class="text-lg text-gray-700">
          {{ task.title }}
        </span>
      </div>
      <button
        (click)="onDelete.emit()"
        class="text-red-500 hover:text-red-700 font-medium">
        Delete
      </button>
    </div>
  `
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() onToggle = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();
}
