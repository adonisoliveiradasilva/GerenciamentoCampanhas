using System.Threading.Tasks;
using GerenciamentoCampanhas.Domain.Entities;

namespace GerenciamentoCampanhas.Domain.Interfaces
{
    public interface IDoacaoRepository
    {
        Task AdicionarAsync(Doacao doacao);
    }
}