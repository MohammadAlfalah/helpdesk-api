using System.ComponentModel.DataAnnotations;
using HelpDesk.Api.Models;

namespace HelpDesk.Api.Dtos;

public record CommentCreateDto
{
    [Required, MaxLength(4000)]
    public string Body { get; init; } = string.Empty;

    /// <summary>Agent-only internal note. Ignored (forced false) for customers.</summary>
    public bool IsInternal { get; init; }
}

public record CommentReadDto
{
    public int Id { get; init; }
    public int TicketId { get; init; }
    public UserSummaryDto? Author { get; init; }
    public string Body { get; init; } = string.Empty;
    public bool IsInternal { get; init; }
    public DateTime CreatedAt { get; init; }

    public static CommentReadDto From(Comment c) => new()
    {
        Id = c.Id,
        TicketId = c.TicketId,
        Author = UserSummaryDto.From(c.Author),
        Body = c.Body,
        IsInternal = c.IsInternal,
        CreatedAt = c.CreatedAt
    };
}
