using GerenciamentoCampanhas.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GerenciamentoCampanhas.Infrastructure.Data.Configurations
{
    public class DoacaoConfiguration : IEntityTypeConfiguration<Doacao>
    {
        public void Configure(EntityTypeBuilder<Doacao> builder)
        {
            builder.HasKey(d => d.Id);
            
            builder.Property(d => d.Destino).IsRequired().HasMaxLength(500);

            builder.HasOne(d => d.Item)
                   .WithMany(i => i.Doacoes)
                   .HasForeignKey(d => d.ItemId)
                   .OnDelete(DeleteBehavior.Cascade); 
        }
    }
}