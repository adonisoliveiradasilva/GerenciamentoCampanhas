using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.Interfaces;
using GerenciamentoCampanhas.Infrastructure.Config;
using Microsoft.Extensions.Options;

namespace GerenciamentoCampanhas.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private static readonly HttpClient HttpClient = new HttpClient();
        private readonly SmtpSettings _smtpSettings;

        public EmailService(IOptions<SmtpSettings> smtpSettings)
        {
            _smtpSettings = smtpSettings.Value;
        }

        public async Task EnviarBoasVindasAsync(string email, string nome, string senhaTemporaria)
        {
            var corpoHtml = $@"
                <h2>Olá, {nome}!</h2>
                <p>Seu cadastro no Sistema de Doações foi realizado com sucesso.</p>
                <p>Sua senha temporária de acesso é: <strong>{senhaTemporaria}</strong></p>
                <p>Acesse o sistema e atualize sua senha no primeiro acesso.</p>
                <br>
                <p>Equipe do Sistema de Doações.</p>";

            try
            {
                await EnviarViaResendAsync(
                    email,
                    "Bem-vindo ao Sistema de Doações! Seus dados de acesso",
                    corpoHtml);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao enviar e-mail: {ex.Message}");
            }
        }

        public async Task EnviarRecuperacaoSenhaAsync(string email, string nome, string linkRecuperacao)
        {
            var corpoHtml = $@"
                <h2>Olá, {nome}!</h2>
                <p>Você solicitou a recuperação de senha para sua conta.</p>
                <p>Clique no link abaixo para definir uma nova senha:</p>
                <p><a href='{linkRecuperacao}' target='_blank'>Redefinir Senha</a></p>
                <p>Este link expira em 1 hora.</p>
                <br>
                <p>Se você não solicitou isso, ignore este e-mail.</p>";

            try
            {
                await EnviarViaResendAsync(
                    email,
                    "Recuperação de Senha - Sistema de Doações",
                    corpoHtml);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao enviar e-mail de recuperação: {ex.Message}");
                throw;
            }
        }

        private async Task EnviarViaResendAsync(string paraEmail, string assunto, string html)
        {
            var apiKey = Environment.GetEnvironmentVariable("RESEND_API_KEY");
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                throw new InvalidOperationException("Variável de ambiente RESEND_API_KEY não configurada.");
            }

            var remetenteNome = string.IsNullOrWhiteSpace(_smtpSettings.RemetenteNome)
                ? "Sistema de Doações"
                : _smtpSettings.RemetenteNome;

            var remetenteEmail = Environment.GetEnvironmentVariable("RESEND_FROM_EMAIL");
            if (string.IsNullOrWhiteSpace(remetenteEmail))
            {
                remetenteEmail = string.IsNullOrWhiteSpace(_smtpSettings.RemetenteEmail)
                    ? "onboarding@resend.dev"
                    : _smtpSettings.RemetenteEmail;
            }

            var payload = new
            {
                from = $"{remetenteNome} <{remetenteEmail}>",
                to = new[] { paraEmail },
                subject = assunto,
                html = html
            };

            var json = JsonSerializer.Serialize(payload);
            using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            request.Content = new StringContent(json, Encoding.UTF8, "application/json");

            using var response = await HttpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                throw new Exception($"Resend retornou {(int)response.StatusCode} ({response.ReasonPhrase}): {body}");
            }
        }
    }
}