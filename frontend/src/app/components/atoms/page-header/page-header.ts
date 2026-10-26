import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lumen-page-header',
  imports: [],
  templateUrl: './page-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './page-header.scss',
})
export class PageHeader {
  label = input<string>('');
}
