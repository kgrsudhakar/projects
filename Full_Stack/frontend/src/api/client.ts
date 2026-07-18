import axios from 'axios';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';

const API_URL = 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await client.get('/tasks/');
    return response.data;
  },
  create: async (data: CreateTaskRequest): Promise<Task> => {
    const response = await client.post('/tasks/', data);
    return response.data;
  },
  update: async (id: number, data: UpdateTaskRequest): Promise<Task> => {
    const response = await client.patch(`/tasks/${id}/`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await client.delete(`/tasks/${id}/`);
  },
};
