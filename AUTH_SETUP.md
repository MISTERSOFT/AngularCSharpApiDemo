# JWT Authentication Setup Guide

This document explains the JWT authentication system and how to work with models, migrations, and DTOs in this project.

## Overview

The project now includes:
- **JWT Authentication** with ASP.NET Core Identity
- **PostgreSQL** database with Entity Framework Core
- **Clean architecture** with organized folder structure
- **Docker Compose** setup for PostgreSQL and PGAdmin

## Project Structure

```
AngularCSharpApiDemo.Server/
├── Controllers/
│   ├── AuthController.cs       # Authentication endpoints
│   └── WeatherForecastController.cs
├── Data/
│   ├── ApplicationDbContext.cs # EF Core DbContext
│   └── DatabaseSeeder.cs       # Database seeding (roles & admin)
├── Models/
│   └── ApplicationUser.cs      # User entity
├── DTOs/
│   ├── RegisterDto.cs          # Registration request
│   ├── LoginDto.cs             # Login request
│   ├── AuthResponseDto.cs      # Auth response with JWT
│   └── UserDto.cs              # User information
├── Services/
│   └── JwtService.cs           # JWT token generation
├── Interfaces/
│   └── IJwtService.cs          # JWT service interface
└── Migrations/
    └── [Generated migration files]
```

## Getting Started

### 1. Start PostgreSQL and PGAdmin

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL** on port 5432
- **PGAdmin** on port 5050 (http://localhost:5050)

PGAdmin credentials:
- Email: `admin@admin.com`
- Password: `admin`

### 2. Apply Database Migrations

```bash
cd AngularCSharpApiDemo.Server
dotnet ef database update
```

This creates all necessary tables including ASP.NET Identity tables and your custom ApplicationUser table.

### 3. Run the Application

```bash
dotnet run
```

The application will automatically:
- Create Admin and User roles
- Seed a default admin user

**Default Admin Credentials:**
- Email: `admin@app.fr`
- Username: `admin`
- Password: `Azerty123!`

You can login immediately with these credentials to access admin features.

> **Note**: For production, change these credentials in the `DatabaseSeeder.cs` file or use environment variables. See `Data/README_SEEDING.md` for details.

## Authentication Endpoints

### Register a New User

**POST** `/api/auth/register`

Request body:
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "johndoe",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "expiresAt": "2025-11-08T18:30:00Z"
}
```

### Login

**POST** `/api/auth/login`

Request body:
```json
{
  "usernameOrEmail": "johndoe",
  "password": "Password123"
}
```

Response: Same as registration

### Get Current User

**GET** `/api/auth/me`

Headers:
```
Authorization: Bearer {your-jwt-token}
```

Response:
```json
{
  "id": "user-id-guid",
  "username": "johndoe",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2025-11-08T12:00:00Z"
}
```

## Working with Models, Migrations, and DTOs

### Creating a New Model

1. **Create the model class** in `Models/` folder:

```csharp
namespace AngularCSharpApiDemo.Server.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

2. **Add DbSet to ApplicationDbContext**:

```csharp
// In Data/ApplicationDbContext.cs
public DbSet<Product> Products { get; set; }
```

3. **Configure the model** (optional) in `OnModelCreating`:

```csharp
builder.Entity<Product>(entity =>
{
    entity.HasKey(e => e.Id);
    entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
    entity.Property(e => e.Price).HasPrecision(18, 2);
});
```

### Creating a Migration

```bash
cd AngularCSharpApiDemo.Server
dotnet ef migrations add AddProductTable
```

### Applying Migrations

```bash
dotnet ef database update
```

### Reverting a Migration

```bash
# Remove the last migration (if not yet applied)
dotnet ef migrations remove

# Revert to a specific migration
dotnet ef database update PreviousMigrationName
```

### Creating DTOs

1. **Create a DTO** in `DTOs/` folder:

```csharp
using System.ComponentModel.DataAnnotations;

namespace AngularCSharpApiDemo.Server.DTOs;

public class CreateProductDto
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
    public string Name { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }
}

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

2. **Use DTOs in controllers**:

```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Price = dto.Price
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return Ok(new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            CreatedAt = product.CreatedAt
        });
    }
}
```

## JWT Configuration

JWT settings are in `appsettings.json` and `appsettings.Development.json`:

```json
{
  "JwtSettings": {
    "SecretKey": "Your-Secret-Key-At-Least-32-Characters",
    "Issuer": "AngularCSharpApiDemo",
    "Audience": "AngularCSharpApiDemo.Client",
    "ExpiryInMinutes": "60"
  }
}
```

**Security Note**:
- For production, use environment variables or Azure Key Vault for the secret key
- Never commit production secrets to version control
- The secret key should be at least 32 characters long

## Password Requirements

Current password policy:
- Minimum length: 6 characters
- Requires at least one digit
- Requires at least one lowercase letter
- Requires at least one uppercase letter
- No special characters required

You can modify these in `Program.cs`:

```csharp
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
})
```

## User Roles

Two roles are automatically created:
- **Admin**: For administrative users
- **User**: Default role for new registrations

### Protecting Endpoints with Roles

```csharp
[Authorize(Roles = "Admin")]
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteProduct(int id)
{
    // Only admins can delete
}

[Authorize] // Any authenticated user
[HttpGet]
public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
{
    // Any logged-in user can view
}
```

## Database Connection

Connection string is configured in `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=angularcsharpapidemo;Username=root;Password=root"
  }
}
```

Make sure this matches your Docker Compose PostgreSQL configuration.

## Useful Commands

### EF Core Commands

```bash
# Install EF tools globally (one-time)
dotnet tool install --global dotnet-ef

# Create a new migration
dotnet ef migrations add MigrationName

# Apply migrations
dotnet ef database update

# Revert to specific migration
dotnet ef database update MigrationName

# Remove last migration (not yet applied)
dotnet ef migrations remove

# Generate SQL script
dotnet ef migrations script

# Drop database
dotnet ef database drop
```

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f postgres

# Restart services
docker-compose restart
```

## Testing with Swagger/OpenAPI

The application includes OpenAPI support. When running in development mode:

1. Navigate to the OpenAPI endpoint (check console output for URL)
2. Test authentication endpoints
3. Copy the JWT token from the response
4. Click "Authorize" button in Swagger UI
5. Enter: `Bearer {your-token}`
6. Test protected endpoints

## Best Practices

### Models
- Keep models simple and focused on data structure
- Use data annotations for basic validation
- Configure complex relationships in `OnModelCreating`

### DTOs
- Always use DTOs for API requests/responses
- Never expose internal models directly
- Use data annotations for validation
- Create separate DTOs for Create, Update, and Read operations

### Migrations
- Create descriptive migration names: `AddProductTable`, `UpdateUserEmailIndex`
- Review generated migrations before applying
- Test migrations on a separate database first
- Always keep migrations in version control

### Security
- Store sensitive configuration in environment variables
- Use HTTPS in production
- Implement rate limiting for auth endpoints
- Log authentication failures
- Implement refresh tokens for long-lived sessions

## Troubleshooting

### Cannot connect to PostgreSQL
- Ensure Docker is running: `docker ps`
- Check PostgreSQL logs: `docker-compose logs postgres`
- Verify connection string matches Docker configuration

### Migration fails
- Ensure database is running
- Check connection string
- Verify you're in the Server project directory
- Run `dotnet build` first to ensure project compiles

### JWT validation fails
- Verify token hasn't expired
- Check SecretKey matches between token generation and validation
- Ensure Issuer and Audience match configuration

## Next Steps

1. **Implement Refresh Tokens**: Add refresh token functionality for better security
2. **Add Email Verification**: Send verification emails on registration
3. **Password Reset**: Implement forgot password functionality
4. **Two-Factor Authentication**: Add 2FA support
5. **Audit Logging**: Track user actions and changes
6. **Role Management**: Create endpoints to manage user roles

## Additional Resources

- [ASP.NET Core Identity Documentation](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity)
- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
