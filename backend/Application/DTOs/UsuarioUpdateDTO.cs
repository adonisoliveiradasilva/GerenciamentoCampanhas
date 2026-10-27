using System.ComponentModel.DataAnnotations;

namespace GerenciamentoCampanhas.Application.DTOs
{
    public class UsuarioUpdateDTO
    {
        [Required] public string Nome { get; set; } = string.Empty;
        [Required, EmailAddress] public string Email { get; set; } = string.Empty;
        [Required] public string Perfil { get; set; } = string.Empty;
        public bool Ativo { get; set; }
    }
}