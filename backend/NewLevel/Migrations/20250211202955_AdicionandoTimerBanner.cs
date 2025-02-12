using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NewLevel.Migrations
{
    /// <inheritdoc />
    public partial class AdicionandoTimerBanner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PublicTimer",
                table: "Users",
                newName: "PublicTimerBanner");

            migrationBuilder.AddColumn<DateTime>(
                name: "PublicTimerAvatar",
                table: "Users",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PublicTimerAvatar",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "PublicTimerBanner",
                table: "Users",
                newName: "PublicTimer");
        }
    }
}
