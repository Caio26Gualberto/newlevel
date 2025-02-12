using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NewLevel.Migrations
{
    /// <inheritdoc />
    public partial class BannerPositionColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BannerPosition",
                table: "Users",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BannerPosition",
                table: "Users");
        }
    }
}
