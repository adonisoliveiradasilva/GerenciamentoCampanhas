import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastWrapper } from './components/organisms/toast-wrapper/toast-wrapper';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastWrapper],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
