using System.ComponentModel.DataAnnotations;

namespace GerenciamentoCampanhas.Application.DTOs
{
    public class AtualizarMeusDadosDTO
    {
        [Required(ErrorMessage = "O nome é obrigatório.")]
        [MinLength(3, ErrorMessage = "O nome deve ter no mínimo 3 caracteres.")]
        public string Nome { get; set; } = string.Empty;
    }
}