import { Component } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [],
  template: `
    <form (submit)="onSubmit($event)" class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <input
          #titleInput
          type="text"
          placeholder="What needs to be done?"
          class="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all text-slate-700 placeholder-slate-400"
          required>
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xl">✍️</span>
      </div>
      <button
        type="submit"
        class="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md hover:shadow-blue-200 flex items-center justify-center gap-2">
        <span>Add Task</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
      </button>
    </form>
  `
})
export class TaskFormComponent {
  @Output() taskAdded = new EventEmitter<void>();

  constructor(private taskService: TaskService) {}

  onSubmit(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLFormElement;
    const title = (input.querySelector('input') as HTMLInputElement).value;

    const newTask: Task = {
      title: title,
      description: '',
      completed: false
    };

    this.taskService.createTask(newTask).subscribe(() => {
      this.taskAdded.emit();
      (input.querySelector('input') as HTMLInputElement).value = '';
    });
  }
}
