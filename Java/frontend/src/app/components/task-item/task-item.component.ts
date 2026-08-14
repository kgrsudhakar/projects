import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-200 transition-all hover:border-blue-300 hover:shadow-md">
      <div class="flex items-center gap-4">
        <div class="relative flex items-center">
          <input
            type="checkbox"
            [checked]="task.completed"
            (change)="onToggle.emit()"
            class="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-full checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <svg class="absolute w-4 h-4 text-white pointer-events-none hidden peer-checked:block left-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <div class="flex flex-col">
          <span [class.line-through]="task.completed" [class.text-slate-400]="task.completed" class="text-lg font-medium text-slate-700 transition-all">
            {{ task.title }}
          </span>
          <span *ngIf="task.completed" class="text-xs font-bold text-green-600 uppercase tracking-wider">Completed</span>
        </div>
      </div>
      <button
        (click)="onDelete.emit()"
        class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
    </div>
  `
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() onToggle = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();
}
