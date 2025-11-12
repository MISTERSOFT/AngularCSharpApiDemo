namespace AngularCSharpApiDemo.Server.DTOs;

/// <summary>
/// Filter parameters for product queries
/// </summary>
public class ProductFilterParams : PaginationParams
{
    /// <summary>
    /// Search term to filter products by name or description
    /// </summary>
    public string? Search { get; set; }

    /// <summary>
    /// Category IDs to filter products by (comma-separated)
    /// </summary>
    public string? Categories { get; set; }

    /// <summary>
    /// Minimum price filter
    /// </summary>
    public decimal? MinPrice { get; set; }

    /// <summary>
    /// Maximum price filter
    /// </summary>
    public decimal? MaxPrice { get; set; }
}
