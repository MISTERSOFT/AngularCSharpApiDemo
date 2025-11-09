# Database Seeding Approaches in ASP.NET Core

This document compares different approaches for seeding databases in ASP.NET Core applications.

## Available Approaches

### 1. Extension Method Approach (Current - Recommended) ⭐

**Implementation:**
```csharp
// Program.cs
var app = builder.Build();
await app.SeedDatabaseAsync();
```

**Location:** `Extensions/DatabaseSeedingExtensions.cs`

**Pros:**
- ✅ Clean and maintainable code in Program.cs
- ✅ Full access to UserManager and RoleManager
- ✅ Easy password hashing via ASP.NET Identity
- ✅ Dependency injection support
- ✅ Complex business logic support
- ✅ Excellent for ASP.NET Identity scenarios
- ✅ Extensible and reusable
- ✅ Proper error handling and logging

**Cons:**
- ❌ Runs at application startup (slight delay)
- ❌ Requires manual scope management

**Best For:**
- Applications using ASP.NET Identity
- Complex seeding scenarios
- Role-based systems
- When you need UserManager/RoleManager

---

### 2. Manual Inline Approach (Previous)

**Implementation:**
```csharp
// Program.cs
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<DatabaseSeeder>>();

    var seeder = new DatabaseSeeder(roleManager, userManager, logger);
    await seeder.SeedAsync();
}
```

**Pros:**
- ✅ Simple and direct
- ✅ Full control

**Cons:**
- ❌ Clutters Program.cs
- ❌ Not reusable
- ❌ Harder to test

**Best For:**
- Quick prototypes
- Very simple seeding

---

### 3. EF Core `ModelBuilder` Seeding

**Implementation:**
```csharp
// ApplicationDbContext.cs
protected override void OnModelCreating(ModelBuilder builder)
{
    base.OnModelCreating(builder);

    builder.Entity<Product>().HasData(
        new Product { Id = 1, Name = "Product 1", Price = 10.99m },
        new Product { Id = 2, Name = "Product 2", Price = 20.99m }
    );
}
```

**Pros:**
- ✅ Integrated with EF Core migrations
- ✅ Tracked in migration files
- ✅ Version controlled with schema changes
- ✅ Ideal for lookup/reference data

**Cons:**
- ❌ Cannot use UserManager (no password hashing)
- ❌ Requires hardcoded IDs
- ❌ Limited to simple data
- ❌ No dependency injection
- ❌ Not suitable for Identity users

**Best For:**
- Static reference data (countries, categories)
- Lookup tables
- Test data in development
- Simple entity seeding

---

### 4. EF Core 9.0 `UseSeeding`/`UseAsyncSeeding`

**Implementation:**
```csharp
// Program.cs
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(connectionString)
        .UseSeeding((context, _) =>
        {
            // Synchronous seeding
            if (!context.Products.Any())
            {
                context.Products.Add(new Product { Name = "Product 1" });
                context.SaveChanges();
            }
        })
        .UseAsyncSeeding(async (context, _, cancellationToken) =>
        {
            // Async seeding
            if (!await context.Products.AnyAsync(cancellationToken))
            {
                await context.Products.AddAsync(
                    new Product { Name = "Product 1" },
                    cancellationToken
                );
                await context.SaveChangesAsync(cancellationToken);
            }
        });
});
```

**Pros:**
- ✅ Integrated with EF Core 9.0+
- ✅ Runs during EnsureCreated/Migrate
- ✅ Cleaner for simple scenarios
- ✅ Supports async operations

**Cons:**
- ❌ No easy access to UserManager/RoleManager
- ❌ Limited dependency injection
- ❌ Password hashing is complex
- ❌ Only works with EF Core 9.0+
- ❌ Less flexible for Identity scenarios

**Best For:**
- Simple data seeding
- EF Core 9.0+ projects without Identity
- Basic entity initialization

---

## Comparison Matrix

| Feature | Extension Method | Inline Manual | ModelBuilder | UseSeeding/UseAsyncSeeding |
|---------|-----------------|---------------|--------------|---------------------------|
| **Code Cleanliness** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Identity Support** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐ |
| **UserManager Access** | ✅ | ✅ | ❌ | ❌ |
| **Password Hashing** | ✅ | ✅ | ❌ | ⭐ |
| **Dependency Injection** | ✅ | ✅ | ❌ | ⭐ |
| **Complex Logic** | ✅ | ✅ | ❌ | ⭐ |
| **Reusability** | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Testing** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Error Handling** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **EF Integration** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Version Support** | All | All | All | EF Core 9.0+ |

---

## Why Extension Method is Best for This Project

1. **ASP.NET Identity Integration**
   - We need UserManager for password hashing
   - RoleManager for role creation
   - SignInManager for authentication logic

2. **Clean Architecture**
   - Keeps Program.cs minimal
   - Separates concerns
   - Easy to extend

3. **Maintainability**
   - Centralized seeding logic
   - Easy to test
   - Clear error handling

4. **Flexibility**
   - Can add more seeders easily
   - Supports complex business logic
   - Full dependency injection support

---

## Using the Extension Method

### Basic Usage

```csharp
// Program.cs
var app = builder.Build();

// Seed database
await app.SeedDatabaseAsync();
```

### With Auto-Migration (Optional)

```csharp
// Apply migrations automatically in development
await app.MigrateDatabaseAsync(
    applyMigrations: app.Environment.IsDevelopment()
);

// Then seed
await app.SeedDatabaseAsync();
```

### Environment-Specific Seeding

```csharp
// Only seed in development
if (app.Environment.IsDevelopment())
{
    await app.SeedDatabaseAsync();
}
```

---

## Creating Additional Seeders

### Step 1: Create Seeder Class

```csharp
// Data/ProductSeeder.cs
public class ProductSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ProductSeeder> _logger;

    public ProductSeeder(ApplicationDbContext context, ILogger<ProductSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        if (await _context.Products.AnyAsync())
        {
            _logger.LogInformation("Products already exist, skipping seed");
            return;
        }

        var products = new List<Product>
        {
            new() { Name = "Laptop", Price = 999.99m },
            new() { Name = "Mouse", Price = 29.99m }
        };

        await _context.Products.AddRangeAsync(products);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Seeded {Count} products", products.Count);
    }
}
```

### Step 2: Add Extension Method

```csharp
// Extensions/DatabaseSeedingExtensions.cs
public static async Task<WebApplication> SeedProductsAsync(this WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<ProductSeeder>>();

    var seeder = new ProductSeeder(context, logger);
    await seeder.SeedAsync();

    return app;
}
```

### Step 3: Use in Program.cs

```csharp
var app = builder.Build();

await app.SeedDatabaseAsync();  // Identity seeding
await app.SeedProductsAsync();  // Product seeding
```

---

## Best Practices

1. **Idempotent Seeding**
   - Always check if data exists before seeding
   - Use `AnyAsync()` or `FindByEmailAsync()` checks

2. **Error Handling**
   - Wrap seeding in try-catch
   - Log errors clearly
   - Decide whether to throw or continue

3. **Environment Awareness**
   - Different data for dev/staging/prod
   - Use configuration for environment-specific values

4. **Logging**
   - Log what was seeded
   - Log when seeding is skipped
   - Log errors with details

5. **Security**
   - Never commit production credentials
   - Use environment variables for sensitive data
   - Change default passwords

6. **Performance**
   - Use `AddRangeAsync` for bulk inserts
   - Consider seeding performance for large datasets
   - Async operations for better scalability

---

## Comparison: When to Use Each Approach

### Use Extension Method When:
- ✅ Working with ASP.NET Identity
- ✅ Need password hashing
- ✅ Complex seeding logic
- ✅ Multiple related entities
- ✅ Production applications

### Use ModelBuilder When:
- ✅ Static reference data
- ✅ Simple lookup tables
- ✅ Data tied to schema
- ✅ Test data generation

### Use UseSeeding When:
- ✅ EF Core 9.0+ without Identity
- ✅ Simple entity seeding
- ✅ Want EF lifecycle integration

### Use Inline When:
- ✅ Quick prototypes
- ✅ Learning/tutorials
- ✅ Very simple scenarios

---

## Migration from Other Approaches

### From Inline to Extension Method

**Before:**
```csharp
using (var scope = app.Services.CreateScope())
{
    // 20+ lines of seeding code
}
```

**After:**
```csharp
await app.SeedDatabaseAsync();
```

### From ModelBuilder to Extension Method

**Before:**
```csharp
protected override void OnModelCreating(ModelBuilder builder)
{
    builder.Entity<IdentityRole>().HasData(
        new IdentityRole { Id = "1", Name = "Admin" }
        // Can't hash passwords properly!
    );
}
```

**After:**
```csharp
// DatabaseSeeder.cs with proper UserManager
var result = await _userManager.CreateAsync(user, password);
```

---

## Conclusion

For this project, the **Extension Method approach** is the best choice because:

1. It provides clean, maintainable code
2. Full support for ASP.NET Identity
3. Proper password hashing via UserManager
4. Extensible for future needs
5. Industry best practice

The code is production-ready and follows ASP.NET Core conventions.
