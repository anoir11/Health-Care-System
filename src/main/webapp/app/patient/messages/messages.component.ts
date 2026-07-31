import { Component, signal, computed, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ViewEncapsulation, // ← add this import
  // ...rest of imports
} from '@angular/core';

// ─── Models ──────────────────────────────────────────────────────────────────

export type MessageSender = 'me' | 'them';
export type AttachmentType = 'lab' | 'imaging' | 'prescription' | 'report' | 'file';
export type FilterTab = 'all' | 'doctors' | 'lab';

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: AttachmentType;
  fromFolder?: boolean;
}

export interface Message {
  id: string;
  sender: MessageSender;
  text?: string;
  attachment?: Attachment;
  time: Date;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  name: string;
  role: string;
  clinic: string;
  initials: string;
  color: string;
  online: boolean;
  unread: number;
  lastMessage: string;
  lastTime: Date;
  messages: Message[];
  sharedDocs: Attachment[];
  nextAppointment?: { label: string; date: Date; duration: string };
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    name: 'Dr. Karim Slim',
    role: 'Cardiologist',
    clinic: 'Clinique du Lac',
    initials: 'KS',
    color: '#1d4ed8',
    online: true,
    unread: 3,
    lastMessage: "I've reviewed your blood test results…",
    lastTime: new Date('2026-04-30T10:42:00'),
    nextAppointment: {
      label: 'Teleconsultation',
      date: new Date('2026-05-03T10:30:00'),
      duration: '30 min',
    },
    sharedDocs: [
      { id: 'd1', name: 'Blood Test Apr 10', size: '0.8 MB', type: 'lab' },
      { id: 'd2', name: 'Referral — Nutritionist', size: '0.3 MB', type: 'report' },
      { id: 'd3', name: 'ECG — Apr 26 2026', size: '1.2 MB', type: 'imaging' },
    ],
    messages: [
      {
        id: 'm1',
        sender: 'them',
        text: "Hello! I've received your latest blood test. Your cholesterol level is slightly elevated — nothing alarming, but I'd like to discuss a few dietary adjustments.",
        time: new Date('2026-04-28T09:14:00'),
      },
      {
        id: 'm2',
        sender: 'them',
        attachment: { id: 'd1', name: 'Blood Test Apr 10', size: '0.8 MB', type: 'lab' },
        time: new Date('2026-04-28T09:15:00'),
      },
      {
        id: 'm3',
        sender: 'me',
        text: 'Thank you, Dr. Slim. Is this something we can address with diet alone or will I need medication?',
        time: new Date('2026-04-28T09:22:00'),
        status: 'read',
      },
      {
        id: 'm4',
        sender: 'them',
        text: "At this stage, I'd prefer to start with lifestyle changes. I'm attaching a referral note and a dietary guide. We'll reassess in 6 weeks.",
        time: new Date('2026-04-28T09:28:00'),
      },
      {
        id: 'm5',
        sender: 'them',
        attachment: { id: 'd2', name: 'Referral — Nutritionist', size: '0.3 MB', type: 'report' },
        time: new Date('2026-04-28T09:29:00'),
      },
      {
        id: 'm6',
        sender: 'me',
        text: 'I also wanted to share my last ECG from the imaging center.',
        time: new Date('2026-04-30T10:40:00'),
        status: 'delivered',
      },
      {
        id: 'm7',
        sender: 'me',
        attachment: { id: 'd3', name: 'ECG — Apr 26 2026', size: '1.2 MB', type: 'imaging', fromFolder: true },
        time: new Date('2026-04-30T10:41:00'),
        status: 'delivered',
      },
    ],
  },
  {
    id: 'c2',
    name: 'Dr. Meriem Bali',
    role: 'General Practitioner',
    clinic: 'Cabinet Bali',
    initials: 'MB',
    color: '#7c3aed',
    online: false,
    unread: 0,
    lastMessage: 'Your prescription has been renewed',
    lastTime: new Date('2026-04-29T14:10:00'),
    sharedDocs: [{ id: 'd4', name: 'Prescription Apr 29', size: '0.2 MB', type: 'prescription' }],
    messages: [
      {
        id: 'm8',
        sender: 'them',
        text: 'Your prescription for Doliprane 1000 has been renewed. Please collect it from the pharmacy.',
        time: new Date('2026-04-29T14:10:00'),
      },
      {
        id: 'm9',
        sender: 'them',
        attachment: { id: 'd4', name: 'Prescription Apr 29', size: '0.2 MB', type: 'prescription' },
        time: new Date('2026-04-29T14:11:00'),
      },
    ],
  },
  {
    id: 'c3',
    name: 'Clinique du Lac',
    role: 'Imaging Center',
    clinic: 'Clinique du Lac',
    initials: 'CL',
    color: '#0d9488',
    online: false,
    unread: 1,
    lastMessage: '📎 MRI Brain — Apr 26',
    lastTime: new Date('2026-04-28T11:00:00'),
    sharedDocs: [{ id: 'd5', name: 'MRI Brain — Apr 26', size: '4.2 MB', type: 'imaging' }],
    messages: [
      {
        id: 'm10',
        sender: 'them',
        text: 'Your MRI report is now available. Please find it attached.',
        time: new Date('2026-04-28T11:00:00'),
      },
      {
        id: 'm11',
        sender: 'them',
        attachment: { id: 'd5', name: 'MRI Brain — Apr 26', size: '4.2 MB', type: 'imaging' },
        time: new Date('2026-04-28T11:01:00'),
      },
    ],
  },
  {
    id: 'c4',
    name: 'Lab Synlab',
    role: 'Laboratory',
    clinic: 'Synlab Tunis',
    initials: 'LS',
    color: '#e11d48',
    online: false,
    unread: 0,
    lastMessage: 'Your results are ready for pickup',
    lastTime: new Date('2026-04-24T09:30:00'),
    sharedDocs: [],
    messages: [
      {
        id: 'm12',
        sender: 'them',
        text: 'Your lab results from April 24 are ready. You may pick them up at our reception or download them from the portal.',
        time: new Date('2026-04-24T09:30:00'),
      },
    ],
  },
  {
    id: 'c5',
    name: 'Dr. Amine Hajji',
    role: 'Orthopedist',
    clinic: 'Polyclinique Bizerte',
    initials: 'AH',
    color: '#d97706',
    online: false,
    unread: 0,
    lastMessage: 'Appointment confirmed for May 5',
    lastTime: new Date('2026-04-20T16:00:00'),
    sharedDocs: [],
    messages: [
      {
        id: 'm13',
        sender: 'them',
        text: 'Your appointment for May 5 at 2:00 PM has been confirmed. Please arrive 10 minutes early.',
        time: new Date('2026-04-20T16:00:00'),
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function groupByDate(messages: Message[]): { date: string; items: Message[] }[] {
  const groups: Record<string, Message[]> = {};
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  for (const msg of messages) {
    let label: string;
    if (msg.time.toDateString() === today.toDateString()) label = 'Today';
    else if (msg.time.toDateString() === yesterday.toDateString()) label = 'Yesterday';
    else label = msg.time.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    (groups[label] ??= []).push(msg);
  }
  return Object.entries(groups).map(([date, items]) => ({ date, items }));
}

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  encapsulation: ViewEncapsulation.None, // ← add this line
})
export class MessagesComponent implements AfterViewChecked {
  @ViewChild('chatBody') chatBodyRef!: ElementRef<HTMLDivElement>;

  conversations = signal<Conversation[]>(CONVERSATIONS);
  selectedId = signal<string>('c1');
  searchQuery = signal('');
  messageText = signal('');
  activeFilter = signal<FilterTab>('all');
  isTyping = signal(true);

  selectedConversation = computed(() => this.conversations().find(c => c.id === this.selectedId()));

  readonly filterTabs: { k: FilterTab; l: string }[] = [
    { k: 'all', l: 'All' },
    { k: 'doctors', l: 'Doctors' },
    { k: 'lab', l: 'Lab & Imaging' },
  ];

  filteredConversations = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const filter = this.activeFilter();
    return this.conversations().filter(c => {
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q);
      const matchFilter =
        filter === 'all' ||
        (filter === 'doctors' && c.role.toLowerCase().includes('doctor')) ||
        (filter === 'lab' && (c.role.toLowerCase().includes('lab') || c.role.toLowerCase().includes('imaging')));
      return matchSearch && matchFilter;
    });
  });

  groupedMessages = computed(() => {
    const conv = this.selectedConversation();
    return conv ? groupByDate(conv.messages) : [];
  });

  totalUnread = computed(() => this.conversations().reduce((s, c) => s + c.unread, 0));

  private _scrollToBottom = false;

  selectConversation(id: string) {
    this.selectedId.set(id);
    this.conversations.update(list => list.map(c => (c.id === id ? { ...c, unread: 0 } : c)));
    this._scrollToBottom = true;
  }

  sendMessage() {
    const text = this.messageText().trim();
    if (!text) return;
    const conv = this.selectedConversation();
    if (!conv) return;
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'me',
      text,
      time: new Date(),
      status: 'sent',
    };
    this.conversations.update(list =>
      list.map(c => (c.id === conv.id ? { ...c, messages: [...c.messages, newMsg], lastMessage: text, lastTime: new Date() } : c)),
    );
    this.messageText.set('');
    this._scrollToBottom = true;
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  formatLastTime(date: Date): string {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return this.formatTime(date);
    return date.toLocaleDateString('en-GB', { weekday: 'short' });
  }

  formatAppointmentDate(date: Date): string {
    return (
      date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) +
      ' · ' +
      date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    );
  }

  attachmentIcon(type: AttachmentType): string {
    const map: Record<AttachmentType, string> = {
      lab: '🧪',
      imaging: '🩻',
      prescription: '💊',
      report: '📋',
      file: '📎',
    };
    return map[type];
  }

  attachmentBg(type: AttachmentType): string {
    const map: Record<AttachmentType, string> = {
      lab: '#dbeafe',
      imaging: '#ede9fe',
      prescription: '#fef3c7',
      report: '#dcfce7',
      file: '#f1f5f9',
    };
    return map[type];
  }

  ngAfterViewChecked() {
    if (this._scrollToBottom && this.chatBodyRef) {
      const el = this.chatBodyRef.nativeElement;
      el.scrollTop = el.scrollHeight;
      this._scrollToBottom = false;
    }
  }
}
