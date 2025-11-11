using AngularCSharpApiDemo.Server.Data;
using AngularCSharpApiDemo.Server.DTOs;
using AngularCSharpApiDemo.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AngularCSharpApiDemo.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(ApplicationDbContext context, ILogger<ProductsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all products
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
    {
        var products = await _context.Products
            .Include(p => p.Categories)
            .Include(p => p.ProductImages)
            .ToListAsync();

        var productDtos = products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            Categories = p.Categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name
            }).ToList(),
            ProductImages = p.ProductImages.Select(pi => new ProductImageDto
            {
                Id = pi.Id,
                Url = pi.Url
            }).ToList()
        }).ToList();

        return Ok(productDtos);
    }

    /// <summary>
    /// Get product by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Categories)
            .Include(p => p.ProductImages)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound(new { message = $"Product with ID {id} not found" });
        }

        var productDto = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Categories = product.Categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name
            }).ToList(),
            ProductImages = product.ProductImages.Select(pi => new ProductImageDto
            {
                Id = pi.Id,
                Url = pi.Url
            }).ToList()
        };

        return Ok(productDto);
    }

    /// <summary>
    /// Create a new product
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto createProductDto)
    {
        // Validate categories exist
        var categories = await _context.Categories
            .Where(c => createProductDto.CategoryIds.Contains(c.Id))
            .ToListAsync();

        if (categories.Count != createProductDto.CategoryIds.Count)
        {
            return BadRequest(new { message = "One or more category IDs are invalid" });
        }

        var product = new Product
        {
            Name = createProductDto.Name,
            Description = createProductDto.Description,
            Price = createProductDto.Price,
            Categories = categories,
            ProductImages = createProductDto.ImageUrls.Select(url => new ProductImage
            {
                Url = url
            }).ToList()
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // Reload product with navigation properties
        await _context.Entry(product)
            .Collection(p => p.Categories)
            .LoadAsync();
        await _context.Entry(product)
            .Collection(p => p.ProductImages)
            .LoadAsync();

        var productDto = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Categories = product.Categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name
            }).ToList(),
            ProductImages = product.ProductImages.Select(pi => new ProductImageDto
            {
                Id = pi.Id,
                Url = pi.Url
            }).ToList()
        };

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, productDto);
    }

    /// <summary>
    /// Update an existing product
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto updateProductDto)
    {
        var product = await _context.Products
            .Include(p => p.Categories)
            .Include(p => p.ProductImages)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound(new { message = $"Product with ID {id} not found" });
        }

        // Validate categories exist
        var categories = await _context.Categories
            .Where(c => updateProductDto.CategoryIds.Contains(c.Id))
            .ToListAsync();

        if (categories.Count != updateProductDto.CategoryIds.Count)
        {
            return BadRequest(new { message = "One or more category IDs are invalid" });
        }

        // Update product properties
        product.Name = updateProductDto.Name;
        product.Description = updateProductDto.Description;
        product.Price = updateProductDto.Price;

        // Update categories
        product.Categories.Clear();
        product.Categories = categories;

        // Update images - remove all existing and add new ones
        _context.ProductImages.RemoveRange(product.ProductImages);
        product.ProductImages = updateProductDto.ImageUrls.Select(url => new ProductImage
        {
            Url = url,
            ProductId = product.Id
        }).ToList();

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProductExists(id))
            {
                return NotFound(new { message = $"Product with ID {id} not found" });
            }
            throw;
        }

        return NoContent();
    }

    /// <summary>
    /// Delete a product
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound(new { message = $"Product with ID {id} not found" });
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ProductExists(int id)
    {
        return _context.Products.Any(e => e.Id == id);
    }
}
