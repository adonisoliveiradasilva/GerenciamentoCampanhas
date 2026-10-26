using System.Collections.Generic;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.DTOs;

namespace GerenciamentoCampanhas.Application.Interfaces
{
    public interface IUsuarioService
    {
        Task<IEnumerable<UsuarioResponseDTO>> ObterTodosAsync();
    }
}