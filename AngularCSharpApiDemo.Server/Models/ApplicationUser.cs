using Microsoft.AspNetCore.Identity;

namespace AngularCSharpApiDemo.Server.Models;

/// <summary>
/// Application user extending IdentityUser with custom properties
/// </summary>
public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
