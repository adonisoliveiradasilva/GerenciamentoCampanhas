using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.DTOs;

namespace GerenciamentoCampanhas.Application.Interfaces
{
    public interface ICampanhaService
    {
        Task<IEnumerable<CampanhaResponseDTO>> ObterTodosAsync();
        Task<CampanhaResponseDTO> ObterPorIdAsync(Guid id);
        Task<CampanhaResponseDTO> CriarAsync(CampanhaCreateDTO dto);
        Task AtualizarAsync(Guid id, CampanhaUpdateDTO dto);
        Task ExcluirAsync(Guid id);
    }
}