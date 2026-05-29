using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NeuroMentor.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAttemptReview : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TeacherExplanation",
                table: "ExerciseAttempts",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReviewStatus",
                table: "ExerciseAttempts",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "TeacherExplanation", table: "ExerciseAttempts");
            migrationBuilder.DropColumn(name: "ReviewStatus", table: "ExerciseAttempts");
        }
    }
}
