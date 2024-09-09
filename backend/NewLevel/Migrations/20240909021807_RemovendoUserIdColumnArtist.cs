using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NewLevel.Migrations
{
    /// <inheritdoc />
    public partial class RemovendoUserIdColumnArtist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Artists_Users_UserId",
                table: "Artists");

            migrationBuilder.DropIndex(
                name: "IX_Artists_UserId",
                table: "Artists");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Artists");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Artists",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Artists_UserId",
                table: "Artists",
                column: "UserId",
                unique: true,
                filter: "[UserId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Artists_Users_UserId",
                table: "Artists",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
