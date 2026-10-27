import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface IItemVM {
  id: string;
  nome: string;
  descricao?: string;
  quantidade?: number;
  dataChegada: string;
  lugarPego?: string;
  horaPego?: string;
  campanhaId: string;
  doadorId?: string;
  imagens?: string[]; 
  
  campanhaNome?: string;
  doadorNome?: string;
  dataChegadaFormatada?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api`; 

  getAll(): Observable<IItemVM[]> {
    return this.http.get<IItemVM[]>(`${this.baseUrl}/Itens`);
  }

  create(item: Partial<IItemVM>): Observable<IItemVM> {
    return this.http.post<IItemVM>(`${this.baseUrl}/Itens`, item);
  }

  update(id: string, item: Partial<IItemVM>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Itens/${id}`, item);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Itens/${id}`);
  }
}