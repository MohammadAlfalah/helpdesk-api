namespace HelpDesk.Api.Models;

/// <summary>A support ticket raised by a customer and handled by an agent.</summary>
public class Ticket
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    /// <summary>Free-form category, e.g. "Hardware", "Network", "Account".</summary>
    public string Category { get; set; } = string.Empty;

    public TicketStatus Status { get; set; } = TicketStatus.Open;
    public TicketPriority Priority { get; set; } = TicketPriority.Medium;

    // Who raised it (a customer).
    public int CreatedById { get; set; }
    public User? CreatedBy { get; set; }

    // The agent currently handling it (null until assigned).
    public int? AssignedAgentId { get; set; }
    public User? AssignedAgent { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }

    // ---- SLA tracking ----
    /// <summary>When this ticket must be resolved by, derived from its priority at creation.</summary>
    public DateTime SlaDueAt { get; set; }

    /// <summary>Set by the background job when the SLA is breached while still open.</summary>
    public bool IsEscalated { get; set; }
    public DateTime? EscalatedAt { get; set; }

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
