using HelpDesk.Api.Auth;
using HelpDesk.Api.Data;
using HelpDesk.Api.Dtos;
using HelpDesk.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Controllers;

[Route("api/[controller]")]
public class AuthController : ApiControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtTokenService _tokens;

    public AuthController(AppDbContext db, JwtTokenService tokens)
    {
        _db = db;
        _tokens = tokens;
    }

    /// <summary>Register a new customer account.</summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();
        if (await _db.Users.AnyAsync(u => u.Email == email))
            return Problem(statusCode: StatusCodes.Status409Conflict,
                title: "Email already registered", detail: "An account with this email already exists.");

        var user = new User
        {
            Email = email,
            FullName = dto.FullName.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = UserRole.Customer
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok(new AuthResponse(_tokens.GenerateToken(user), user.Email, user.FullName, user.Role));
    }

    /// <summary>Exchange credentials for a JWT.</summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Problem(statusCode: StatusCodes.Status401Unauthorized,
                title: "Invalid credentials", detail: "Invalid email or password.");

        return Ok(new AuthResponse(_tokens.GenerateToken(user), user.Email, user.FullName, user.Role));
    }
}
