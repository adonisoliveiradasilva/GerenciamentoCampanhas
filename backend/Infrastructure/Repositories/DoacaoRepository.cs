using System.Threading.Tasks;
using GerenciamentoCampanhas.Domain.Entities;
using GerenciamentoCampanhas.Domain.Interfaces;
using GerenciamentoCampanhas.Infrastructure.Data;

namespace GerenciamentoCampanhas.Infrastructure.Repositories
{
    public class DoacaoRepository : IDoacaoRepository
    {
        private readonly AppDbContext _context;

        public DoacaoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AdicionarAsync(Doacao doacao)
        {
            _context.Doacoes.Add(doacao);
            await _context.SaveChangesAsync();
        }
    }
}