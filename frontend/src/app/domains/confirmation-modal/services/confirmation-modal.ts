import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IConfirmationConfig } from '../models/confirmation-config.interface';

interface IConfirmationState {
  config: IConfirmationConfig;
  outcome$: Subject<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmationModalService {
  private stateSubject = new Subject<IConfirmationState | null>();
  public state$ = this.stateSubject.asObservable();

  public open(config: IConfirmationConfig): Observable<boolean> {
    const outcome$ = new Subject<boolean>();
    
    const type = config.type || 'info';
    
    const defaultIcons: Record<string, string> = {
      danger: 'fas fa-trash-can',
      warning: 'fas fa-triangle-exclamation',
      info: 'fas fa-circle-info',
      success: 'fas fa-check'
    };

    this.stateSubject.next({
      config: {
        title: config.title || 'Confirmação',
        subtitle: config.subtitle || '',
        confirmText: config.confirmText || 'Confirmar',
        cancelText: config.cancelText || 'Cancelar',
        confirmIcon: config.confirmIcon || (config.icon || defaultIcons[type]),
        cancelIcon: config.cancelIcon || 'fas fa-ban',
        type,
        icon: config.icon || defaultIcons[type],
        message: config.message
      },
      outcome$
    });

    return outcome$.asObservable();
  }

  public close(): void {
    this.stateSubject.next(null);
  }
}