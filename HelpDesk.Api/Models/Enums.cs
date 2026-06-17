namespace HelpDesk.Api.Models;

/// <summary>Who a user is. Agents handle tickets; customers raise them.</summary>
public enum UserRole
{
    Customer,
    Agent
}

/// <summary>Lifecycle of a support ticket.</summary>
public enum TicketStatus
{
    Open,
    InProgress,
    Resolved,
    Closed
}

/// <summary>How urgent a ticket is. Drives the SLA due time and escalation order.</summary>
public enum TicketPriority
{
    Low,
    Medium,
    High,
    Urgent
}
