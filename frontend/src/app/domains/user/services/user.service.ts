import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ILoginUserRequest {
  email: string;
  password: string;
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
  private readonly baseUrl = `${environment.apiUrl}/user`;

  login(credentials: ILoginUserRequest): Observable<IUserResponse> {
    return this.http.post<IUserResponse>(`${this.baseUrl}/login`, credentials);
  }

  refreshToken(): Observable<IUserResponse> {
    return this.http.post<IUserResponse>(`${this.baseUrl}/refresh`, {});
  }

  getContextPermissions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/me/permissions`);
  }

  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/request-password-reset`, { email });
  }

  resetPassword(payload: { token: string, newPassword: string }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/reset-password`, payload);
  }

  updateLastAccessedContext(payload: { workspaceId: string | null, unitId: string | null }): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/update-context`, payload);
  }

  updateProfile(payload: { name: string }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/profile`, payload);
  }

  updatePreferences(payload: { theme: string, language: string, preferFullScreenModal: boolean }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/preferences`, payload);
  }
}