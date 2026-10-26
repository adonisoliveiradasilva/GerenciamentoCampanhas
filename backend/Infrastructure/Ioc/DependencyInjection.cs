using GerenciamentoCampanhas.Application.Interfaces;
using GerenciamentoCampanhas.Application.Services;
using GerenciamentoCampanhas.Domain.Interfaces;
using GerenciamentoCampanhas.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace GerenciamentoCampanhas.Infrastructure.IoC
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            // ==========================================
            // REPOSITÓRIOS
            // ==========================================
            services.AddScoped<IUsuarioRepository, UsuarioRepository>();

            // ==========================================
            // SERVIÇOS DE APLICAÇÃO
            // ==========================================
            services.AddScoped<IAuthService, AuthService>();

            return services;
        }
    }
}