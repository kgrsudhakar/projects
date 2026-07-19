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
      <input
        #titleInput
        type="text"
        placeholder="What needs to be done?"
        class="flex-1 p-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        required>
      <button
        type="submit"
        class="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-md hover:shadow-lg">
        Add Task
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
