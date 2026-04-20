using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeuroMentor.Api.Data;

namespace NeuroMentor.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize]
public class AdminController(AppDbContext db) : ControllerBase
{
    private bool IsAdmin => User.FindFirstValue("isAdmin") == "True";

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] string? search = null)
    {
        if (!IsAdmin) return Forbid();

        var query = db.Users.AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(u => u.Name.ToLower().Contains(search.ToLower()) ||
                                     u.Email.ToLower().Contains(search.ToLower()));

        var users = await query
            .OrderBy(u => u.Name)
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                Role = u.Role.ToString().ToLower(),
                u.PhotoUrl,
                u.IsAiEnabled,
                u.IsAdmin,
                u.CreatedAt,
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpPut("users/{id:guid}/ai-access")]
    public async Task<IActionResult> SetAiAccess(Guid id, [FromBody] SetAiAccessRequest req)
    {
        if (!IsAdmin) return Forbid();

        var user = await db.Users.FindAsync(id);
        if (user is null) return NotFound();

        user.IsAiEnabled = req.Enabled;
        await db.SaveChangesAsync();

        return Ok(new { id = user.Id, isAiEnabled = user.IsAiEnabled });
    }

    [HttpPut("users/{id:guid}/admin")]
    public async Task<IActionResult> SetAdmin(Guid id, [FromBody] SetAdminRequest req)
    {
        if (!IsAdmin) return Forbid();

        var user = await db.Users.FindAsync(id);
        if (user is null) return NotFound();

        user.IsAdmin = req.Enabled;
        await db.SaveChangesAsync();

        return Ok(new { id = user.Id, isAdmin = user.IsAdmin });
    }
}

public record SetAiAccessRequest(bool Enabled);
public record SetAdminRequest(bool Enabled);
