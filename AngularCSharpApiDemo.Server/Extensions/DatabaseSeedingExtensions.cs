using AngularCSharpApiDemo.Server.Data;
using AngularCSharpApiDemo.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AngularCSharpApiDemo.Server.Extensions;

/// <summary>
/// Extension methods for database seeding
/// </summary>
public static class DatabaseSeedingExtensions
{
    /// <summary>
    /// Seeds the database with initial data
    /// </summary>
    /// <param name="app">The web application</param>
    /// <returns>The web application for chaining</returns>
    public static async Task<WebApplication> SeedDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;
        var logger = services.GetRequiredService<ILogger<DatabaseSeeder>>();

        try
        {
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            var context = services.GetRequiredService<ApplicationDbContext>();

            var seeder = new DatabaseSeeder(roleManager, userManager, context, logger);
            await seeder.SeedAsync();

            logger.LogInformation("Database seeding completed successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database");
            throw; // Re-throw to prevent app from starting with incomplete data
        }

        return app;
    }

    /// <summary>
    /// Applies pending migrations automatically
    /// </summary>
    /// <param name="app">The web application</param>
    /// <param name="applyMigrations">Whether to apply migrations automatically</param>
    /// <returns>The web application for chaining</returns>
    public static async Task<WebApplication> MigrateDatabaseAsync(
        this WebApplication app,
        bool applyMigrations = false)
    {
        if (!applyMigrations)
        {
            return app;
        }

        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;
        var logger = services.GetRequiredService<ILogger<Program>>();

        try
        {
            var context = services.GetRequiredService<ApplicationDbContext>();

            // Check if there are pending migrations
            var pendingMigrations = await context.Database.GetPendingMigrationsAsync();

            if (pendingMigrations.Any())
            {
                logger.LogInformation("Applying {Count} pending migrations", pendingMigrations.Count());
                await context.Database.MigrateAsync();
                logger.LogInformation("Migrations applied successfully");
            }
            else
            {
                logger.LogInformation("Database is up to date");
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while migrating the database");
            throw;
        }

        return app;
    }
}
