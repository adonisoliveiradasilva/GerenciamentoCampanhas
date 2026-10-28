using System;

namespace GerenciamentoCampanhas.Domain.Entities
{
    public class Doacao
    {
        public Guid Id { get; private set; }
        public Guid ItemId { get; private set; }
        public Item Item { get; private set; }
        public int Quantidade { get; private set; }
        public DateTime DataDoacao { get; private set; }
        public string Destino { get; private set; } = string.Empty;
        public DateTime DataCriacao { get; private set; }

        protected Doacao() { }

        public Doacao(Guid itemId, int quantidade, DateTime dataDoacao, string destino)
        {
            if (quantidade <= 0) throw new ArgumentException("A quantidade doada deve ser maior que zero.");
            if (string.IsNullOrWhiteSpace(destino)) throw new ArgumentException("O destino/observação da doação é obrigatório.");

            Id = Guid.NewGuid();
            ItemId = itemId;
            Quantidade = quantidade;
            DataDoacao = dataDoacao;
            Destino = destino;
            DataCriacao = DateTime.UtcNow;
        }
    }
}