import { Component, computed, ElementRef, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type NotificationType = 'appointment' | 'lab' | 'message' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-notifications-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-bell.component.html',
  styleUrls: ['./notifications-bell.component.scss'],
})
export class NotificationsBellComponent {
  open = signal(false);

  notifications = signal<AppNotification[]>([
    {
      id: 'n1',
      type: 'appointment',
      title: 'Upcoming appointment',
      message: 'Dr. Sami Trabelsi tomorrow at 10:30 AM — Cardiology.',
      time: '2h ago',
      read: false,
    },
    {
      id: 'n2',
      type: 'lab',
      title: 'Lab results ready',
      message: 'Your blood test results from Clinique du Lac are available.',
      time: '5h ago',
      read: false,
    },
    {
      id: 'n3',
      type: 'message',
      title: 'New message',
      message: 'Dr. Amel Karray sent you a message about your prescription.',
      time: 'Yesterday',
      read: true,
    },
    {
      id: 'n4',
      type: 'system',
      title: 'Insurance expiring soon',
      message: 'Your CNAM policy expires on 31 Dec 2026. Renew to avoid gaps.',
      time: '2 days ago',
      read: true,
    },
  ]);

  unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  constructor(private el: ElementRef<HTMLElement>) {}

  toggle(): void {
    this.open.update(v => !v);
  }

  markRead(id: string): void {
    this.notifications.update(list => list.map(n => (n.id === id ? { ...n, read: true } : n)));
  }

  markAllRead(): void {
    this.notifications.update(list => list.map(n => ({ ...n, read: true })));
  }

  icon(type: NotificationType): string {
    return { appointment: '📅', lab: '🧪', message: '✉️', system: 'ℹ️' }[type];
  }

  // Close the dropdown when clicking outside the component
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.el.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
