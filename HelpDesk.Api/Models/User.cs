namespace HelpDesk.Api.Models;

/// <summary>An authenticated user — either a customer or a support agent.</summary>
public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;

    /// <summary>BCrypt hash — the plain-text password is never stored.</summary>
    public string PasswordHash { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.Customer;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Tickets this user raised (as a customer).
    public ICollection<Ticket> CreatedTickets { get; set; } = new List<Ticket>();

    // Tickets assigned to this user (as an agent).
    public ICollection<Ticket> AssignedTickets { get; set; } = new List<Ticket>();
}
