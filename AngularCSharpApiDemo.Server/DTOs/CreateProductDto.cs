using System.ComponentModel.DataAnnotations;

namespace AngularCSharpApiDemo.Server.DTOs;

public class CreateProductDto
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public required string Name { get; set; }

    [StringLength(1000)]
    public string? Description { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    public List<int> CategoryIds { get; set; } = new();

    public List<string> ImageUrls { get; set; } = new();
}
