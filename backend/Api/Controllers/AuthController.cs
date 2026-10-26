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
    }
}