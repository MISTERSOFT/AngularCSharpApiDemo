# Database Seeding Guide

## Overview

The `DatabaseSeeder` class handles automatic database initialization with default roles and an admin user. This seeding runs once at application startup.

## Default Seeded Data

### Roles
- **Admin**: Full administrative access
- **User**: Standard user access

### Admin User
- **Email**: `admin@app.fr`
- **Username**: `admin`
- **Password**: `Azerty123!`
- **First Name**: John
- **Last Name**: Doe
- **Email Confirmed**: true
- **Two-Factor Enabled**: false
- **Role**: Admin

## How It Works

The `DatabaseSeeder` is automatically invoked in `Program.cs` at startup:

```csharp
using (var scope = app.Services.CreateScope())
{
    var seeder = new DatabaseSeeder(roleManager, userManager, seederLogger);
    await seeder.SeedAsync();
}
```

### Seeding Logic

1. **Roles Seeding** (`SeedRolesAsync`)
   - Checks if each role exists
   - Creates missing roles
   - Logs success or failure

2. **Admin User Seeding** (`SeedAdminUserAsync`)
   - Checks if admin user exists (by email)
   - Creates admin user if not found
   - Assigns Admin role
   - Logs success or failure

## Adding Custom Seed Data

### Option 1: Extend DatabaseSeeder

Add a new seeding method to `DatabaseSeeder.cs`:

```csharp
private async Task SeedProductCategoriesAsync()
{
    // Your seeding logic here
}
```

Then call it in `SeedAsync`:

```csharp
public async Task SeedAsync()
{
    await SeedRolesAsync();
    await SeedAdminUserAsync();
    await SeedProductCategoriesAsync(); // Add your method
}
```

### Option 2: Create Multiple Seeders

Create a dedicated seeder class:

```csharp
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
        if (!await _context.Products.AnyAsync())
        {
            var products = new List<Product>
            {
                new() { Name = "Product 1", Price = 10.99m },
                new() { Name = "Product 2", Price = 20.99m }
            };

            await _context.Products.AddRangeAsync(products);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Seeded {Count} products", products.Count);
        }
    }
}
```

Then call it in `Program.cs`:

```csharp
var productSeeder = new ProductSeeder(context, productSeederLogger);
await productSeeder.SeedAsync();
```

## Testing the Seeder

After running the application for the first time:

1. Check the logs for seeding confirmation:
   ```
   info: DatabaseSeeder[0]
         Role 'Admin' created successfully
   info: DatabaseSeeder[0]
         Role 'User' created successfully
   info: DatabaseSeeder[0]
         Admin user 'admin' created successfully with email 'admin@app.fr'
   ```

2. Test the admin login:
   ```bash
   curl -X POST https://localhost:7000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "usernameOrEmail": "admin",
       "password": "Azerty123!"
     }'
   ```

3. Verify in the database:
   ```sql
   -- Check roles
   SELECT * FROM "AspNetRoles";

   -- Check admin user
   SELECT * FROM "AspNetUsers" WHERE "Email" = 'admin@app.fr';

   -- Check user roles
   SELECT u."UserName", r."Name"
   FROM "AspNetUsers" u
   JOIN "AspNetUserRoles" ur ON u."Id" = ur."UserId"
   JOIN "AspNetRoles" r ON ur."RoleId" = r."Id";
   ```

## Changing Default Admin Credentials

**For Development:**

Edit `DatabaseSeeder.cs`:

```csharp
private async Task SeedAdminUserAsync()
{
    const string adminEmail = "your-email@domain.com";
    const string adminUserName = "yourusername";
    const string adminPassword = "YourPassword123!";

    // ... rest of the code
}
```

**For Production:**

Use environment variables:

```csharp
private async Task SeedAdminUserAsync()
{
    var adminEmail = _configuration["AdminUser:Email"] ?? "admin@app.fr";
    var adminUserName = _configuration["AdminUser:Username"] ?? "admin";
    var adminPassword = _configuration["AdminUser:Password"] ?? "Azerty123!";

    // ... rest of the code
}
```

Then set environment variables or add to `appsettings.Production.json`:

```json
{
  "AdminUser": {
    "Email": "admin@yourcompany.com",
    "Username": "superadmin",
    "Password": "YourSecurePassword123!"
  }
}
```

## Security Best Practices

1. **Change Default Credentials**: Always change the default admin password before deploying to production

2. **Use Environment Variables**: Store sensitive credentials in environment variables, not in code

3. **Force Password Change**: Consider requiring the admin to change their password on first login

4. **Disable Seeding in Production**: Add a flag to disable automatic seeding:

   ```csharp
   if (app.Environment.IsDevelopment())
   {
       using var scope = app.Services.CreateScope();
       var seeder = new DatabaseSeeder(...);
       await seeder.SeedAsync();
   }
   ```

5. **Audit Logging**: Log all admin activities for security auditing

## Troubleshooting

### Seeder Runs Multiple Times

The seeder is designed to be idempotent (safe to run multiple times). It checks if data exists before creating it.

### Admin User Already Exists

If you see "Admin user already exists" in logs, the admin was already created. To reset:

```sql
-- Delete admin user (be careful in production!)
DELETE FROM "AspNetUserRoles" WHERE "UserId" IN (
    SELECT "Id" FROM "AspNetUsers" WHERE "Email" = 'admin@app.fr'
);
DELETE FROM "AspNetUsers" WHERE "Email" = 'admin@app.fr';
```

Or use migrations to manage data.

### Seeding Fails

Check logs for specific error messages. Common issues:
- Database connection problems
- Password doesn't meet requirements
- Email format is invalid
- Role doesn't exist (ensure roles are seeded first)

## Example: Adding Sample Data Seeder

```csharp
public class SampleDataSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<SampleDataSeeder> _logger;

    public SampleDataSeeder(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        ILogger<SampleDataSeeder> logger)
    {
        _context = context;
        _userManager = userManager;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        // Only seed in development
        if (!_context.Products.Any())
        {
            await SeedProductsAsync();
        }

        if ((await _userManager.GetUsersInRoleAsync("User")).Count < 5)
        {
            await SeedTestUsersAsync();
        }
    }

    private async Task SeedProductsAsync()
    {
        var products = new List<Product>
        {
            new() { Name = "Laptop", Price = 999.99m },
            new() { Name = "Mouse", Price = 29.99m },
            new() { Name = "Keyboard", Price = 79.99m }
        };

        _context.Products.AddRange(products);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Seeded {Count} products", products.Count);
    }

    private async Task SeedTestUsersAsync()
    {
        for (int i = 1; i <= 5; i++)
        {
            var user = new ApplicationUser
            {
                UserName = $"user{i}",
                Email = $"user{i}@test.com",
                FirstName = $"Test{i}",
                LastName = "User",
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, "Test123!");
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User");
            }
        }

        _logger.LogInformation("Seeded 5 test users");
    }
}
```

Use it in `Program.cs`:

```csharp
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<SampleDataSeeder>>();

    var sampleSeeder = new SampleDataSeeder(context, userManager, logger);
    await sampleSeeder.SeedAsync();
}
```
