using GerenciamentoCampanhas.Application.Services;
using GerenciamentoCampanhas.Domain.Interfaces;
using GerenciamentoCampanhas.Domain.Models;
using Moq;
using Xunit;

namespace GerenciamentoCampanhas.Tests.Application;

public class DashboardServiceTests
{
    [Fact]
    public async Task ObterDadosDashboardAsync_DeveMapearTodosOsDadosDoModelo()
    {
        var repoMock = new Mock<IDashboardRepository>();
        repoMock.Setup(r => r.ObterResumoDashboardAsync()).ReturnsAsync(new DashboardResumoModel
        {
            Kpis = new DashboardKpiModel
            {
                TotalItensEstoque = 40,
                TotalItensDoados = 25,
                CampanhasAtivas = 3,
                DoadoresCadastrados = 12
            },
            ArrecadacaoPorCampanha = new List<GraficoCampanhaModel>
            {
                new() { CampanhaNome = "Campanha A", TotalArrecadado = 30 }
            },
            StatusEstoque = new EstoqueStatusModel
            {
                IntegralmenteDisponivel = 5,
                ParcialmenteDoado = 3,
                TotalmenteEsgotado = 2
            },
            TopDoadores = new List<TopDoadorModel>
            {
                new() { DoadorNome = "Carlos", TotalItensDoados = 18 }
            }
        });

        var service = new DashboardService(repoMock.Object);
        var dto = await service.ObterDadosDashboardAsync();

        Assert.Equal(40, dto.Kpis.TotalItensEstoque);
        Assert.Equal(25, dto.Kpis.TotalItensDoados);
        Assert.Equal(3, dto.Kpis.CampanhasAtivas);
        Assert.Equal(12, dto.Kpis.DoadoresCadastrados);
        Assert.Single(dto.ArrecadacaoPorCampanha);
        Assert.Equal("Campanha A", dto.ArrecadacaoPorCampanha[0].CampanhaNome);
        Assert.Equal(5, dto.StatusEstoque.IntegralmenteDisponivel);
        Assert.Equal(3, dto.StatusEstoque.ParcialmenteDoado);
        Assert.Equal(2, dto.StatusEstoque.TotalmenteEsgotado);
        Assert.Single(dto.TopDoadores);
        Assert.Equal("Carlos", dto.TopDoadores[0].DoadorNome);
    }
}
