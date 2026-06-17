using HelpDesk.Api.Auth;
using HelpDesk.Api.Data;
using HelpDesk.Api.Models;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Tests.Unit;

/// <summary>
/// A throwaway AppDbContext backed by an in-memory SQLite database (a real relational
/// engine, so FKs and the enum-to-string conversion are exercised), pre-seeded with
/// one customer and one agent. Fast and requires no Docker.
/// </summary>
public sealed class SqliteTestContext : IDisposable
{
    private readonly SqliteConnection _connection;
    public AppDbContext Db { get; }
    public User Customer { get; }
    public User Agent { get; }

    public SqliteTestContext()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();
        var options = new DbContextOptionsBuilder<AppDbContext>().UseSqlite(_connection).Options;
        Db = new AppDbContext(options);
        Db.Database.EnsureCreated();

        Customer = new User { Email = "customer@test.local", FullName = "Cust Omer", PasswordHash = "x", Role = UserRole.Customer };
        Agent = new User { Email = "agent@test.local", FullName = "Ag Ent", PasswordHash = "x", Role = UserRole.Agent };
        Db.Users.AddRange(Customer, Agent);
        Db.SaveChanges();
    }

    public CurrentUser AsCustomer => new(Customer.Id, UserRole.Customer, Customer.Email, Customer.FullName);
    public CurrentUser AsAgent => new(Agent.Id, UserRole.Agent, Agent.Email, Agent.FullName);

    public void Dispose()
    {
        Db.Dispose();
        _connection.Dispose();
    }
}
