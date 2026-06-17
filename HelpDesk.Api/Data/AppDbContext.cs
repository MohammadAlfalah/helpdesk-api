using HelpDesk.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<Comment> Comments => Set<Comment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Email).HasMaxLength(256).IsRequired();
            e.Property(u => u.FullName).HasMaxLength(120).IsRequired();
            e.Property(u => u.Role).HasConversion<string>().HasMaxLength(20);
        });

        modelBuilder.Entity<Ticket>(e =>
        {
            e.Property(t => t.Title).HasMaxLength(200).IsRequired();
            e.Property(t => t.Category).HasMaxLength(60);
            e.Property(t => t.Status).HasConversion<string>().HasMaxLength(20);
            e.Property(t => t.Priority).HasConversion<string>().HasMaxLength(20);

            // A ticket has one creator (customer) and an optional assigned agent.
            // Restrict on delete so removing a user never silently cascades away tickets,
            // and to avoid multiple-cascade-path errors from the two FKs into User.
            e.HasOne(t => t.CreatedBy)
                .WithMany(u => u.CreatedTickets)
                .HasForeignKey(t => t.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(t => t.AssignedAgent)
                .WithMany(u => u.AssignedTickets)
                .HasForeignKey(t => t.AssignedAgentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes for the common list filters.
            e.HasIndex(t => t.Status);
            e.HasIndex(t => t.Priority);
            e.HasIndex(t => t.AssignedAgentId);
            e.HasIndex(t => t.CreatedById);
        });

        modelBuilder.Entity<Comment>(e =>
        {
            e.Property(c => c.Body).HasMaxLength(4000).IsRequired();

            e.HasOne(c => c.Ticket)
                .WithMany(t => t.Comments)
                .HasForeignKey(c => c.TicketId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(c => c.Author)
                .WithMany()
                .HasForeignKey(c => c.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasIndex(c => c.TicketId);
        });
    }
}
