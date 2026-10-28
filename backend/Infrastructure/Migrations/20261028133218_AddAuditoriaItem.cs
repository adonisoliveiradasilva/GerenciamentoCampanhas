using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditoriaItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "CampanhaId",
                table: "Itens",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataUltimaAtualizacao",
                table: "Itens",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UsuarioAtualizadorId",
                table: "Itens",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UsuarioCriadorId",
                table: "Itens",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Itens_UsuarioAtualizadorId",
                table: "Itens",
                column: "UsuarioAtualizadorId");

            migrationBuilder.CreateIndex(
                name: "IX_Itens_UsuarioCriadorId",
                table: "Itens",
                column: "UsuarioCriadorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Itens_Usuarios_UsuarioAtualizadorId",
                table: "Itens",
                column: "UsuarioAtualizadorId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Itens_Usuarios_UsuarioCriadorId",
                table: "Itens",
                column: "UsuarioCriadorId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Itens_Usuarios_UsuarioAtualizadorId",
                table: "Itens");

            migrationBuilder.DropForeignKey(
                name: "FK_Itens_Usuarios_UsuarioCriadorId",
                table: "Itens");

            migrationBuilder.DropIndex(
                name: "IX_Itens_UsuarioAtualizadorId",
                table: "Itens");

            migrationBuilder.DropIndex(
                name: "IX_Itens_UsuarioCriadorId",
                table: "Itens");

            migrationBuilder.DropColumn(
                name: "DataUltimaAtualizacao",
                table: "Itens");

            migrationBuilder.DropColumn(
                name: "UsuarioAtualizadorId",
                table: "Itens");

            migrationBuilder.DropColumn(
                name: "UsuarioCriadorId",
                table: "Itens");

            migrationBuilder.AlterColumn<Guid>(
                name: "CampanhaId",
                table: "Itens",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");
        }
    }
}
