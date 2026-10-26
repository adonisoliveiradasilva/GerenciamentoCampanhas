import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { IToast } from '../../../domains/toast/modal/toast.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lumen-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './toast.scss',
})
export class Toast {
  data = input.required<IToast>();
  closeToast = output<string>();
}