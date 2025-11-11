namespace AngularCSharpApiDemo.Server.Models;

public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }

    // Navigation properties
    public ICollection<Category> Categories { get; set; } = new List<Category>();
    public ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
}
