using HelpDesk.Api.Auth;
using HelpDesk.Api.Dtos;
using HelpDesk.Api.Models;
using HelpDesk.Api.Services;
using Xunit;

namespace HelpDesk.Tests.Unit;

public class TicketServiceTests
{
    private static TicketService NewService(SqliteTestContext ctx) => new(ctx.Db, new SlaOptions());

    private static TicketCreateDto NewTicketDto(string title = "Printer broken", TicketPriority p = TicketPriority.Medium)
        => new() { Title = title, Description = "It won't print", Category = "Hardware", Priority = p };

    [Fact]
    public async Task Create_SetsOpenStatusAndSlaDueTime()
    {
        using var ctx = new SqliteTestContext();
        var svc = NewService(ctx);

        var dto = NewTicketDto(p: TicketPriority.High);
        var created = await svc.CreateAsync(dto, ctx.AsCustomer);

        Assert.Equal(TicketStatus.Open, created.Status);
        Assert.Equal(ctx.Customer.Id, created.CreatedBy!.Id);
        // High priority => 4h SLA target.
        Assert.Equal(created.CreatedAt.AddHours(4), created.SlaDueAt);
    }

    [Fact]
    public async Task Get_Customer_CannotSeeAnotherCustomersTicket()
    {
        using var ctx = new SqliteTestContext();
        var svc = NewService(ctx);
        var created = await svc.CreateAsync(NewTicketDto(), ctx.AsCustomer);

        var otherCustomer = new CurrentUser(9999, UserRole.Customer, "other@test.local", "Other");
        var result = await svc.GetAsync(created.Id, otherCustomer);

        Assert.Equal(ResultStatus.NotFound, result.Status); // existence not leaked
    }

    [Fact]
    public async Task List_Customer_SeesOnlyTheirOwnTickets()
    {
        using var ctx = new SqliteTestContext();
        var svc = NewService(ctx);
        await svc.CreateAsync(NewTicketDto("mine"), ctx.AsCustomer);
        // a ticket owned by the agent acting as creator
        await svc.CreateAsync(NewTicketDto("theirs"), ctx.AsAgent);

        var page = await svc.ListAsync(new TicketQueryParameters(), ctx.AsCustomer);

        Assert.Single(page.Items);
        Assert.Equal("mine", page.Items[0].Title);
    }

    [Fact]
    public async Task List_Agent_CanFilterByStatusAndPriority()
    {
        using var ctx = new SqliteTestContext();
        var svc = NewService(ctx);
        await svc.CreateAsync(NewTicketDto("low", TicketPriority.Low), ctx.AsCustomer);
        await svc.CreateAsync(NewTicketDto("urgent", TicketPriority.Urgent), ctx.AsCustomer);

        var page = await svc.ListAsync(
            new TicketQueryParameters { Priority = TicketPriority.Urgent }, ctx.AsAgent);

        Assert.Single(page.Items);
        Assert.Equal("urgent", page.Items[0].Title);
    }

    [Fact]
    public async Task List_SupportsSearchAndPagination()
    {
        using var ctx = new SqliteTestContext();
        var svc = NewService(ctx);
        for (var i = 0; i < 5; i++)
            await svc.CreateAsync(NewTicketDto($"VPN issue {i}"), ctx.AsCustomer);
        await svc.CreateAsync(NewTicketDto("Monitor flicker"), ctx.AsCustomer);

        var search = await svc.ListAsync(new TicketQueryParameters { Search = "vpn" }, ctx.AsAgent);
        Assert.Equal(5, search.TotalCount);

        var firstPage = await svc.ListAsync(
            new TicketQueryParameters { Search = "vpn", Page = 1, PageSize = 2 }, ctx.AsAgent);
        Assert.Equal(2, firstPage.Items.Count);
        Assert.Equal(3, firstPage.TotalPages);
        Assert.True(firstPage.HasNextPage);
    }

    [Fact]
    public async Task Update_ByCustomer_IsForbidden()
    {
        using var ctx = new SqliteTestContext();
        var svc = NewService(ctx);
        var created = await svc.CreateAsync(NewTicketDto(), ctx.AsCustomer);

        var result = await svc.UpdateAsync(created.Id,
            new TicketUpdateDto { Status = TicketStatus.Closed }, ctx.AsCustomer);

        Assert.Equal(ResultStatus.Forbidden, result.Status);
    }

    [Fact]
    public async Task Update_ToResolved_StampsResolvedAtAndClearsEscalation()
    {
        using var ctx = new SqliteTestContext();
        var svc = NewService(ctx);
        var created = await svc.CreateAsync(NewTicketDto(), ctx.AsCustomer);

        // Put the ticket into an escalated state first, so clearing it is observable.
        var entity = ctx.Db.Tickets.First(t => t.Id == created.Id);
        entity.IsEscalated = true;
        entity.EscalatedAt = DateTime.UtcNow;
        ctx.Db.SaveChanges();

        var result = await svc.UpdateAsync(created.Id,
            new TicketUpdateDto { Status = TicketStatus.Resolved }, ctx.AsAgent);

        Assert.True(result.IsOk);
        Assert.Equal(TicketStatus.Resolved, result.Value!.Status);
        Assert.NotNull(result.Value.ResolvedAt);
        Assert.False(result.Value.IsEscalated);   // cleared on resolve
        Assert.Null(result.Value.EscalatedAt);     // and the timestamp too
    }

    [Fact]
    public async Task Assign_ToANonAgent_IsRejected()
    {
        using var ctx = new SqliteTestContext();
        var svc = NewService(ctx);
        var created = await svc.CreateAsync(NewTicketDto(), ctx.AsCustomer);

        var result = await svc.AssignAsync(created.Id, ctx.Customer.Id, ctx.AsAgent);

        Assert.Equal(ResultStatus.BadRequest, result.Status);
    }

    [Fact]
    public async Task Assign_ToAgent_MovesOpenTicketIntoProgress()
    {
        using var ctx = new SqliteTestContext();
        var svc = NewService(ctx);
        var created = await svc.CreateAsync(NewTicketDto(), ctx.AsCustomer);

        var result = await svc.AssignAsync(created.Id, ctx.Agent.Id, ctx.AsAgent);

        Assert.True(result.IsOk);
        Assert.Equal(ctx.Agent.Id, result.Value!.AssignedAgent!.Id);
        Assert.Equal(TicketStatus.InProgress, result.Value.Status);
    }

    [Fact]
    public async Task Comments_CustomerNeverSeesInternalNotes()
    {
        using var ctx = new SqliteTestContext();
        var svc = NewService(ctx);
        var created = await svc.CreateAsync(NewTicketDto(), ctx.AsCustomer);

        await svc.AddCommentAsync(created.Id, new CommentCreateDto { Body = "public reply" }, ctx.AsAgent);
        await svc.AddCommentAsync(created.Id, new CommentCreateDto { Body = "internal note", IsInternal = true }, ctx.AsAgent);

        var asCustomer = await svc.GetCommentsAsync(created.Id, ctx.AsCustomer);
        var asAgent = await svc.GetCommentsAsync(created.Id, ctx.AsAgent);

        Assert.Single(asCustomer.Value!);           // only the public one
        Assert.Equal(2, asAgent.Value!.Count);       // agent sees both
    }

    [Fact]
    public async Task Comments_CustomerCannotMarkOwnCommentInternal()
    {
        using var ctx = new SqliteTestContext();
        var svc = NewService(ctx);
        var created = await svc.CreateAsync(NewTicketDto(), ctx.AsCustomer);

        var result = await svc.AddCommentAsync(created.Id,
            new CommentCreateDto { Body = "trying to hide", IsInternal = true }, ctx.AsCustomer);

        Assert.True(result.IsOk);
        Assert.False(result.Value!.IsInternal); // forced public
    }
}
