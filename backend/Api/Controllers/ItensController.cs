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
    public class ItensController : ControllerBase
    {
        private readonly IItemService _itemService;

        public ItensController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpGet]
        public async Task<IActionResult> ObterTodos()
        {
            return Ok(await _itemService.ObterTodosAsync());
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> ObterPorId(Guid id)
        {
            try { return Ok(await _itemService.ObterPorIdAsync(id)); }
            catch (Exception ex) { return NotFound(new { Erro = ex.Message }); }
        }

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] ItemRequestDTO dto)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var usuarioId))
                {
                    return Unauthorized(new { erro = "Usuário não autenticado." });
                }

                var item = await _itemService.CriarAsync(dto, usuarioId);
                return CreatedAtAction(nameof(ObterPorId), new { id = item.Id }, item);
            }
            catch (Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(Guid id, [FromBody] ItemRequestDTO dto)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var usuarioId))
                {
                    return Unauthorized(new { erro = "Usuário não autenticado." });
                }

                await _itemService.AtualizarAsync(id, dto, usuarioId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Excluir(Guid id)
        {
            try 
            { 
                await _itemService.ExcluirAsync(id); 
                return NoContent(); 
            }
            catch (Exception ex) { return BadRequest(new { Erro = ex.Message }); }
        }

        [HttpPost("{id}/doar")]
        public async Task<IActionResult> RegistrarDoacao(Guid id, [FromBody] DoacaoRequestDTO dto)
        {
            try
            {
                if (id != dto.ItemId) return BadRequest(new { erro = "IDs inconsistentes." });

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var usuarioId))
                {
                    return Unauthorized(new { erro = "Usuário não autenticado." });
                }

                await _itemService.RegistrarDoacaoAsync(dto, usuarioId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }
    }
}