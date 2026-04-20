using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NeuroMentor.Api.DTOs.Exercises;
using System.Security.Claims;
using NeuroMentor.Api.Services;

namespace NeuroMentor.Api.Controllers;

[ApiController]
[Route("api/chat")]
[Authorize]
public class ChatController(ClaudeService claude) : ControllerBase
{
    private static readonly string MentorSystem = NeuroPersona.Mentor;
    private bool HasAiAccess => User.FindFirstValue("isAiEnabled") == "True";

    [HttpPost("stream")]
    public async Task Stream([FromBody] ChatRequest req, CancellationToken ct)
    {
        if (!HasAiAccess) { Response.StatusCode = 403; return; }
        Response.ContentType = "text/event-stream";
        Response.Headers["Cache-Control"] = "no-cache";
        Response.Headers["X-Accel-Buffering"] = "no";

        var system = req.Context is not null
            ? $"{MentorSystem}\n\nMATERIAL DO ALUNO:\n\"\"\"\n{req.Context[..Math.Min(15000, req.Context.Length)]}\n\"\"\""
            : MentorSystem;

        var messages = req.Messages
            .Select(m => (object)new { role = m.Role, content = m.Content })
            .ToList();

        await foreach (var chunk in claude.StreamAsync(system, messages, ct: ct))
        {
            if (ct.IsCancellationRequested) break;
            var data = $"0:{JsonSerializer.Serialize(chunk)}\n";
            await Response.Body.WriteAsync(Encoding.UTF8.GetBytes(data), ct);
            await Response.Body.FlushAsync(ct);
        }
    }

    [HttpPost("exercises")]
    public async Task<IActionResult> GenerateExercises([FromBody] ChatRequest req)
    {
        if (!HasAiAccess) return Forbid();
        var system = req.Context is not null
            ? $"{MentorSystem}\n\nMATERIAL:\n{req.Context[..Math.Min(15000, req.Context.Length)]}"
            : MentorSystem;

        var lastMsg = req.Messages.LastOrDefault();
        var userPrompt = lastMsg?.Content?.ToString() ?? "Gere 3 exercícios variados sobre o material.";

        var prompt = $$"""
            {{userPrompt}}
            Retorne APENAS o JSON:
            {
              "exercises": [
                {
                  "id": "ex-1",
                  "question": "pergunta",
                  "type": "multiple_choice",
                  "options": ["A", "B", "C", "D"]
                }
              ]
            }
            """;

        var raw = await claude.CompleteAsync(system, prompt, 1500);
        var start = raw.IndexOf('{'); var end = raw.LastIndexOf('}');
        if (start == -1 || end == -1) return StatusCode(500, new { error = "Falha ao gerar exercícios." });

        return Ok(JsonDocument.Parse(raw[start..(end + 1)]).RootElement);
    }
}
