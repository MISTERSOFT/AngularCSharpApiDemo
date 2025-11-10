using AngularCSharpApiDemo.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace AngularCSharpApiDemo.Server.HealthChecks;

/// <summary>
/// Custom health check for database connectivity and migrations
/// </summary>
public class DatabaseHealthCheck : IHealthCheck
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DatabaseHealthCheck> _logger;

    public DatabaseHealthCheck(ApplicationDbContext context, ILogger<DatabaseHealthCheck> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Check if database can be connected
            var canConnect = await _context.Database.CanConnectAsync(cancellationToken);

            if (!canConnect)
            {
                return HealthCheckResult.Unhealthy("Cannot connect to database");
            }

            // Check for pending migrations
            var pendingMigrations = await _context.Database.GetPendingMigrationsAsync(cancellationToken);
            var pendingCount = pendingMigrations.Count();

            if (pendingCount > 0)
            {
                _logger.LogWarning("Database has {Count} pending migrations", pendingCount);
                return HealthCheckResult.Degraded(
                    $"Database has {pendingCount} pending migration(s)",
                    data: new Dictionary<string, object>
                    {
                        { "pendingMigrations", pendingCount }
                    });
            }

            var dbConnection = _context.Database.GetDbConnection();
            return HealthCheckResult.Healthy(
                "Database is healthy",
                data: new Dictionary<string, object>
                {
                    { "provider", "PostgreSQL" },
                    { "database", dbConnection.Database }
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Database health check failed");
            return HealthCheckResult.Unhealthy(
                "Database health check failed",
                exception: ex);
        }
    }
}
