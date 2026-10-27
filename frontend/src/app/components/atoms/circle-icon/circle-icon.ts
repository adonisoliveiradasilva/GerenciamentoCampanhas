import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lumen-circle-icon',
  imports: [],
  templateUrl: './circle-icon.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './circle-icon.scss',
})
export class CircleIcon {
  icon = input<string>('');
  bgColor = input<string>('');
  iconColor = input<string>('');
}
