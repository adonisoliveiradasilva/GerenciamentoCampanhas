import { Component, ChangeDetectionStrategy, input, output, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';

@Component({
  selector: 'lumen-fullscreen-modal',
  standalone: true,
  imports: [],
  templateUrl: './fullscreen-modal.html',
  styleUrl: './fullscreen-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullscreenModal implements OnInit, OnDestroy {
  title = input.required<string>();
  icon = input<string>('fa-solid fa-expand');
  
  onClose = output<void>();

  private el = inject(ElementRef);

  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.el.nativeElement && this.el.nativeElement.parentNode) {
      this.el.nativeElement.parentNode.removeChild(this.el.nativeElement);
    }
  }
}