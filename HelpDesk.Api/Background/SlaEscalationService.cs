using HelpDesk.Api.Services;

namespace HelpDesk.Api.Background;

/// <summary>
/// Hosted background service that periodically runs the SLA escalation pass.
/// It resolves a fresh scope each tick (the runner and its DbContext are scoped),
/// and never crashes the app: a failed run is logged and retried next tick.
/// </summary>
public class SlaEscalationService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly SlaOptions _sla;
    private readonly ILogger<SlaEscalationService> _logger;

    public SlaEscalationService(
        IServiceScopeFactory scopeFactory,
        SlaOptions sla,
        ILogger<SlaEscalationService> logger)
    {
        _scopeFactory = scopeFactory;
        _sla = sla;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var interval = TimeSpan.FromSeconds(Math.Max(5, _sla.CheckIntervalSeconds));
        _logger.LogInformation("SLA escalation job started; checking every {Seconds}s.", interval.TotalSeconds);

        using var timer = new PeriodicTimer(interval);
        do
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var runner = scope.ServiceProvider.GetRequiredService<SlaEscalationRunner>();
                var escalated = await runner.RunOnceAsync(DateTime.UtcNow, stoppingToken);
                if (escalated > 0)
                    _logger.LogInformation("SLA job escalated {Count} ticket(s).", escalated);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break; // shutting down
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SLA escalation run failed; will retry next tick.");
            }
        }
        while (await timer.WaitForNextTickAsync(stoppingToken));
    }
}
