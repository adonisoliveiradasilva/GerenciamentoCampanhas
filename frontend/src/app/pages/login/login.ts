import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthLayout } from '../../components/templates/auth-layout/auth-layout';
import { InputComponent } from '../../components/atoms/input/input';
import { Button } from '../../components/atoms/button/button';
import { Heading } from '../../components/atoms/heading/heading';
import { Link } from '../../components/atoms/link/link';
import { Loading } from '../../components/molecules/loading/loading';
import { UserService } from '../../domains/user/services/user.service';
import { ToastService } from '../../domains/toast/services/toast-service';

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
  private userService = inject(UserService);
  private toast = inject(ToastService);
  
  email = signal('');
  password = signal('');
  isLoading = signal(false);

  handleLoginSubmit() {
    if (!this.email() || !this.password()) {
      this.toast.show('warning', "Por favor, preencha e-mail e senha.");
      return;
    }

    this.isLoading.set(true);
    
    this.userService.login({ 
      email: this.email(), 
      senha: this.password() 
    }).subscribe({
      next: (response) => {
        localStorage.setItem('auth_token', response.token);
        
        this.userService.refreshUserState(); 
        
        this.isLoading.set(false);
        
        this.router.navigate(['/perfil']); 
      },
      error: (err) => {
        this.isLoading.set(false);
        const mensagemErro = err.error?.erro || "Ocorreu um erro ao fazer login.";
        this.toast.show('error', mensagemErro);
      }
    });
  }
}