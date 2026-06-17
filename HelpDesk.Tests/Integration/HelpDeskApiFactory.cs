using Microsoft.AspNetCore.Mvc.Testing;
using Testcontainers.PostgreSql;
using Xunit;

namespace HelpDesk.Tests.Integration;

/// <summary>
/// Spins up a real PostgreSQL container (Testcontainers) and boots the API against it,
/// so the integration tests exercise the actual HTTP pipeline, auth, EF Core and the
/// production database engine. Requires Docker to be running.
///
/// Configuration is provided via environment variables (rather than ConfigureAppConfiguration)
/// because Program.cs reads the connection string and JWT key at the top of its startup,
/// before the WebApplicationFactory's in-memory config sources would be applied. Environment
/// variables are part of the default configuration and are read at that point.
/// </summary>
public class HelpDeskApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _db = new PostgreSqlBuilder()
        .WithImage("postgres:16-alpine")
        .Build();

    public async Task InitializeAsync()
    {
        await _db.StartAsync();

        Environment.SetEnvironmentVariable("ConnectionStrings__DefaultConnection", _db.GetConnectionString());
        Environment.SetEnvironmentVariable("Jwt__Key", "integration-tests-signing-key-not-for-production-0123456789");
        Environment.SetEnvironmentVariable("Jwt__Issuer", "HelpDeskApi");
        Environment.SetEnvironmentVariable("Jwt__Audience", "HelpDeskClient");
        // Keep the background escalation job from interfering with assertions.
        Environment.SetEnvironmentVariable("Sla__CheckIntervalSeconds", "3600");
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        Environment.SetEnvironmentVariable("ConnectionStrings__DefaultConnection", null);
        Environment.SetEnvironmentVariable("Jwt__Key", null);
        Environment.SetEnvironmentVariable("Jwt__Issuer", null);
        Environment.SetEnvironmentVariable("Jwt__Audience", null);
        Environment.SetEnvironmentVariable("Sla__CheckIntervalSeconds", null);

        await _db.DisposeAsync();
        await base.DisposeAsync();
    }
}
