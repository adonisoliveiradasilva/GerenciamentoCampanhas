using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.DTOs;
using GerenciamentoCampanhas.Application.Interfaces;

namespace GerenciamentoCampanhas.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            try
            {
                var token = await _authService.LoginAsync(request);
                
                return Ok(new { Token = token }); 
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { Erro = ex.Message });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] EsqueceuSenhaDTO request)
        {
            try
            {
                await _authService.SolicitarRecuperacaoSenhaAsync(request);
                return Ok(new { Mensagem = "Se o e-mail estiver cadastrado, as instruções foram enviadas." });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { Erro = ex.Message });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] RedefinirSenhaDTO request)
        {
            try
            {
                await _authService.RedefinirSenhaAsync(request);
                return Ok(new { Mensagem = "Senha alterada com sucesso." });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { Erro = ex.Message });
            }
        }
    }
}