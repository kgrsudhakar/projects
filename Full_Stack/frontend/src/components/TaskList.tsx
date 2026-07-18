import React, { useState, useEffect } from 'react';
import type { Task, CreateTaskRequest } from '../types';
import { taskApi } from '../api/client';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';

export const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const data = await taskApi.getAll();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (taskData: CreateTaskRequest) => {
    try {
      await taskApi.create(taskData);
      await fetchTasks();
    } catch (err) {
      setError('Failed to create task.');
    }
  };

  const handleToggle = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      await taskApi.update(id, { completed: !task.completed });
      await fetchTasks();
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await taskApi.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  if (error) {
    return <div className="p-4 text-red-600 bg-red-50 rounded-lg border border-red-200">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Todo List</h1>
        <p className="text-gray-600">Organize your day efficiently</p>
      </header>

      <TaskForm onSubmit={handleCreate} />

      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Loading tasks...</div>
      ) : (
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-gray-500">
              No tasks found. Start by adding some!
            </div>
          ) : (
            tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
