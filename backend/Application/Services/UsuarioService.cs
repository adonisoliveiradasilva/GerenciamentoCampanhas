using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.DTOs;
using GerenciamentoCampanhas.Application.Interfaces;
using GerenciamentoCampanhas.Domain.Interfaces;

namespace GerenciamentoCampanhas.Application.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;

        public UsuarioService(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        public async Task<IEnumerable<UsuarioResponseDTO>> ObterTodosAsync()
        {
            var usuarios = await _usuarioRepository.ObterTodosAsync();

            return usuarios.Select(u => new UsuarioResponseDTO
            {
                Id = u.Id,
                Nome = u.Nome,
                Email = u.Email,
                Perfil = u.Perfil.ToString(),
                DataCriacao = u.DataCriacao,
                Ativo = u.Ativo
            });
        }
    }
}