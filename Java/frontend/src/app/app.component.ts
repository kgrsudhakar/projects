import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TaskListComponent],
  template: `
    <div class="min-h-screen bg-gray-100">
      <app-task-list></app-task-list>
    </div>
  `
})
export class AppComponent {
  title = 'task-manager';
}
