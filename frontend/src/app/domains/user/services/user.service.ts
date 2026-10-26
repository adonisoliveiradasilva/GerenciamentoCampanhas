import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { jwtDecode } from 'jwt-decode'; // Importação da lib

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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api`; 

  login(credentials: ILoginUserRequest): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.baseUrl}/Auth/login`, credentials);
  }

  getAll(): Observable<IUsuarioVM[]> {
    return this.http.get<IUsuarioVM[]>(`${this.baseUrl}/Usuarios`);
  }

  getLoggedUser(): IUserResponse | null {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      
      console.log('Token JWT Decodificado:', decoded);
      
      return {
        id: decoded.nameid || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
        
        name: decoded.unique_name || decoded.name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Usuário',
        
        email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
        
        role: decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'Sem Perfil'
      };
    } catch (Error) {
      return null;
    }
  }
}