using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Domain.Entities;
using GerenciamentoCampanhas.Domain.Interfaces;
using GerenciamentoCampanhas.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GerenciamentoCampanhas.Infrastructure.Repositories
{
    public class DoadorRepository : IDoadorRepository
    {
        private readonly AppDbContext _context;

        public DoadorRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Doador>> ObterTodosAsync()
        {
            return await _context.Doadores
                .AsNoTracking()
                .OrderBy(d => d.Nome)
                .ToListAsync();
        }

        public async Task<Doador?> ObterPorIdAsync(Guid id)
        {
            return await _context.Doadores.FindAsync(id);
        }

        public async Task AdicionarAsync(Doador doador)
        {
            _context.Doadores.Add(doador);
            await _context.SaveChangesAsync();
        }

        public async Task AtualizarAsync(Doador doador)
        {
            _context.Doadores.Update(doador);
            await _context.SaveChangesAsync();
        }

        public async Task RemoverAsync(Doador doador)
        {
            _context.Doadores.Remove(doador);
            await _context.SaveChangesAsync();
        }

        public async Task<Doador?> ObterPorEmailAsync(string email)
        {
            return await _context.Doadores.FirstOrDefaultAsync(d => d.Email == email);
        }
    }
}