import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastWrapper } from './components/organisms/toast-wrapper/toast-wrapper';
import { ConfirmationModal } from './components/molecules/confirmation-modal/confirmation-modal';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastWrapper, ConfirmationModal],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
