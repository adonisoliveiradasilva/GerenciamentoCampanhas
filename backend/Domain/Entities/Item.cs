using System;
using System.Collections.Generic;

namespace GerenciamentoCampanhas.Domain.Entities
{
    public class Item
    {
        public Guid Id { get; private set; }
        public string Nome { get; private set; } = string.Empty;
        public string? Descricao { get; private set; }
        public int Quantidade { get; private set; }
        public DateTime DataChegada { get; private set; }
        public TimeSpan? HoraPego { get; private set; }
        public string? LugarPego { get; private set; }
        public List<string> Imagens { get; private set; } = new();
        public DateTime DataCriacao { get; private set; }

        public Guid? CampanhaId { get; private set; }
        public Campanha? Campanha { get; private set; }

        public Guid? DoadorId { get; private set; }
        public Doador? Doador { get; private set; }

        protected Item() { }

        public Item(string nome, string? descricao, int quantidade, DateTime dataChegada, 
                    TimeSpan? horaPego, string? lugarPego, Guid campanhaId, Guid? doadorId, List<string>? imagens)
        {
            Id = Guid.NewGuid();
            Nome = nome;
            Descricao = descricao;
            Quantidade = quantidade;
            DataChegada = dataChegada;
            HoraPego = horaPego;
            LugarPego = lugarPego;
            CampanhaId = campanhaId;
            DoadorId = doadorId;
            Imagens = imagens ?? new List<string>();
            DataCriacao = DateTime.UtcNow;
        }

        public void Atualizar(string nome, string? descricao, int quantidade, DateTime dataChegada, 
                              TimeSpan? horaPego, string? lugarPego, Guid campanhaId, Guid? doadorId, List<string>? imagens)
        {
            Nome = nome;
            Descricao = descricao;
            Quantidade = quantidade;
            DataChegada = dataChegada;
            HoraPego = horaPego;
            LugarPego = lugarPego;
            CampanhaId = campanhaId;
            DoadorId = doadorId;
            Imagens = imagens ?? new List<string>();
        }
    }
}