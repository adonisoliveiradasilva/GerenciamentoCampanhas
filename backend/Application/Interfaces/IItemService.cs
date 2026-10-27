using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.DTOs;

namespace GerenciamentoCampanhas.Application.Interfaces
{
    public interface IItemService
    {
        Task<IEnumerable<ItemResponseDTO>> ObterTodosAsync();
        Task<ItemResponseDTO> ObterPorIdAsync(Guid id);
        Task<ItemResponseDTO> CriarAsync(ItemRequestDTO dto);
        Task AtualizarAsync(Guid id, ItemRequestDTO dto);
        Task ExcluirAsync(Guid id);
    }
}