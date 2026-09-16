import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { ChatService } from '../services/chat.service';
import { ChatMessage } from '../models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('scrollAnchor') scrollAnchor?: ElementRef<HTMLDivElement>;

  room = 'general';
  username = '';
  joined = false;

  draft = '';
  messages: ChatMessage[] = [];
  onlineUsers: string[] = [];
  systemMessages: string[] = [];
  typingUsers = new Set<string>();

  private typingSubject = new Subject<boolean>();
  private subscriptions: Subscription[] = [];

  constructor(private socketService: SocketService, private chatService: ChatService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.socketService.onReceiveMessage().subscribe((msg) => {
        this.messages.push(msg);
        this.scrollToBottom();
      }),

      this.socketService.onPresenceUpdate().subscribe((users) => {
        this.onlineUsers = users;
      }),

      this.socketService.onSystemMessage().subscribe((text) => {
        this.systemMessages.push(text);
        setTimeout(() => {
          this.systemMessages.shift();
        }, 4000);
      }),

      this.socketService.onTypingUpdate().subscribe(({ username, isTyping }) => {
        if (isTyping) {
          this.typingUsers.add(username);
        } else {
          this.typingUsers.delete(username);
        }
      }),

      // Debounce outgoing "typing" events so we don't flood the socket on every keystroke.
      this.typingSubject.pipe(debounceTime(300)).subscribe((isTyping) => {
        this.socketService.setTyping(this.room, this.username, isTyping);
      })
    );
  }

  join(): void {
    if (!this.username.trim()) return;

    this.joined = true;
    this.socketService.joinRoom(this.room, this.username.trim());

    this.chatService.getHistory(this.room).subscribe((history) => {
      this.messages = history;
      this.scrollToBottom();
    });
  }

  send(): void {
    const text = this.draft.trim();
    if (!text) return;

    this.socketService.sendMessage({ room: this.room, username: this.username, text });
    this.draft = '';
    this.typingSubject.next(false);
  }

  onTyping(): void {
    this.typingSubject.next(this.draft.length > 0);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.scrollAnchor?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }

  get typingLabel(): string {
    const others = Array.from(this.typingUsers).filter((u) => u !== this.username);
    if (others.length === 0) return '';
    return `${others.join(', ')} ${others.length === 1 ? 'is' : 'are'} typing...`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
