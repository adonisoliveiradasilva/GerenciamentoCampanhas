using System;

namespace GerenciamentoCampanhas.Domain.Entities
{
    public class Doador
    {
        public Guid Id { get; private set; }
        public string Nome { get; private set; } = string.Empty;
        public string Email { get; private set; } = string.Empty;
        public DateTime DataNascimento { get; private set; }
        public DateTime DataCriacao { get; private set; }

        protected Doador() { }

        public Doador(string nome, string email, DateTime dataNascimento)
        {
            Id = Guid.NewGuid();
            Nome = nome;
            Email = email.ToLower().Trim();
            DataNascimento = dataNascimento;
            DataCriacao = DateTime.UtcNow;
        }

        public void Atualizar(string nome, string email, DateTime dataNascimento)
        {
            Nome = nome;
            Email = email.ToLower().Trim();
            DataNascimento = dataNascimento;
        }
    }
}