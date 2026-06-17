using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HelpDesk.Api.Models;
using Microsoft.IdentityModel.Tokens;

namespace HelpDesk.Api.Auth;

/// <summary>
/// Issues signed JWTs carrying the user's id, email, name and role. The role
/// claim drives [Authorize(Roles = "...")] checks across the API.
/// </summary>
public class JwtTokenService
{
    private readonly IConfiguration _config;

    public JwtTokenService(IConfiguration config) => _config = config;

    public string GenerateToken(User user)
    {
        var key = _config["Jwt:Key"]
            ?? throw new InvalidOperationException("Jwt:Key is not configured.");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var creds = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
