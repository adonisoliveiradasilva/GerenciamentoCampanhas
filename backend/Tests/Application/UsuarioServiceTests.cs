using GerenciamentoCampanhas.Application.DTOs;
using GerenciamentoCampanhas.Application.Interfaces;
using GerenciamentoCampanhas.Application.Services;
using GerenciamentoCampanhas.Domain.Entities;
using GerenciamentoCampanhas.Domain.Enums;
using GerenciamentoCampanhas.Domain.Interfaces;
using Moq;
using Xunit;

namespace GerenciamentoCampanhas.Tests.Application;

public class UsuarioServiceTests
{
    private readonly Mock<IUsuarioRepository> _repoMock = new();
    private readonly Mock<IEmailService> _emailMock = new();
    private readonly UsuarioService _service;

    public UsuarioServiceTests()
    {
        _service = new UsuarioService(_repoMock.Object, _emailMock.Object);
    }

    [Fact]
    public async Task ObterTodosAsync_DeveMapearUsuarios()
    {
        var usuarios = new[]
        {
            new Usuario("Admin", "admin@ufop.br", "hash", PerfilUsuario.Administrador)
        };
        _repoMock.Setup(r => r.ObterTodosAsync()).ReturnsAsync(usuarios);

        var resultado = (await _service.ObterTodosAsync()).ToList();

        Assert.Single(resultado);
        Assert.Equal("Admin", resultado[0].Nome);
        Assert.Equal("Administrador", resultado[0].Perfil);
        Assert.True(resultado[0].Ativo);
    }

    [Fact]
    public async Task CriarAsync_DeveValidarEmailPerfilEEnviarBoasVindas()
    {
        var criado = await _service.CriarAsync(new UsuarioCreateDTO
        {
            Nome = "Novo Diácono",
            Email = "diacono@ufop.br",
            Perfil = "Diacono"
        });

        Assert.Equal("Novo Diácono", criado.Nome);
        Assert.Equal("Diacono", criado.Perfil);
        _repoMock.Verify(r => r.AdicionarAsync(It.IsAny<Usuario>()), Times.Once);
        _emailMock.Verify(e => e.EnviarBoasVindasAsync("diacono@ufop.br", "Novo Diácono", It.Is<string>(s => s.Length == 8)), Times.Once);

        _repoMock.Setup(r => r.ObterPorEmailAsync("dup@ufop.br"))
            .ReturnsAsync(new Usuario("Dup", "dup@ufop.br", "h", PerfilUsuario.Diacono));

        await Assert.ThrowsAsync<Exception>(() => _service.CriarAsync(new UsuarioCreateDTO
        {
            Nome = "Dup",
            Email = "dup@ufop.br",
            Perfil = "Diacono"
        }));

        await Assert.ThrowsAsync<Exception>(() => _service.CriarAsync(new UsuarioCreateDTO
        {
            Nome = "Invalido",
            Email = "novo2@ufop.br",
            Perfil = "Inexistente"
        }));
    }

    [Fact]
    public async Task AtualizarAsync_DeveAlterarDadosPerfilEStatus()
    {
        var usuario = new Usuario("Original", "orig@ufop.br", "hash", PerfilUsuario.Diacono);
        _repoMock.Setup(r => r.ObterPorIdAsync(usuario.Id)).ReturnsAsync(usuario);

        await _service.AtualizarAsync(usuario.Id, new UsuarioUpdateDTO
        {
            Nome = "Editado",
            Email = "edit@ufop.br",
            Perfil = "Administrador",
            Ativo = false
        });
        Assert.Equal("Editado", usuario.Nome);
        Assert.Equal(PerfilUsuario.Administrador, usuario.Perfil);
        Assert.False(usuario.Ativo);

        await _service.AtualizarAsync(usuario.Id, new UsuarioUpdateDTO
        {
            Nome = "Reativado",
            Email = "edit@ufop.br",
            Perfil = "Diacono",
            Ativo = true
        });
        Assert.True(usuario.Ativo);

        await Assert.ThrowsAsync<Exception>(() => _service.AtualizarAsync(Guid.NewGuid(), new UsuarioUpdateDTO { Perfil = "Diacono" }));
        await Assert.ThrowsAsync<Exception>(() => _service.AtualizarAsync(usuario.Id, new UsuarioUpdateDTO { Perfil = "Invalido" }));
    }

    [Fact]
    public async Task AlterarSenhaAsync_DeveValidarSenhaAtualEAtualizarHash()
    {
        var usuario = new Usuario("User", "u@ufop.br", BCrypt.Net.BCrypt.HashPassword("Atual@123"), PerfilUsuario.Diacono);
        _repoMock.Setup(r => r.ObterPorIdAsync(usuario.Id)).ReturnsAsync(usuario);

        await _service.AlterarSenhaAsync(usuario.Id, new AlterarSenhaDTO
        {
            SenhaAtual = "Atual@123",
            NovaSenha = "Nova@1234"
        });
        Assert.True(BCrypt.Net.BCrypt.Verify("Nova@1234", usuario.SenhaHash));
        _repoMock.Verify(r => r.AtualizarAsync(usuario), Times.Once);

        await Assert.ThrowsAsync<Exception>(() => _service.AlterarSenhaAsync(usuario.Id, new AlterarSenhaDTO
        {
            SenhaAtual = "Errada",
            NovaSenha = "Nova@1234"
        }));

        await Assert.ThrowsAsync<Exception>(() => _service.AlterarSenhaAsync(Guid.NewGuid(), new AlterarSenhaDTO()));
    }

    [Fact]
    public async Task AtualizarMeusDadosEExcluir_DeveFuncionarOuLancarErro()
    {
        var usuario = new Usuario("Antigo", "keep@ufop.br", "hash", PerfilUsuario.Diacono);
        _repoMock.Setup(r => r.ObterPorIdAsync(usuario.Id)).ReturnsAsync(usuario);

        await _service.AtualizarMeusDadosAsync(usuario.Id, new AtualizarMeusDadosDTO { Nome = "Novo Nome" });
        Assert.Equal("Novo Nome", usuario.Nome);
        Assert.Equal("keep@ufop.br", usuario.Email);

        await Assert.ThrowsAsync<Exception>(() => _service.AtualizarMeusDadosAsync(Guid.NewGuid(), new AtualizarMeusDadosDTO { Nome = "X" }));

        await _service.ExcluirAsync(usuario.Id);
        _repoMock.Verify(r => r.RemoverAsync(usuario), Times.Once);

        await Assert.ThrowsAsync<Exception>(() => _service.ExcluirAsync(Guid.NewGuid()));
    }
}
