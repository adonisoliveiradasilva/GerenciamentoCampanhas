using System.Threading.Tasks;
using GerenciamentoCampanhas.Domain.Entities;
using GerenciamentoCampanhas.Domain.Interfaces;
using GerenciamentoCampanhas.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GerenciamentoCampanhas.Infrastructure.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly AppDbContext _context;

        public UsuarioRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario?> ObterPorEmailAsync(string email)
        {
            return await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}