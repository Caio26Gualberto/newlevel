using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NewLevel.Infra.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemovingPublicTimerAndSrcFromAllTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvatarUrl",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "BannerUrl",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PublicTimerAvatar",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PublicTimerBanner",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PrivateURL",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "PublicTimer",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "PublicTimerBanner",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "bannerUrl",
                table: "Events");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AvatarUrl",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BannerUrl",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PublicTimerAvatar",
                table: "Users",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PublicTimerBanner",
                table: "Users",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrivateURL",
                table: "Photos",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PublicTimer",
                table: "Photos",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PublicTimerBanner",
                table: "Events",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "bannerUrl",
                table: "Events",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
