import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TaskListComponent],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav class="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div class="max-w-5xl mx-auto flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-2xl">✅</span>
            <span class="text-xl font-bold tracking-tight text-slate-800">TaskFlow</span>
          </div>
          <div class="flex items-center gap-4 text-sm font-medium text-slate-600">
            <a href="#" class="hover:text-blue-600 transition-colors">My Tasks</a>
            <a href="#" class="hover:text-blue-600 transition-colors">Settings</a>
          </div>
        </div>
      </nav>
      <main class="py-8">
        <app-task-list></app-task-list>
      </main>
    </div>
  `
})
export class AppComponent {
  title = 'task-manager';
}
