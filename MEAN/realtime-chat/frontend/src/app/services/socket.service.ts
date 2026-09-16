import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ChatMessage } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.socketUrl, { autoConnect: true });
  }

  joinRoom(room: string, username: string): void {
    this.socket.emit('join_room', { room, username });
  }

  sendMessage(payload: ChatMessage): void {
    this.socket.emit('send_message', payload);
  }

  setTyping(room: string, username: string, isTyping: boolean): void {
    this.socket.emit('typing', { room, username, isTyping });
  }

  onReceiveMessage(): Observable<ChatMessage> {
    return new Observable((subscriber) => {
      this.socket.on('receive_message', (msg: ChatMessage) => subscriber.next(msg));
    });
  }

  onPresenceUpdate(): Observable<string[]> {
    return new Observable((subscriber) => {
      this.socket.on('presence_update', (users: string[]) => subscriber.next(users));
    });
  }

  onSystemMessage(): Observable<string> {
    return new Observable((subscriber) => {
      this.socket.on('system_message', (msg: string) => subscriber.next(msg));
    });
  }

  onTypingUpdate(): Observable<{ username: string; isTyping: boolean }> {
    return new Observable((subscriber) => {
      this.socket.on('typing_update', (data) => subscriber.next(data));
    });
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
