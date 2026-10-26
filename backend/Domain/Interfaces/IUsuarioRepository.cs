using System.Threading.Tasks;
using GerenciamentoCampanhas.Domain.Entities;

namespace GerenciamentoCampanhas.Domain.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<Usuario?> ObterPorEmailAsync(string email);
    }
}