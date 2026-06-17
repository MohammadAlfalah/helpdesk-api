using System.ComponentModel.DataAnnotations;
using HelpDesk.Api.Models;

namespace HelpDesk.Api.Dtos;

public record RegisterDto
{
    [Required, EmailAddress, MaxLength(256)]
    public string Email { get; init; } = string.Empty;

    [Required, MaxLength(120)]
    public string FullName { get; init; } = string.Empty;

    [Required, MinLength(8), MaxLength(128)]
    public string Password { get; init; } = string.Empty;
}

public record LoginDto
{
    [Required, EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    public string Password { get; init; } = string.Empty;
}

public record AuthResponse(string Token, string Email, string FullName, UserRole Role);
