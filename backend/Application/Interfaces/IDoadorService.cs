using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.DTOs;

namespace GerenciamentoCampanhas.Application.Interfaces
{
    public interface IDoadorService
    {
        Task<IEnumerable<DoadorResponseDTO>> ObterTodosAsync();
        Task<DoadorResponseDTO> ObterPorIdAsync(Guid id);
        Task<DoadorResponseDTO> CriarAsync(DoadorRequestDTO dto);
        Task AtualizarAsync(Guid id, DoadorRequestDTO dto);
        Task ExcluirAsync(Guid id);
    }
}