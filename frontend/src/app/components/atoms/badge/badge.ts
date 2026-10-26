import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeColor = 'success' | 'purple' | 'warning' | 'neutral' | 'danger'; 

@Component({
  selector: 'lumen-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './badge.scss',
})
export class Badge {
  label = input.required<string>();
  color = input<BadgeColor>('neutral');
  icon = input.required<string>();
}