import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lumen-dashboard-layout',
  standalone: true,
  imports: [],
  host: { 'class': 'expand-host' },
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayout {}