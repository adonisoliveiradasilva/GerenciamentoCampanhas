using System;
using System.ComponentModel.DataAnnotations;

namespace GerenciamentoCampanhas.Application.DTOs
{
    public class CampanhaCreateDTO
    {
        [Required(ErrorMessage = "O nome é obrigatório.")]
        [MinLength(3, ErrorMessage = "O nome deve ter no mínimo 3 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "O local é obrigatório.")]
        public string Local { get; set; } = string.Empty;

        public string? Descricao { get; set; }

        [Required(ErrorMessage = "A data de início é obrigatória.")]
        public DateTime DataInicio { get; set; }

        public DateTime? DataFim { get; set; }
    }

    public class CampanhaUpdateDTO : CampanhaCreateDTO
    {

    }

    public class CampanhaResponseDTO
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Local { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime? DataFim { get; set; }
        public DateTime DataCriacao { get; set; }
    }
}