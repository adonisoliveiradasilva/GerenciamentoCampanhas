using GerenciamentoCampanhas.Domain.Entities;
using GerenciamentoCampanhas.Domain.Enums;
using GerenciamentoCampanhas.Domain.Models;
using Xunit;

namespace GerenciamentoCampanhas.Tests.Domain;

public class EntitiesTests
{
    [Fact]
    public void Campanha_CriarEAtualizar_DeveDefinirPropriedades()
    {
        var inicio = new DateTime(2026, 5, 1, 0, 0, 0, DateTimeKind.Utc);
        var fim = new DateTime(2026, 6, 30, 0, 0, 0, DateTimeKind.Utc);

        var campanha = new Campanha("Agasalho", "Matriz", "Roupas de inverno", inicio, fim);

        Assert.NotEqual(Guid.Empty, campanha.Id);
        Assert.Equal("Agasalho", campanha.Nome);
        Assert.Equal("Matriz", campanha.Local);
        Assert.Equal("Roupas de inverno", campanha.Descricao);
        Assert.Equal(inicio, campanha.DataInicio);
        Assert.Equal(fim, campanha.DataFim);
        Assert.True(campanha.DataCriacao <= DateTime.UtcNow);

        var novoInicio = inicio.AddDays(5);
        campanha.Atualizar("Natal", "Centro", null, novoInicio, null);

        Assert.Equal("Natal", campanha.Nome);
        Assert.Equal("Centro", campanha.Local);
        Assert.Null(campanha.Descricao);
        Assert.Equal(novoInicio, campanha.DataInicio);
        Assert.Null(campanha.DataFim);
    }

    [Fact]
    public void Doador_CriarEAtualizar_DeveNormalizarEmail()
    {
        var nascimento = new DateTime(1990, 3, 10, 0, 0, 0, DateTimeKind.Utc);
        var doador = new Doador("Maria", "  MARIA@Email.COM  ", nascimento);

        Assert.NotEqual(Guid.Empty, doador.Id);
        Assert.Equal("Maria", doador.Nome);
        Assert.Equal("maria@email.com", doador.Email);
        Assert.Equal(nascimento, doador.DataNascimento);

        var novaData = new DateTime(1991, 4, 20, 0, 0, 0, DateTimeKind.Utc);
        doador.Atualizar("Maria Silva", " NOVO@Email.com ", novaData);

        Assert.Equal("Maria Silva", doador.Nome);
        Assert.Equal("novo@email.com", doador.Email);
        Assert.Equal(novaData, doador.DataNascimento);
    }

    [Fact]
    public void Usuario_CriarEAlterarEstado_DeveFuncionarCorretamente()
    {
        var usuario = new Usuario("João", "joao@email.com", "hash1", PerfilUsuario.Diacono);

        Assert.NotEqual(Guid.Empty, usuario.Id);
        Assert.Equal("João", usuario.Nome);
        Assert.Equal("joao@email.com", usuario.Email);
        Assert.Equal("hash1", usuario.SenhaHash);
        Assert.Equal(PerfilUsuario.Diacono, usuario.Perfil);
        Assert.True(usuario.Ativo);

        usuario.Desativar();
        Assert.False(usuario.Ativo);

        usuario.Reativar();
        Assert.True(usuario.Ativo);

        usuario.AtualizarSenha("hash2");
        Assert.Equal("hash2", usuario.SenhaHash);

        usuario.AlterarPerfil(PerfilUsuario.Administrador);
        Assert.Equal(PerfilUsuario.Administrador, usuario.Perfil);

        usuario.AtualizarDados("João Pedro", "jp@email.com");
        Assert.Equal("João Pedro", usuario.Nome);
        Assert.Equal("jp@email.com", usuario.Email);

        var expiracao = DateTime.UtcNow.AddHours(1);
        usuario.GerarTokenRecuperacao("tok-123", expiracao);
        Assert.Equal("tok-123", usuario.TokenRecuperacao);
        Assert.Equal(expiracao, usuario.TokenRecuperacaoExpiracao);

        usuario.LimparTokenRecuperacao();
        Assert.Null(usuario.TokenRecuperacao);
        Assert.Null(usuario.TokenRecuperacaoExpiracao);
    }

    [Fact]
    public void Doacao_CriarValidaEInvalidas_DeveValidarRegras()
    {
        var itemId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var data = DateTime.UtcNow;

        var doacao = new Doacao(itemId, 3, data, "Família Silva", userId);
        Assert.NotEqual(Guid.Empty, doacao.Id);
        Assert.Equal(itemId, doacao.ItemId);
        Assert.Equal(3, doacao.Quantidade);
        Assert.Equal(data, doacao.DataDoacao);
        Assert.Equal("Família Silva", doacao.Destino);
        Assert.Equal(userId, doacao.UsuarioId);

        Assert.Throws<ArgumentException>(() => new Doacao(itemId, 0, data, "Destino", userId));
        Assert.Throws<ArgumentException>(() => new Doacao(itemId, 2, data, "   ", userId));
        Assert.Throws<ArgumentException>(() => new Doacao(itemId, 2, data, "Destino", Guid.Empty));
    }

    [Fact]
    public void Item_CriarAtualizarEBaixaEstoque_DeveValidarTodasAsRegras()
    {
        var campanhaId = Guid.NewGuid();
        var doadorId = Guid.NewGuid();
        var criadorId = Guid.NewGuid();
        var atualizadorId = Guid.NewGuid();
        var chegada = DateTime.UtcNow.AddDays(-1);

        var item = new Item("Cesta Básica", "Alimentos", 10, chegada, TimeSpan.FromHours(14), "Matriz", campanhaId, doadorId, null, criadorId);

        Assert.NotEqual(Guid.Empty, item.Id);
        Assert.Equal("Cesta Básica", item.Nome);
        Assert.Equal(10, item.Quantidade);
        Assert.Empty(item.Imagens);
        Assert.Equal(criadorId, item.UsuarioCriadorId);

        item.Atualizar("Cesta Grande", "Atualizada", 8, chegada, null, "Galpão", campanhaId, null, new List<string> { "img1" }, atualizadorId);
        Assert.Equal("Cesta Grande", item.Nome);
        Assert.Equal(8, item.Quantidade);
        Assert.Single(item.Imagens);
        Assert.Equal(atualizadorId, item.UsuarioAtualizadorId);
        Assert.NotNull(item.DataUltimaAtualizacao);

        item.Atualizar("Cesta", null, 5, chegada, null, null, campanhaId, null, null, atualizadorId);
        Assert.Empty(item.Imagens);

        item.RegistrarBaixaEstoque(2);
        Assert.Equal(3, item.Quantidade);

        Assert.Throws<ArgumentException>(() => item.RegistrarBaixaEstoque(0));
        Assert.Throws<InvalidOperationException>(() => item.RegistrarBaixaEstoque(4));

        Assert.Throws<ArgumentException>(() => new Item("", null, 1, chegada, null, null, campanhaId, null, null, criadorId));
        Assert.Throws<ArgumentException>(() => new Item("Item", null, -1, chegada, null, null, campanhaId, null, null, criadorId));
        Assert.Throws<ArgumentException>(() => new Item("Item", null, 1, chegada, null, null, Guid.Empty, null, null, criadorId));
        Assert.Throws<ArgumentException>(() => new Item("Item", null, 1, chegada, null, null, campanhaId, null, null, Guid.Empty));

        Assert.Throws<ArgumentException>(() => item.Atualizar(" ", null, 1, chegada, null, null, campanhaId, null, null, atualizadorId));
        Assert.Throws<ArgumentException>(() => item.Atualizar("Item", null, -2, chegada, null, null, campanhaId, null, null, atualizadorId));
        Assert.Throws<ArgumentException>(() => item.Atualizar("Item", null, 1, chegada, null, null, campanhaId, null, null, Guid.Empty));
    }

    [Fact]
    public void DashboardModels_DeveInicializarEDefinirValores()
    {
        var resumo = new DashboardResumoModel
        {
            Kpis = new DashboardKpiModel { TotalItensEstoque = 10, TotalItensDoados = 5, CampanhasAtivas = 2, DoadoresCadastrados = 4 },
            ArrecadacaoPorCampanha = new List<GraficoCampanhaModel> { new() { CampanhaNome = "Natal", TotalArrecadado = 15 } },
            StatusEstoque = new EstoqueStatusModel { IntegralmenteDisponivel = 3, ParcialmenteDoado = 2, TotalmenteEsgotado = 1 },
            TopDoadores = new List<TopDoadorModel> { new() { DoadorNome = "Ana", TotalItensDoados = 7 } }
        };

        Assert.Equal(10, resumo.Kpis.TotalItensEstoque);
        Assert.Single(resumo.ArrecadacaoPorCampanha);
        Assert.Equal(2, resumo.StatusEstoque.ParcialmenteDoado);
        Assert.Single(resumo.TopDoadores);
    }
}
