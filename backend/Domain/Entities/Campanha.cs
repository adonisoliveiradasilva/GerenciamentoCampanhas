using System;

namespace GerenciamentoCampanhas.Domain.Entities
{
    public class Campanha
    {
        public Guid Id { get; private set; }
        public string Nome { get; private set; } = string.Empty;
        public string Local { get; private set; } = string.Empty;
        public string? Descricao { get; private set; }
        public DateTime DataInicio { get; private set; }
        public DateTime? DataFim { get; private set; }
        public DateTime DataCriacao { get; private set; }
        protected Campanha() { }

        public Campanha(string nome, string local, string? descricao, DateTime dataInicio, DateTime? dataFim)
        {
            Id = Guid.NewGuid();
            Nome = nome;
            Local = local;
            Descricao = descricao;
            DataInicio = dataInicio;
            DataFim = dataFim;
            DataCriacao = DateTime.UtcNow;
        }

        public void Atualizar(string nome, string local, string? descricao, DateTime dataInicio, DateTime? dataFim)
        {
            Nome = nome;
            Local = local;
            Descricao = descricao;
            DataInicio = dataInicio;
            DataFim = dataFim;
        }
    }
}