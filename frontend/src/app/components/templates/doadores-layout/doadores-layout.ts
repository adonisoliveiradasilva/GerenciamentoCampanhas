import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lumen-doadores-layout',
  standalone: true,
  imports: [],
  host: { 'class': 'expand-host' },
  templateUrl: './doadores-layout.html',
  styleUrl: './doadores-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoadoresLayout { }