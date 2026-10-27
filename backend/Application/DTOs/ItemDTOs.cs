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
        
        [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero.")]
        public int Quantidade { get; set; }
        
        [Required(ErrorMessage = "A data de chegada é obrigatória.")]
        public DateTime DataChegada { get; set; }
        public TimeSpan? HoraPego { get; set; }
        
        public string? LugarPego { get; set; }
        
        [Required(ErrorMessage = "A campanha de destino é obrigatória no momento do cadastro.")]
        public Guid CampanhaId { get; set; }
        
        public Guid? DoadorId { get; set; }
        
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
    }
}