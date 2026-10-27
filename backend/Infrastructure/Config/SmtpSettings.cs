namespace GerenciamentoCampanhas.Infrastructure.Config
{
    public class SmtpSettings
    {
        public string Servidor { get; set; } = string.Empty;
        public int Porta { get; set; }
        public string RemetenteNome { get; set; } = string.Empty;
        public string RemetenteEmail { get; set; } = string.Empty;
        public string Usuario { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
    }
}