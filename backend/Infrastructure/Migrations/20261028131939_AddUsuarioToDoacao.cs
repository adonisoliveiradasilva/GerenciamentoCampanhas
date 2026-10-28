using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUsuarioToDoacao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UsuarioId",
                table: "Doacoes",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Doacoes_UsuarioId",
                table: "Doacoes",
                column: "UsuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Doacoes_Usuarios_UsuarioId",
                table: "Doacoes",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Doacoes_Usuarios_UsuarioId",
                table: "Doacoes");

            migrationBuilder.DropIndex(
                name: "IX_Doacoes_UsuarioId",
                table: "Doacoes");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Doacoes");
        }
    }
}
