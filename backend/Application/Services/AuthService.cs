using System;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.DTOs;
using GerenciamentoCampanhas.Application.Interfaces;
using GerenciamentoCampanhas.Domain.Interfaces;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace GerenciamentoCampanhas.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IEmailService _emailService;

        public AuthService(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        public async Task<string> LoginAsync(LoginRequestDTO request)
        {
            var emailLimpo = request.Email?.Trim() ?? string.Empty;

            var usuario = await _usuarioRepository.ObterPorEmailAsync(emailLimpo);
            
            if (usuario == null) 
                throw new Exception("E-mail ou senha inválidos.");
            
            if (!usuario.Ativo) 
                throw new Exception("Usuário inativo. Procure a administração.");

            bool senhaValida = BCrypt.Net.BCrypt.Verify(request.Senha, usuario.SenhaHash);
            
            if (!senhaValida) 
                throw new Exception("E-mail ou senha inválidos.");

            // ==========================================
            // GERAÇÃO DO TOKEN JWT
            // ==========================================
            var tokenHandler = new JwtSecurityTokenHandler();
            
            var keyString = Environment.GetEnvironmentVariable("JWT_SECRET") 
                            ?? "ChaveSuperSecretaPadraoDoSistemaDeDoacoes2026!!";
            var key = Encoding.ASCII.GetBytes(keyString);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                    new Claim(ClaimTypes.Email, usuario.Email),
                    new Claim(ClaimTypes.Name, usuario.Nome),
                    new Claim(ClaimTypes.Role, usuario.Perfil.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), 
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task SolicitarRecuperacaoSenhaAsync(EsqueceuSenhaDTO request)
        {
            var emailLimpo = request.Email?.Trim() ?? string.Empty;
            var usuario = await _usuarioRepository.ObterPorEmailAsync(emailLimpo);

            if (usuario == null) return; // Por segurança, não expor se o e-mail existe

            var token = Guid.NewGuid().ToString();
            var expiracao = DateTime.UtcNow.AddHours(1);

            usuario.GerarTokenRecuperacao(token, expiracao);
            await _usuarioRepository.AtualizarAsync(usuario);

            var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:4200";
            var link = $"{frontendUrl}/reset-password?email={Uri.EscapeDataString(usuario.Email)}&token={Uri.EscapeDataString(token)}";

            await _emailService.EnviarRecuperacaoSenhaAsync(usuario.Email, usuario.Nome, link);
        }

        public async Task RedefinirSenhaAsync(RedefinirSenhaDTO request)
        {
            var usuario = await _usuarioRepository.ObterPorEmailAsync(request.Email.Trim());

            if (usuario == null || usuario.TokenRecuperacao != request.Token || usuario.TokenRecuperacaoExpiracao < DateTime.UtcNow)
            {
                throw new Exception("Token inválido ou expirado.");
            }

            var novoHash = BCrypt.Net.BCrypt.HashPassword(request.NovaSenha);
            usuario.AtualizarSenha(novoHash);
            usuario.LimparTokenRecuperacao();

            await _usuarioRepository.AtualizarAsync(usuario);
        }
    }
}