import { Component, signal, computed, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type AvatarColor = 'blue' | 'teal' | 'purple' | 'orange' | 'medilink';
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
  subtitle: string;
  initials: string;
  avatarColor: AvatarColor;
  isOnline: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: Date;
  isSupport: boolean;
  messages: Message[];
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    name: 'Dr. Sarah Johnson',
    subtitle: 'Cardiologist',
    initials: 'SJ',
    avatarColor: 'blue',
    isOnline: true,
    unreadCount: 2,
    lastMessage: 'Your lab results look good overall…',
    lastMessageTime: new Date(),
    isSupport: false,
    messages: [
      {
        id: 'm1',
        text: "Good morning Amine! I've reviewed your Complete Blood Count results from last week.",
        sender: 'other',
        timestamp: new Date(Date.now() - 3600000 * 2),
        type: 'text',
        read: true,
      },
      {
        id: 'm2',
        text: 'Your lab results look good overall. Your cholesterol is slightly elevated but nothing to worry about for now. Keep up with the Atorvastatin 20mg as prescribed.',
        sender: 'other',
        timestamp: new Date(Date.now() - 3600000 * 2 + 60000),
        type: 'text',
        read: true,
      },
      {
        id: 'm3',
        text: "Thank you Doctor! Should I change my diet? I've been eating a lot of red meat lately.",
        sender: 'me',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
        read: true,
      },
      {
        id: 'm4',
        text: 'Yes, I would recommend reducing red meat to 2-3 times per week. Try to add more fish, vegetables and olive oil to your diet. A Mediterranean-style diet would be ideal for your condition.',
        sender: 'other',
        timestamp: new Date(Date.now() - 3600000 + 120000),
        type: 'text',
        read: true,
      },
      {
        id: 'm5',
        text: "Understood! I'll make those changes. Should I come in for a follow-up soon?",
        sender: 'me',
        timestamp: new Date(Date.now() - 1800000),
        type: 'text',
        read: true,
      },
      {
        id: 'm6',
        text: '📅 Appointment on 6 May 2026 at 10:30 AM confirmed',
        sender: 'other',
        timestamp: new Date(Date.now() - 1200000),
        type: 'system',
        read: true,
      },
      {
        id: 'm7',
        text: 'See you at your next appointment on May 6th! Let me know if you have any other questions before then. 😊',
        sender: 'other',
        timestamp: new Date(Date.now() - 600000),
        type: 'text',
        read: false,
      },
      {
        id: 'm8',
        text: 'Your lab results look good overall, Amine. Keep monitoring your blood pressure daily.',
        sender: 'other',
        timestamp: new Date(Date.now() - 300000),
        type: 'text',
        read: false,
      },
    ],
  },
  {
    id: 'c2',
    name: 'Dr. Mohamed Karim',
    subtitle: 'Radiologist',
    initials: 'MK',
    avatarColor: 'teal',
    isOnline: false,
    unreadCount: 0,
    lastMessage: 'Please bring the MRI scan to your appointment.',
    lastMessageTime: new Date(Date.now() - 86400000),
    isSupport: false,
    messages: [
      {
        id: 'm1',
        text: 'Hello Amine, please bring the MRI scan images to your next appointment on May 14th.',
        sender: 'other',
        timestamp: new Date(Date.now() - 86400000),
        type: 'text',
        read: true,
      },
      {
        id: 'm2',
        text: "Of course Doctor, I'll make sure to bring them. Should I bring any other documents?",
        sender: 'me',
        timestamp: new Date(Date.now() - 82800000),
        type: 'text',
        read: true,
      },
      {
        id: 'm3',
        text: 'Just the MRI scan and your latest blood pressure readings. See you soon!',
        sender: 'other',
        timestamp: new Date(Date.now() - 79200000),
        type: 'text',
        read: true,
      },
    ],
  },
  {
    id: 'c3',
    name: 'Dr. Leila Mansouri',
    subtitle: 'General Practitioner',
    initials: 'LM',
    avatarColor: 'purple',
    isOnline: false,
    unreadCount: 0,
    lastMessage: 'Thank you for coming in today!',
    lastMessageTime: new Date(Date.now() - 86400000 * 3),
    isSupport: false,
    messages: [
      {
        id: 'm1',
        text: 'Thank you for coming in today Amine! Your annual checkup results were great.',
        sender: 'other',
        timestamp: new Date(Date.now() - 86400000 * 3),
        type: 'text',
        read: true,
      },
      {
        id: 'm2',
        text: 'Thank you Doctor! I feel much better knowing everything is fine.',
        sender: 'me',
        timestamp: new Date(Date.now() - 86400000 * 3 + 3600000),
        type: 'text',
        read: true,
      },
    ],
  },
  {
    id: 'c4',
    name: 'MediLink Support',
    subtitle: 'Platform support',
    initials: '🏥',
    avatarColor: 'medilink',
    isOnline: true,
    unreadCount: 1,
    lastMessage: 'Your account has been verified ✅',
    lastMessageTime: new Date(Date.now() - 86400000 * 2),
    isSupport: true,
    messages: [
      {
        id: 'm1',
        text: 'Welcome to MediLink, Amine! Your account has been successfully created.',
        sender: 'other',
        timestamp: new Date(Date.now() - 86400000 * 7),
        type: 'text',
        read: true,
      },
      {
        id: 'm2',
        text: 'Your account has been verified ✅ You now have full access to all features including medical folder, appointments and messaging with your doctors.',
        sender: 'other',
        timestamp: new Date(Date.now() - 86400000 * 2),
        type: 'text',
        read: false,
      },
    ],
  },
];

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messagesPatient.component.html',
  styleUrls: ['./messagesPatient.component.scss'],
})
export class MessagesPatientComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  conversations = signal<Conversation[]>(MOCK_CONVERSATIONS);
  activeConvId = signal<string>('c1');
  newMessage = signal('');
  searchQuery = signal('');
  isTyping = signal(false);
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

  doctorConversations = computed(() => this.conversations().filter(c => !c.isSupport && this.matchesSearch(c)));

  supportConversations = computed(() => this.conversations().filter(c => c.isSupport && this.matchesSearch(c)));

  totalUnread = computed(() => this.conversations().reduce((sum, c) => sum + c.unreadCount, 0));

  matchesSearch(c: Conversation): boolean {
    const q = this.searchQuery().toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q);
  }

  showChatOnMobile = signal(true);

  backToList() {
    this.showChatOnMobile.set(false);
  }

  selectConversation(id: string) {
    this.activeConvId.set(id);
    this.showChatOnMobile.set(true);
    // mark all as read
    this.conversations.update(convs =>
      convs.map(c => (c.id === id ? { ...c, unreadCount: 0, messages: c.messages.map(m => ({ ...m, read: true })) } : c)),
    );
    this.shouldScroll = true;
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

    // simulate typing + reply
    this.simulateReply();
  }

  simulateReply() {
    this.isTyping.set(true);
    this.shouldScroll = true;
    setTimeout(() => {
      this.isTyping.set(false);
      const reply: Message = {
        id: `m${Date.now()}`,
        text: "Thank you for your message. I'll get back to you shortly.",
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

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  scrollToBottom() {
    try {
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    } catch {}
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
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
    const prev = messages[index - 1].timestamp;
    const curr = messages[index].timestamp;
    return prev.toDateString() !== curr.toDateString();
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
