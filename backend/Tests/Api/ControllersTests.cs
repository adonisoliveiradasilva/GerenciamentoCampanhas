using System.Security.Claims;
using GerenciamentoCampanhas.API.Controllers;
using GerenciamentoCampanhas.Application.DTOs;
using GerenciamentoCampanhas.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace GerenciamentoCampanhas.Tests.Api;

public class ControllersTests
{
    private static void SetUser(ControllerBase controller, Guid? userId)
    {
        var claims = userId.HasValue
            ? new[] { new Claim(ClaimTypes.NameIdentifier, userId.Value.ToString()) }
            : Array.Empty<Claim>();

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(new ClaimsIdentity(claims, "Test")) }
        };
    }

    [Fact]
    public async Task AuthController_TodosEndpoints_SucessoEErro()
    {
        var service = new Mock<IAuthService>();
        var controller = new AuthController(service.Object);

        service.Setup(s => s.LoginAsync(It.IsAny<LoginRequestDTO>())).ReturnsAsync("jwt-token");
        Assert.IsType<OkObjectResult>(await controller.Login(new LoginRequestDTO()));
        service.Setup(s => s.LoginAsync(It.IsAny<LoginRequestDTO>())).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.Login(new LoginRequestDTO()));

        Assert.IsType<OkObjectResult>(await controller.ForgotPassword(new EsqueceuSenhaDTO()));
        service.Setup(s => s.SolicitarRecuperacaoSenhaAsync(It.IsAny<EsqueceuSenhaDTO>())).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.ForgotPassword(new EsqueceuSenhaDTO()));

        Assert.IsType<OkObjectResult>(await controller.ResetPassword(new RedefinirSenhaDTO()));
        service.Setup(s => s.RedefinirSenhaAsync(It.IsAny<RedefinirSenhaDTO>())).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.ResetPassword(new RedefinirSenhaDTO()));
    }

    [Fact]
    public async Task CampanhasController_TodosEndpoints_SucessoEErro()
    {
        var service = new Mock<ICampanhaService>();
        var controller = new CampanhasController(service.Object);
        var id = Guid.NewGuid();

        service.Setup(s => s.ObterTodosAsync()).ReturnsAsync(Array.Empty<CampanhaResponseDTO>());
        Assert.IsType<OkObjectResult>(await controller.ObterTodos());

        service.Setup(s => s.ObterPorIdAsync(id)).ReturnsAsync(new CampanhaResponseDTO { Id = id });
        Assert.IsType<OkObjectResult>(await controller.ObterPorId(id));
        service.Setup(s => s.ObterPorIdAsync(id)).ThrowsAsync(new Exception("nao encontrada"));
        Assert.IsType<NotFoundObjectResult>(await controller.ObterPorId(id));

        service.Setup(s => s.CriarAsync(It.IsAny<CampanhaCreateDTO>())).ReturnsAsync(new CampanhaResponseDTO { Id = id });
        var created = Assert.IsType<ObjectResult>(await controller.Criar(new CampanhaCreateDTO()));
        Assert.Equal(201, created.StatusCode);
        service.Setup(s => s.CriarAsync(It.IsAny<CampanhaCreateDTO>())).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.Criar(new CampanhaCreateDTO()));

        Assert.IsType<NoContentResult>(await controller.Atualizar(id, new CampanhaUpdateDTO()));
        service.Setup(s => s.AtualizarAsync(id, It.IsAny<CampanhaUpdateDTO>())).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.Atualizar(id, new CampanhaUpdateDTO()));

        Assert.IsType<NoContentResult>(await controller.Excluir(id));
        service.Setup(s => s.ExcluirAsync(id)).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.Excluir(id));
    }

    [Fact]
    public async Task DashboardController_ObterResumo_SucessoEErro()
    {
        var service = new Mock<IDashboardService>();
        var controller = new DashboardController(service.Object);

        service.Setup(s => s.ObterDadosDashboardAsync()).ReturnsAsync(new DashboardResponseDTO());
        Assert.IsType<OkObjectResult>(await controller.ObterResumo());

        service.Setup(s => s.ObterDadosDashboardAsync()).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.ObterResumo());
    }

    [Fact]
    public async Task DoadoresController_TodosEndpoints_SucessoEErro()
    {
        var service = new Mock<IDoadorService>();
        var controller = new DoadoresController(service.Object);
        var id = Guid.NewGuid();

        service.Setup(s => s.ObterTodosAsync()).ReturnsAsync(Array.Empty<DoadorResponseDTO>());
        Assert.IsType<OkObjectResult>(await controller.ObterTodos());

        service.Setup(s => s.ObterPorIdAsync(id)).ReturnsAsync(new DoadorResponseDTO { Id = id });
        Assert.IsType<OkObjectResult>(await controller.ObterPorId(id));
        service.Setup(s => s.ObterPorIdAsync(id)).ThrowsAsync(new Exception("erro"));
        Assert.IsType<NotFoundObjectResult>(await controller.ObterPorId(id));

        service.Setup(s => s.CriarAsync(It.IsAny<DoadorRequestDTO>())).ReturnsAsync(new DoadorResponseDTO { Id = id });
        var created = Assert.IsType<ObjectResult>(await controller.Criar(new DoadorRequestDTO()));
        Assert.Equal(201, created.StatusCode);
        service.Setup(s => s.CriarAsync(It.IsAny<DoadorRequestDTO>())).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.Criar(new DoadorRequestDTO()));

        Assert.IsType<NoContentResult>(await controller.Atualizar(id, new DoadorRequestDTO()));
        service.Setup(s => s.AtualizarAsync(id, It.IsAny<DoadorRequestDTO>())).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.Atualizar(id, new DoadorRequestDTO()));

        Assert.IsType<NoContentResult>(await controller.Excluir(id));
        service.Setup(s => s.ExcluirAsync(id)).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.Excluir(id));
    }

    [Fact]
    public async Task ItensController_TodosEndpoints_SucessoUnauthorizedEErro()
    {
        var service = new Mock<IItemService>();
        var controller = new ItensController(service.Object);
        var itemId = Guid.NewGuid();
        var userId = Guid.NewGuid();

        service.Setup(s => s.ObterTodosAsync()).ReturnsAsync(Array.Empty<ItemResponseDTO>());
        Assert.IsType<OkObjectResult>(await controller.ObterTodos());

        service.Setup(s => s.ObterPorIdAsync(itemId)).ReturnsAsync(new ItemResponseDTO { Id = itemId });
        Assert.IsType<OkObjectResult>(await controller.ObterPorId(itemId));
        service.Setup(s => s.ObterPorIdAsync(itemId)).ThrowsAsync(new Exception("erro"));
        Assert.IsType<NotFoundObjectResult>(await controller.ObterPorId(itemId));

        SetUser(controller, null);
        Assert.IsType<UnauthorizedObjectResult>(await controller.Criar(new ItemRequestDTO()));
        Assert.IsType<UnauthorizedObjectResult>(await controller.Atualizar(itemId, new ItemRequestDTO()));
        Assert.IsType<UnauthorizedObjectResult>(await controller.RegistrarDoacao(itemId, new DoacaoRequestDTO { ItemId = itemId }));

        SetUser(controller, userId);
        service.Setup(s => s.CriarAsync(It.IsAny<ItemRequestDTO>(), userId)).ReturnsAsync(new ItemResponseDTO { Id = itemId });
        Assert.IsType<CreatedAtActionResult>(await controller.Criar(new ItemRequestDTO()));
        service.Setup(s => s.CriarAsync(It.IsAny<ItemRequestDTO>(), userId)).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.Criar(new ItemRequestDTO()));

        Assert.IsType<NoContentResult>(await controller.Atualizar(itemId, new ItemRequestDTO()));
        service.Setup(s => s.AtualizarAsync(itemId, It.IsAny<ItemRequestDTO>(), userId)).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.Atualizar(itemId, new ItemRequestDTO()));

        Assert.IsType<NoContentResult>(await controller.Excluir(itemId));
        service.Setup(s => s.ExcluirAsync(itemId)).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.Excluir(itemId));

        Assert.IsType<BadRequestObjectResult>(await controller.RegistrarDoacao(itemId, new DoacaoRequestDTO { ItemId = Guid.NewGuid() }));
        Assert.IsType<OkResult>(await controller.RegistrarDoacao(itemId, new DoacaoRequestDTO { ItemId = itemId }));
        service.Setup(s => s.RegistrarDoacaoAsync(It.IsAny<DoacaoRequestDTO>(), userId)).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.RegistrarDoacao(itemId, new DoacaoRequestDTO { ItemId = itemId }));
    }

    [Fact]
    public async Task UsuariosController_TodosEndpoints_SucessoUnauthorizedAutoExclusaoEErro()
    {
        var service = new Mock<IUsuarioService>();
        var controller = new UsuariosController(service.Object);
        var userId = Guid.NewGuid();
        var outroId = Guid.NewGuid();

        service.Setup(s => s.ObterTodosAsync()).ReturnsAsync(Array.Empty<UsuarioResponseDTO>());
        Assert.IsType<OkObjectResult>(await controller.ObterTodos());

        service.Setup(s => s.CriarAsync(It.IsAny<UsuarioCreateDTO>())).ReturnsAsync(new UsuarioResponseDTO { Id = outroId });
        var created = Assert.IsType<ObjectResult>(await controller.Criar(new UsuarioCreateDTO()));
        Assert.Equal(201, created.StatusCode);
        service.Setup(s => s.CriarAsync(It.IsAny<UsuarioCreateDTO>())).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.Criar(new UsuarioCreateDTO()));

        Assert.IsType<NoContentResult>(await controller.Atualizar(outroId, new UsuarioUpdateDTO()));
        service.Setup(s => s.AtualizarAsync(outroId, It.IsAny<UsuarioUpdateDTO>())).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.Atualizar(outroId, new UsuarioUpdateDTO()));

        SetUser(controller, null);
        Assert.IsType<UnauthorizedObjectResult>(await controller.AlterarSenha(new AlterarSenhaDTO()));
        Assert.IsType<UnauthorizedObjectResult>(await controller.AtualizarMeusDados(new AtualizarMeusDadosDTO()));

        SetUser(controller, userId);
        Assert.IsType<NoContentResult>(await controller.AlterarSenha(new AlterarSenhaDTO()));
        service.Setup(s => s.AlterarSenhaAsync(userId, It.IsAny<AlterarSenhaDTO>())).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.AlterarSenha(new AlterarSenhaDTO()));

        Assert.IsType<NoContentResult>(await controller.AtualizarMeusDados(new AtualizarMeusDadosDTO()));
        service.Setup(s => s.AtualizarMeusDadosAsync(userId, It.IsAny<AtualizarMeusDadosDTO>())).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.AtualizarMeusDados(new AtualizarMeusDadosDTO()));

        Assert.IsType<BadRequestObjectResult>(await controller.Excluir(userId));
        Assert.IsType<NoContentResult>(await controller.Excluir(outroId));
        service.Setup(s => s.ExcluirAsync(outroId)).ThrowsAsync(new Exception("erro"));
        Assert.IsType<BadRequestObjectResult>(await controller.Excluir(outroId));
    }
}
