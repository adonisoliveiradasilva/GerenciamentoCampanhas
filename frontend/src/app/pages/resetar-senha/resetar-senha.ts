import { Component, inject, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'resetar-senha',
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
  templateUrl: './resetar-senha.html',
  styleUrl: './resetar-senha.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetarSenha implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  email = signal('');
  token = signal('');
  novaSenha = signal('');
  isLoading = signal(false);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email.set(params['email'] || '');
      this.token.set(params['token'] || '');
    });
  }

  handleSubmit() {
    if (!this.novaSenha()) {
      this.toast.show('warning', 'Por favor, informe a nova senha.');
      return;
    }

    this.isLoading.set(true);

    this.http.post(`${environment.apiUrl || 'http://localhost:5000/api'}/auth/reset-password`, {
      email: this.email(),
      token: this.token(),
      novaSenha: this.novaSenha()
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.show('success', 'Senha alterada com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const mensagemErro = err.error?.erro || 'Erro ao redefinir a senha.';
        this.toast.show('error', mensagemErro);
      }
    });
  }
}