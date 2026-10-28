using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.DTOs;

namespace GerenciamentoCampanhas.Application.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardResponseDTO> ObterDadosDashboardAsync();
    }
}