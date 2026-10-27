using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.DTOs;
using GerenciamentoCampanhas.Application.Interfaces;
using System.Security.Claims;

namespace GerenciamentoCampanhas.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public UsuariosController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpGet]
        public async Task<IActionResult> ObterTodos()
        {
            var usuarios = await _usuarioService.ObterTodosAsync();
            return Ok(usuarios);
        }

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] UsuarioCreateDTO request)
        {
            try
            {
                var usuarioCriado = await _usuarioService.CriarAsync(request);
                return StatusCode(201, usuarioCriado);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Erro = ex.Message });
            }
        }

       
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Atualizar(Guid id, [FromBody] UsuarioUpdateDTO request)
        {
            try
            {
                await _usuarioService.AtualizarAsync(id, request);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Erro = ex.Message });
            }
        }

        
        [HttpPut("AlterarSenha")]
        public async Task<IActionResult> AlterarSenha([FromBody] AlterarSenhaDTO request)
        {
            try
            {
                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdClaim))
                    return Unauthorized("Token inválido.");

                var usuarioId = Guid.Parse(userIdClaim);

                await _usuarioService.AlterarSenhaAsync(usuarioId, request);
                
                return NoContent(); 
            }
            catch (Exception ex)
            {
                return BadRequest(new { Erro = ex.Message });
            }
        }

        [HttpPut("MeusDados")]
        public async Task<IActionResult> AtualizarMeusDados([FromBody] AtualizarMeusDadosDTO request)
        {
            try
            {
                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdClaim))
                    return Unauthorized("Token inválido.");

                var usuarioId = Guid.Parse(userIdClaim);

                await _usuarioService.AtualizarMeusDadosAsync(usuarioId, request);
                
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Erro = ex.Message });
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Excluir(Guid id)
        {
            try
            {
                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
                
                if (userIdClaim == id.ToString())
                {
                    return BadRequest(new { Erro = "Ação não permitida: Você não pode excluir sua própria conta." });
                }

                await _usuarioService.ExcluirAsync(id);
                
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Erro = ex.Message });
            }
        }
    }
}