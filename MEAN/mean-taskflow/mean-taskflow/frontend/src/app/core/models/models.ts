export interface User {
  _id: string;
  name: string;
  email: string;
  avatarColor: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  color: string;
  owner: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description: string;
  project: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: User | null;
  createdBy: User;
  dueDate: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  task: string;
  author: User;
  text: string;
  createdAt: string;
}

export interface PresenceUser {
  userId: string;
  name: string;
  avatarColor: string;
}
