using System.Text.Json;
using HelpDesk.Api.Dtos;
using HelpDesk.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HelpDesk.Api.Controllers;

[Authorize]
[Route("api/[controller]")]
public class TicketsController : ApiControllerBase
{
    private readonly ITicketService _service;
    public TicketsController(ITicketService service) => _service = service;

    /// <summary>
    /// List tickets with filtering, search, sorting and pagination.
    /// Customers see only their own tickets; agents see all.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedResult<TicketReadDto>>> List([FromQuery] TicketQueryParameters query)
    {
        var result = await _service.ListAsync(query, Caller);

        // Expose pagination metadata in a header as well as the body.
        Response.Headers["X-Pagination"] = JsonSerializer.Serialize(new
        {
            result.Page, result.PageSize, result.TotalCount, result.TotalPages,
            result.HasNextPage, result.HasPreviousPage
        });

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TicketReadDto>> GetById(int id)
    {
        var result = await _service.GetAsync(id, Caller);
        return result.IsOk ? Ok(result.Value) : Problemify(result);
    }

    /// <summary>Raise a new ticket.</summary>
    [HttpPost]
    public async Task<ActionResult<TicketReadDto>> Create(TicketCreateDto dto)
    {
        var created = await _service.CreateAsync(dto, Caller);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Update a ticket's status, priority or category (agents only).</summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Agent")]
    public async Task<ActionResult<TicketReadDto>> Update(int id, TicketUpdateDto dto)
    {
        var result = await _service.UpdateAsync(id, dto, Caller);
        return result.IsOk ? Ok(result.Value) : Problemify(result);
    }

    /// <summary>Assign (or unassign, with a null agentId) a ticket to an agent.</summary>
    [HttpPost("{id:int}/assign")]
    [Authorize(Roles = "Agent")]
    public async Task<ActionResult<TicketReadDto>> Assign(int id, AssignTicketDto dto)
    {
        var result = await _service.AssignAsync(id, dto.AgentId, Caller);
        return result.IsOk ? Ok(result.Value) : Problemify(result);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Agent")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id, Caller);
        return result.IsOk ? NoContent() : Problemify(result);
    }

    // ---- Comments (nested under a ticket) ----

    [HttpGet("{id:int}/comments")]
    public async Task<ActionResult<IReadOnlyList<CommentReadDto>>> GetComments(int id)
    {
        var result = await _service.GetCommentsAsync(id, Caller);
        return result.IsOk ? Ok(result.Value) : Problemify(result);
    }

    [HttpPost("{id:int}/comments")]
    public async Task<ActionResult<CommentReadDto>> AddComment(int id, CommentCreateDto dto)
    {
        var result = await _service.AddCommentAsync(id, dto, Caller);
        return result.IsOk
            ? CreatedAtAction(nameof(GetComments), new { id }, result.Value)
            : Problemify(result);
    }
}
