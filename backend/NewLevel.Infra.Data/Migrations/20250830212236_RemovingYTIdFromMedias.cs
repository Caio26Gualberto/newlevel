using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NewLevel.Infra.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemovingYTIdFromMedias : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "YoutubeId",
                table: "Medias",
                newName: "KeyS3");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "KeyS3",
                table: "Medias",
                newName: "YoutubeId");
        }
    }
}
