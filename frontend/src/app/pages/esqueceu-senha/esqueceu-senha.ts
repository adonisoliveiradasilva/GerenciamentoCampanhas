import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthLayout } from '../../components/templates/auth-layout/auth-layout';
import { InputComponent } from '../../components/atoms/input/input';
import { Button } from '../../components/atoms/button/button';
import { Heading } from '../../components/atoms/heading/heading';
import { Link } from '../../components/atoms/link/link';
import { Loading } from '../../components/molecules/loading/loading';
import { ToastService } from '../../domains/toast/services/toast-service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'esqueceu-senha',
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
  templateUrl: './esqueceu-senha.html',
  styleUrl: './esqueceu-senha.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsqueceuSenha {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastService);

  email = '';
  isLoading = signal(false);

  handleSubmit() {
    if (!this.email) {
      this.toast.show('warning', 'Por favor, informe seu e-mail.');
      return;
    }

    this.isLoading.set(true);

    this.http.post(`${environment.apiUrl || 'http://localhost:5000/api'}/auth/forgot-password`, {
      email: this.email
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.show('success', 'Instruções enviadas para o seu e-mail.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const mensagemErro = err.error?.erro || 'Ocorreu ao solicitar a recuperação.';
        this.toast.show('error', mensagemErro);
      }
    });
  }
}