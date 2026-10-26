import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IToast, ToastType } from '../modal/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<IToast[]>([]);
  public toasts$: Observable<IToast[]> = this.toastsSubject.asObservable();

  constructor() {}

  public show(type: ToastType, message: string, duration: number = 4000): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: IToast = { id, type, message };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  public remove(id: string): void {
    const filteredToasts = this.toastsSubject.value.filter(toast => toast.id !== id);
    this.toastsSubject.next(filteredToasts);
  }
}
