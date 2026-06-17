using HelpDesk.Api.Models;
using HelpDesk.Api.Services;
using Xunit;

namespace HelpDesk.Tests.Unit;

public class SlaOptionsTests
{
    [Theory]
    [InlineData(TicketPriority.Urgent, 1)]
    [InlineData(TicketPriority.High, 4)]
    [InlineData(TicketPriority.Medium, 24)]
    [InlineData(TicketPriority.Low, 72)]
    public void DueFrom_AddsThePriorityTarget(TicketPriority priority, int expectedHours)
    {
        var options = new SlaOptions();
        var created = new DateTime(2026, 1, 1, 12, 0, 0, DateTimeKind.Utc);

        var due = options.DueFrom(created, priority);

        Assert.Equal(created.AddHours(expectedHours), due);
    }

    [Fact]
    public void ResolutionTarget_RespectsConfiguredOverrides()
    {
        var options = new SlaOptions { HighHours = 2 };
        Assert.Equal(TimeSpan.FromHours(2), options.ResolutionTarget(TicketPriority.High));
    }
}
