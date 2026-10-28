using System;
using System.Linq;
using System.Threading.Tasks;
using GerenciamentoCampanhas.Domain.Interfaces;
using GerenciamentoCampanhas.Domain.Models;
using GerenciamentoCampanhas.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GerenciamentoCampanhas.Infrastructure.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly AppDbContext _context;

        public DashboardRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardResumoModel> ObterResumoDashboardAsync()
        {
            var hoje = DateTime.UtcNow.Date;

            var totalEstoque = await _context.Itens.SumAsync(i => i.Quantidade);
            var totalDoado = await _context.Doacoes.SumAsync(d => d.Quantidade);
            var campanhasAtivas = await _context.Campanhas.CountAsync(c => c.DataFim == null || c.DataFim >= hoje);
            var doadoresCadastrados = await _context.Doadores.CountAsync();

            var arrecadacaoCampanha = await _context.Campanhas
                .Select(c => new GraficoCampanhaModel
                {
                    CampanhaNome = c.Nome,
                    TotalArrecadado = _context.Itens.Where(i => i.CampanhaId == c.Id).Sum(i => i.Quantidade) +
                                      _context.Doacoes.Where(d => d.Item.CampanhaId == c.Id).Sum(d => d.Quantidade)
                })
                .Where(x => x.TotalArrecadado > 0)
                .OrderByDescending(x => x.TotalArrecadado)
                .ToListAsync();

            var integral = await _context.Itens.CountAsync(i => i.Quantidade > 0 && !i.Doacoes.Any());
            var parcial = await _context.Itens.CountAsync(i => i.Quantidade > 0 && i.Doacoes.Any());
            var esgotado = await _context.Itens.CountAsync(i => i.Quantidade == 0);

            var topDoadores = await _context.Doadores
                .Select(d => new TopDoadorModel
                {
                    DoadorNome = d.Nome,
                    TotalItensDoados = _context.Itens.Where(i => i.DoadorId == d.Id).Sum(i => i.Quantidade) +
                                       _context.Doacoes.Where(doacao => doacao.Item.DoadorId == d.Id).Sum(doacao => doacao.Quantidade)
                })
                .Where(x => x.TotalItensDoados > 0)
                .OrderByDescending(x => x.TotalItensDoados)
                .Take(5)
                .ToListAsync();

            return new DashboardResumoModel
            {
                Kpis = new DashboardKpiModel
                {
                    TotalItensEstoque = totalEstoque,
                    TotalItensDoados = totalDoado,
                    CampanhasAtivas = campanhasAtivas,
                    DoadoresCadastrados = doadoresCadastrados
                },
                ArrecadacaoPorCampanha = arrecadacaoCampanha,
                StatusEstoque = new EstoqueStatusModel
                {
                    IntegralmenteDisponivel = integral,
                    ParcialmenteDoado = parcial,
                    TotalmenteEsgotado = esgotado
                },
                TopDoadores = topDoadores
            };
        }
    }
}