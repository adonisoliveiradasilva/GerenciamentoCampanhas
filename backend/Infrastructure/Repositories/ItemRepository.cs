using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using GerenciamentoCampanhas.Domain.Entities;
using GerenciamentoCampanhas.Domain.Interfaces;
using GerenciamentoCampanhas.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GerenciamentoCampanhas.Infrastructure.Repositories
{
    public class ItemRepository : IItemRepository
    {
        private readonly AppDbContext _context;

        public ItemRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Item>> ObterTodosAsync()
        {
            return await _context.Itens
                .Include(i => i.Campanha)
                .Include(i => i.Doador)
                .Include(i => i.Doacoes)
                    .ThenInclude(d => d.Usuario)
                .Include(i => i.UsuarioCriador)
                .Include(i => i.UsuarioAtualizador)
                .AsNoTracking()
                .OrderByDescending(i => i.DataCriacao)
                .ToListAsync();
        }

        public async Task<Item?> ObterPorIdAsync(Guid id)
        {
            return await _context.Itens
                .Include(i => i.Campanha)
                .Include(i => i.Doador)
                .Include(i => i.Doacoes)
                    .ThenInclude(d => d.Usuario)
                .Include(i => i.UsuarioCriador)
                .Include(i => i.UsuarioAtualizador)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task AdicionarAsync(Item item)
        {
            _context.Itens.Add(item);
            await _context.SaveChangesAsync();
        }

        public async Task AtualizarAsync(Item item)
        {
            _context.Itens.Update(item);
            await _context.SaveChangesAsync();
        }

        public async Task RemoverAsync(Item item)
        {
            _context.Itens.Remove(item);
            await _context.SaveChangesAsync();
        }
    }
}