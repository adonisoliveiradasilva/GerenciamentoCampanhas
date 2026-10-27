using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Domain.Entities;

namespace GerenciamentoCampanhas.Domain.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<Usuario?> ObterPorIdAsync(Guid id);
        Task<Usuario?> ObterPorEmailAsync(string email);
        Task<IEnumerable<Usuario>> ObterTodosAsync();
        Task AdicionarAsync(Usuario usuario);
        Task AtualizarAsync(Usuario usuario);
    }
}