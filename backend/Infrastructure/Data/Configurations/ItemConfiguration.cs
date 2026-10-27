using GerenciamentoCampanhas.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GerenciamentoCampanhas.Infrastructure.Data.Configurations
{
    public class ItemConfiguration : IEntityTypeConfiguration<Item>
    {
        public void Configure(EntityTypeBuilder<Item> builder)
        {
            builder.HasOne(i => i.Campanha)
                .WithMany()
                .HasForeignKey(i => i.CampanhaId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasOne(i => i.Doador)
                .WithMany()
                .HasForeignKey(i => i.DoadorId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}