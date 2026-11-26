import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, Subject, throwError } from 'rxjs';

import { Dashboard } from './dashboard';
import { DashboardService, IDashboardResumoVM } from '../../domains/dashboard/services/dashboard.service';
import { ToastService } from '../../domains/toast/services/toast-service';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const mockResumo: IDashboardResumoVM = {
    kpis: {
      totalItensEstoque: 120,
      totalItensDoados: 45,
      campanhasAtivas: 3,
      doadoresCadastrados: 18
    },
    arrecadacaoPorCampanha: [
      { campanhaNome: 'Campanha do Agasalho', totalArrecadado: 80 },
      { campanhaNome: 'Natal Solidário', totalArrecadado: 40 }
    ],
    statusEstoque: {
      integralmenteDisponivel: 70,
      parcialmenteDoado: 35,
      totalmenteEsgotado: 15
    },
    topDoadores: [
      { doadorNome: 'Maria Silva', totalItensDoados: 25 },
      { doadorNome: 'João Souza', totalItensDoados: 15 }
    ]
  };

  beforeEach(async () => {
    dashboardServiceSpy = jasmine.createSpyObj<DashboardService>('DashboardService', ['getResumo']);
    toastServiceSpy = jasmine.createSpyObj<ToastService>('ToastService', ['show', 'remove']);

    dashboardServiceSpy.getResumo.and.returnValue(of(mockResumo));

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideZonelessChangeDetection(),
        provideAnimationsAsync('noop'),
        { provide: DashboardService, useValue: dashboardServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load dashboard summary on init and stop loading', () => {
    fixture.detectChanges();

    expect(dashboardServiceSpy.getResumo).toHaveBeenCalledTimes(1);
    expect(component.data()).toEqual(mockResumo);
    expect(component.isLoading()).toBeFalse();
  });

  it('should remain in loading state while summary request is pending', () => {
    const pending$ = new Subject<IDashboardResumoVM>();
    dashboardServiceSpy.getResumo.and.returnValue(pending$.asObservable());

    fixture.detectChanges();

    expect(component.isLoading()).toBeTrue();
    expect(component.data()).toBeNull();
    expect(component.barChartData()).toBeNull();
    expect(component.doughnutChartData()).toBeNull();

    pending$.next(mockResumo);
    pending$.complete();

    expect(component.isLoading()).toBeFalse();
    expect(component.data()).toEqual(mockResumo);
  });

  it('should compute barChartData from arrecadacaoPorCampanha', () => {
    fixture.detectChanges();

    const barData = component.barChartData();
    expect(barData).not.toBeNull();
    expect(barData!.labels).toEqual(['Campanha do Agasalho', 'Natal Solidário']);
    expect(barData!.datasets[0].label).toBe('Total Arrecadado');
    expect(barData!.datasets[0].data).toEqual([80, 40]);
  });

  it('should format bar chart tooltip label with units', () => {
    const formatted = component.barChartOptions.plugins.tooltip.callbacks.label({ raw: 12 });
    expect(formatted).toBe(' 12 unidades');
  });

  it('should compute doughnutChartData from statusEstoque', () => {
    fixture.detectChanges();

    const doughnutData = component.doughnutChartData();
    expect(doughnutData).not.toBeNull();
    expect(doughnutData!.labels).toEqual([
      '100% Disponível',
      'Parcialmente Doado',
      'Totalmente Esgotado'
    ]);
    expect(doughnutData!.datasets[0].data).toEqual([70, 35, 15]);
  });

  it('should render top donors and campaign legends in the template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Maria Silva');
    expect(compiled.textContent).toContain('25 un.');
    expect(compiled.textContent).toContain('Campanha do Agasalho');
    expect(compiled.textContent).toContain('80 un.');
  });

  it('should show API error message when loading summary fails', () => {
    const errorResponse = new HttpErrorResponse({
      error: { erro: 'Falha ao consultar resumo.' },
      status: 500
    });
    dashboardServiceSpy.getResumo.and.returnValue(throwError(() => errorResponse));

    fixture.detectChanges();

    expect(component.isLoading()).toBeFalse();
    expect(component.data()).toBeNull();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Falha ao consultar resumo.');
  });

  it('should show fallback error message when error payload has no erro field', () => {
    const errorResponse = new HttpErrorResponse({ status: 500 });
    dashboardServiceSpy.getResumo.and.returnValue(throwError(() => errorResponse));

    fixture.detectChanges();

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Erro ao carregar dados.');
  });
});
