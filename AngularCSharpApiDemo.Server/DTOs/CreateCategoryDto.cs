using System.ComponentModel.DataAnnotations;

namespace AngularCSharpApiDemo.Server.DTOs;

public class CreateCategoryDto
{
    [Required]
    [StringLength(100, MinimumLength = 1)]
    public required string Name { get; set; }
}
