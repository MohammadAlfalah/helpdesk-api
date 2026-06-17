namespace HelpDesk.Api.Models;

/// <summary>A message on a ticket, from either the customer or an agent.</summary>
public class Comment
{
    public int Id { get; set; }

    public int TicketId { get; set; }
    public Ticket? Ticket { get; set; }

    public int AuthorId { get; set; }
    public User? Author { get; set; }

    public string Body { get; set; } = string.Empty;

    /// <summary>Internal agent-only note. Customers never see comments where this is true.</summary>
    public bool IsInternal { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
