import { CommonModule } from '@angular/common';
import { Component, input, output, model, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lumen-input',
  imports: [FormsModule, CommonModule],
  templateUrl: './input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './input.scss',
})
export class InputComponent {
  label = input<string>('');
  
  type = input<'text' | 'password' | 'textarea' | 'email' | 'date' | 'time' | 'number'>('text');
  
  size = input<'small' | 'medium' | 'large'>('medium');
  mode = input.required<'form' | 'login'>();
  name = input<string>('');
  autocomplete = input<string>('off');
  placeholder = input<string>('');
  icon = input<string>('');
  required = input<boolean>(false);
  hasError = input<boolean>(false);
  
  disabled = input<boolean>(false);
  
  errorMessage = input<string>(''); 
  isLoading = input<boolean>(false);
  
  value = model<string>('');

  isPasswordVisible = signal(false);

  currentType = computed(() => {
    if (this.type() === 'password') {
      return this.isPasswordVisible() ? 'text' : 'password';
    }
    return this.type();
  });

  onValueChange(newValue: string) {
    this.value.set(newValue); 
  }

  togglePasswordVisibility() {
    this.isPasswordVisible.update(visible => !visible);
  }  
}