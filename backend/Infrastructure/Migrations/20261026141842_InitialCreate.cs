using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    SenhaHash = table.Column<string>(type: "text", nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "Id", "Ativo", "DataCriacao", "Email", "Nome", "SenhaHash" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), true, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "adonis.silva@aluno.ufop.edu.br", "Adonis Oliveira", "$2a$11$0N2/iW5BvM8XvX7.n6B3.e6N6f3hX/z3xW7b0n0X0/3X7z3xW7b0m" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), true, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "caique.leite@aluno.ufop.edu.br", "Caique Leite", "$2a$11$0N2/iW5BvM8XvX7.n6B3.e6N6f3hX/z3xW7b0n0X0/3X7z3xW7b0m" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
