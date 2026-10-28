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
        
        public Guid CampanhaId { get; private set; }
        public Campanha Campanha { get; private set; }

        public Guid? DoadorId { get; private set; }
        public Doador? Doador { get; private set; }

        public List<string> Imagens { get; private set; } = new();
        public ICollection<Doacao> Doacoes { get; private set; } = new List<Doacao>();

        public DateTime DataCriacao { get; private set; }
        public Guid UsuarioCriadorId { get; private set; }
        public Usuario UsuarioCriador { get; private set; }

        public DateTime? DataUltimaAtualizacao { get; private set; }
        public Guid? UsuarioAtualizadorId { get; private set; }
        public Usuario? UsuarioAtualizador { get; private set; }

        protected Item() { }

        public Item(string nome, string? descricao, int quantidade, DateTime dataChegada, TimeSpan? horaPego, string? lugarPego, Guid campanhaId, Guid? doadorId, List<string>? imagens, Guid usuarioCriadorId)
        {
            if (string.IsNullOrWhiteSpace(nome)) throw new ArgumentException("O nome do item é obrigatório.");
            if (quantidade < 0) throw new ArgumentException("A quantidade não pode ser negativa.");
            if (campanhaId == Guid.Empty) throw new ArgumentException("A campanha de destino é obrigatória.");
            if (usuarioCriadorId == Guid.Empty) throw new ArgumentException("O usuário criador é obrigatório.");

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
            UsuarioCriadorId = usuarioCriadorId;
        }

        public void Atualizar(string nome, string? descricao, int quantidade, DateTime dataChegada, TimeSpan? horaPego, string? lugarPego, Guid campanhaId, Guid? doadorId, List<string>? imagens, Guid usuarioAtualizadorId)
        {
            if (string.IsNullOrWhiteSpace(nome)) throw new ArgumentException("O nome do item é obrigatório.");
            if (quantidade < 0) throw new ArgumentException("A quantidade não pode ser negativa.");
            if (usuarioAtualizadorId == Guid.Empty) throw new ArgumentException("O usuário atualizador é obrigatório.");

            Nome = nome;
            Descricao = descricao;
            Quantidade = quantidade;
            DataChegada = dataChegada;
            HoraPego = horaPego;
            LugarPego = lugarPego;
            CampanhaId = campanhaId;
            DoadorId = doadorId;
            Imagens = imagens ?? new List<string>();

            DataUltimaAtualizacao = DateTime.UtcNow;
            UsuarioAtualizadorId = usuarioAtualizadorId;
        }

        public void RegistrarBaixaEstoque(int quantidadeDoada)
        {
            if (quantidadeDoada <= 0) throw new ArgumentException("A quantidade a ser doada deve ser maior que zero.");
            if (Quantidade < quantidadeDoada) throw new InvalidOperationException($"Não há itens suficientes em estoque. Disponível: {Quantidade}");

            Quantidade -= quantidadeDoada;
        }
    }
}