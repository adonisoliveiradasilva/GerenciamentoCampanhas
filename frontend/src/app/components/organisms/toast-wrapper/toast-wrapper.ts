import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ToastService } from '../../../domains/toast/services/toast-service';
import { Toast } from '../../atoms/toast/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lumen-toast-wrapper',
  imports: [Toast, CommonModule],
  templateUrl: './toast-wrapper.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './toast-wrapper.scss',
})
export class ToastWrapper {
  private toastService = inject(ToastService);
  
  toasts$ = this.toastService.toasts$;

  closeToast(id: string): void {
    this.toastService.remove(id);
  }
}
