using GerenciamentoCampanhas.Application.Interfaces;
using GerenciamentoCampanhas.Application.Services;
using GerenciamentoCampanhas.Domain.Interfaces;
using GerenciamentoCampanhas.Infrastructure.Config;
using GerenciamentoCampanhas.Infrastructure.Repositories;
using GerenciamentoCampanhas.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
namespace GerenciamentoCampanhas.Infrastructure.IoC
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration) 
        {
            // ==========================================
            // REPOSITÓRIOS
            // ==========================================
            services.AddScoped<IUsuarioRepository, UsuarioRepository>();

            // ==========================================
            // SERVIÇOS DE APLICAÇÃO
            // ==========================================
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUsuarioService, UsuarioService>();
            
            services.Configure<SmtpSettings>(configuration.GetSection("SmtpSettings"));
            services.AddScoped<IEmailService, EmailService>();

            return services;
        }
    }
}