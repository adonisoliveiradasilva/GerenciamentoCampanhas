import { Component, inject, ElementRef, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core'; // 🛡️ Importe ElementRef, OnInit, OnDestroy
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfirmationModalService } from '../../../domains/confirmation-modal/services/confirmation-modal';

import { Button } from '../../atoms/button/button';
import { CircleIcon } from '../../atoms/circle-icon/circle-icon';
import { AlertIcon } from '../../atoms/alert-icon/alert-icon';
import { Subject } from 'rxjs';

@Component({
  selector: 'lumen-confirmation-modal',
  standalone: true,
  imports: [Button, CircleIcon, AlertIcon],
  templateUrl: './confirmation-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './confirmation-modal.scss',
})
export class ConfirmationModal implements OnInit, OnDestroy {
  private confirmationModalService = inject(ConfirmationModalService);
  private el = inject(ElementRef);
  
  public state = toSignal(this.confirmationModalService.state$);

  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.el.nativeElement && this.el.nativeElement.parentNode) {
      this.el.nativeElement.parentNode.removeChild(this.el.nativeElement);
    }
  }

  public onConfirm(outcome$: Subject<boolean>): void {
    outcome$.next(true);
    outcome$.complete();
    this.confirmationModalService.close();
  }

  public onCancel(outcome$: Subject<boolean>): void {
    outcome$.next(false);
    outcome$.complete();
    this.confirmationModalService.close();
  }
}