using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InserirUsuarioAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                INSERT INTO ""Usuarios"" (""Id"", ""Nome"", ""Email"", ""SenhaHash"", ""Perfil"", ""DataCriacao"", ""Ativo"")
                VALUES (
                    'a0000000-0000-0000-0000-000000000001', 
                    'Caíque', 
                    'caiquegalinari@gmail.com', 
                    '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
                    'Administrador', 
                    NOW(), 
                    TRUE
                )
                ON CONFLICT (""Email"") DO NOTHING;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
