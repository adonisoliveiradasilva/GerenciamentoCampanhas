import { CommonModule } from '@angular/common';
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

export type ButtonType = 'primary' | 'secondary' | 'login' | 'circle-icon' | 'circle-icon-secondary' | 'circle-icon-tertiary' | 'danger';

@Component({
  selector: 'lumen-button',
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-login-width]': "type() === 'login'"
  }
})
export class Button {
  text = input<string>('');
  type = input<ButtonType>('primary');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  isLoading = input<boolean>(false);
  icon = input<string>('');
  nativeType = input<'button' | 'submit' | 'reset'>('button');
  
  onClick = output<void>();

  action() {
    this.onClick.emit();
  }
}