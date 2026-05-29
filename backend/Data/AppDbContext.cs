using Microsoft.EntityFrameworkCore;
using NeuroMentor.Api.Models;

namespace NeuroMentor.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<LessonModule> LessonModules => Set<LessonModule>();
    public DbSet<ClassRoom> Classes => Set<ClassRoom>();
    public DbSet<ClassLesson> ClassLessons => Set<ClassLesson>();
    public DbSet<ClassStudent> ClassStudents => Set<ClassStudent>();
    public DbSet<ExerciseAttempt> ExerciseAttempts => Set<ExerciseAttempt>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>().HasIndex(u => u.Email).IsUnique();
        b.Entity<ClassRoom>().HasIndex(c => c.Code).IsUnique();

        b.Entity<ClassLesson>().HasKey(cl => new { cl.ClassRoomId, cl.LessonId });
        b.Entity<ClassStudent>().HasKey(cs => new { cs.ClassRoomId, cs.UserId });

        b.Entity<LessonModule>()
            .Property(m => m.Concepts)
            .HasColumnType("jsonb");

        b.Entity<Lesson>()
            .HasOne(l => l.Teacher)
            .WithMany(u => u.Lessons)
            .HasForeignKey(l => l.TeacherId)
            .OnDelete(DeleteBehavior.Cascade);

        b.Entity<ClassRoom>()
            .HasOne(c => c.Teacher)
            .WithMany(u => u.OwnedClasses)
            .HasForeignKey(c => c.TeacherId)
            .OnDelete(DeleteBehavior.Cascade);

        b.Entity<ClassStudent>()
            .HasOne(cs => cs.User)
            .WithMany(u => u.ClassEnrollments)
            .HasForeignKey(cs => cs.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        b.Entity<ExerciseAttempt>()
            .HasOne(a => a.User)
            .WithMany(u => u.Attempts)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
