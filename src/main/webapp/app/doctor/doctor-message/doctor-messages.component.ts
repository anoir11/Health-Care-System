import { Component, signal, computed, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type AvatarColor = 'green' | 'blue' | 'purple' | 'rose' | 'amber' | 'teal';
export type MessageType = 'text' | 'system';
export type SenderType = 'me' | 'other';

export interface Message {
  id: string;
  text: string;
  sender: SenderType;
  timestamp: Date;
  type: MessageType;
  read: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  subtitle: string; // patient age + condition
  initials: string;
  avatarColor: AvatarColor;
  isOnline: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: Date;
  messages: Message[];
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    name: 'Amine Ben Ali',
    subtitle: '28y · Hypertension, Diabetes',
    initials: 'AB',
    avatarColor: 'green',
    isOnline: true,
    unreadCount: 2,
    lastMessage: 'Doctor, I have a question about my medication…',
    lastMessageTime: new Date(),
    messages: [
      {
        id: 'm1',
        text: "Good morning Doctor! I've been taking the Atorvastatin 20mg as prescribed.",
        sender: 'other',
        timestamp: new Date(Date.now() - 3600000 * 2),
        type: 'text',
        read: true,
      },
      {
        id: 'm2',
        text: 'I noticed some muscle pain in my legs. Could this be related to the medication?',
        sender: 'other',
        timestamp: new Date(Date.now() - 3600000 * 2 + 60000),
        type: 'text',
        read: true,
      },
      {
        id: 'm3',
        text: "Hello Amine. Yes, muscle pain can be a side effect of statins. Please stop taking it temporarily and come in for a check. I'll schedule a CK blood test.",
        sender: 'me',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
        read: true,
      },
      {
        id: 'm4',
        text: '📅 Appointment on 6 May 2026 at 10:30 AM confirmed',
        sender: 'me',
        timestamp: new Date(Date.now() - 3500000),
        type: 'system',
        read: true,
      },
      {
        id: 'm5',
        text: 'Thank you Doctor! Should I stop the Bisoprolol too?',
        sender: 'other',
        timestamp: new Date(Date.now() - 1800000),
        type: 'text',
        read: false,
      },
      {
        id: 'm6',
        text: 'Doctor, I have a question about my medication…',
        sender: 'other',
        timestamp: new Date(Date.now() - 600000),
        type: 'text',
        read: false,
      },
    ],
  },
  {
    id: 'c2',
    name: 'Fatma Trabelsi',
    subtitle: '45y · First visit',
    initials: 'FT',
    avatarColor: 'blue',
    isOnline: false,
    unreadCount: 1,
    lastMessage: 'Thank you for the prescription Doctor!',
    lastMessageTime: new Date(Date.now() - 3600000 * 3),
    messages: [
      {
        id: 'm1',
        text: 'Hello Doctor, I visited you yesterday for the first time regarding my chest pain.',
        sender: 'other',
        timestamp: new Date(Date.now() - 86400000),
        type: 'text',
        read: true,
      },
      {
        id: 'm2',
        text: 'Hello Fatma. How are you feeling today? Is the pain still present?',
        sender: 'me',
        timestamp: new Date(Date.now() - 82800000),
        type: 'text',
        read: true,
      },
      {
        id: 'm3',
        text: "The pain is better but still comes when I walk fast. I've been resting like you said.",
        sender: 'other',
        timestamp: new Date(Date.now() - 79200000),
        type: 'text',
        read: true,
      },
      {
        id: 'm4',
        text: 'Good. Please take the ECG results to the lab I mentioned. We need to rule out any cardiac issue. Book a follow-up in 1 week.',
        sender: 'me',
        timestamp: new Date(Date.now() - 75600000),
        type: 'text',
        read: true,
      },
      {
        id: 'm5',
        text: 'Thank you for the prescription Doctor!',
        sender: 'other',
        timestamp: new Date(Date.now() - 3600000 * 3),
        type: 'text',
        read: false,
      },
    ],
  },
  {
    id: 'c3',
    name: 'Karim Mansouri',
    subtitle: '52y · Hypertension',
    initials: 'KM',
    avatarColor: 'purple',
    isOnline: true,
    unreadCount: 0,
    lastMessage: 'See you at 10:30 Doctor!',
    lastMessageTime: new Date(Date.now() - 86400000),
    messages: [
      {
        id: 'm1',
        text: 'Doctor, I took my blood pressure this morning: 145/92. Is that okay?',
        sender: 'other',
        timestamp: new Date(Date.now() - 86400000 * 2),
        type: 'text',
        read: true,
      },
      {
        id: 'm2',
        text: "It's slightly elevated. Make sure you take the Amlodipine at the same time every day, preferably in the morning. Reduce salt intake and avoid stress.",
        sender: 'me',
        timestamp: new Date(Date.now() - 86400000 * 2 + 3600000),
        type: 'text',
        read: true,
      },
      {
        id: 'm3',
        text: "Understood, thank you. I'll measure again tomorrow.",
        sender: 'other',
        timestamp: new Date(Date.now() - 86400000),
        type: 'text',
        read: true,
      },
      {
        id: 'm4',
        text: 'See you at 10:30 Doctor!',
        sender: 'other',
        timestamp: new Date(Date.now() - 86400000 + 3600000),
        type: 'text',
        read: true,
      },
    ],
  },
  {
    id: 'c4',
    name: 'Sonia Belhaj',
    subtitle: '38y · Post-cardiac surgery',
    initials: 'SB',
    avatarColor: 'rose',
    isOnline: false,
    unreadCount: 0,
    lastMessage: 'INR result is 2.4 this week.',
    lastMessageTime: new Date(Date.now() - 86400000 * 3),
    messages: [
      {
        id: 'm1',
        text: 'Doctor, my INR result is 2.4 this week. Is that in range?',
        sender: 'other',
        timestamp: new Date(Date.now() - 86400000 * 3),
        type: 'text',
        read: true,
      },
      {
        id: 'm2',
        text: 'Yes Sonia, 2.4 is within the therapeutic range (2.0–3.0). Keep the same Warfarin dose. Recheck in 2 weeks.',
        sender: 'me',
        timestamp: new Date(Date.now() - 86400000 * 3 + 3600000),
        type: 'text',
        read: true,
      },
      {
        id: 'm3',
        text: "Perfect, thank you Doctor. I'll book the next test now.",
        sender: 'other',
        timestamp: new Date(Date.now() - 86400000 * 3 + 7200000),
        type: 'text',
        read: true,
      },
    ],
  },
  {
    id: 'c5',
    name: 'Mohamed Sassi',
    subtitle: '61y · Atrial fibrillation',
    initials: 'MS',
    avatarColor: 'amber',
    isOnline: false,
    unreadCount: 0,
    lastMessage: 'I feel much better since starting the new medication.',
    lastMessageTime: new Date(Date.now() - 86400000 * 5),
    messages: [
      {
        id: 'm1',
        text: 'Doctor, I feel much better since starting the new medication. My heart feels more regular.',
        sender: 'other',
        timestamp: new Date(Date.now() - 86400000 * 5),
        type: 'text',
        read: true,
      },
      {
        id: 'm2',
        text: 'Excellent news Mohamed! The Digoxin is working well. Keep monitoring your pulse daily. If it goes below 60 bpm, contact me immediately.',
        sender: 'me',
        timestamp: new Date(Date.now() - 86400000 * 5 + 3600000),
        type: 'text',
        read: true,
      },
    ],
  },
];

@Component({
  selector: 'app-doctor-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-messages.component.html',
  styleUrls: ['./doctor-messages.component.scss'],
})
export class DoctorMessagesComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  conversations = signal<Conversation[]>(MOCK_CONVERSATIONS);
  activeConvId = signal<string>('c1');
  newMessage = signal('');
  searchQuery = signal('');
  isTyping = signal(false);
  showChatOnMobile = signal(false);
  private shouldScroll = false;

  ngOnInit() {
    this.shouldScroll = true;
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  activeConversation = computed(() => this.conversations().find(c => c.id === this.activeConvId()) ?? null);

  filteredConversations = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.conversations();
    return this.conversations().filter(
      c => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q),
    );
  });

  totalUnread = computed(() => this.conversations().reduce((sum, c) => sum + c.unreadCount, 0));

  selectConversation(id: string) {
    this.activeConvId.set(id);
    this.showChatOnMobile.set(true);
    this.conversations.update(convs =>
      convs.map(c => (c.id === id ? { ...c, unreadCount: 0, messages: c.messages.map(m => ({ ...m, read: true })) } : c)),
    );
    this.shouldScroll = true;
  }

  backToList() {
    this.showChatOnMobile.set(false);
  }

  sendMessage() {
    const text = this.newMessage().trim();
    if (!text || !this.activeConvId()) return;

    const msg: Message = {
      id: `m${Date.now()}`,
      text,
      sender: 'me',
      timestamp: new Date(),
      type: 'text',
      read: true,
    };

    this.conversations.update(convs =>
      convs.map(c =>
        c.id === this.activeConvId() ? { ...c, messages: [...c.messages, msg], lastMessage: text, lastMessageTime: new Date() } : c,
      ),
    );

    this.newMessage.set('');
    this.shouldScroll = true;
    this.simulateReply();
  }

  simulateReply() {
    this.isTyping.set(true);
    this.shouldScroll = true;
    setTimeout(() => {
      this.isTyping.set(false);
      const reply: Message = {
        id: `m${Date.now()}`,
        text: 'Thank you Doctor, I understand.',
        sender: 'other',
        timestamp: new Date(),
        type: 'text',
        read: true,
      };
      this.conversations.update(convs =>
        convs.map(c =>
          c.id === this.activeConvId()
            ? { ...c, messages: [...c.messages, reply], lastMessage: reply.text, lastMessageTime: new Date() }
            : c,
        ),
      );
      this.shouldScroll = true;
    }, 2000);
  }

  handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  scrollToBottom() {
    try {
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    } catch {}
  }

  formatTime(date: Date): string {
    const diff = new Date().getTime() - date.getTime();
    if (diff < 86400000) return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    if (diff < 86400000 * 2) return 'Yesterday';
    if (diff < 86400000 * 7) return date.toLocaleDateString('en-GB', { weekday: 'short' });
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }

  formatMessageTime(date: Date): string {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  isNewDay(messages: Message[], index: number): boolean {
    if (index === 0) return true;
    return messages[index - 1].timestamp.toDateString() !== messages[index].timestamp.toDateString();
  }

  formatDay(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  trackById(_: number, item: { id: string }) {
    return item.id;
  }
}
