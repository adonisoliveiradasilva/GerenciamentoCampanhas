using GerenciamentoCampanhas.Application.DTOs;
using GerenciamentoCampanhas.Application.Services;
using GerenciamentoCampanhas.Domain.Entities;
using GerenciamentoCampanhas.Domain.Interfaces;
using Moq;
using Xunit;

namespace GerenciamentoCampanhas.Tests.Application;

public class DoadorServiceTests
{
    private readonly Mock<IDoadorRepository> _repoMock = new();
    private readonly DoadorService _service;

    public DoadorServiceTests()
    {
        _service = new DoadorService(_repoMock.Object);
    }

    [Fact]
    public async Task ObterTodosEObterPorId_DeveRetornarDoadoresOuErro()
    {
        var doador = new Doador("Ana", "ana@email.com", new DateTime(1995, 5, 1, 0, 0, 0, DateTimeKind.Utc));
        _repoMock.Setup(r => r.ObterTodosAsync()).ReturnsAsync(new[] { doador });
        _repoMock.Setup(r => r.ObterPorIdAsync(doador.Id)).ReturnsAsync(doador);

        var todos = (await _service.ObterTodosAsync()).ToList();
        Assert.Single(todos);
        Assert.Equal("Ana", todos[0].Nome);

        var porId = await _service.ObterPorIdAsync(doador.Id);
        Assert.Equal("ana@email.com", porId.Email);

        await Assert.ThrowsAsync<Exception>(() => _service.ObterPorIdAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task CriarAsync_DeveValidarDataEmailDuplicadoECriar()
    {
        var valido = new DoadorRequestDTO
        {
            Nome = "Carlos",
            Email = " CARLOS@Email.com ",
            DataNascimento = new DateTime(1988, 10, 15)
        };

        var criado = await _service.CriarAsync(valido);
        Assert.Equal("carlos@email.com", criado.Email);
        _repoMock.Verify(r => r.AdicionarAsync(It.IsAny<Doador>()), Times.Once);

        await Assert.ThrowsAsync<Exception>(() => _service.CriarAsync(new DoadorRequestDTO
        {
            Nome = "Futuro",
            Email = "f@email.com",
            DataNascimento = DateTime.UtcNow.AddDays(2)
        }));

        _repoMock.Setup(r => r.ObterPorEmailAsync("dup@email.com"))
            .ReturnsAsync(new Doador("Existente", "dup@email.com", new DateTime(1990, 1, 1)));

        await Assert.ThrowsAsync<Exception>(() => _service.CriarAsync(new DoadorRequestDTO
        {
            Nome = "Dup",
            Email = "dup@email.com",
            DataNascimento = new DateTime(1990, 1, 1)
        }));
    }

    [Fact]
    public async Task AtualizarAsync_DeveValidarRegrasEAtualizar()
    {
        var doador = new Doador("Pedro", "pedro@email.com", new DateTime(1990, 1, 1, 0, 0, 0, DateTimeKind.Utc));
        var outro = new Doador("Outro", "outro@email.com", new DateTime(1990, 1, 1, 0, 0, 0, DateTimeKind.Utc));

        _repoMock.Setup(r => r.ObterPorIdAsync(doador.Id)).ReturnsAsync(doador);
        _repoMock.Setup(r => r.ObterPorEmailAsync("pedro@email.com")).ReturnsAsync(doador);
        _repoMock.Setup(r => r.ObterPorEmailAsync("outro@email.com")).ReturnsAsync(outro);

        await _service.AtualizarAsync(doador.Id, new DoadorRequestDTO
        {
            Nome = "Pedro Atualizado",
            Email = "PEDRO@email.com",
            DataNascimento = new DateTime(1991, 2, 2)
        });
        Assert.Equal("Pedro Atualizado", doador.Nome);
        _repoMock.Verify(r => r.AtualizarAsync(doador), Times.Once);

        await Assert.ThrowsAsync<Exception>(() => _service.AtualizarAsync(Guid.NewGuid(), new DoadorRequestDTO
        {
            Nome = "X",
            Email = "x@email.com",
            DataNascimento = new DateTime(1990, 1, 1)
        }));

        await Assert.ThrowsAsync<Exception>(() => _service.AtualizarAsync(doador.Id, new DoadorRequestDTO
        {
            Nome = "Futuro",
            Email = "pedro@email.com",
            DataNascimento = DateTime.UtcNow.AddDays(5)
        }));

        await Assert.ThrowsAsync<Exception>(() => _service.AtualizarAsync(doador.Id, new DoadorRequestDTO
        {
            Nome = "Pedro",
            Email = "outro@email.com",
            DataNascimento = new DateTime(1990, 1, 1)
        }));
    }

    [Fact]
    public async Task ExcluirAsync_DeveRemoverOuLancarErro()
    {
        var doador = new Doador("Remover", "rem@email.com", new DateTime(1990, 1, 1));
        _repoMock.Setup(r => r.ObterPorIdAsync(doador.Id)).ReturnsAsync(doador);

        await _service.ExcluirAsync(doador.Id);
        _repoMock.Verify(r => r.RemoverAsync(doador), Times.Once);

        await Assert.ThrowsAsync<Exception>(() => _service.ExcluirAsync(Guid.NewGuid()));
    }
}
