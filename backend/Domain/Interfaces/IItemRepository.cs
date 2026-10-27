using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Domain.Entities;

namespace GerenciamentoCampanhas.Domain.Interfaces
{
    public interface IItemRepository
    {
        Task<IEnumerable<Item>> ObterTodosAsync();
        Task<Item?> ObterPorIdAsync(Guid id);
        Task AdicionarAsync(Item item);
        Task AtualizarAsync(Item item);
        Task RemoverAsync(Item item);
    }
}