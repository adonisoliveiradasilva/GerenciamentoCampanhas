import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly STORAGE_KEY = 'sidebar-collapsed';

  private collapsedSubject = new BehaviorSubject<boolean>(this.getInitialState());

  public isCollapsed$: Observable<boolean> = this.collapsedSubject.asObservable();

  constructor() {}

  private getInitialState(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  public toggle(): void {
    const newState = !this.collapsedSubject.value;
    
    this.collapsedSubject.next(newState);
    
    localStorage.setItem(this.STORAGE_KEY, String(newState));
  }
}
