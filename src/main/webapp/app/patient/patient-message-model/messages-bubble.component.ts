import { Component, computed, ElementRef, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChatMessage {
  id: string;
  sender: string;
  avatarInitials: string;
  preview: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-messages-bubbles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages-bubble.component.html',
  styleUrls: ['./messages-bubble.component.scss'],
})
export class MessagesBubblesComponent {
  open = signal(false);

  messages = signal<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'Dr. Sami Trabelsi',
      avatarInitials: 'ST',
      preview: 'Please bring your previous ECG results to the appointment.',
      time: '10m ago',
      read: false,
    },
    {
      id: 'm2',
      sender: 'Dr. Amel Karray',
      avatarInitials: 'AK',
      preview: 'Your prescription has been renewed for 3 months.',
      time: '3h ago',
      read: false,
    },
    {
      id: 'm3',
      sender: 'Clinique du Lac',
      avatarInitials: 'CL',
      preview: 'Your lab appointment has been confirmed for Monday.',
      time: 'Yesterday',
      read: true,
    },
  ]);

  unreadCount = computed(() => this.messages().filter(m => !m.read).length);

  constructor(private el: ElementRef<HTMLElement>) {}

  toggle(): void {
    this.open.update(v => !v);
  }

  markRead(id: string): void {
    this.messages.update(list => list.map(m => (m.id === id ? { ...m, read: true } : m)));
  }

  markAllRead(): void {
    this.messages.update(list => list.map(m => ({ ...m, read: true })));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.el.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
