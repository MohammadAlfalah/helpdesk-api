using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using HelpDesk.Api.Dtos;
using HelpDesk.Api.Models;
using Xunit;

namespace HelpDesk.Tests.Integration;

public class TicketsApiTests : IClassFixture<HelpDeskApiFactory>
{
    private readonly HelpDeskApiFactory _factory;

    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter() }
    };

    public TicketsApiTests(HelpDeskApiFactory factory) => _factory = factory;

    // ---- helpers ----

    private async Task<HttpClient> NewCustomerClientAsync()
    {
        var client = _factory.CreateClient();
        var email = $"cust-{Guid.NewGuid():N}@test.local";
        var res = await client.PostAsJsonAsync("/api/auth/register",
            new { email, fullName = "Test Customer", password = "Passw0rd!" });
        res.EnsureSuccessStatusCode();
        await AttachTokenAsync(client, res);
        return client;
    }

    private async Task<HttpClient> SeededAgentClientAsync()
    {
        var client = _factory.CreateClient();
        var res = await client.PostAsJsonAsync("/api/auth/login",
            new { email = "agent@helpdesk.local", password = "Agent#12345" });
        res.EnsureSuccessStatusCode();
        await AttachTokenAsync(client, res);
        return client;
    }

    private static async Task AttachTokenAsync(HttpClient client, HttpResponseMessage res)
    {
        var auth = await res.Content.ReadFromJsonAsync<AuthResponse>(Json);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth!.Token);
    }

    private static async Task<TicketReadDto> CreateTicketAsync(HttpClient client, string title = "Cannot log in")
    {
        var res = await client.PostAsJsonAsync("/api/tickets",
            new { title, description = "Detailed problem description", category = "Account", priority = "High" });
        Assert.Equal(HttpStatusCode.Created, res.StatusCode);
        return (await res.Content.ReadFromJsonAsync<TicketReadDto>(Json))!;
    }

    // ---- tests ----

    [Fact]
    public async Task Unauthenticated_request_is_rejected()
    {
        var client = _factory.CreateClient();
        var res = await client.GetAsync("/api/tickets");
        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }

    [Fact]
    public async Task Customer_can_create_and_list_their_own_tickets()
    {
        var client = await NewCustomerClientAsync();
        await CreateTicketAsync(client, "Printer offline");

        var page = await client.GetFromJsonAsync<PagedResult<TicketReadDto>>("/api/tickets", Json);

        Assert.NotNull(page);
        Assert.Equal(1, page!.TotalCount); // a brand-new customer only sees their own ticket
        Assert.Equal("Printer offline", page.Items[0].Title);
        Assert.Equal(TicketStatus.Open, page.Items[0].Status);
    }

    [Fact]
    public async Task Customer_cannot_access_another_customers_ticket_over_http()
    {
        // Customer A raises a ticket.
        var customerA = await NewCustomerClientAsync();
        var ticket = await CreateTicketAsync(customerA, "Confidential: payroll bug");
        await customerA.PostAsJsonAsync($"/api/tickets/{ticket.Id}/comments", new { body = "sensitive detail" });

        // Customer B must not be able to see it via any read path (404, not 403 — existence is not leaked).
        var customerB = await NewCustomerClientAsync();

        var get = await customerB.GetAsync($"/api/tickets/{ticket.Id}");
        Assert.Equal(HttpStatusCode.NotFound, get.StatusCode);

        var comments = await customerB.GetAsync($"/api/tickets/{ticket.Id}/comments");
        Assert.Equal(HttpStatusCode.NotFound, comments.StatusCode);

        var comment = await customerB.PostAsJsonAsync($"/api/tickets/{ticket.Id}/comments", new { body = "snoop" });
        Assert.Equal(HttpStatusCode.NotFound, comment.StatusCode);

        // ...and it never appears in B's own list.
        var bList = await customerB.GetFromJsonAsync<PagedResult<TicketReadDto>>("/api/tickets", Json);
        Assert.DoesNotContain(bList!.Items, t => t.Id == ticket.Id);
    }

    [Fact]
    public async Task Register_with_a_short_password_returns_400()
    {
        var client = _factory.CreateClient();
        var res = await client.PostAsJsonAsync("/api/auth/register",
            new { email = "x@test.local", fullName = "X", password = "short" });
        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
    }

    [Fact]
    public async Task Customer_cannot_update_a_ticket_403()
    {
        var client = await NewCustomerClientAsync();
        var ticket = await CreateTicketAsync(client);

        var res = await client.PutAsJsonAsync($"/api/tickets/{ticket.Id}", new { status = "Closed" });

        Assert.Equal(HttpStatusCode.Forbidden, res.StatusCode);
    }

    [Fact]
    public async Task Agent_can_assign_resolve_and_internal_notes_stay_hidden_from_customer()
    {
        var customer = await NewCustomerClientAsync();
        var ticket = await CreateTicketAsync(customer, "Email not syncing");

        var agent = await SeededAgentClientAsync();

        // Agent sees the ticket in the full list.
        var all = await agent.GetFromJsonAsync<PagedResult<TicketReadDto>>("/api/tickets?search=syncing", Json);
        Assert.Contains(all!.Items, t => t.Id == ticket.Id);

        // Assign to the agent themselves -> moves to InProgress.
        var me = await agent.GetFromJsonAsync<UserSummaryDto>("/api/users/me", Json);
        var assignRes = await agent.PostAsJsonAsync($"/api/tickets/{ticket.Id}/assign", new { agentId = me!.Id });
        assignRes.EnsureSuccessStatusCode();
        var assigned = (await assignRes.Content.ReadFromJsonAsync<TicketReadDto>(Json))!;
        Assert.Equal(TicketStatus.InProgress, assigned.Status);

        // Agent posts a public reply and an internal note.
        await agent.PostAsJsonAsync($"/api/tickets/{ticket.Id}/comments", new { body = "Looking into it" });
        await agent.PostAsJsonAsync($"/api/tickets/{ticket.Id}/comments", new { body = "Check their MX records", isInternal = true });

        // Customer sees only the public comment.
        var customerComments = await customer.GetFromJsonAsync<List<CommentReadDto>>($"/api/tickets/{ticket.Id}/comments", Json);
        Assert.Single(customerComments!);
        Assert.False(customerComments![0].IsInternal);

        // Agent resolves the ticket.
        var resolveRes = await agent.PutAsJsonAsync($"/api/tickets/{ticket.Id}", new { status = "Resolved" });
        resolveRes.EnsureSuccessStatusCode();
        var resolved = (await resolveRes.Content.ReadFromJsonAsync<TicketReadDto>(Json))!;
        Assert.Equal(TicketStatus.Resolved, resolved.Status);
        Assert.NotNull(resolved.ResolvedAt);
    }
}
