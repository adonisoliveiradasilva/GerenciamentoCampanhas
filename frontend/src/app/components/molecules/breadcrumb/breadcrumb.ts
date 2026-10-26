import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface IBreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'breadcrumb',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Breadcrumb {
  items = input.required<IBreadcrumbItem[]>();
}