import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lumen-campanhas-layout',
  standalone: true,
  imports: [],
  host: { 'class': 'expand-host' },
  templateUrl: './campanhas-layout.html',
  styleUrl: './campanhas-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampanhasLayout { }