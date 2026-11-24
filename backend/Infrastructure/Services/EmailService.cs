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
        private static readonly HttpClient HttpClient = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(15)
        };

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
                await EnviarViaMailjetAsync(
                    email,
                    nome,
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
                await EnviarViaMailjetAsync(
                    email,
                    nome,
                    "Recuperação de Senha - Sistema de Doações",
                    corpoHtml);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao enviar e-mail de recuperação: {ex.Message}");
                throw;
            }
        }

        private async Task EnviarViaMailjetAsync(string paraEmail, string paraNome, string assunto, string html)
        {
            var apiKey = Environment.GetEnvironmentVariable("MAILJET_API_KEY");
            var secretKey = Environment.GetEnvironmentVariable("MAILJET_SECRET_KEY");

            if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(secretKey))
            {
                throw new InvalidOperationException("Variáveis MAILJET_API_KEY e/ou MAILJET_SECRET_KEY não configuradas.");
            }

            var fromEmail = Environment.GetEnvironmentVariable("MAILJET_FROM_EMAIL");
            if (string.IsNullOrWhiteSpace(fromEmail))
            {
                fromEmail = _smtpSettings.RemetenteEmail;
            }

            if (string.IsNullOrWhiteSpace(fromEmail))
            {
                throw new InvalidOperationException("E-mail remetente não configurado (MAILJET_FROM_EMAIL).");
            }

            var fromName = Environment.GetEnvironmentVariable("MAILJET_FROM_NAME");
            if (string.IsNullOrWhiteSpace(fromName))
            {
                fromName = string.IsNullOrWhiteSpace(_smtpSettings.RemetenteNome)
                    ? "Sistema de Doações"
                    : _smtpSettings.RemetenteNome;
            }

            var payload = new
            {
                Messages = new[]
                {
                    new
                    {
                        From = new { Email = fromEmail, Name = fromName },
                        To = new[] { new { Email = paraEmail, Name = paraNome } },
                        Subject = assunto,
                        HTMLPart = html
                    }
                }
            };

            var json = JsonSerializer.Serialize(payload);
            var authToken = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{apiKey}:{secretKey}"));

            using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.mailjet.com/v3.1/send");
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", authToken);
            request.Content = new StringContent(json, Encoding.UTF8, "application/json");

            using var response = await HttpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                throw new Exception($"Mailjet retornou {(int)response.StatusCode} ({response.ReasonPhrase}): {body}");
            }
        }
    }
}