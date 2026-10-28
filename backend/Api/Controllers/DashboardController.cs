using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.Interfaces;

namespace GerenciamentoCampanhas.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet]
        public async Task<IActionResult> ObterResumo()
        {
            try 
            { 
                return Ok(await _dashboardService.ObterDadosDashboardAsync()); 
            }
            catch (Exception ex) 
            { 
                return BadRequest(new { Erro = ex.Message }); 
            }
        }
    }
}