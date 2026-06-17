using HelpDesk.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Data;

/// <summary>
/// Seeds a default agent and a demo customer on first run so the API is usable
/// immediately (these credentials are documented in the README).
/// </summary>
public static class SeedData
{
    public static async Task EnsureSeededAsync(AppDbContext db)
    {
        if (await db.Users.AnyAsync()) return;

        db.Users.AddRange(
            new User
            {
                Email = "agent@helpdesk.local",
                FullName = "Support Agent",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Agent#12345"),
                Role = UserRole.Agent
            },
            new User
            {
                Email = "customer@helpdesk.local",
                FullName = "Demo Customer",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer#12345"),
                Role = UserRole.Customer
            });

        await db.SaveChangesAsync();
    }
}
