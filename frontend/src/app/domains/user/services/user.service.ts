import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

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
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/Auth`; 

  login(credentials: ILoginUserRequest): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.baseUrl}/login`, credentials);
  }
}