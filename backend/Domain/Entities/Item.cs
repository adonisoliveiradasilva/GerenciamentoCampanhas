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

        private readonly List<Doacao> _doacoes = new();
        public IReadOnlyCollection<Doacao> Doacoes => _doacoes.AsReadOnly();

        protected Item() { }

        public Item(string nome, string? descricao, int quantidade, DateTime dataChegada, 
                    TimeSpan? horaPego, string? lugarPego, Guid campanhaId, Guid? doadorId, List<string>? imagens)
        {
            if (imagens != null && imagens.Count > 5)
                throw new ArgumentException("O limite máximo é de 5 imagens por item.");

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
            if (imagens != null && imagens.Count > 5)
                throw new ArgumentException("O limite máximo é de 5 imagens por item.");

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

        public void RegistrarBaixaEstoque(int quantidadeBaixa)
        {
            if (quantidadeBaixa <= 0)
                throw new ArgumentException("A quantidade a ser baixada deve ser maior que zero.");
            
            if (Quantidade < quantidadeBaixa)
                throw new InvalidOperationException($"Estoque insuficiente. Tentativa de doar {quantidadeBaixa}, mas há apenas {Quantidade} disponíveis.");

            Quantidade -= quantidadeBaixa;
        }
    }
}