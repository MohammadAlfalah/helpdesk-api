using HelpDesk.Api.Models;

namespace HelpDesk.Api.Services;

/// <summary>
/// SLA resolution targets per priority, in hours. Bound from the "Sla" config
/// section so they can be tuned without code changes; the defaults below apply
/// when nothing is configured.
/// </summary>
public class SlaOptions
{
    public int UrgentHours { get; set; } = 1;
    public int HighHours { get; set; } = 4;
    public int MediumHours { get; set; } = 24;
    public int LowHours { get; set; } = 72;

    /// <summary>How often the background escalation job scans for SLA breaches.</summary>
    public int CheckIntervalSeconds { get; set; } = 60;

    /// <summary>How long, from creation, a ticket of this priority has to be resolved.</summary>
    public TimeSpan ResolutionTarget(TicketPriority priority) => TimeSpan.FromHours(priority switch
    {
        TicketPriority.Urgent => UrgentHours,
        TicketPriority.High => HighHours,
        TicketPriority.Medium => MediumHours,
        _ => LowHours
    });

    /// <summary>The absolute SLA due time for a ticket created at <paramref name="createdAtUtc"/>.</summary>
    public DateTime DueFrom(DateTime createdAtUtc, TicketPriority priority)
        => createdAtUtc + ResolutionTarget(priority);
}
