using System.ComponentModel.DataAnnotations;
using HelpDesk.Api.Models;

namespace HelpDesk.Api.Dtos;

/// <summary>
/// Query-string parameters for listing tickets: filtering, free-text search,
/// sorting, and pagination. Bound from the query string via [FromQuery].
/// </summary>
public class TicketQueryParameters
{
    // [EnumDataType] makes an out-of-range numeric value (e.g. ?status=99) a 400
    // instead of binding to an undefined enum and silently returning an empty page.
    [EnumDataType(typeof(TicketStatus))]
    public TicketStatus? Status { get; set; }

    [EnumDataType(typeof(TicketPriority))]
    public TicketPriority? Priority { get; set; }

    public string? Category { get; set; }

    /// <summary>Filter to tickets assigned to this agent.</summary>
    public int? AssignedAgentId { get; set; }

    /// <summary>Filter to tickets created by this customer.</summary>
    public int? CreatedById { get; set; }

    /// <summary>Only tickets the SLA job has escalated.</summary>
    public bool? Escalated { get; set; }

    /// <summary>Case-insensitive match against title and description.</summary>
    public string? Search { get; set; }

    /// <summary>
    /// Sort field + optional direction, e.g. "createdAt", "priority desc", "slaDueAt asc".
    /// Allowed fields: createdAt, updatedAt, priority, status, slaDueAt. Defaults to newest first.
    /// </summary>
    public string? Sort { get; set; }

    private int _page = 1;
    public int Page
    {
        get => _page;
        set => _page = value < 1 ? 1 : value;
    }

    private int _pageSize = 20;
    public const int MaxPageSize = 100;
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value < 1 ? 1 : (value > MaxPageSize ? MaxPageSize : value);
    }
}
