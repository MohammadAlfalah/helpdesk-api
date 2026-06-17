using HelpDesk.Api.Data;
using HelpDesk.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Services;

/// <summary>
/// The escalation pass itself, isolated from the timer loop so it can be unit-tested
/// directly: find open tickets whose SLA has lapsed, flag them as escalated and bump
/// their priority one level.
/// </summary>
public class SlaEscalationRunner
{
    private readonly AppDbContext _db;
    private readonly ILogger<SlaEscalationRunner> _logger;

    public SlaEscalationRunner(AppDbContext db, ILogger<SlaEscalationRunner> logger)
    {
        _db = db;
        _logger = logger;
    }

    /// <summary>Escalates every newly-breached ticket and returns how many were escalated.</summary>
    public async Task<int> RunOnceAsync(DateTime nowUtc, CancellationToken ct = default)
    {
        var breached = await _db.Tickets
            .Where(t => !t.IsEscalated
                && t.SlaDueAt < nowUtc
                && t.Status != TicketStatus.Resolved
                && t.Status != TicketStatus.Closed)
            .ToListAsync(ct);

        foreach (var ticket in breached)
        {
            ticket.IsEscalated = true;
            ticket.EscalatedAt = nowUtc;
            ticket.Priority = BumpPriority(ticket.Priority);
            ticket.UpdatedAt = nowUtc;

            _logger.LogWarning(
                "SLA breached: ticket {TicketId} was due {Due:u}, escalated to {Priority}.",
                ticket.Id, ticket.SlaDueAt, ticket.Priority);
        }

        if (breached.Count > 0)
            await _db.SaveChangesAsync(ct);

        return breached.Count;
    }

    private static TicketPriority BumpPriority(TicketPriority current) => current switch
    {
        TicketPriority.Low => TicketPriority.Medium,
        TicketPriority.Medium => TicketPriority.High,
        _ => TicketPriority.Urgent
    };
}
