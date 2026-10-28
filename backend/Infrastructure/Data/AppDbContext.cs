using System;
using GerenciamentoCampanhas.Domain.Entities;
using GerenciamentoCampanhas.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace GerenciamentoCampanhas.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Campanha> Campanhas { get; set; }
        public DbSet<Doador> Doadores { get; set; }
        public DbSet<Item> Itens { get; set; }
        public DbSet<Doacao> Doacoes { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

            // ==========================================
            // SEEDER: Populando o banco com 2 usuários
            // ==========================================
            var senhaHashPadrao = "$2a$11$f4CnqCFJ5TAxKo1p2DHA7OJIw6O.qipPUhpxnbmWcu.tubtSUPvHi";

            modelBuilder.Entity<Usuario>().HasData(
                new 
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    Nome = "Adonis Oliveira",
                    Email = "adonis.silva@aluno.ufop.edu.br",
                    SenhaHash = senhaHashPadrao,
                    Perfil = PerfilUsuario.Administrador,
                    DataCriacao = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    Ativo = true
                },
                new 
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    Nome = "Caique Leite",
                    Email = "caique.leite@aluno.ufop.edu.br",
                    SenhaHash = senhaHashPadrao,
                    Perfil = PerfilUsuario.Administrador,
                    DataCriacao = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    Ativo = true
                }
            );
        }
    }
}