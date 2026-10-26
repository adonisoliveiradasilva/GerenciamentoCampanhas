using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSenhasReais : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "SenhaHash",
                value: "$2a$10$cYLM.qoXpeAzcZhJ3oXRLu9Slkb61LHyWW5qJ4QKvHEMhaxZ5qCPi.");

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "SenhaHash",
                value: "$2a$10$cYLM.qoXpeAzcZhJ3oXRLu9Slkb61LHyWW5qJ4QKvHEMhaxZ5qCPi.");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "SenhaHash",
                value: "$2a$11$0N2/iW5BvM8XvX7.n6B3.e6N6f3hX/z3xW7b0n0X0/3X7z3xW7b0m");

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "SenhaHash",
                value: "$2a$11$0N2/iW5BvM8XvX7.n6B3.e6N6f3hX/z3xW7b0n0X0/3X7z3xW7b0m");
        }
    }
}
