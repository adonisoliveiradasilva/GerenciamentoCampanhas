using System.Threading.Tasks;

namespace GerenciamentoCampanhas.Application.Interfaces
{
    public interface IEmailService
    {
        Task EnviarBoasVindasAsync(string email, string nome, string senhaTemporaria);
    }
}