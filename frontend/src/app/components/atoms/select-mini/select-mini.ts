import { Component, ChangeDetectionStrategy, input, output, signal, HostListener, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'lumen-select-mini',
  standalone: true,
  templateUrl: './select-mini.html',
  styleUrl: './select-mini.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectMini {
  public options = input.required<{label: string, value: string}[]>();
  public value = input<string>('');
  public disabled = input<boolean>(false);

  public valueChange = output<string>();

  public isOpen = signal<boolean>(false);
  private el = inject(ElementRef);

  public get selectedLabel(): string {
    const selected = this.options().find(o => o.value === this.value());
    return selected ? selected.label : 'Selecione...';
  }

  public toggleDropdown(event: Event) {
    event.stopPropagation();
    if (!this.disabled()) {
      this.isOpen.update(v => !v);
    }
  }

  public selectOption(optValue: string, event: Event) {
    event.stopPropagation();
    this.valueChange.emit(optValue);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event) {
    if (this.isOpen() && !this.el.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}