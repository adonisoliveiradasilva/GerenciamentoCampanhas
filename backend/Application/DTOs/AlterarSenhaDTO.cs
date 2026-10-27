using System.ComponentModel.DataAnnotations;

namespace GerenciamentoCampanhas.Application.DTOs
{
    public class AlterarSenhaDTO
    {
        [Required(ErrorMessage = "A senha atual é obrigatória.")]
        public string SenhaAtual { get; set; } = string.Empty;

        [Required(ErrorMessage = "A nova senha é obrigatória.")]
        [MinLength(8, ErrorMessage = "A senha deve ter no mínimo 8 caracteres.")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$", 
            ErrorMessage = "A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial.")]
        public string NovaSenha { get; set; } = string.Empty;
    }
}