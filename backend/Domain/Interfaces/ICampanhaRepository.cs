using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Domain.Entities;

namespace GerenciamentoCampanhas.Domain.Interfaces
{
    public interface ICampanhaRepository
    {
        Task<IEnumerable<Campanha>> ObterTodosAsync();
        Task<Campanha?> ObterPorIdAsync(Guid id);
        Task AdicionarAsync(Campanha campanha);
        Task AtualizarAsync(Campanha campanha);
        Task RemoverAsync(Campanha campanha);
    }
}