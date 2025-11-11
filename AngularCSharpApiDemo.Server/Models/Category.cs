namespace AngularCSharpApiDemo.Server.Models;

public class Category
{
    public int Id { get; set; }
    public required string Name { get; set; }

    // Navigation properties
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
