using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Application.DTOs;
using GerenciamentoCampanhas.Application.Interfaces;
using GerenciamentoCampanhas.Domain.Entities;
using GerenciamentoCampanhas.Domain.Interfaces;

namespace GerenciamentoCampanhas.Application.Services
{
    public class DoadorService : IDoadorService
    {
        private readonly IDoadorRepository _doadorRepository;

        public DoadorService(IDoadorRepository doadorRepository)
        {
            _doadorRepository = doadorRepository;
        }

        public async Task<IEnumerable<DoadorResponseDTO>> ObterTodosAsync()
        {
            var doadores = await _doadorRepository.ObterTodosAsync();
            return doadores.Select(MapearParaResponse);
        }

        public async Task<DoadorResponseDTO> ObterPorIdAsync(Guid id)
        {
            var doador = await _doadorRepository.ObterPorIdAsync(id);
            if (doador == null) throw new Exception("Doador não encontrado.");
            return MapearParaResponse(doador);
        }

        public async Task<DoadorResponseDTO> CriarAsync(DoadorRequestDTO dto)
        {
            if (dto.DataNascimento.Date > DateTime.UtcNow.Date)
                throw new Exception("A data de nascimento não pode ser no futuro.");

            var emailLimpo = dto.Email.ToLower().Trim();
            var doadorExistente = await _doadorRepository.ObterPorEmailAsync(emailLimpo);
            
            if (doadorExistente != null)
                throw new Exception("Já existe um doador cadastrado com este e-mail.");

            var dataNascUtc = DateTime.SpecifyKind(dto.DataNascimento, DateTimeKind.Utc);
            var doador = new Doador(dto.Nome, emailLimpo, dataNascUtc);
            
            await _doadorRepository.AdicionarAsync(doador);
            return MapearParaResponse(doador);
        }

        public async Task AtualizarAsync(Guid id, DoadorRequestDTO dto)
        {
            var doador = await _doadorRepository.ObterPorIdAsync(id);
            if (doador == null) throw new Exception("Doador não encontrado.");

            if (dto.DataNascimento.Date > DateTime.UtcNow.Date)
                throw new Exception("A data de nascimento não pode ser no futuro.");

            var emailLimpo = dto.Email.ToLower().Trim();
            var doadorExistente = await _doadorRepository.ObterPorEmailAsync(emailLimpo);
            
            if (doadorExistente != null && doadorExistente.Id != id)
                throw new Exception("Já existe um outro doador cadastrado com este e-mail.");

            var dataNascUtc = DateTime.SpecifyKind(dto.DataNascimento, DateTimeKind.Utc);
            doador.Atualizar(dto.Nome, emailLimpo, dataNascUtc);
            
            await _doadorRepository.AtualizarAsync(doador);
        }

        private static DoadorResponseDTO MapearParaResponse(Doador doador)
        {
            return new DoadorResponseDTO
            {
                Id = doador.Id,
                Nome = doador.Nome,
                Email = doador.Email,
                DataNascimento = doador.DataNascimento,
                DataCriacao = doador.DataCriacao
            };
        }

        public async Task ExcluirAsync(Guid id)
        {
            var doador = await _doadorRepository.ObterPorIdAsync(id);
            if (doador == null) throw new Exception("Doador não encontrado.");

            await _doadorRepository.RemoverAsync(doador);
        }
    }
}