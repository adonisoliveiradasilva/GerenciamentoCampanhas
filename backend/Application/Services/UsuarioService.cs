using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.DTOs;
using GerenciamentoCampanhas.Application.Interfaces;
using GerenciamentoCampanhas.Domain.Entities;
using GerenciamentoCampanhas.Domain.Enums;
using GerenciamentoCampanhas.Domain.Interfaces;
using BCrypt.Net;
using System.Security.Cryptography;

namespace GerenciamentoCampanhas.Application.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IEmailService _emailService;

        public UsuarioService(IUsuarioRepository usuarioRepository, IEmailService emailService)
        {
            _usuarioRepository = usuarioRepository;
            _emailService = emailService;
        }

        public async Task<IEnumerable<UsuarioResponseDTO>> ObterTodosAsync()
        {
            var usuarios = await _usuarioRepository.ObterTodosAsync();

            return usuarios.Select(u => new UsuarioResponseDTO
            {
                Id = u.Id,
                Nome = u.Nome,
                Email = u.Email,
                Perfil = u.Perfil.ToString(),
                DataCriacao = u.DataCriacao,
                Ativo = u.Ativo
            });
        }

        public async Task<UsuarioResponseDTO> CriarAsync(UsuarioCreateDTO dto)
        {
            var usuarioExistente = await _usuarioRepository.ObterPorEmailAsync(dto.Email);
            if (usuarioExistente != null)
                throw new Exception("Já existe um usuário cadastrado com este e-mail.");

            if (!Enum.TryParse<PerfilUsuario>(dto.Perfil, true, out var perfilEnum))
                throw new Exception("Perfil de usuário inválido.");

            string senhaTemporaria = GerarSenhaAleatoria(8);
            
            string senhaHash = BCrypt.Net.BCrypt.HashPassword(senhaTemporaria);

            var novoUsuario = new Usuario(dto.Nome, dto.Email, senhaHash, perfilEnum);

            await _usuarioRepository.AdicionarAsync(novoUsuario);

            await _emailService.EnviarBoasVindasAsync(novoUsuario.Email, novoUsuario.Nome, senhaTemporaria);

            return MapearParaResponse(novoUsuario);
        }

        public async Task AtualizarAsync(Guid id, UsuarioUpdateDTO dto)
        {
            var usuario = await _usuarioRepository.ObterPorIdAsync(id);
            if (usuario == null) throw new Exception("Usuário não encontrado.");

            if (!Enum.TryParse<PerfilUsuario>(dto.Perfil, true, out var perfilEnum))
                throw new Exception("Perfil de usuário inválido.");

            usuario.AtualizarDados(dto.Nome, dto.Email);
            usuario.AlterarPerfil(perfilEnum);

            if (dto.Ativo) usuario.Reativar();
            else usuario.Desativar();

            await _usuarioRepository.AtualizarAsync(usuario);
        }

        private string GerarSenhaAleatoria(int tamanho)
        {
            const string caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*";
            
            return new string(Enumerable.Repeat(caracteres, tamanho)
              .Select(s => s[RandomNumberGenerator.GetInt32(s.Length)]).ToArray());
        }

        private UsuarioResponseDTO MapearParaResponse(Usuario u)
        {
            return new UsuarioResponseDTO
            {
                Id = u.Id,
                Nome = u.Nome,
                Email = u.Email,
                Perfil = u.Perfil.ToString(),
                DataCriacao = u.DataCriacao,
                Ativo = u.Ativo
            };
        }

        public async Task AlterarSenhaAsync(Guid idUsuario, AlterarSenhaDTO dto)
        {
            var usuario = await _usuarioRepository.ObterPorIdAsync(idUsuario);
            if (usuario == null) throw new Exception("Usuário não encontrado.");

            if (!BCrypt.Net.BCrypt.Verify(dto.SenhaAtual, usuario.SenhaHash))
                throw new Exception("A senha atual está incorreta.");

            string novoHash = BCrypt.Net.BCrypt.HashPassword(dto.NovaSenha);
            
            usuario.AtualizarSenha(novoHash);

            await _usuarioRepository.AtualizarAsync(usuario);
        }

        public async Task AtualizarMeusDadosAsync(Guid idUsuario, AtualizarMeusDadosDTO dto)
        {
            var usuario = await _usuarioRepository.ObterPorIdAsync(idUsuario);
            if (usuario == null) throw new Exception("Usuário não encontrado.");

            usuario.AtualizarDados(dto.Nome, usuario.Email);

            await _usuarioRepository.AtualizarAsync(usuario);
        }
    }
}