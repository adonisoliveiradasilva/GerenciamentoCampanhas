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
    public class CampanhaService : ICampanhaService
    {
        private readonly ICampanhaRepository _campanhaRepository;

        public CampanhaService(ICampanhaRepository campanhaRepository)
        {
            _campanhaRepository = campanhaRepository;
        }

        public async Task<IEnumerable<CampanhaResponseDTO>> ObterTodosAsync()
        {
            var campanhas = await _campanhaRepository.ObterTodosAsync();
            return campanhas.Select(MapearParaResponse);
        }

        public async Task<CampanhaResponseDTO> ObterPorIdAsync(Guid id)
        {
            var campanha = await _campanhaRepository.ObterPorIdAsync(id);
            if (campanha == null) throw new Exception("Campanha não encontrada.");
            
            return MapearParaResponse(campanha);
        }

        public async Task<CampanhaResponseDTO> CriarAsync(CampanhaCreateDTO dto)
        {
            if (dto.DataFim.HasValue && dto.DataFim < dto.DataInicio)
                throw new Exception("A data de fim não pode ser anterior à data de início.");

            var dataInicioUtc = DateTime.SpecifyKind(dto.DataInicio, DateTimeKind.Utc);
            DateTime? dataFimUtc = dto.DataFim.HasValue 
                ? DateTime.SpecifyKind(dto.DataFim.Value, DateTimeKind.Utc) 
                : null;

            var campanha = new Campanha(dto.Nome, dto.Local, dto.Descricao, dataInicioUtc, dataFimUtc);
            
            await _campanhaRepository.AdicionarAsync(campanha);
            
            return MapearParaResponse(campanha);
        }

        public async Task AtualizarAsync(Guid id, CampanhaUpdateDTO dto)
        {
            var campanha = await _campanhaRepository.ObterPorIdAsync(id);
            if (campanha == null) throw new Exception("Campanha não encontrada.");

            if (dto.DataFim.HasValue && dto.DataFim < dto.DataInicio)
                throw new Exception("A data de fim não pode ser anterior à data de início.");

            var dataInicioUtc = DateTime.SpecifyKind(dto.DataInicio, DateTimeKind.Utc);
            DateTime? dataFimUtc = dto.DataFim.HasValue 
                ? DateTime.SpecifyKind(dto.DataFim.Value, DateTimeKind.Utc) 
                : null;

            campanha.Atualizar(dto.Nome, dto.Local, dto.Descricao, dataInicioUtc, dataFimUtc);
            
            await _campanhaRepository.AtualizarAsync(campanha);
        }

        public async Task ExcluirAsync(Guid id)
        {
            var campanha = await _campanhaRepository.ObterPorIdAsync(id);
            if (campanha == null) throw new Exception("Campanha não encontrada.");

            await _campanhaRepository.RemoverAsync(campanha);
        }

        private static CampanhaResponseDTO MapearParaResponse(Campanha campanha)
        {
            return new CampanhaResponseDTO
            {
                Id = campanha.Id,
                Nome = campanha.Nome,
                Local = campanha.Local,
                Descricao = campanha.Descricao,
                DataInicio = campanha.DataInicio,
                DataFim = campanha.DataFim,
                DataCriacao = campanha.DataCriacao
            };
        }
    }
}