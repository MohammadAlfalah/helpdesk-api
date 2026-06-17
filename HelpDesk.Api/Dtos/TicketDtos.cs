using System.ComponentModel.DataAnnotations;
using HelpDesk.Api.Models;

namespace HelpDesk.Api.Dtos;

/// <summary>Lightweight user summary embedded in ticket/comment responses.</summary>
public record UserSummaryDto(int Id, string FullName, string Email, UserRole Role)
{
    public static UserSummaryDto? From(User? u)
        => u is null ? null : new UserSummaryDto(u.Id, u.FullName, u.Email, u.Role);
}

/// <summary>Customer payload to raise a ticket.</summary>
public record TicketCreateDto
{
    [Required, MaxLength(200)]
    public string Title { get; init; } = string.Empty;

    [Required, MaxLength(4000)]
    public string Description { get; init; } = string.Empty;

    [MaxLength(60)]
    public string Category { get; init; } = "General";

    [EnumDataType(typeof(TicketPriority))]
    public TicketPriority Priority { get; init; } = TicketPriority.Medium;
}

/// <summary>
/// Agent payload to update a ticket. All fields optional — only the ones provided
/// are applied (a partial update / PATCH-style body).
/// </summary>
public record TicketUpdateDto
{
    [EnumDataType(typeof(TicketStatus))]
    public TicketStatus? Status { get; init; }

    [EnumDataType(typeof(TicketPriority))]
    public TicketPriority? Priority { get; init; }

    [MaxLength(60)]
    public string? Category { get; init; }
}

/// <summary>Body for assigning a ticket to an agent.</summary>
public record AssignTicketDto
{
    /// <summary>Agent to assign. Null unassigns the ticket.</summary>
    public int? AgentId { get; init; }
}

public record TicketReadDto
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Category { get; init; } = string.Empty;
    public TicketStatus Status { get; init; }
    public TicketPriority Priority { get; init; }
    public UserSummaryDto? CreatedBy { get; init; }
    public UserSummaryDto? AssignedAgent { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
    public DateTime? ResolvedAt { get; init; }
    public DateTime SlaDueAt { get; init; }
    public bool IsEscalated { get; init; }
    public DateTime? EscalatedAt { get; init; }

    /// <summary>True once the SLA due time has passed and the ticket is not yet resolved/closed.</summary>
    public bool IsSlaBreached { get; init; }

    public static TicketReadDto From(Ticket t, DateTime utcNow) => new()
    {
        Id = t.Id,
        Title = t.Title,
        Description = t.Description,
        Category = t.Category,
        Status = t.Status,
        Priority = t.Priority,
        CreatedBy = UserSummaryDto.From(t.CreatedBy),
        AssignedAgent = UserSummaryDto.From(t.AssignedAgent),
        CreatedAt = t.CreatedAt,
        UpdatedAt = t.UpdatedAt,
        ResolvedAt = t.ResolvedAt,
        SlaDueAt = t.SlaDueAt,
        IsEscalated = t.IsEscalated,
        EscalatedAt = t.EscalatedAt,
        IsSlaBreached = t.SlaDueAt < utcNow
            && t.Status != TicketStatus.Resolved
            && t.Status != TicketStatus.Closed
    };
}
