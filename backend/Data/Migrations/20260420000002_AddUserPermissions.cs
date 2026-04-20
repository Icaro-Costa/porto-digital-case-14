using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NeuroMentor.Api.Data.Migrations;

public partial class AddUserPermissions : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<bool>(
            name: "IsAiEnabled",
            table: "Users",
            type: "boolean",
            nullable: false,
            defaultValue: false);

        migrationBuilder.AddColumn<bool>(
            name: "IsAdmin",
            table: "Users",
            type: "boolean",
            nullable: false,
            defaultValue: false);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(name: "IsAiEnabled", table: "Users");
        migrationBuilder.DropColumn(name: "IsAdmin", table: "Users");
    }
}
