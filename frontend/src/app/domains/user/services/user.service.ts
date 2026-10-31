import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

export interface ILoginUserRequest {
  email: string;
  senha: string;
}

export interface IAuthResponse {
  token: string;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface IUsuarioVM {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  dataCriacao: Date;
  ativo: boolean;
  
  status?: string; 
  statusLabel?: string;
  statusCss?: string;
  statusIcon?: string;
}

export interface IAlterarSenhaRequest {
  senhaAtual: string;
  novaSenha: string;
}

export interface IAtualizarMeusDadosRequest {
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  public currentUser = signal<IUserResponse | null>(this.getLoggedUser());
  
  login(credentials: ILoginUserRequest): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.baseUrl}/Auth/login`, credentials);
  }

  getAll(): Observable<IUsuarioVM[]> {
    return this.http.get<IUsuarioVM[]>(`${this.baseUrl}/Usuarios`);
  }

  create(usuario: Partial<IUsuarioVM>): Observable<IUsuarioVM> {
    return this.http.post<IUsuarioVM>(`${this.baseUrl}/Usuarios`, usuario);
  }

  update(id: string, usuario: Partial<IUsuarioVM>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Usuarios/${id}`, usuario);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Usuarios/${id}`);
  }

  updateMeusDados(dados: IAtualizarMeusDadosRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Usuarios/MeusDados`, dados);
  }

  alterarSenha(dados: IAlterarSenhaRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Usuarios/AlterarSenha`, dados);
  }

  public refreshUserState(): void {
    this.currentUser.set(this.getLoggedUser());
  }
  
  public updateUserNameLocal(newName: string): void {
    const user = this.currentUser();
    if (user) {
      const updatedUser = { ...user, name: newName };
      this.currentUser.set(updatedUser);
      localStorage.setItem('auth_name_override', newName);
    }
  }

  getLoggedUser(): IUserResponse | null {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
            
      const user: IUserResponse = {
        id: decoded.nameid || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
        name: decoded.unique_name || decoded.name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Usuário',
        email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
        role: decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'Sem Perfil'
      };

      const nameOverride = localStorage.getItem('auth_name_override');
      if (nameOverride) {
        user.name = nameOverride;
      }

      return user;
    } catch (Error) {
      return null;
    }
  }
}