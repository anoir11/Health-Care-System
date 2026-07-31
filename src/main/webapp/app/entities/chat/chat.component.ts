import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { ChatService } from '../chat.service';
import { Message } from '@stomp/stompjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  messages: { role: string; text: string; time: string }[] = [];
  userInput = '';
  loading = false;

  isFocused: boolean = false;

  // constructor(private chatService: ChatService) { }

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (e) {}
  }

  private now(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  onEnter(event: KeyboardEvent): void {
    if (!event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  sendSuggestion(text: string): void {
    this.userInput = text;
    this.send();
  }

  send() {
    // if (!this.userInput.trim()) return;
    // this.messages.push({ role: 'user', text: this.userInput });
    // this.loading = true;
    // this.chatService.sendMessage(this.userInput).subscribe(res => {
    //   this.messages.push({ role: 'bot', text: res.reply });
    //   this.loading = false;
    // });
    // this.userInput = '';
  }
}
