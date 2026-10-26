using System;

namespace GerenciamentoCampanhas.Application.DTOs
{
    public class UsuarioResponseDTO
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Perfil { get; set; } = string.Empty;
        public DateTime DataCriacao { get; set; }
        public bool Ativo { get; set; }
    }
}