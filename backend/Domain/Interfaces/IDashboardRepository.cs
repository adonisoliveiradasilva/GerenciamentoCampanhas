using System.Threading.Tasks;
using GerenciamentoCampanhas.Domain.Models;

namespace GerenciamentoCampanhas.Domain.Interfaces
{
    public interface IDashboardRepository
    {
        Task<DashboardResumoModel> ObterResumoDashboardAsync();
    }
}