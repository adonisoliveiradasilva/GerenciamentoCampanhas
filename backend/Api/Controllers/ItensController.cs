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
        public async Task<IActionResult> Criar([FromBody] ItemRequestDTO request)
        {
            try { return StatusCode(201, await _itemService.CriarAsync(request)); }
            catch (Exception ex) { return BadRequest(new { Erro = ex.Message }); }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Atualizar(Guid id, [FromBody] ItemRequestDTO request)
        {
            try 
            { 
                await _itemService.AtualizarAsync(id, request); 
                return NoContent(); 
            }
            catch (Exception ex) { return BadRequest(new { Erro = ex.Message }); }
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
    }
}