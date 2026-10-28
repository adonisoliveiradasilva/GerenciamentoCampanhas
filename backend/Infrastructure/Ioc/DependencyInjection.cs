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

            services.AddScoped<ICampanhaRepository, CampanhaRepository>();
            services.AddScoped<ICampanhaService, CampanhaService>();

            services.AddScoped<IDoadorRepository, DoadorRepository>();
            services.AddScoped<IDoadorService, DoadorService>();

            services.AddScoped<IItemRepository, ItemRepository>();
            services.AddScoped<IItemService, ItemService>();
            services.AddScoped<IDoacaoRepository, DoacaoRepository>();

            services.AddScoped<IDashboardRepository, DashboardRepository>();
            services.AddScoped<IDashboardService, DashboardService>();

            return services;
        }
    }
}