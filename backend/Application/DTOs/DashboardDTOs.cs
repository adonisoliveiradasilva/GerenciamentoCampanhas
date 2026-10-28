using System.Collections.Generic;

namespace GerenciamentoCampanhas.Application.DTOs
{
    public class DashboardResponseDTO
    {
        public DashboardKpiDTO Kpis { get; set; } = new();
        public List<GraficoCampanhaDTO> ArrecadacaoPorCampanha { get; set; } = new();
        public EstoqueStatusDTO StatusEstoque { get; set; } = new();
        public List<TopDoadorDTO> TopDoadores { get; set; } = new();
    }

    public class DashboardKpiDTO
    {
        public int TotalItensEstoque { get; set; }
        public int TotalItensDoados { get; set; }
        public int CampanhasAtivas { get; set; }
        public int DoadoresCadastrados { get; set; }
    }

    public class GraficoCampanhaDTO
    {
        public string CampanhaNome { get; set; } = string.Empty;
        public int TotalArrecadado { get; set; }
    }

    public class EstoqueStatusDTO
    {
        public int IntegralmenteDisponivel { get; set; }
        public int ParcialmenteDoado { get; set; }
        public int TotalmenteEsgotado { get; set; }
    }

    public class TopDoadorDTO
    {
        public string DoadorNome { get; set; } = string.Empty;
        public int TotalItensDoados { get; set; }
    }
}