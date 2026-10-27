using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.DTOs;

namespace GerenciamentoCampanhas.Application.Interfaces
{
    public interface IUsuarioService
    {
        Task<IEnumerable<UsuarioResponseDTO>> ObterTodosAsync();
        Task<UsuarioResponseDTO> CriarAsync(UsuarioCreateDTO dto);
        Task AtualizarAsync(Guid id, UsuarioUpdateDTO dto);
        
        Task AlterarSenhaAsync(Guid idUsuario, AlterarSenhaDTO dto);
        Task AtualizarMeusDadosAsync(Guid idUsuario, AtualizarMeusDadosDTO dto);
    }
}