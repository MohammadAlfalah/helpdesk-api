using HelpDesk.Api.Models;
using HelpDesk.Api.Services;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace HelpDesk.Tests.Unit;

public class SlaEscalationRunnerTests
{
    private static Ticket NewTicket(SqliteTestContext ctx, TicketPriority priority, DateTime slaDueAt, TicketStatus status = TicketStatus.Open)
        => new()
        {
            Title = "t", Description = "d", Category = "General",
            Priority = priority, Status = status,
            CreatedById = ctx.Customer.Id,
            CreatedAt = slaDueAt.AddHours(-1), UpdatedAt = slaDueAt.AddHours(-1),
            SlaDueAt = slaDueAt
        };

    [Fact]
    public async Task RunOnce_EscalatesBreachedOpenTicket_AndBumpsPriority()
    {
        using var ctx = new SqliteTestContext();
        var now = new DateTime(2026, 1, 1, 12, 0, 0, DateTimeKind.Utc);
        ctx.Db.Tickets.Add(NewTicket(ctx, TicketPriority.Medium, now.AddMinutes(-5))); // already overdue
        await ctx.Db.SaveChangesAsync();

        var runner = new SlaEscalationRunner(ctx.Db, NullLogger<SlaEscalationRunner>.Instance);
        var count = await runner.RunOnceAsync(now);

        Assert.Equal(1, count);
        var t = ctx.Db.Tickets.Single();
        Assert.True(t.IsEscalated);
        Assert.Equal(now, t.EscalatedAt);
        Assert.Equal(TicketPriority.High, t.Priority); // Medium -> High
    }

    [Fact]
    public async Task RunOnce_IgnoresNotYetDue_Resolved_AndAlreadyEscalated()
    {
        using var ctx = new SqliteTestContext();
        var now = new DateTime(2026, 1, 1, 12, 0, 0, DateTimeKind.Utc);

        ctx.Db.Tickets.Add(NewTicket(ctx, TicketPriority.High, now.AddHours(2)));                 // not due yet
        ctx.Db.Tickets.Add(NewTicket(ctx, TicketPriority.High, now.AddMinutes(-5), TicketStatus.Resolved)); // resolved
        var already = NewTicket(ctx, TicketPriority.High, now.AddMinutes(-5));
        already.IsEscalated = true;                                                                // already escalated
        ctx.Db.Tickets.Add(already);
        await ctx.Db.SaveChangesAsync();

        var runner = new SlaEscalationRunner(ctx.Db, NullLogger<SlaEscalationRunner>.Instance);
        var count = await runner.RunOnceAsync(now);

        Assert.Equal(0, count);
    }

    [Fact]
    public async Task RunOnce_CapsPriorityAtUrgent()
    {
        using var ctx = new SqliteTestContext();
        var now = new DateTime(2026, 1, 1, 12, 0, 0, DateTimeKind.Utc);
        ctx.Db.Tickets.Add(NewTicket(ctx, TicketPriority.Urgent, now.AddMinutes(-5)));
        await ctx.Db.SaveChangesAsync();

        var runner = new SlaEscalationRunner(ctx.Db, NullLogger<SlaEscalationRunner>.Instance);
        await runner.RunOnceAsync(now);

        Assert.Equal(TicketPriority.Urgent, ctx.Db.Tickets.Single().Priority);
    }
}
