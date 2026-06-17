using System.Security.Claims;
using HelpDesk.Api.Models;

namespace HelpDesk.Api.Auth;

/// <summary>The authenticated caller, projected from the JWT claims.</summary>
public record CurrentUser(int Id, UserRole Role, string Email, string FullName)
{
    public bool IsAgent => Role == UserRole.Agent;
}

public static class ClaimsPrincipalExtensions
{
    public static int GetUserId(this ClaimsPrincipal principal)
        => int.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("Token is missing the user id claim."));

    public static CurrentUser ToCurrentUser(this ClaimsPrincipal principal)
    {
        var role = Enum.TryParse<UserRole>(principal.FindFirstValue(ClaimTypes.Role), out var r)
            ? r
            : UserRole.Customer;

        return new CurrentUser(
            principal.GetUserId(),
            role,
            principal.FindFirstValue(ClaimTypes.Email) ?? string.Empty,
            principal.FindFirstValue(ClaimTypes.Name) ?? string.Empty);
    }
}
