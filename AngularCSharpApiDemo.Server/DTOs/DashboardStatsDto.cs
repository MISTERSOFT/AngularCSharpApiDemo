namespace AngularCSharpApiDemo.Server.DTOs;

/// <summary>
/// Dashboard statistics data transfer object
/// </summary>
public class DashboardStatsDto
{
    /// <summary>
    /// Total number of products in the system
    /// </summary>
    public int TotalProducts { get; set; }

    /// <summary>
    /// Total number of categories in the system
    /// </summary>
    public int TotalCategories { get; set; }
}
