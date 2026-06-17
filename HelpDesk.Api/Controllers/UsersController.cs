using HelpDesk.Api.Data;
using HelpDesk.Api.Dtos;
using HelpDesk.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Controllers;

[Authorize]
[Route("api/[controller]")]
public class UsersController : ApiControllerBase
{
    private readonly AppDbContext _db;
    public UsersController(AppDbContext db) => _db = db;

    /// <summary>The current authenticated user.</summary>
    [HttpGet("me")]
    public ActionResult<UserSummaryDto> Me()
        => Ok(new UserSummaryDto(Caller.Id, Caller.FullName, Caller.Email, Caller.Role));

    /// <summary>List support agents (for ticket assignment). Agents only.</summary>
    [HttpGet("agents")]
    [Authorize(Roles = "Agent")]
    public async Task<ActionResult<IReadOnlyList<UserSummaryDto>>> Agents()
    {
        var agents = await _db.Users
            .AsNoTracking()
            .Where(u => u.Role == UserRole.Agent)
            .OrderBy(u => u.FullName)
            .Select(u => new UserSummaryDto(u.Id, u.FullName, u.Email, u.Role))
            .ToListAsync();
        return Ok(agents);
    }
}
