using HelpDesk.Api.Auth;
using HelpDesk.Api.Data;
using HelpDesk.Api.Dtos;
using HelpDesk.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Services;

public interface ITicketService
{
    Task<PagedResult<TicketReadDto>> ListAsync(TicketQueryParameters q, CurrentUser caller);
    Task<ServiceResult<TicketReadDto>> GetAsync(int id, CurrentUser caller);
    Task<TicketReadDto> CreateAsync(TicketCreateDto dto, CurrentUser caller);
    Task<ServiceResult<TicketReadDto>> UpdateAsync(int id, TicketUpdateDto dto, CurrentUser caller);
    Task<ServiceResult<TicketReadDto>> AssignAsync(int id, int? agentId, CurrentUser caller);
    Task<ServiceResult<bool>> DeleteAsync(int id, CurrentUser caller);

    Task<ServiceResult<IReadOnlyList<CommentReadDto>>> GetCommentsAsync(int ticketId, CurrentUser caller);
    Task<ServiceResult<CommentReadDto>> AddCommentAsync(int ticketId, CommentCreateDto dto, CurrentUser caller);
}

public class TicketService : ITicketService
{
    private readonly AppDbContext _db;
    private readonly SlaOptions _sla;

    public TicketService(AppDbContext db, SlaOptions sla)
    {
        _db = db;
        _sla = sla;
    }

    public async Task<PagedResult<TicketReadDto>> ListAsync(TicketQueryParameters q, CurrentUser caller)
    {
        var query = _db.Tickets
            .Include(t => t.CreatedBy)
            .Include(t => t.AssignedAgent)
            .AsNoTracking()
            .AsQueryable();

        // Customers can only ever see their own tickets, regardless of filters passed.
        if (!caller.IsAgent)
            query = query.Where(t => t.CreatedById == caller.Id);
        else if (q.CreatedById is int createdBy)
            query = query.Where(t => t.CreatedById == createdBy);

        if (q.Status is TicketStatus status) query = query.Where(t => t.Status == status);
        if (q.Priority is TicketPriority priority) query = query.Where(t => t.Priority == priority);
        if (q.AssignedAgentId is int agentId) query = query.Where(t => t.AssignedAgentId == agentId);
        if (q.Escalated is bool esc) query = query.Where(t => t.IsEscalated == esc);
        if (!string.IsNullOrWhiteSpace(q.Category))
            query = query.Where(t => t.Category == q.Category);

        if (!string.IsNullOrWhiteSpace(q.Search))
        {
            var term = q.Search.Trim().ToLower();
            query = query.Where(t =>
                t.Title.ToLower().Contains(term) || t.Description.ToLower().Contains(term));
        }

        query = ApplySort(query, q.Sort);

        var total = await query.CountAsync();
        var now = DateTime.UtcNow;

        var items = await query
            .Skip((q.Page - 1) * q.PageSize)
            .Take(q.PageSize)
            .ToListAsync();

        return new PagedResult<TicketReadDto>(
            items.Select(t => TicketReadDto.From(t, now)).ToList(),
            q.Page, q.PageSize, total);
    }

    private static IQueryable<Ticket> ApplySort(IQueryable<Ticket> query, string? sort)
    {
        var (field, descending) = ParseSort(sort);
        return field switch
        {
            "priority" => descending ? query.OrderByDescending(t => t.Priority) : query.OrderBy(t => t.Priority),
            "status" => descending ? query.OrderByDescending(t => t.Status) : query.OrderBy(t => t.Status),
            "updatedat" => descending ? query.OrderByDescending(t => t.UpdatedAt) : query.OrderBy(t => t.UpdatedAt),
            "sladueat" => descending ? query.OrderByDescending(t => t.SlaDueAt) : query.OrderBy(t => t.SlaDueAt),
            // default: newest first
            _ => descending ? query.OrderByDescending(t => t.CreatedAt) : query.OrderBy(t => t.CreatedAt),
        };
    }

    private static (string field, bool descending) ParseSort(string? sort)
    {
        if (string.IsNullOrWhiteSpace(sort)) return ("createdat", true);
        var parts = sort.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var field = parts[0].ToLower();
        var descending = parts.Length > 1
            ? parts[1].Equals("desc", StringComparison.OrdinalIgnoreCase)
            : field == "createdat"; // createdAt defaults to descending
        return (field, descending);
    }

    public async Task<ServiceResult<TicketReadDto>> GetAsync(int id, CurrentUser caller)
    {
        var ticket = await LoadAsync(id);
        if (ticket is null) return ServiceResult<TicketReadDto>.NotFound();

        // A customer asking for someone else's ticket gets a 404 (don't leak existence).
        if (!caller.IsAgent && ticket.CreatedById != caller.Id)
            return ServiceResult<TicketReadDto>.NotFound();

        return ServiceResult<TicketReadDto>.Ok(TicketReadDto.From(ticket, DateTime.UtcNow));
    }

    public async Task<TicketReadDto> CreateAsync(TicketCreateDto dto, CurrentUser caller)
    {
        var now = DateTime.UtcNow;
        var ticket = new Ticket
        {
            Title = dto.Title.Trim(),
            Description = dto.Description,
            Category = string.IsNullOrWhiteSpace(dto.Category) ? "General" : dto.Category.Trim(),
            Priority = dto.Priority,
            Status = TicketStatus.Open,
            CreatedById = caller.Id,
            CreatedAt = now,
            UpdatedAt = now,
            SlaDueAt = _sla.DueFrom(now, dto.Priority)
        };

        _db.Tickets.Add(ticket);
        await _db.SaveChangesAsync();

        // Reload with the creator populated for the response.
        var saved = await LoadAsync(ticket.Id);
        return TicketReadDto.From(saved!, now);
    }

    public async Task<ServiceResult<TicketReadDto>> UpdateAsync(int id, TicketUpdateDto dto, CurrentUser caller)
    {
        if (!caller.IsAgent)
            return ServiceResult<TicketReadDto>.Forbidden("Only agents can update tickets.");

        var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == id);
        if (ticket is null) return ServiceResult<TicketReadDto>.NotFound();

        if (dto.Category is not null) ticket.Category = dto.Category.Trim();
        if (dto.Priority is TicketPriority p) ticket.Priority = p;

        if (dto.Status is TicketStatus newStatus && newStatus != ticket.Status)
        {
            ticket.Status = newStatus;
            if (newStatus is TicketStatus.Resolved or TicketStatus.Closed)
            {
                ticket.ResolvedAt ??= DateTime.UtcNow;
                // A resolved/closed ticket is no longer at risk of SLA escalation.
                ticket.IsEscalated = false;
                ticket.EscalatedAt = null;
            }
            else
            {
                // Reopened — clear the resolution timestamp.
                ticket.ResolvedAt = null;
            }
        }

        ticket.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var saved = await LoadAsync(ticket.Id);
        return ServiceResult<TicketReadDto>.Ok(TicketReadDto.From(saved!, DateTime.UtcNow));
    }

    public async Task<ServiceResult<TicketReadDto>> AssignAsync(int id, int? agentId, CurrentUser caller)
    {
        if (!caller.IsAgent)
            return ServiceResult<TicketReadDto>.Forbidden("Only agents can assign tickets.");

        var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == id);
        if (ticket is null) return ServiceResult<TicketReadDto>.NotFound();

        if (agentId is int aid)
        {
            var agent = await _db.Users.FirstOrDefaultAsync(u => u.Id == aid);
            if (agent is null) return ServiceResult<TicketReadDto>.BadRequest("The specified agent does not exist.");
            if (agent.Role != UserRole.Agent)
                return ServiceResult<TicketReadDto>.BadRequest("Tickets can only be assigned to agents.");
        }

        ticket.AssignedAgentId = agentId;
        // Picking up an unassigned, still-open ticket moves it into progress.
        if (agentId is not null && ticket.Status == TicketStatus.Open)
            ticket.Status = TicketStatus.InProgress;
        ticket.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        var saved = await LoadAsync(ticket.Id);
        return ServiceResult<TicketReadDto>.Ok(TicketReadDto.From(saved!, DateTime.UtcNow));
    }

    public async Task<ServiceResult<bool>> DeleteAsync(int id, CurrentUser caller)
    {
        if (!caller.IsAgent)
            return ServiceResult<bool>.Forbidden("Only agents can delete tickets.");

        var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == id);
        if (ticket is null) return ServiceResult<bool>.NotFound();

        _db.Tickets.Remove(ticket);
        await _db.SaveChangesAsync();
        return ServiceResult<bool>.Ok(true);
    }

    // ---- Comments ----

    public async Task<ServiceResult<IReadOnlyList<CommentReadDto>>> GetCommentsAsync(int ticketId, CurrentUser caller)
    {
        var ticket = await _db.Tickets.AsNoTracking().FirstOrDefaultAsync(t => t.Id == ticketId);
        if (ticket is null) return ServiceResult<IReadOnlyList<CommentReadDto>>.NotFound();
        if (!caller.IsAgent && ticket.CreatedById != caller.Id)
            return ServiceResult<IReadOnlyList<CommentReadDto>>.NotFound();

        var query = _db.Comments
            .Include(c => c.Author)
            .AsNoTracking()
            .Where(c => c.TicketId == ticketId);

        // Customers never see internal agent notes.
        if (!caller.IsAgent) query = query.Where(c => !c.IsInternal);

        var comments = await query
            .OrderBy(c => c.CreatedAt)
            .Select(c => CommentReadDto.From(c))
            .ToListAsync();

        return ServiceResult<IReadOnlyList<CommentReadDto>>.Ok(comments);
    }

    public async Task<ServiceResult<CommentReadDto>> AddCommentAsync(int ticketId, CommentCreateDto dto, CurrentUser caller)
    {
        var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == ticketId);
        if (ticket is null) return ServiceResult<CommentReadDto>.NotFound();
        if (!caller.IsAgent && ticket.CreatedById != caller.Id)
            return ServiceResult<CommentReadDto>.NotFound();

        var comment = new Comment
        {
            TicketId = ticketId,
            AuthorId = caller.Id,
            Body = dto.Body,
            // Only agents may post internal notes.
            IsInternal = caller.IsAgent && dto.IsInternal,
            CreatedAt = DateTime.UtcNow
        };

        _db.Comments.Add(comment);
        ticket.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var saved = await _db.Comments.Include(c => c.Author).FirstAsync(c => c.Id == comment.Id);
        return ServiceResult<CommentReadDto>.Ok(CommentReadDto.From(saved));
    }

    private Task<Ticket?> LoadAsync(int id) => _db.Tickets
        .Include(t => t.CreatedBy)
        .Include(t => t.AssignedAgent)
        .AsNoTracking()
        .FirstOrDefaultAsync(t => t.Id == id);
}
