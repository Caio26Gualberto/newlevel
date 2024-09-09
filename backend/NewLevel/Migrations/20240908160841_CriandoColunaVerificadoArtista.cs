using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NewLevel.Migrations
{
    /// <inheritdoc />
    public partial class CriandoColunaVerificadoArtista : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsVerified",
                table: "Artists",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsVerified",
                table: "Artists");
        }
    }
}
