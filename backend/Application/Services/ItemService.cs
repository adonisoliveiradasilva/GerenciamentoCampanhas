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
    public class ItemService : IItemService
    {
        private readonly IItemRepository _itemRepository;
        private readonly ICampanhaRepository _campanhaRepository;
        private readonly IDoadorRepository _doadorRepository;

        public ItemService(IItemRepository itemRepository, ICampanhaRepository campanhaRepository, IDoadorRepository doadorRepository)
        {
            _itemRepository = itemRepository;
            _campanhaRepository = campanhaRepository;
            _doadorRepository = doadorRepository;
        }

        public async Task<IEnumerable<ItemResponseDTO>> ObterTodosAsync()
        {
            var itens = await _itemRepository.ObterTodosAsync();
            return itens.Select(MapearParaResponse);
        }

        public async Task<ItemResponseDTO> ObterPorIdAsync(Guid id)
        {
            var item = await _itemRepository.ObterPorIdAsync(id);
            if (item == null) throw new Exception("Item não encontrado.");
            return MapearParaResponse(item);
        }

        public async Task<ItemResponseDTO> CriarAsync(ItemRequestDTO dto)
        {
            // Validações de FK
            var campanha = await _campanhaRepository.ObterPorIdAsync(dto.CampanhaId);
            if (campanha == null) throw new Exception("Campanha selecionada não existe.");

            if (dto.DoadorId.HasValue)
            {
                var doador = await _doadorRepository.ObterPorIdAsync(dto.DoadorId.Value);
                if (doador == null) throw new Exception("Doador selecionado não existe.");
            }

            var dataChegadaUtc = DateTime.SpecifyKind(dto.DataChegada, DateTimeKind.Utc);
            
            var item = new Item(
                dto.Nome, dto.Descricao, dto.Quantidade, dataChegadaUtc, 
                dto.HoraPego, dto.LugarPego, dto.CampanhaId, dto.DoadorId, dto.Imagens
            );
            
            await _itemRepository.AdicionarAsync(item);
            
            // Retorna carregando as entidades para mapear os nomes corretos
            var itemCriado = await _itemRepository.ObterPorIdAsync(item.Id);
            return MapearParaResponse(itemCriado!);
        }

        public async Task AtualizarAsync(Guid id, ItemRequestDTO dto)
        {
            var item = await _itemRepository.ObterPorIdAsync(id);
            if (item == null) throw new Exception("Item não encontrado.");

            var campanha = await _campanhaRepository.ObterPorIdAsync(dto.CampanhaId);
            if (campanha == null) throw new Exception("Campanha selecionada não existe.");

            if (dto.DoadorId.HasValue)
            {
                var doador = await _doadorRepository.ObterPorIdAsync(dto.DoadorId.Value);
                if (doador == null) throw new Exception("Doador selecionado não existe.");
            }

            var dataChegadaUtc = DateTime.SpecifyKind(dto.DataChegada, DateTimeKind.Utc);

            item.Atualizar(
                dto.Nome, dto.Descricao, dto.Quantidade, dataChegadaUtc, 
                dto.HoraPego, dto.LugarPego, dto.CampanhaId, dto.DoadorId, dto.Imagens
            );
            
            await _itemRepository.AtualizarAsync(item);
        }

        public async Task ExcluirAsync(Guid id)
        {
            var item = await _itemRepository.ObterPorIdAsync(id);
            if (item == null) throw new Exception("Item não encontrado.");

            await _itemRepository.RemoverAsync(item);
        }

        private static ItemResponseDTO MapearParaResponse(Item item)
        {
            string campanhaNome = "Campanha Excluída";
            if (item.Campanha != null) campanhaNome = item.Campanha.Nome;

            string doadorNome = "Não informado";
            if (item.Doador != null) doadorNome = item.Doador.Nome;
            else if (item.DoadorId == null && item.Doador == null && 
                     false) { }

            return new ItemResponseDTO
            {
                Id = item.Id,
                Nome = item.Nome,
                Descricao = item.Descricao,
                Quantidade = item.Quantidade,
                DataChegada = item.DataChegada,
                HoraPego = item.HoraPego?.ToString(@"hh\:mm"),
                LugarPego = item.LugarPego,
                CampanhaId = item.CampanhaId,
                CampanhaNome = campanhaNome,
                DoadorId = item.DoadorId,
                DoadorNome = doadorNome,
                Imagens = item.Imagens
            };
        }
    }
}