import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmergencyContact } from './profile.component';

export interface EmergencyContactFormValue {
  name: string;
  relationship: string;
  phone: string;
  role: 'primary' | 'secondary';
}

/**
 * Standalone modal for adding or editing a single emergency contact.
 *
 * Usage:
 *   <app-emergency-contact-modal
 *     [open]="contactModalOpen()"
 *     [contact]="contactBeingEdited()"
 *     [saving]="contactModalSaving()"
 *     [error]="contactModalError()"
 *     (save)="saveContact($event)"
 *     (delete)="deleteContact($event)"
 *     (close)="closeContactModal()" />
 */
@Component({
  selector: 'app-emergency-contact-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './emergency-contact-modal.component.html',
  styleUrls: ['./emergency-contact-modal.component.scss'],
})
export class EmergencyContactModalComponent implements OnChanges {
  @Input() open = false;
  @Input() contact: EmergencyContact | null = null;
  @Input() saving = false;
  @Input() error = '';

  @Output() save = new EventEmitter<EmergencyContactFormValue>();
  @Output() delete = new EventEmitter<EmergencyContact>();
  @Output() close = new EventEmitter<void>();

  form = signal<EmergencyContactFormValue>(this.emptyForm());
  touched = signal(false);
  confirmingDelete = signal(false);

  get isEditMode(): boolean {
    return !!this.contact;
  }

  get title(): string {
    return this.isEditMode ? 'Edit emergency contact' : 'Add emergency contact';
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reset the form whenever the modal is (re)opened or the target contact changes.
    if (changes['open'] && this.open) {
      this.form.set(
        this.contact
          ? {
              name: this.contact.name,
              relationship: this.contact.relationship,
              phone: this.contact.phone,
              role: this.contact.role,
            }
          : this.emptyForm(),
      );
      this.touched.set(false);
      this.confirmingDelete.set(false);
    }
  }

  private emptyForm(): EmergencyContactFormValue {
    return { name: '', relationship: '', phone: '', role: 'secondary' };
  }

  get isValid(): boolean {
    const f = this.form();
    return f.name.trim().length > 1 && f.relationship.trim().length > 0 && f.phone.trim().length > 3;
  }

  onBackdropClick(): void {
    if (!this.saving) this.close.emit();
  }

  onSubmit(): void {
    this.touched.set(true);
    if (!this.isValid || this.saving) return;

    const f = this.form();
    this.save.emit({
      name: f.name.trim(),
      relationship: f.relationship.trim(),
      phone: f.phone.trim(),
      role: f.role,
    });
  }

  askDelete(): void {
    this.confirmingDelete.set(true);
  }

  cancelDelete(): void {
    this.confirmingDelete.set(false);
  }

  confirmDelete(): void {
    if (this.contact) this.delete.emit(this.contact);
  }

  updateField<K extends keyof EmergencyContactFormValue>(key: K, value: EmergencyContactFormValue[K]): void {
    this.form.update(f => ({ ...f, [key]: value }));
  }
}
