using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NeuroMentor.Api.Data.Migrations;

public partial class AddModuleTextChunk : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "TextChunk",
            table: "LessonModules",
            type: "text",
            nullable: false,
            defaultValue: "");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(name: "TextChunk", table: "LessonModules");
    }
}
