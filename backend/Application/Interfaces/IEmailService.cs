using System.Threading.Tasks;

namespace GerenciamentoCampanhas.Application.Interfaces
{
    public interface IEmailService
    {
        Task EnviarBoasVindasAsync(string email, string nome, string senhaTemporaria);
        Task EnviarBoasVindasAsync(string email, string nome, string senhaTemporaria);
        Task EnviarRecuperacaoSenhaAsync(string email, string nome, string linkRecuperacao);
    }
}