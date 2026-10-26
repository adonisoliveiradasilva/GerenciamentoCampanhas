
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lumen-search-input',
  imports: [],
  templateUrl: './search-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './search-input.scss',
})
export class SearchInput {
  placeholder = input<string>('');
  width = input<string>('100%');
  
  searchChange = output<string>();

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchChange.emit(inputElement.value);
  }
}