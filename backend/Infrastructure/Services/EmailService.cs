using System;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.Interfaces;
using GerenciamentoCampanhas.Infrastructure.Config;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace GerenciamentoCampanhas.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtpSettings;

        public EmailService(IOptions<SmtpSettings> smtpSettings)
        {
            _smtpSettings = smtpSettings.Value;
        }

        public async Task EnviarBoasVindasAsync(string email, string nome, string senhaTemporaria)
        {
            try
            {
                var mensagem = new MimeMessage();
                mensagem.From.Add(new MailboxAddress(_smtpSettings.RemetenteNome, _smtpSettings.RemetenteEmail));
                mensagem.To.Add(new MailboxAddress(nome, email));
                mensagem.Subject = "Bem-vindo ao Sistema de Doações! Seus dados de acesso";

                var corpoHtml = $@"
                    <h2>Olá, {nome}!</h2>
                    <p>Seu cadastro no Sistema de Doações foi realizado com sucesso.</p>
                    <p>Sua senha temporária de acesso é: <strong>{senhaTemporaria}</strong></p>
                    <p>Acesse o sistema e atualize sua senha no primeiro acesso.</p>
                    <br>
                    <p>Equipe do Sistema de Doações.</p>";

                var builder = new BodyBuilder { HtmlBody = corpoHtml };
                mensagem.Body = builder.ToMessageBody();

                using var client = new SmtpClient();
                
                await client.ConnectAsync(_smtpSettings.Servidor, _smtpSettings.Porta, SecureSocketOptions.StartTls);
                
                await client.AuthenticateAsync(_smtpSettings.Usuario, _smtpSettings.Senha);
                
                await client.SendAsync(mensagem);
                
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao enviar e-mail: {ex.Message}");
            }
        }
    }
}