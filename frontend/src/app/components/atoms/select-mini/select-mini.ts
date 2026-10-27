import { Component, ChangeDetectionStrategy, input, model, signal, HostListener, ElementRef, inject, computed } from '@angular/core';

@Component({
  selector: 'lumen-select-mini',
  standalone: true,
  templateUrl: './select-mini.html',
  styleUrl: './select-mini.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectMini {
  public options = input.required<{label: string, value: string}[]>();
  public disabled = input<boolean>(false);
  public showSearch = input<boolean>(true); 

  public value = model<string>('');

  public isOpen = signal<boolean>(false);
  public searchQuery = signal<string>('');
  
  private el = inject(ElementRef);

  public filteredOptions = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.options();
    
    return this.options().filter(opt => opt.label.toLowerCase().includes(q));
  });

  public selectedLabel = computed(() => {
    const selected = this.options().find(o => o.value === this.value());
    return selected ? selected.label : 'Selecione...';
  });

  public toggleDropdown(event: Event) {
    event.stopPropagation();
    if (!this.disabled()) {
      const willOpen = !this.isOpen();
      this.isOpen.set(willOpen);
      if (willOpen) {
        this.searchQuery.set('');
      }
    }
  }

  public selectOption(optValue: string, event: Event) {
    event.stopPropagation();
    
    this.value.set(optValue); 
    
    this.isOpen.set(false);
  }
  
  public onSearchClick(event: Event) {
    event.stopPropagation();
  }
  
  public onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event) {
    if (this.isOpen() && !this.el.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}