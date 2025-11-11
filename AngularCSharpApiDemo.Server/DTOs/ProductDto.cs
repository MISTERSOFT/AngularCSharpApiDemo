namespace AngularCSharpApiDemo.Server.DTOs;

public class ProductDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public List<CategoryDto> Categories { get; set; } = new();
    public List<ProductImageDto> ProductImages { get; set; } = new();
}
