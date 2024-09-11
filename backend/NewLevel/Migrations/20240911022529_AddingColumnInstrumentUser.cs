using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NewLevel.Migrations
{
    /// <inheritdoc />
    public partial class AddingColumnInstrumentUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Instrument",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Instrument",
                table: "Users");
        }
    }
}
