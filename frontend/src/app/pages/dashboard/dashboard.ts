import { Component, signal, computed, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChartModule } from 'primeng/chart';

import { DashboardLayout } from '../../components/templates/dashboard-layout/dashboard-layout';
import { PageHeader } from '../../components/atoms/page-header/page-header';
import { StatCard } from '../../components/molecules/stat-card/stat-card';
import { ChartWrapper } from '../../components/atoms/chart-wrapper/chart-wrapper';
import { DashboardService, IDashboardResumoVM } from '../../domains/dashboard/services/dashboard.service';
import { ToastService } from '../../domains/toast/services/toast-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardLayout, PageHeader, StatCard, ChartWrapper, ChartModule],
  host: { 'class': 'expand-host' },
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  private toastService = inject(ToastService);

  public isLoading = signal<boolean>(true);
  public data = signal<IDashboardResumoVM | null>(null);

  ngOnInit(): void {
    this.carregarDados();
  }

  private carregarDados(): void {
    this.isLoading.set(true);
    this.dashboardService.getResumo().subscribe({
      next: (resumo) => {
        this.data.set(resumo);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.toastService.show('error', err.error?.erro || 'Erro ao carregar dados.');
      }
    });
  }

  public barChartData = computed(() => {
    const resumo = this.data();
    if (!resumo) return null;

    return {
      labels: resumo.arrecadacaoPorCampanha.map(c => c.campanhaNome),
      datasets: [
        {
          label: 'Total Arrecadado',
          data: resumo.arrecadacaoPorCampanha.map(c => c.totalArrecadado),
          backgroundColor: '#8A7EBC',
          borderRadius: 6,
          barThickness: 40
        }
      ]
    };
  });

  public barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.raw} unidades`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  public doughnutChartData = computed(() => {
    const resumo = this.data();
    if (!resumo) return null;

    return {
      labels: ['100% Disponível', 'Parcialmente Doado', 'Totalmente Esgotado'],
      datasets: [
        {
          data: [
            resumo.statusEstoque.integralmenteDisponivel,
            resumo.statusEstoque.parcialmenteDoado,
            resumo.statusEstoque.totalmenteEsgotado
          ],
          backgroundColor: [
            '#3B926A',
            '#FA9C42',
            '#DD4C73'
          ],
          borderWidth: 0,
          cutout: '75%'
        }
      ]
    };
  });

  public doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };
}