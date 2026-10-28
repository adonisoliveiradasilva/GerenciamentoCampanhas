using System.Collections.Generic;

namespace GerenciamentoCampanhas.Domain.Models
{
    public class DashboardResumoModel
    {
        public DashboardKpiModel Kpis { get; set; } = new();
        public List<GraficoCampanhaModel> ArrecadacaoPorCampanha { get; set; } = new();
        public EstoqueStatusModel StatusEstoque { get; set; } = new();
        public List<TopDoadorModel> TopDoadores { get; set; } = new();
    }

    public class DashboardKpiModel
    {
        public int TotalItensEstoque { get; set; }
        public int TotalItensDoados { get; set; }
        public int CampanhasAtivas { get; set; }
        public int DoadoresCadastrados { get; set; }
    }

    public class GraficoCampanhaModel
    {
        public string CampanhaNome { get; set; } = string.Empty;
        public int TotalArrecadado { get; set; }
    }

    public class EstoqueStatusModel
    {
        public int IntegralmenteDisponivel { get; set; }
        public int ParcialmenteDoado { get; set; }
        public int TotalmenteEsgotado { get; set; }
    }

    public class TopDoadorModel
    {
        public string DoadorNome { get; set; } = string.Empty;
        public int TotalItensDoados { get; set; }
    }
}