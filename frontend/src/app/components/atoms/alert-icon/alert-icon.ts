import { Component, input, ChangeDetectionStrategy } from '@angular/core';


export type AlertType = 'info' | 'warning' | 'danger' | 'success' | undefined;

@Component({
  selector: 'lumen-alert-icon',
  standalone: true,
  imports: [],
  templateUrl: './alert-icon.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './alert-icon.scss',
})
export class AlertIcon {
  type = input<AlertType>('info');
  icon = input.required<string>();
  text = input.required<string>();
}