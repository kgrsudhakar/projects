import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null;

  constructor(private auth: AuthService) {}

  connect(): Socket {
    if (this.socket?.connected) return this.socket;
    this.socket = io('/', {
      auth: { token: this.auth.getToken() },
      transports: ['websocket', 'polling']
    });
    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  joinProject(projectId: string) {
    this.connect().emit('project:join', projectId);
  }

  leaveProject(projectId: string) {
    this.socket?.emit('project:leave', projectId);
  }

  emitTypingStart(projectId: string, taskId: string) {
    this.socket?.emit('typing:start', { projectId, taskId });
  }

  emitTypingStop(projectId: string, taskId: string) {
    this.socket?.emit('typing:stop', { projectId, taskId });
  }

  on<T = any>(event: string): Observable<T> {
    return new Observable((subscriber) => {
      const s = this.connect();
      const handler = (payload: T) => subscriber.next(payload);
      s.on(event, handler);
      return () => s.off(event, handler);
    });
  }
}
