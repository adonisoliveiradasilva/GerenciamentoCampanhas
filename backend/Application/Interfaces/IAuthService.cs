using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.DTOs;

namespace GerenciamentoCampanhas.Application.Interfaces
{
    public interface IAuthService
    {
        Task<string> LoginAsync(LoginRequestDTO request);
        Task<string> LoginAsync(LoginRequestDTO request);
        Task SolicitarRecuperacaoSenhaAsync(EsqueceuSenhaDTO request);
        Task RedefinirSenhaAsync(RedefinirSenhaDTO request);
    }
}