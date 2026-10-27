import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface IDoadorVM {
  id: string;
  nome: string;
  dataNascimento: string; 
  email: string;
  
  dataNascimentoFormatada?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoadorService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api`; 

  getAll(): Observable<IDoadorVM[]> {
    return this.http.get<IDoadorVM[]>(`${this.baseUrl}/Doadores`);
  }

  create(doador: Partial<IDoadorVM>): Observable<IDoadorVM> {
    return this.http.post<IDoadorVM>(`${this.baseUrl}/Doadores`, doador);
  }

  update(id: string, doador: Partial<IDoadorVM>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Doadores/${id}`, doador);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Doadores/${id}`);
  }
}