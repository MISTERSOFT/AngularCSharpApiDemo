using AngularCSharpApiDemo.Server.Models;
using Bogus;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AngularCSharpApiDemo.Server.Data;

/// <summary>
/// Handles database seeding for roles and initial users
/// </summary>
public class DatabaseSeeder
{
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(
        RoleManager<IdentityRole> roleManager,
        UserManager<ApplicationUser> userManager,
        ApplicationDbContext context,
        ILogger<DatabaseSeeder> logger)
    {
        _roleManager = roleManager;
        _userManager = userManager;
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Seeds the database with initial data
    /// </summary>
    public async Task SeedAsync()
    {
        await SeedRolesAsync();
        await SeedAdminUserAsync();
        await SeedCategoriesAndProductsAsync();
    }

    /// <summary>
    /// Seeds default roles
    /// </summary>
    private async Task SeedRolesAsync()
    {
        string[] roleNames = { "Admin", "User" };

        foreach (var roleName in roleNames)
        {
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                var result = await _roleManager.CreateAsync(new IdentityRole(roleName));

                if (result.Succeeded)
                {
                    _logger.LogInformation("Role '{RoleName}' created successfully", roleName);
                }
                else
                {
                    _logger.LogError("Failed to create role '{RoleName}': {Errors}",
                        roleName,
                        string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
        }
    }

    /// <summary>
    /// Seeds the default admin user
    /// </summary>
    private async Task SeedAdminUserAsync()
    {
        const string adminEmail = "admin@app.fr";
        const string adminUserName = "admin";
        const string adminPassword = "Azerty123!";

        var existingAdmin = await _userManager.FindByEmailAsync(adminEmail);

        if (existingAdmin == null)
        {
            var adminUser = new ApplicationUser
            {
                UserName = adminUserName,
                Email = adminEmail,
                FirstName = "John",
                LastName = "Doe",
                EmailConfirmed = true,
                TwoFactorEnabled = false,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(adminUser, adminPassword);

            if (result.Succeeded)
            {
                // Assign Admin role
                await _userManager.AddToRoleAsync(adminUser, "Admin");

                _logger.LogInformation("Admin user '{UserName}' created successfully with email '{Email}'",
                    adminUserName,
                    adminEmail);
            }
            else
            {
                _logger.LogError("Failed to create admin user: {Errors}",
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
        else
        {
            _logger.LogInformation("Admin user already exists");
        }
    }

    /// <summary>
    /// Seeds categories and products with fake data using Bogus
    /// </summary>
    private async Task SeedCategoriesAndProductsAsync()
    {
        // Check if we already have products
        if (await _context.Products.AnyAsync())
        {
            _logger.LogInformation("Products already exist, skipping seeding");
            return;
        }

        _logger.LogInformation("Starting to seed categories and products...");

        // 1. Create Categories
        var categoryNames = new[]
        {
            "Electronics",
            "Clothing",
            "Home & Living",
            "Sports & Outdoors",
            "Books",
            "Toys & Games",
            "Beauty & Personal Care",
            "Automotive",
            "Food & Grocery",
            "Health & Wellness"
        };

        var categories = new List<Category>();
        foreach (var name in categoryNames)
        {
            var category = new Category { Name = name };
            categories.Add(category);
            _context.Categories.Add(category);
        }

        await _context.SaveChangesAsync();
        _logger.LogInformation("Created {Count} categories", categories.Count);

        // 2. Create Products with Bogus
        var productFaker = new Faker<Product>()
            .RuleFor(p => p.Name, f => f.Commerce.ProductName())
            .RuleFor(p => p.Description, f => f.Commerce.ProductDescription())
            .RuleFor(p => p.Price, f => decimal.Parse(f.Commerce.Price(min: 5, max: 2000, decimals: 2)));

        var products = productFaker.Generate(50); // Generate 50 products

        // 3. Assign random categories to each product (1-3 categories per product)
        var random = new Random();
        foreach (var product in products)
        {
            var numberOfCategories = random.Next(1, 4); // 1 to 3 categories
            var selectedCategories = categories
                .OrderBy(x => random.Next())
                .Take(numberOfCategories)
                .ToList();

            product.Categories = selectedCategories;
        }

        _context.Products.AddRange(products);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Created {Count} products", products.Count);

        // 4. Create Product Images using Bogus
        var productImageFaker = new Faker<ProductImage>()
            .RuleFor(pi => pi.Url, f => f.Image.PicsumUrl(width: 800, height: 600));

        var productImages = new List<ProductImage>();
        foreach (var product in products)
        {
            // Each product gets 1-4 random images
            var numberOfImages = random.Next(1, 5);
            for (int i = 0; i < numberOfImages; i++)
            {
                var image = productImageFaker.Generate();
                image.ProductId = product.Id;
                productImages.Add(image);
            }
        }

        _context.ProductImages.AddRange(productImages);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Created {Count} product images", productImages.Count);

        _logger.LogInformation("Successfully seeded {ProductCount} products with {ImageCount} images across {CategoryCount} categories",
            products.Count,
            productImages.Count,
            categories.Count);
    }
}
