using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using GerenciamentoCampanhas.Application.DTOs;
using GerenciamentoCampanhas.Application.Interfaces;
using GerenciamentoCampanhas.Application.Services;
using GerenciamentoCampanhas.Domain.Entities;
using GerenciamentoCampanhas.Domain.Enums;
using GerenciamentoCampanhas.Domain.Interfaces;
using Moq;
using Xunit;

namespace GerenciamentoCampanhas.Tests.Application;

public class AuthServiceTests
{
    private readonly Mock<IUsuarioRepository> _repoMock = new();
    private readonly Mock<IEmailService> _emailMock = new();
    private readonly AuthService _service;

    public AuthServiceTests()
    {
        _service = new AuthService(_repoMock.Object, _emailMock.Object);
    }

    [Fact]
    public async Task LoginAsync_ComCredenciaisValidas_DeveRetornarJwtComClaims()
    {
        var hash = BCrypt.Net.BCrypt.HashPassword("Senha@123");
        var usuario = new Usuario("Adonis", "adonis@ufop.br", hash, PerfilUsuario.Administrador);
        _repoMock.Setup(r => r.ObterPorEmailAsync("adonis@ufop.br")).ReturnsAsync(usuario);

        var token = await _service.LoginAsync(new LoginRequestDTO { Email = " adonis@ufop.br ", Senha = "Senha@123" });

        Assert.False(string.IsNullOrWhiteSpace(token));
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
        Assert.Equal(usuario.Id.ToString(), jwt.Claims.First(c => c.Type == "nameid").Value);
        Assert.Equal("adonis@ufop.br", jwt.Claims.First(c => c.Type == "email").Value);
        Assert.Equal("Adonis", jwt.Claims.First(c => c.Type == "unique_name").Value);
        Assert.Equal("Administrador", jwt.Claims.First(c => c.Type == "role").Value);
    }

    [Fact]
    public async Task LoginAsync_ComUsuarioInexistente_DeveLancarExcecao()
    {
        _repoMock.Setup(r => r.ObterPorEmailAsync(It.IsAny<string>())).ReturnsAsync((Usuario?)null);

        var ex = await Assert.ThrowsAsync<Exception>(() =>
            _service.LoginAsync(new LoginRequestDTO { Email = "naoexiste@ufop.br", Senha = "123" }));

        Assert.Equal("E-mail ou senha inválidos.", ex.Message);
    }

    [Fact]
    public async Task LoginAsync_ComUsuarioInativo_DeveLancarExcecao()
    {
        var usuario = new Usuario("Inativo", "inativo@ufop.br", BCrypt.Net.BCrypt.HashPassword("123456"), PerfilUsuario.Diacono);
        usuario.Desativar();
        _repoMock.Setup(r => r.ObterPorEmailAsync("inativo@ufop.br")).ReturnsAsync(usuario);

        var ex = await Assert.ThrowsAsync<Exception>(() =>
            _service.LoginAsync(new LoginRequestDTO { Email = "inativo@ufop.br", Senha = "123456" }));

        Assert.Equal("Usuário inativo. Procure a administração.", ex.Message);
    }

    [Fact]
    public async Task LoginAsync_ComSenhaIncorreta_DeveLancarExcecao()
    {
        var usuario = new Usuario("Ativo", "ativo@ufop.br", BCrypt.Net.BCrypt.HashPassword("Correta1!"), PerfilUsuario.Diacono);
        _repoMock.Setup(r => r.ObterPorEmailAsync("ativo@ufop.br")).ReturnsAsync(usuario);

        var ex = await Assert.ThrowsAsync<Exception>(() =>
            _service.LoginAsync(new LoginRequestDTO { Email = "ativo@ufop.br", Senha = "Errada" }));

        Assert.Equal("E-mail ou senha inválidos.", ex.Message);
    }

    [Fact]
    public async Task SolicitarRecuperacaoSenhaAsync_UsuarioNaoEncontrado_NaoDeveEnviarEmail()
    {
        _repoMock.Setup(r => r.ObterPorEmailAsync("desconhecido@ufop.br")).ReturnsAsync((Usuario?)null);

        await _service.SolicitarRecuperacaoSenhaAsync(new EsqueceuSenhaDTO { Email = "desconhecido@ufop.br" });

        _repoMock.Verify(r => r.AtualizarAsync(It.IsAny<Usuario>()), Times.Never);
        _emailMock.Verify(e => e.EnviarRecuperacaoSenhaAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task SolicitarRecuperacaoSenhaAsync_UsuarioEncontrado_DeveGerarTokenEEnviarEmail()
    {
        var originalFrontend = Environment.GetEnvironmentVariable("FRONTEND_URL");
        Environment.SetEnvironmentVariable("FRONTEND_URL", "https://app.teste.com/");
        try
        {
            var usuario = new Usuario("Maria", "maria@ufop.br", "hash", PerfilUsuario.Diacono);
            _repoMock.Setup(r => r.ObterPorEmailAsync("maria@ufop.br")).ReturnsAsync(usuario);

            await _service.SolicitarRecuperacaoSenhaAsync(new EsqueceuSenhaDTO { Email = " maria@ufop.br " });

            Assert.False(string.IsNullOrWhiteSpace(usuario.TokenRecuperacao));
            Assert.NotNull(usuario.TokenRecuperacaoExpiracao);
            _repoMock.Verify(r => r.AtualizarAsync(usuario), Times.Once);
            _emailMock.Verify(e => e.EnviarRecuperacaoSenhaAsync(
                "maria@ufop.br",
                "Maria",
                It.Is<string>(link => link.StartsWith("https://app.teste.com/resetar-senha?email=maria%40ufop.br&token="))),
                Times.Once);
        }
        finally
        {
            Environment.SetEnvironmentVariable("FRONTEND_URL", originalFrontend);
        }
    }

    [Fact]
    public async Task RedefinirSenhaAsync_ComTokenValido_DeveAtualizarSenhaELimparToken()
    {
        var usuario = new Usuario("Maria", "maria@ufop.br", BCrypt.Net.BCrypt.HashPassword("Antiga1!"), PerfilUsuario.Diacono);
        usuario.GerarTokenRecuperacao("token-valido", DateTime.UtcNow.AddMinutes(30));
        _repoMock.Setup(r => r.ObterPorEmailAsync("maria@ufop.br")).ReturnsAsync(usuario);

        await _service.RedefinirSenhaAsync(new RedefinirSenhaDTO
        {
            Email = " maria@ufop.br ",
            Token = "token-valido",
            NovaSenha = "NovaSenha@1"
        });

        Assert.True(BCrypt.Net.BCrypt.Verify("NovaSenha@1", usuario.SenhaHash));
        Assert.Null(usuario.TokenRecuperacao);
        Assert.Null(usuario.TokenRecuperacaoExpiracao);
        _repoMock.Verify(r => r.AtualizarAsync(usuario), Times.Once);
    }

    [Fact]
    public async Task RedefinirSenhaAsync_ComTokenInvalidoOuExpirado_DeveLancarExcecao()
    {
        var usuario = new Usuario("Maria", "maria@ufop.br", "hash", PerfilUsuario.Diacono);
        usuario.GerarTokenRecuperacao("token-certo", DateTime.UtcNow.AddMinutes(-5));
        _repoMock.Setup(r => r.ObterPorEmailAsync("maria@ufop.br")).ReturnsAsync(usuario);

        await Assert.ThrowsAsync<Exception>(() => _service.RedefinirSenhaAsync(new RedefinirSenhaDTO
        {
            Email = "maria@ufop.br",
            Token = "token-errado",
            NovaSenha = "NovaSenha@1"
        }));

        await Assert.ThrowsAsync<Exception>(() => _service.RedefinirSenhaAsync(new RedefinirSenhaDTO
        {
            Email = "maria@ufop.br",
            Token = "token-certo",
            NovaSenha = "NovaSenha@1"
        }));
    }
}
