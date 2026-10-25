import { Component, OnInit, DestroyRef, inject, ChangeDetectionStrategy, signal, input, effect } from '@angular/core';

@Component({
  selector: 'lumen-date-time',
  standalone: true,
  imports: [],
  templateUrl: './date-time.html',
  styleUrl: './date-time.scss',
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class DateTime implements OnInit {
  locale = input<string>('pt-BR');

  currentTime = signal<string>('');
  currentDate = signal<string>('');

  private destroyRef = inject(DestroyRef);
  private intervalId: ReturnType<typeof setInterval> | undefined;

  constructor() {
    effect(() => {
      this.updateDateTime();
    });
  }

  ngOnInit(): void {
    this.updateDateTime();

    this.intervalId = setInterval(() => {
      this.updateDateTime();
    }, 1000); 

    this.destroyRef.onDestroy(() => {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    });
  }

  private updateDateTime(): void {
    const now = new Date();
    const currentLocale = this.locale();

    const timeOptions: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit' 
    };

    this.currentTime.set(now.toLocaleTimeString(currentLocale, timeOptions));
    this.currentDate.set(now.toLocaleDateString(currentLocale));
  }
}