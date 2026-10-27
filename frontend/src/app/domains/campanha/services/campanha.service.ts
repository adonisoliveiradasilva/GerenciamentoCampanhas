import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ICampanhaVM {
  id: string;
  nome: string;
  local: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  
  anoLabel?: string;
  anoCss?: string;
  dataInicioFormatada?: string;
  dataFimFormatada?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CampanhaService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api`; 

  getAll(): Observable<ICampanhaVM[]> {
    return this.http.get<ICampanhaVM[]>(`${this.baseUrl}/Campanhas`);
  }

  create(campanha: Partial<ICampanhaVM>): Observable<ICampanhaVM> {
    return this.http.post<ICampanhaVM>(`${this.baseUrl}/Campanhas`, campanha);
  }

  update(id: string, campanha: Partial<ICampanhaVM>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Campanhas/${id}`, campanha);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Campanhas/${id}`);
  }
}