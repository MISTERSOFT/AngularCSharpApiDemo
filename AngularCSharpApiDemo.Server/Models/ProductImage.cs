namespace AngularCSharpApiDemo.Server.Models;

public class ProductImage
{
    public int Id { get; set; }
    public required string Url { get; set; }

    // Foreign key
    public int ProductId { get; set; }

    // Navigation property
    public Product Product { get; set; } = null!;
}
