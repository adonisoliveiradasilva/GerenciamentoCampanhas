import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'auth-layout',
  standalone: true,
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLayout {
  txtWelcome = input.required<string>();
  txtSubtitle = input.required<string>();
  txtSecurityBadge = input.required<string>();
}