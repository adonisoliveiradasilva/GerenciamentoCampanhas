import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthLayout } from '../../components/templates/auth-layout/auth-layout';
import { InputComponent } from '../../components/atoms/input/input';
import { Button } from '../../components/atoms/button/button';
import { Heading } from '../../components/atoms/heading/heading';
import { Link } from '../../components/atoms/link/link';
import { Loading } from '../../components/molecules/loading/loading';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    FormsModule, 
    AuthLayout, 
    InputComponent, 
    Button, 
    Heading, 
    Link,
    Loading
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private router = inject(Router);

  email = signal('');
  password = signal('');
  isLoading = signal(false);

  handleLoginSubmit() {
    if (!this.email() || !this.password()) {
      alert('Por favor, preencha e-mail e senha.');
      return;
    }

    this.isLoading.set(true);
    
    setTimeout(() => {
      localStorage.setItem('auth_token', 'fake-jwt-token-doacoes');
      this.isLoading.set(false);
      this.router.navigate(['/dashboard']);
    }, 1500);
  }
}