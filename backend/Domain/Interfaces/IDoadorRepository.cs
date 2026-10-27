using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Domain.Entities;

namespace GerenciamentoCampanhas.Domain.Interfaces
{
    public interface IDoadorRepository
    {
        Task<IEnumerable<Doador>> ObterTodosAsync();
        Task<Doador?> ObterPorIdAsync(Guid id);
        Task AdicionarAsync(Doador doador);
        Task AtualizarAsync(Doador doador);
        Task RemoverAsync(Doador doador);
        Task<Doador?> ObterPorEmailAsync(string email);
    }
}