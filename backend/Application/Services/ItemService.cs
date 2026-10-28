using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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
    private readonly IDoacaoRepository _doacaoRepository; 

    public ItemService(
        IItemRepository itemRepository, 
        ICampanhaRepository campanhaRepository, 
        IDoadorRepository doadorRepository,
        IDoacaoRepository doacaoRepository)
    {
        _itemRepository = itemRepository;
        _campanhaRepository = campanhaRepository;
        _doadorRepository = doadorRepository;
        _doacaoRepository = doacaoRepository;
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

    public async Task<ItemResponseDTO> CriarAsync(ItemRequestDTO dto, Guid usuarioId)
    {
        var campanha = await _campanhaRepository.ObterPorIdAsync(dto.CampanhaId);
        if (campanha == null) throw new Exception("Campanha selecionada não existe.");

        if (dto.DoadorId.HasValue)
        {
            var doador = await _doadorRepository.ObterPorIdAsync(dto.DoadorId.Value);
            if (doador == null) throw new Exception("Doador selecionado não existe.");
        }

        var dataChegadaUtc = DateTime.SpecifyKind(dto.DataChegada, DateTimeKind.Utc);
        
        if (dataChegadaUtc.Date > DateTime.UtcNow.Date)
            throw new InvalidOperationException("Não é permitido registrar a chegada de um item com data futura.");
        
        var item = new Item(
            dto.Nome, dto.Descricao, dto.Quantidade, dataChegadaUtc, 
            dto.HoraPego, dto.LugarPego, dto.CampanhaId, dto.DoadorId, dto.Imagens, usuarioId
        );
        
        await _itemRepository.AdicionarAsync(item);
        
        var itemCriado = await _itemRepository.ObterPorIdAsync(item.Id);
        return MapearParaResponse(itemCriado!);
    }

    public async Task AtualizarAsync(Guid id, ItemRequestDTO dto, Guid usuarioId)
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

        if (dataChegadaUtc.Date > DateTime.UtcNow.Date)
            throw new InvalidOperationException("Não é permitido registrar a chegada de um item com data futura.");

        item.Atualizar(
            dto.Nome, dto.Descricao, dto.Quantidade, dataChegadaUtc, 
            dto.HoraPego, dto.LugarPego, dto.CampanhaId, dto.DoadorId, dto.Imagens, usuarioId
        );
        
        await _itemRepository.AtualizarAsync(item);
    }

    public async Task ExcluirAsync(Guid id)
    {
        var item = await _itemRepository.ObterPorIdAsync(id);
        if (item == null) throw new Exception("Item não encontrado.");

        await _itemRepository.RemoverAsync(item);
    }

    public async Task RegistrarDoacaoAsync(DoacaoRequestDTO dto, Guid usuarioId)
    {
        var item = await _itemRepository.ObterPorIdAsync(dto.ItemId);
        if (item == null) throw new Exception("Item não encontrado.");

        var dataDoacaoUtc = DateTime.SpecifyKind(dto.DataDoacao, DateTimeKind.Utc);
        
        if (dataDoacaoUtc.Date < item.DataChegada.Date)
            throw new InvalidOperationException($"A doação não pode ser registrada numa data anterior à chegada do item ({item.DataChegada:dd/MM/yyyy}).");

        if (dataDoacaoUtc.Date > DateTime.UtcNow.Date)
            throw new InvalidOperationException("Não é permitido registrar doações com datas futuras.");

        item.RegistrarBaixaEstoque(dto.Quantidade);

        var doacao = new Doacao(item.Id, dto.Quantidade, dataDoacaoUtc, dto.Destino, usuarioId);

        await _doacaoRepository.AdicionarAsync(doacao);
        await _itemRepository.AtualizarAsync(item);
    }

    private static ItemResponseDTO MapearParaResponse(Item item)
    {
        string campanhaNome = item.Campanha?.Nome ?? "Campanha Excluída";
        string doadorNome = item.Doador?.Nome ?? "Não informado";

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
            Imagens = item.Imagens,
            DataCriacao = item.DataCriacao,
            UsuarioCriadorNome = item.UsuarioCriador?.Nome ?? "Sistema",
            DataUltimaAtualizacao = item.DataUltimaAtualizacao,
            UsuarioAtualizadorNome = item.UsuarioAtualizador?.Nome,
            HistoricoDoacoes = item.Doacoes.OrderByDescending(d => d.DataDoacao).Select(d => new DoacaoResponseDTO
            {
                Id = d.Id,
                Quantidade = d.Quantidade,
                DataDoacao = d.DataDoacao,
                Destino = d.Destino,
                UsuarioNome = d.Usuario?.Nome ?? "Usuário Removido"
            }).ToList()
        };
    }
}
}