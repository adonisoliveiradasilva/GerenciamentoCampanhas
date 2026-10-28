import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface IDashboardKpiVM {
  totalItensEstoque: number;
  totalItensDoados: number;
  campanhasAtivas: number;
  doadoresCadastrados: number;
}

export interface IGraficoCampanhaVM {
  campanhaNome: string;
  totalArrecadado: number;
}

export interface IEstoqueStatusVM {
  integralmenteDisponivel: number;
  parcialmenteDoado: number;
  totalmenteEsgotado: number;
}

export interface ITopDoadorVM {
  doadorNome: string;
  totalItensDoados: number;
}

export interface IDashboardResumoVM {
  kpis: IDashboardKpiVM;
  arrecadacaoPorCampanha: IGraficoCampanhaVM[];
  statusEstoque: IEstoqueStatusVM;
  topDoadores: ITopDoadorVM[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api`;

  getResumo(): Observable<IDashboardResumoVM> {
    return this.http.get<IDashboardResumoVM>(`${this.baseUrl}/Dashboard`);
  }
}