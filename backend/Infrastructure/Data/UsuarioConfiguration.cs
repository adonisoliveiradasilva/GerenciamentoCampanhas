using GerenciamentoCampanhas.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GerenciamentoCampanhas.Infrastructure.Data.Configurations
{
    public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
    {
        public void Configure(EntityTypeBuilder<Usuario> builder)
        {
            builder.ToTable("Usuarios");

            builder.HasKey(u => u.Id);

            builder.Property(u => u.Nome)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(u => u.Email)
                   .IsRequired()
                   .HasMaxLength(150);

            builder.HasIndex(u => u.Email)
                   .IsUnique();

            builder.Property(u => u.SenhaHash)
                   .IsRequired();
                   
            builder.Property(u => u.Perfil)
                   .HasConversion<string>()
                   .IsRequired()
                   .HasMaxLength(50);
                   
            builder.Property(u => u.DataCriacao)
                   .IsRequired();

            builder.Property(u => u.Ativo)
                   .IsRequired();
        }
    }
}