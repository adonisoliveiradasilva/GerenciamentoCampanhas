using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.DTOs;
using GerenciamentoCampanhas.Application.Interfaces;

namespace GerenciamentoCampanhas.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CampanhasController : ControllerBase
    {
        private readonly ICampanhaService _campanhaService;

        public CampanhasController(ICampanhaService campanhaService)
        {
            _campanhaService = campanhaService;
        }

        [HttpGet]
        public async Task<IActionResult> ObterTodos()
        {
            var campanhas = await _campanhaService.ObterTodosAsync();
            return Ok(campanhas);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> ObterPorId(Guid id)
        {
            try
            {
                var campanha = await _campanhaService.ObterPorIdAsync(id);
                return Ok(campanha);
            }
            catch (Exception ex)
            {
                return NotFound(new { Erro = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] CampanhaCreateDTO request)
        {
            try
            {
                var campanhaCriada = await _campanhaService.CriarAsync(request);
                return StatusCode(201, campanhaCriada);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Erro = ex.Message });
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Atualizar(Guid id, [FromBody] CampanhaUpdateDTO request)
        {
            try
            {
                await _campanhaService.AtualizarAsync(id, request);
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
                await _campanhaService.ExcluirAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Erro = ex.Message });
            }
        }
    }
}