using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GerenciamentoCampanhas.Application.DTOs
{
    public class ItemRequestDTO
    {
        [Required(ErrorMessage = "O nome é obrigatório.")]
        public string Nome { get; set; } = string.Empty;
        
        public string? Descricao { get; set; }
        
        [Range(0, int.MaxValue, ErrorMessage = "A quantidade não pode ser negativa.")]
        public int Quantidade { get; set; }
        
        [Required(ErrorMessage = "A data de chegada é obrigatória.")]
        public DateTime DataChegada { get; set; }
        
        public TimeSpan? HoraPego { get; set; }
        
        public string? LugarPego { get; set; }
        
        [Required(ErrorMessage = "A campanha de destino é obrigatória no momento do cadastro.")]
        public Guid CampanhaId { get; set; }
        
        public Guid? DoadorId { get; set; }
        
        [MaxLength(5, ErrorMessage = "Um item não pode conter mais de 5 imagens.")]
        public List<string>? Imagens { get; set; }
    }

    public class ItemResponseDTO
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public int Quantidade { get; set; }
        public DateTime DataChegada { get; set; }
        public string? HoraPego { get; set; } 
        public string? LugarPego { get; set; }
        
        public Guid? CampanhaId { get; set; }
        public string CampanhaNome { get; set; } = string.Empty; 
        
        public Guid? DoadorId { get; set; }
        public string DoadorNome { get; set; } = string.Empty; 
        
        public List<string> Imagens { get; set; } = new();
        public List<DoacaoResponseDTO> HistoricoDoacoes { get; set; } = new();
    }

    public class DoacaoResponseDTO
    {
        public Guid Id { get; set; }
        public int Quantidade { get; set; }
        public DateTime DataDoacao { get; set; }
        public string Destino { get; set; } = string.Empty;
    }

    public class DoacaoRequestDTO
    {
        [Required]
        public Guid ItemId { get; set; }
        
        [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero.")]
        public int Quantidade { get; set; }
        
        [Required(ErrorMessage = "A data da doação é obrigatória.")]
        public DateTime DataDoacao { get; set; }
        
        [Required(ErrorMessage = "O destino/observação é obrigatório.")]
        [MinLength(3, ErrorMessage = "O destino deve ter pelo menos 3 caracteres.")]
        public string Destino { get; set; } = string.Empty;
    }
}