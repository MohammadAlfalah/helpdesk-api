using HelpDesk.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Data;

/// <summary>
/// Seeds demo data on first run so the API — and the web agent console it serves —
/// are usable immediately: a support agent, a few teammates and customers, and a
/// spread of realistic tickets (open, in progress, escalated, resolved) with
/// comment threads. Sign-in credentials are documented in the README.
/// </summary>
public static class SeedData
{
    public static async Task EnsureSeededAsync(AppDbContext db)
    {
        if (await db.Users.AnyAsync()) return;

        var now = DateTime.UtcNow;
        // One BCrypt hash per password (the salt is embedded), reused across the
        // same-password demo users — far faster than hashing each one separately.
        var agentPw = BCrypt.Net.BCrypt.HashPassword("Agent#12345");
        var custPw = BCrypt.Net.BCrypt.HashPassword("Customer#12345");

        User Agent(string email, string name) => new() { Email = email, FullName = name, PasswordHash = agentPw, Role = UserRole.Agent };
        User Customer(string email, string name) => new() { Email = email, FullName = name, PasswordHash = custPw, Role = UserRole.Customer };

        // ---- People ----
        var agent = Agent("agent@helpdesk.local", "Support Agent");   // the documented demo login
        var dana = Agent("dana@helpdesk.local", "Dana Okafor");
        var marcus = Agent("marcus@helpdesk.local", "Marcus Hale");
        var priya = Agent("priya@helpdesk.local", "Priya Raman");

        var demo = Customer("customer@helpdesk.local", "Demo Customer"); // the documented customer login
        var sam = Customer("sam.liu@northwind.co", "Sam Liu");
        var rosa = Customer("rosa@brightpath.io", "Rosa Méndez");
        var tomas = Customer("tomas@northwind.co", "Tomas Berg");
        var aisha = Customer("aisha@brightpath.io", "Aisha Khan");
        var jordan = Customer("jordan@northwind.co", "Jordan Webb");
        var lena = Customer("lena@brightpath.io", "Lena Fischer");

        db.Users.AddRange(agent, dana, marcus, priya, demo, sam, rosa, tomas, aisha, jordan, lena);

        // SLA resolution target per priority (hours): Urgent 1 · High 4 · Medium 24 · Low 72.
        static double SlaHours(TicketPriority p) => p switch
        {
            TicketPriority.Urgent => 1,
            TicketPriority.High => 4,
            TicketPriority.Medium => 24,
            TicketPriority.Low => 72,
            _ => 24
        };

        Ticket Make(string title, string category, string desc, TicketStatus status, TicketPriority priority,
            User createdBy, User? assignedAgent, double createdHoursAgo, double updatedHoursAgo,
            bool escalated = false, double? resolvedHoursAgo = null)
        {
            var createdAt = now.AddHours(-createdHoursAgo);
            return new Ticket
            {
                Title = title,
                Description = desc,
                Category = category,
                Status = status,
                Priority = priority,
                CreatedBy = createdBy,
                AssignedAgent = assignedAgent,
                CreatedAt = createdAt,
                UpdatedAt = now.AddHours(-updatedHoursAgo),
                ResolvedAt = resolvedHoursAgo is null ? null : now.AddHours(-resolvedHoursAgo.Value),
                SlaDueAt = createdAt.AddHours(SlaHours(priority)),
                IsEscalated = escalated,
                EscalatedAt = escalated ? now.AddHours(-updatedHoursAgo) : null
            };
        }

        var vpn = Make("VPN keeps dropping every few minutes", "Network",
            "The corporate VPN disconnects every few minutes on my machine. Restarting the client does not help and it happens across two laptops. It started this morning after the maintenance window.",
            TicketStatus.Open, TicketPriority.High, sam, dana, createdHoursAgo: 2, updatedHoursAgo: 0.5);

        var pwd = Make("Cannot reset password — link expired", "Account",
            "Every password reset email link says it has expired the moment I click it. I have tried three times over the last hour.",
            TicketStatus.InProgress, TicketPriority.Urgent, rosa, marcus, createdHoursAgo: 5, updatedHoursAgo: 1, escalated: true);

        var printer = Make("Printer on 3rd floor offline", "Hardware",
            "The shared printer (HP-3F) shows offline for everyone on the third floor since yesterday afternoon.",
            TicketStatus.Open, TicketPriority.Medium, tomas, null, createdHoursAgo: 20, updatedHoursAgo: 20);

        var billing = Make("Billing invoice shows wrong seat count", "Billing",
            "Our latest invoice lists 60 seats but we are on the 45-seat plan. Please correct and re-issue.",
            TicketStatus.InProgress, TicketPriority.Medium, aisha, priya, createdHoursAgo: 26, updatedHoursAgo: 3);

        var laptop = Make("Onboarding new starter — laptop request", "Hardware",
            "New hire starts Monday and needs a standard developer laptop image and a monitor.",
            TicketStatus.Resolved, TicketPriority.Low, jordan, dana, createdHoursAgo: 70, updatedHoursAgo: 40, resolvedHoursAgo: 40);

        var signature = Make("Email signature not applying for the team", "Account",
            "The standard signature template is not being pushed to anyone in the sales team Outlook.",
            TicketStatus.Closed, TicketPriority.Low, lena, marcus, createdHoursAgo: 96, updatedHoursAgo: 80, resolvedHoursAgo: 82);

        // Two tickets for the documented demo CUSTOMER, so the customer portal has
        // data to show when you sign in as customer@helpdesk.local.
        var demoWifi = Make("Laptop won't connect to office Wi-Fi", "Network",
            "Since this morning my laptop won't join the office Wi-Fi — other devices connect fine and I've restarted twice.",
            TicketStatus.InProgress, TicketPriority.High, demo, dana, createdHoursAgo: 3, updatedHoursAgo: 1);

        var demoAccess = Make("Request access to the shared Finance drive", "Account",
            "I've moved to the finance team and need read/write access to the shared Finance drive. My manager has approved.",
            TicketStatus.Open, TicketPriority.Low, demo, null, createdHoursAgo: 28, updatedHoursAgo: 28);

        db.Tickets.AddRange(vpn, pwd, printer, billing, laptop, signature, demoWifi, demoAccess);

        // ---- Comment threads ----
        db.Comments.AddRange(
            new Comment { Ticket = vpn, Author = sam, Body = "It just dropped again while I was on a call. Really disruptive.", IsInternal = false, CreatedAt = now.AddHours(-1.5) },
            new Comment { Ticket = vpn, Author = dana, Body = "Thanks Sam — taking a look now. Can you confirm which VPN gateway you connect to?", IsInternal = false, CreatedAt = now.AddHours(-1) },
            new Comment { Ticket = vpn, Author = dana, Body = "Gateway GW-2 was flapping after the maintenance window. Escalating to the network team.", IsInternal = true, CreatedAt = now.AddMinutes(-40) },
            new Comment { Ticket = pwd, Author = rosa, Body = "Still cannot get in. This is now blocking my whole morning.", IsInternal = false, CreatedAt = now.AddHours(-2) },
            new Comment { Ticket = pwd, Author = marcus, Body = "SLA breached — token TTL was misconfigured. Pushing a fix and will reset her link manually.", IsInternal = true, CreatedAt = now.AddMinutes(-50) },
            new Comment { Ticket = demoWifi, Author = dana, Body = "Thanks for flagging this — I've reset your Wi-Fi profile on our side. Could you forget the network on your laptop and reconnect, then let me know if it holds?", IsInternal = false, CreatedAt = now.AddMinutes(-55) }
        );

        await db.SaveChangesAsync();
    }
}
