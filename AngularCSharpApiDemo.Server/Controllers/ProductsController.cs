using AngularCSharpApiDemo.Server.Data;
using AngularCSharpApiDemo.Server.DTOs;
using AngularCSharpApiDemo.Server.DTOs.Converters;
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
    /// Get all products with pagination and filtering
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedResponse<ProductDto>>> GetProducts([FromQuery] ProductFilterParams filterParams)
    {
        var query = _context.Products
            .Include(p => p.Categories)
            .Include(p => p.ProductImages)
            .AsQueryable();

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(filterParams.Search))
        {
            var searchLower = filterParams.Search.ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(searchLower) ||
                p.Description.ToLower().Contains(searchLower));
        }

        // Apply category filter
        if (!string.IsNullOrWhiteSpace(filterParams.Categories))
        {
            var categoryIds = filterParams.Categories
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(int.Parse)
                .ToList();

            if (categoryIds.Any())
            {
                query = query.Where(p => p.Categories.Any(c => categoryIds.Contains(c.Id)));
            }
        }

        // Apply price range filter
        if (filterParams.MinPrice.HasValue)
        {
            query = query.Where(p => p.Price >= filterParams.MinPrice.Value);
        }

        if (filterParams.MaxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= filterParams.MaxPrice.Value);
        }

        // Get total count after filtering
        var totalCount = await query.CountAsync();

        // Apply pagination
        var products = await query
            .Skip((filterParams.PageNumber - 1) * filterParams.PageSize)
            .Take(filterParams.PageSize)
            .ToListAsync();

        var totalPages = (int)Math.Ceiling(totalCount / (double)filterParams.PageSize);

        var response = new PagedResponse<ProductDto>
        {
            PageNumber = filterParams.PageNumber,
            PageSize = filterParams.PageSize,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasPrevious = filterParams.PageNumber > 1,
            HasNext = filterParams.PageNumber < totalPages,
            Items = products.ToDtos()
        };

        return Ok(response);
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

        return Ok(product.ToDto());
    }

    /// <summary>
    /// Get multiple products by their IDs
    /// </summary>
    /// <param name="productIds">List of product IDs to retrieve</param>
    /// <returns>List of products matching the provided IDs</returns>
    [HttpPost("by-ids")]
    public async Task<ActionResult<List<ProductDto>>> GetProductsByIds([FromBody] List<int> productIds)
    {
        // Validate input
        if (productIds == null || !productIds.Any())
        {
            return BadRequest(new { message = "Product IDs list cannot be empty" });
        }

        // Remove duplicates and get distinct IDs
        var distinctIds = productIds.Distinct().ToList();

        // Query products by IDs
        var products = await _context.Products
            .Include(p => p.Categories)
            .Include(p => p.ProductImages)
            .Where(p => distinctIds.Contains(p.Id))
            .ToListAsync();

        // Map to DTOs and return
        return Ok(products.ToDtos());
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
