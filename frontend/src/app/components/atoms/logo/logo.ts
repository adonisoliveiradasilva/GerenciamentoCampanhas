import { CommonModule } from '@angular/common';
import { Component, input, ChangeDetectionStrategy } from '@angular/core';

export type LogoSize = 'small' | 'medium' | 'large';
export type LogoTheme = 'light' | 'dark';

@Component({
  selector: 'lumen-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './logo.scss',
})
export class Logo {
  size = input<LogoSize>('medium');
  theme = input<LogoTheme>('light');
}