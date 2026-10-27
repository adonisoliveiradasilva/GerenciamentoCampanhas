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
    public class DoadoresController : ControllerBase
    {
        private readonly IDoadorService _doadorService;

        public DoadoresController(IDoadorService doadorService)
        {
            _doadorService = doadorService;
        }

        [HttpGet]
        public async Task<IActionResult> ObterTodos()
        {
            return Ok(await _doadorService.ObterTodosAsync());
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> ObterPorId(Guid id)
        {
            try { return Ok(await _doadorService.ObterPorIdAsync(id)); }
            catch (Exception ex) { return NotFound(new { Erro = ex.Message }); }
        }

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] DoadorRequestDTO request)
        {
            try { return StatusCode(201, await _doadorService.CriarAsync(request)); }
            catch (Exception ex) { return BadRequest(new { Erro = ex.Message }); }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Atualizar(Guid id, [FromBody] DoadorRequestDTO request)
        {
            try 
            { 
                await _doadorService.AtualizarAsync(id, request); 
                return NoContent(); 
            }
            catch (Exception ex) { return BadRequest(new { Erro = ex.Message }); }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Excluir(Guid id)
        {
            try 
            { 
                await _doadorService.ExcluirAsync(id); 
                return NoContent(); 
            }
            catch (Exception ex) { return BadRequest(new { Erro = ex.Message }); }
        }
    }
}