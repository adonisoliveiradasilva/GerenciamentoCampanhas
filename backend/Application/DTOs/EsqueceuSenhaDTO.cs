using System.ComponentModel.DataAnnotations;

namespace GerenciamentoCampanhas.Application.DTOs
{
    public class EsqueceuSenhaDTO
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}