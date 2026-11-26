using GerenciamentoCampanhas.Application.Interfaces;
using GerenciamentoCampanhas.Domain.Entities;
using GerenciamentoCampanhas.Domain.Enums;
using GerenciamentoCampanhas.Domain.Interfaces;
using GerenciamentoCampanhas.Infrastructure.Config;
using GerenciamentoCampanhas.Infrastructure.Data;
using GerenciamentoCampanhas.Infrastructure.IoC;
using GerenciamentoCampanhas.Infrastructure.Repositories;
using GerenciamentoCampanhas.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Xunit;

namespace GerenciamentoCampanhas.Tests.Infrastructure;

public class InfrastructureTests
{
    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var context = new AppDbContext(options);
        context.Database.EnsureCreated();
        return context;
    }

    [Fact]
    public async Task CampanhaRepository_CrudCompleto()
    {
        using var ctx = CreateContext();
        var repo = new CampanhaRepository(ctx);
        var c1 = new Campanha("Antiga", "L1", null, new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), null);
        var c2 = new Campanha("Recente", "L2", "D", new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc), null);

        await repo.AdicionarAsync(c1);
        await repo.AdicionarAsync(c2);

        var todas = (await repo.ObterTodosAsync()).ToList();
        Assert.Equal(2, todas.Count);
        Assert.Equal("Recente", todas[0].Nome);

        var encontrada = await repo.ObterPorIdAsync(c1.Id);
        Assert.NotNull(encontrada);

        encontrada!.Atualizar("Editada", "L3", "Nova", c1.DataInicio, null);
        await repo.AtualizarAsync(encontrada);
        Assert.Equal("Editada", (await repo.ObterPorIdAsync(c1.Id))!.Nome);

        await repo.RemoverAsync(encontrada);
        Assert.Null(await repo.ObterPorIdAsync(c1.Id));
    }

    [Fact]
    public async Task DoadorRepository_CrudCompleto()
    {
        using var ctx = CreateContext();
        var repo = new DoadorRepository(ctx);
        var d1 = new Doador("Zeca", "zeca@email.com", new DateTime(1990, 1, 1, 0, 0, 0, DateTimeKind.Utc));
        var d2 = new Doador("Ana", "ana@email.com", new DateTime(1992, 1, 1, 0, 0, 0, DateTimeKind.Utc));

        await repo.AdicionarAsync(d1);
        await repo.AdicionarAsync(d2);

        var todos = (await repo.ObterTodosAsync()).ToList();
        Assert.Equal("Ana", todos[0].Nome);
        Assert.NotNull(await repo.ObterPorEmailAsync("ana@email.com"));

        var encontrado = await repo.ObterPorIdAsync(d1.Id);
        encontrado!.Atualizar("Zeca Atualizado", "zeca2@email.com", d1.DataNascimento);
        await repo.AtualizarAsync(encontrado);
        Assert.NotNull(await repo.ObterPorEmailAsync("zeca2@email.com"));

        await repo.RemoverAsync(encontrado);
        Assert.Null(await repo.ObterPorIdAsync(d1.Id));
    }

    [Fact]
    public async Task UsuarioRepository_CrudCompleto()
    {
        using var ctx = CreateContext();
        var repo = new UsuarioRepository(ctx);
        var u = new Usuario("Teste", "teste@ufop.br", "hash", PerfilUsuario.Diacono);

        await repo.AdicionarAsync(u);
        Assert.NotNull(await repo.ObterPorEmailAsync("teste@ufop.br"));
        Assert.NotNull(await repo.ObterPorIdAsync(u.Id));
        Assert.True((await repo.ObterTodosAsync()).Count() >= 3); // 2 seeded + 1

        u.AtualizarDados("Teste 2", "teste2@ufop.br");
        await repo.AtualizarAsync(u);
        Assert.NotNull(await repo.ObterPorEmailAsync("teste2@ufop.br"));

        await repo.RemoverAsync(u);
        Assert.Null(await repo.ObterPorIdAsync(u.Id));
    }

    [Fact]
    public async Task ItemEDoacaoEDashboardRepositories_DevemPersistirECalcularMetricas()
    {
        using var ctx = CreateContext();
        var campanhaRepo = new CampanhaRepository(ctx);
        var doadorRepo = new DoadorRepository(ctx);
        var itemRepo = new ItemRepository(ctx);
        var doacaoRepo = new DoacaoRepository(ctx);
        var dashboardRepo = new DashboardRepository(ctx);

        var usuarioId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var campAtiva = new Campanha("Ativa", "Matriz", null, DateTime.UtcNow.AddDays(-5), DateTime.UtcNow.AddDays(10));
        var campEncerrada = new Campanha("Encerrada", "Centro", null, DateTime.UtcNow.AddDays(-30), DateTime.UtcNow.AddDays(-1));
        await campanhaRepo.AdicionarAsync(campAtiva);
        await campanhaRepo.AdicionarAsync(campEncerrada);

        var doador = new Doador("João Doador", "joao@doador.com", new DateTime(1985, 5, 5, 0, 0, 0, DateTimeKind.Utc));
        await doadorRepo.AdicionarAsync(doador);

        var itemIntegral = new Item("Arroz", null, 10, DateTime.UtcNow.AddDays(-2), null, null, campAtiva.Id, doador.Id, null, usuarioId);
        var itemParcial = new Item("Feijão", null, 5, DateTime.UtcNow.AddDays(-2), null, null, campAtiva.Id, doador.Id, null, usuarioId);
        var itemEsgotado = new Item("Leite", null, 2, DateTime.UtcNow.AddDays(-2), null, null, campEncerrada.Id, null, null, usuarioId);

        await itemRepo.AdicionarAsync(itemIntegral);
        await itemRepo.AdicionarAsync(itemParcial);
        await itemRepo.AdicionarAsync(itemEsgotado);

        itemParcial.RegistrarBaixaEstoque(2);
        await itemRepo.AtualizarAsync(itemParcial);
        await doacaoRepo.AdicionarAsync(new Doacao(itemParcial.Id, 2, DateTime.UtcNow, "Família A", usuarioId));

        itemEsgotado.RegistrarBaixaEstoque(2);
        await itemRepo.AtualizarAsync(itemEsgotado);
        await doacaoRepo.AdicionarAsync(new Doacao(itemEsgotado.Id, 2, DateTime.UtcNow, "Família B", usuarioId));

        var todosItens = (await itemRepo.ObterTodosAsync()).ToList();
        Assert.Equal(3, todosItens.Count);

        var itemCarregado = await itemRepo.ObterPorIdAsync(itemParcial.Id);
        Assert.NotNull(itemCarregado);
        Assert.Equal("Ativa", itemCarregado!.Campanha.Nome);
        Assert.Single(itemCarregado.Doacoes);

        var resumo = await dashboardRepo.ObterResumoDashboardAsync();
        Assert.Equal(13, resumo.Kpis.TotalItensEstoque);
        Assert.Equal(4, resumo.Kpis.TotalItensDoados);
        Assert.Equal(1, resumo.Kpis.CampanhasAtivas);
        Assert.Equal(1, resumo.Kpis.DoadoresCadastrados);
        Assert.Equal(1, resumo.StatusEstoque.IntegralmenteDisponivel);
        Assert.Equal(1, resumo.StatusEstoque.ParcialmenteDoado);
        Assert.Equal(1, resumo.StatusEstoque.TotalmenteEsgotado);
        Assert.Equal(2, resumo.ArrecadacaoPorCampanha.Count);
        Assert.Single(resumo.TopDoadores);
        Assert.Equal(15, resumo.TopDoadores[0].TotalItensDoados);

        await itemRepo.RemoverAsync(itemCarregado);
        Assert.Null(await itemRepo.ObterPorIdAsync(itemParcial.Id));
    }

    [Fact]
    public void DependencyInjection_DeveRegistrarServicosERepositorios()
    {
        var services = new ServiceCollection();
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["SmtpSettings:Servidor"] = "smtp.teste.com",
                ["SmtpSettings:Porta"] = "587",
                ["SmtpSettings:RemetenteNome"] = "Teste",
                ["SmtpSettings:RemetenteEmail"] = "rem@teste.com",
                ["SmtpSettings:Usuario"] = "user",
                ["SmtpSettings:Senha"] = "pass"
            })
            .Build();

        services.AddInfrastructure(config);

        Assert.Contains(services, s => s.ServiceType == typeof(IUsuarioRepository));
        Assert.Contains(services, s => s.ServiceType == typeof(IAuthService));
        Assert.Contains(services, s => s.ServiceType == typeof(ICampanhaService));
        Assert.Contains(services, s => s.ServiceType == typeof(IDoadorService));
        Assert.Contains(services, s => s.ServiceType == typeof(IItemService));
        Assert.Contains(services, s => s.ServiceType == typeof(IDashboardService));
        Assert.Contains(services, s => s.ServiceType == typeof(IEmailService));
    }

    [Fact]
    public async Task EmailService_SemConfiguracaoMailjet_DeveValidarCorretamente()
    {
        var oldApiKey = Environment.GetEnvironmentVariable("MAILJET_API_KEY");
        var oldSecret = Environment.GetEnvironmentVariable("MAILJET_SECRET_KEY");
        var oldFrom = Environment.GetEnvironmentVariable("MAILJET_FROM_EMAIL");

        try
        {
            Environment.SetEnvironmentVariable("MAILJET_API_KEY", null);
            Environment.SetEnvironmentVariable("MAILJET_SECRET_KEY", null);
            Environment.SetEnvironmentVariable("MAILJET_FROM_EMAIL", null);

            var settings = Options.Create(new SmtpSettings
            {
                Servidor = "smtp.local",
                Porta = 587,
                RemetenteNome = "Sistema",
                RemetenteEmail = "",
                Usuario = "u",
                Senha = "s"
            });
            var emailService = new EmailService(settings);

            // EnviarBoasVindasAsync captura exceção internamente
            await emailService.EnviarBoasVindasAsync("dest@email.com", "Dest", "Abc123!@");

            // EnviarRecuperacaoSenhaAsync propaga exceção quando faltam chaves
            await Assert.ThrowsAsync<InvalidOperationException>(() =>
                emailService.EnviarRecuperacaoSenhaAsync("dest@email.com", "Dest", "http://localhost/reset"));

            // Com chaves presentes mas sem remetente
            Environment.SetEnvironmentVariable("MAILJET_API_KEY", "key");
            Environment.SetEnvironmentVariable("MAILJET_SECRET_KEY", "secret");
            await Assert.ThrowsAsync<InvalidOperationException>(() =>
                emailService.EnviarRecuperacaoSenhaAsync("dest@email.com", "Dest", "http://localhost/reset"));
        }
        finally
        {
            Environment.SetEnvironmentVariable("MAILJET_API_KEY", oldApiKey);
            Environment.SetEnvironmentVariable("MAILJET_SECRET_KEY", oldSecret);
            Environment.SetEnvironmentVariable("MAILJET_FROM_EMAIL", oldFrom);
        }
    }
}
