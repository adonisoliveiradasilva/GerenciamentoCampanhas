using GerenciamentoCampanhas.Application.DTOs;
using GerenciamentoCampanhas.Application.Services;
using GerenciamentoCampanhas.Domain.Entities;
using GerenciamentoCampanhas.Domain.Interfaces;
using Moq;
using Xunit;

namespace GerenciamentoCampanhas.Tests.Application;

public class ItemServiceTests
{
    private readonly Mock<IItemRepository> _itemRepo = new();
    private readonly Mock<ICampanhaRepository> _campanhaRepo = new();
    private readonly Mock<IDoadorRepository> _doadorRepo = new();
    private readonly Mock<IDoacaoRepository> _doacaoRepo = new();
    private readonly ItemService _service;

    public ItemServiceTests()
    {
        _service = new ItemService(_itemRepo.Object, _campanhaRepo.Object, _doadorRepo.Object, _doacaoRepo.Object);
    }

    [Fact]
    public async Task ObterTodosEObterPorId_DeveMapearFallbacksEHistoricoOrdenado()
    {
        var userId = Guid.NewGuid();
        var campanhaId = Guid.NewGuid();
        var item = new Item("Arroz", "5kg", 10, DateTime.UtcNow.AddDays(-5), new TimeSpan(9, 30, 0), "Sede", campanhaId, null, new List<string> { "img" }, userId);
        item.Doacoes.Add(new Doacao(item.Id, 2, DateTime.UtcNow.AddDays(-2), "Destino Antigo", userId));
        item.Doacoes.Add(new Doacao(item.Id, 3, DateTime.UtcNow.AddDays(-1), "Destino Recente", userId));

        _itemRepo.Setup(r => r.ObterTodosAsync()).ReturnsAsync(new[] { item });
        _itemRepo.Setup(r => r.ObterPorIdAsync(item.Id)).ReturnsAsync(item);

        var todos = (await _service.ObterTodosAsync()).ToList();
        Assert.Single(todos);

        var dto = await _service.ObterPorIdAsync(item.Id);
        Assert.Equal("Campanha Excluída", dto.CampanhaNome);
        Assert.Equal("Não informado", dto.DoadorNome);
        Assert.Equal("Sistema", dto.UsuarioCriadorNome);
        Assert.Equal("09:30", dto.HoraPego);
        Assert.Equal(2, dto.HistoricoDoacoes.Count);
        Assert.Equal("Destino Recente", dto.HistoricoDoacoes[0].Destino);
        Assert.Equal("Usuário Removido", dto.HistoricoDoacoes[0].UsuarioNome);

        await Assert.ThrowsAsync<Exception>(() => _service.ObterPorIdAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task CriarAsync_DeveValidarDependenciasEDataFutura()
    {
        var campanha = new Campanha("Camp", "Local", null, DateTime.UtcNow.AddDays(-10), null);
        var doador = new Doador("Doador", "d@email.com", new DateTime(1990, 1, 1));
        var userId = Guid.NewGuid();

        _campanhaRepo.Setup(r => r.ObterPorIdAsync(campanha.Id)).ReturnsAsync(campanha);
        _doadorRepo.Setup(r => r.ObterPorIdAsync(doador.Id)).ReturnsAsync(doador);
        _itemRepo.Setup(r => r.AdicionarAsync(It.IsAny<Item>()))
            .Callback<Item>(it => _itemRepo.Setup(r => r.ObterPorIdAsync(it.Id)).ReturnsAsync(it))
            .Returns(Task.CompletedTask);

        var criado = await _service.CriarAsync(new ItemRequestDTO
        {
            Nome = "Feijão",
            Quantidade = 5,
            DataChegada = DateTime.UtcNow.AddDays(-1),
            CampanhaId = campanha.Id,
            DoadorId = doador.Id
        }, userId);

        Assert.Equal("Feijão", criado.Nome);
        _itemRepo.Verify(r => r.AdicionarAsync(It.IsAny<Item>()), Times.Once);

        await Assert.ThrowsAsync<Exception>(() => _service.CriarAsync(new ItemRequestDTO
        {
            Nome = "Sem Campanha",
            Quantidade = 1,
            DataChegada = DateTime.UtcNow,
            CampanhaId = Guid.NewGuid()
        }, userId));

        await Assert.ThrowsAsync<Exception>(() => _service.CriarAsync(new ItemRequestDTO
        {
            Nome = "Sem Doador",
            Quantidade = 1,
            DataChegada = DateTime.UtcNow,
            CampanhaId = campanha.Id,
            DoadorId = Guid.NewGuid()
        }, userId));

        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CriarAsync(new ItemRequestDTO
        {
            Nome = "Futuro",
            Quantidade = 1,
            DataChegada = DateTime.UtcNow.AddDays(2),
            CampanhaId = campanha.Id
        }, userId));
    }

    [Fact]
    public async Task AtualizarAsync_DeveValidarRegrasEAtualizarItem()
    {
        var campanha = new Campanha("Camp", "Local", null, DateTime.UtcNow.AddDays(-10), null);
        var doador = new Doador("Doador", "d@email.com", new DateTime(1990, 1, 1));
        var userId = Guid.NewGuid();
        var item = new Item("Antigo", null, 3, DateTime.UtcNow.AddDays(-3), null, null, campanha.Id, null, null, userId);

        _itemRepo.Setup(r => r.ObterPorIdAsync(item.Id)).ReturnsAsync(item);
        _campanhaRepo.Setup(r => r.ObterPorIdAsync(campanha.Id)).ReturnsAsync(campanha);
        _doadorRepo.Setup(r => r.ObterPorIdAsync(doador.Id)).ReturnsAsync(doador);

        await _service.AtualizarAsync(item.Id, new ItemRequestDTO
        {
            Nome = "Novo",
            Quantidade = 6,
            DataChegada = DateTime.UtcNow.AddDays(-1),
            CampanhaId = campanha.Id,
            DoadorId = doador.Id
        }, userId);

        Assert.Equal("Novo", item.Nome);
        Assert.Equal(6, item.Quantidade);
        _itemRepo.Verify(r => r.AtualizarAsync(item), Times.Once);

        await Assert.ThrowsAsync<Exception>(() => _service.AtualizarAsync(Guid.NewGuid(), new ItemRequestDTO { CampanhaId = campanha.Id }, userId));
        await Assert.ThrowsAsync<Exception>(() => _service.AtualizarAsync(item.Id, new ItemRequestDTO { CampanhaId = Guid.NewGuid() }, userId));
        await Assert.ThrowsAsync<Exception>(() => _service.AtualizarAsync(item.Id, new ItemRequestDTO { CampanhaId = campanha.Id, DoadorId = Guid.NewGuid() }, userId));
        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.AtualizarAsync(item.Id, new ItemRequestDTO
        {
            Nome = "Futuro",
            Quantidade = 1,
            DataChegada = DateTime.UtcNow.AddDays(3),
            CampanhaId = campanha.Id
        }, userId));
    }

    [Fact]
    public async Task ExcluirAsync_DeveRemoverOuLancarErro()
    {
        var item = new Item("Item", null, 1, DateTime.UtcNow, null, null, Guid.NewGuid(), null, null, Guid.NewGuid());
        _itemRepo.Setup(r => r.ObterPorIdAsync(item.Id)).ReturnsAsync(item);

        await _service.ExcluirAsync(item.Id);
        _itemRepo.Verify(r => r.RemoverAsync(item), Times.Once);

        await Assert.ThrowsAsync<Exception>(() => _service.ExcluirAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task RegistrarDoacaoAsync_DeveBaixarEstoqueEValidarDatas()
    {
        var userId = Guid.NewGuid();
        var chegada = DateTime.UtcNow.Date.AddDays(-3);
        var item = new Item("Cobertor", null, 5, chegada, null, null, Guid.NewGuid(), null, null, userId);
        _itemRepo.Setup(r => r.ObterPorIdAsync(item.Id)).ReturnsAsync(item);

        await _service.RegistrarDoacaoAsync(new DoacaoRequestDTO
        {
            ItemId = item.Id,
            Quantidade = 2,
            DataDoacao = DateTime.UtcNow.Date,
            Destino = "Abrigo Municipal"
        }, userId);

        Assert.Equal(3, item.Quantidade);
        _doacaoRepo.Verify(r => r.AdicionarAsync(It.IsAny<Doacao>()), Times.Once);
        _itemRepo.Verify(r => r.AtualizarAsync(item), Times.Once);

        await Assert.ThrowsAsync<Exception>(() => _service.RegistrarDoacaoAsync(new DoacaoRequestDTO { ItemId = Guid.NewGuid() }, userId));

        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.RegistrarDoacaoAsync(new DoacaoRequestDTO
        {
            ItemId = item.Id,
            Quantidade = 1,
            DataDoacao = chegada.AddDays(-1),
            Destino = "Antes da chegada"
        }, userId));

        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.RegistrarDoacaoAsync(new DoacaoRequestDTO
        {
            ItemId = item.Id,
            Quantidade = 1,
            DataDoacao = DateTime.UtcNow.Date.AddDays(2),
            Destino = "Futuro"
        }, userId));
    }
}
