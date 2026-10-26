using System;

namespace GerenciamentoCampanhas.Domain.Entities
{
    public class Usuario
    {
        public Guid Id { get; private set; }
        public string Nome { get; private set; }
        public string Email { get; private set; }
        public string SenhaHash { get; private set; }
        public DateTime DataCriacao { get; private set; }
        public bool Ativo { get; private set; }

        protected Usuario() { }

    
        public Usuario(string nome, string email, string senhaHash)
        {
            Id = Guid.NewGuid();
            Nome = nome;
            Email = email;
            SenhaHash = senhaHash;
            DataCriacao = DateTime.UtcNow;
            Ativo = true; 
        }
        
        public void Desativar()
        {
            Ativo = false;
        }

        public void Reativar()
        {
            Ativo = true;
        }

        public void AtualizarSenha(string novaSenhaHash)
        {
            SenhaHash = novaSenhaHash;
        }
    }
}