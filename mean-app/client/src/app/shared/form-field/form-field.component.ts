
import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-field">
      <label *ngIf="label" class="form-field__label" [for]="id">{{ label }}</label>
      <div class="form-field__input-container">
        <input
          [id]="id"
          [type]="actualType"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [class]="'form-field__input ' + (error ? 'form-field__input--error' : '')"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
        />
        <div *ngIf="type === 'password'" class="form-field__password-toggle" (click)="togglePasswordVisibility()">
          <span class="icon">{{ showPassword ? '👁️' : '🙈' }}</span>
        </div>
      </div>
      <div *ngIf="error" class="form-field__error">{{ error }}</div>
    </div>
  `,
  styleUrls: ['./form-field.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true
    }
  ]
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() error: string = '';
  @Input() disabled: boolean = false;
  @Input() id: string = '';

  value: string = '';
  showPassword: boolean = false;

  get actualType(): string {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type;
  }

  private onChange = (value: string) => {};
  private onTouched = () => {};

  onInput(event: any): void {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  onFocus(): void {
    
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}