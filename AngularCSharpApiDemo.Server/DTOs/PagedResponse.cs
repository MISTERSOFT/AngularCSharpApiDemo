namespace AngularCSharpApiDemo.Server.DTOs;

/// <summary>
/// Paginated response wrapper
/// </summary>
public class PagedResponse<T>
{
    /// <summary>
    /// Current page number (1-based)
    /// </summary>
    public int PageNumber { get; set; }

    /// <summary>
    /// Number of items per page
    /// </summary>
    public int PageSize { get; set; }

    /// <summary>
    /// Total number of items across all pages
    /// </summary>
    public int TotalCount { get; set; }

    /// <summary>
    /// Total number of pages
    /// </summary>
    public int TotalPages { get; set; }

    /// <summary>
    /// Indicates if there is a previous page
    /// </summary>
    public bool HasPrevious { get; set; }

    /// <summary>
    /// Indicates if there is a next page
    /// </summary>
    public bool HasNext { get; set; }

    /// <summary>
    /// The items for the current page
    /// </summary>
    public List<T> Items { get; set; } = new();
}
