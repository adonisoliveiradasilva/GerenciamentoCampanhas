using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Domain.Entities;
using GerenciamentoCampanhas.Domain.Interfaces;
using GerenciamentoCampanhas.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GerenciamentoCampanhas.Infrastructure.Repositories
{
    public class CampanhaRepository : ICampanhaRepository
    {
        private readonly AppDbContext _context;

        public CampanhaRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Campanha>> ObterTodosAsync()
        {
            return await _context.Campanhas
                .AsNoTracking()
                .OrderByDescending(c => c.DataInicio)
                .ToListAsync();
        }

        public async Task<Campanha?> ObterPorIdAsync(Guid id)
        {
            return await _context.Campanhas.FindAsync(id);
        }

        public async Task AdicionarAsync(Campanha campanha)
        {
            _context.Campanhas.Add(campanha);
            await _context.SaveChangesAsync();
        }

        public async Task AtualizarAsync(Campanha campanha)
        {
            _context.Campanhas.Update(campanha);
            await _context.SaveChangesAsync();
        }

        public async Task RemoverAsync(Campanha campanha)
        {
            _context.Campanhas.Remove(campanha);
            await _context.SaveChangesAsync();
        }
    }
}