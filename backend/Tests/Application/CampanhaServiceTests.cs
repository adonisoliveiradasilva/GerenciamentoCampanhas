using GerenciamentoCampanhas.Application.DTOs;
using GerenciamentoCampanhas.Application.Services;
using GerenciamentoCampanhas.Domain.Entities;
using GerenciamentoCampanhas.Domain.Interfaces;
using Moq;
using Xunit;

namespace GerenciamentoCampanhas.Tests.Application;

public class CampanhaServiceTests
{
    private readonly Mock<ICampanhaRepository> _repoMock = new();
    private readonly CampanhaService _service;

    public CampanhaServiceTests()
    {
        _service = new CampanhaService(_repoMock.Object);
    }

    [Fact]
    public async Task ObterTodosAsync_DeveMapearListaDeCampanhas()
    {
        var lista = new List<Campanha>
        {
            new("Agasalho", "Matriz", "Desc", DateTime.UtcNow, DateTime.UtcNow.AddDays(10)),
            new("Natal", "Centro", null, DateTime.UtcNow, null)
        };
        _repoMock.Setup(r => r.ObterTodosAsync()).ReturnsAsync(lista);

        var resultado = (await _service.ObterTodosAsync()).ToList();

        Assert.Equal(2, resultado.Count);
        Assert.Equal("Agasalho", resultado[0].Nome);
        Assert.Equal("Natal", resultado[1].Nome);
    }

    [Fact]
    public async Task ObterPorIdAsync_QuandoEncontradaOuInexistente_DeveResponderCorretamente()
    {
        var campanha = new Campanha("Páscoa", "Salão", "Chocolates", DateTime.UtcNow, null);
        _repoMock.Setup(r => r.ObterPorIdAsync(campanha.Id)).ReturnsAsync(campanha);

        var dto = await _service.ObterPorIdAsync(campanha.Id);
        Assert.Equal(campanha.Id, dto.Id);
        Assert.Equal("Páscoa", dto.Nome);

        await Assert.ThrowsAsync<Exception>(() => _service.ObterPorIdAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task CriarAsync_ComDadosValidosEInvalidos_DeveValidarDatasEPersistir()
    {
        var inicio = new DateTime(2026, 6, 1);
        var dto = new CampanhaCreateDTO
        {
            Nome = "Inverno Solidário",
            Local = "Igreja Central",
            Descricao = "Cobertores",
            DataInicio = inicio,
            DataFim = inicio.AddDays(30)
        };

        var criada = await _service.CriarAsync(dto);

        Assert.Equal("Inverno Solidário", criada.Nome);
        Assert.Equal(DateTimeKind.Utc, criada.DataInicio.Kind);
        Assert.Equal(DateTimeKind.Utc, criada.DataFim!.Value.Kind);
        _repoMock.Verify(r => r.AdicionarAsync(It.IsAny<Campanha>()), Times.Once);

        var semFim = await _service.CriarAsync(new CampanhaCreateDTO { Nome = "Contínua", Local = "Sede", DataInicio = inicio });
        Assert.Null(semFim.DataFim);

        await Assert.ThrowsAsync<Exception>(() => _service.CriarAsync(new CampanhaCreateDTO
        {
            Nome = "Inválida",
            Local = "Sede",
            DataInicio = inicio,
            DataFim = inicio.AddDays(-1)
        }));
    }

    [Fact]
    public async Task AtualizarAsync_DeveAtualizarOuLancarErro()
    {
        var inicio = new DateTime(2026, 7, 1);
        var campanha = new Campanha("Original", "Local A", null, inicio, null);
        _repoMock.Setup(r => r.ObterPorIdAsync(campanha.Id)).ReturnsAsync(campanha);

        await _service.AtualizarAsync(campanha.Id, new CampanhaUpdateDTO
        {
            Nome = "Atualizada",
            Local = "Local B",
            Descricao = "Nova desc",
            DataInicio = inicio,
            DataFim = inicio.AddDays(15)
        });

        Assert.Equal("Atualizada", campanha.Nome);
        Assert.Equal("Local B", campanha.Local);
        _repoMock.Verify(r => r.AtualizarAsync(campanha), Times.Once);

        await _service.AtualizarAsync(campanha.Id, new CampanhaUpdateDTO
        {
            Nome = "Sem Fim",
            Local = "Local B",
            DataInicio = inicio,
            DataFim = null
        });
        Assert.Null(campanha.DataFim);

        await Assert.ThrowsAsync<Exception>(() => _service.AtualizarAsync(Guid.NewGuid(), new CampanhaUpdateDTO { DataInicio = inicio }));
        await Assert.ThrowsAsync<Exception>(() => _service.AtualizarAsync(campanha.Id, new CampanhaUpdateDTO
        {
            Nome = "Erro",
            Local = "Local",
            DataInicio = inicio,
            DataFim = inicio.AddDays(-2)
        }));
    }

    [Fact]
    public async Task ExcluirAsync_DeveRemoverOuLancarErro()
    {
        var campanha = new Campanha("Excluir", "Local", null, DateTime.UtcNow, null);
        _repoMock.Setup(r => r.ObterPorIdAsync(campanha.Id)).ReturnsAsync(campanha);

        await _service.ExcluirAsync(campanha.Id);
        _repoMock.Verify(r => r.RemoverAsync(campanha), Times.Once);

        await Assert.ThrowsAsync<Exception>(() => _service.ExcluirAsync(Guid.NewGuid()));
    }
}
