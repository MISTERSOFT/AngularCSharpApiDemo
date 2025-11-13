using System.ComponentModel.DataAnnotations;

namespace AngularCSharpApiDemo.Server.DTOs;

/// <summary>
/// DTO for user registration
/// </summary>
public class RegisterDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email address")]
    public string Email { get; set; } = string.Empty;

    //[Required(ErrorMessage = "Username is required")]
    //[StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
    //public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
    public string Password { get; set; } = string.Empty;

    [StringLength(100, ErrorMessage = "First name cannot exceed 100 characters")]
    public string? FirstName { get; set; }

    [StringLength(100, ErrorMessage = "Last name cannot exceed 100 characters")]
    public string? LastName { get; set; }
}
