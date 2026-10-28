using System.Linq;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.DTOs;
using GerenciamentoCampanhas.Application.Interfaces;
using GerenciamentoCampanhas.Domain.Interfaces;

namespace GerenciamentoCampanhas.Application.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IDashboardRepository _dashboardRepository;

        public DashboardService(IDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }

        public async Task<DashboardResponseDTO> ObterDadosDashboardAsync()
        {
            var model = await _dashboardRepository.ObterResumoDashboardAsync();

            return new DashboardResponseDTO
            {
                Kpis = new DashboardKpiDTO
                {
                    TotalItensEstoque = model.Kpis.TotalItensEstoque,
                    TotalItensDoados = model.Kpis.TotalItensDoados,
                    CampanhasAtivas = model.Kpis.CampanhasAtivas,
                    DoadoresCadastrados = model.Kpis.DoadoresCadastrados
                },
                ArrecadacaoPorCampanha = model.ArrecadacaoPorCampanha.Select(c => new GraficoCampanhaDTO
                {
                    CampanhaNome = c.CampanhaNome,
                    TotalArrecadado = c.TotalArrecadado
                }).ToList(),
                StatusEstoque = new EstoqueStatusDTO
                {
                    IntegralmenteDisponivel = model.StatusEstoque.IntegralmenteDisponivel,
                    ParcialmenteDoado = model.StatusEstoque.ParcialmenteDoado,
                    TotalmenteEsgotado = model.StatusEstoque.TotalmenteEsgotado
                },
                TopDoadores = model.TopDoadores.Select(d => new TopDoadorDTO
                {
                    DoadorNome = d.DoadorNome,
                    TotalItensDoados = d.TotalItensDoados
                }).ToList()
            };
        }
    }
}