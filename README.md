# AngularCSharpApiDemo

A full-stack web application template combining **Angular 20** frontend with **ASP.NET Core 9** backend, featuring JWT authentication, PostgreSQL database, and Docker support.

## 🚀 Features

- ✅ **JWT Authentication** with ASP.NET Core Identity
- ✅ **PostgreSQL** database with Entity Framework Core 9
- ✅ **Docker Compose** for PostgreSQL and PGAdmin
- ✅ **Role-based Authorization** (Admin, User)
- ✅ **Automatic Database Seeding** with default admin user
- ✅ **Health Checks** with Kubernetes-ready probes
- ✅ **Clean Architecture** with organized folder structure
- ✅ **OpenAPI/Swagger** documentation
- ✅ **CORS** configured for Angular development
- ✅ **Production-ready** Docker multi-stage builds

## 📁 Project Architecture

### Backend (`AngularCSharpApiDemo.Server/`)

```
AngularCSharpApiDemo.Server/
├── Controllers/          # API endpoints
│   ├── AuthController.cs         # Authentication (register, login, me)
│   └── WeatherForecastController.cs
│
├── Data/                # Database context and seeding
│   ├── ApplicationDbContext.cs   # EF Core DbContext
│   ├── DatabaseSeeder.cs         # Seeds roles & admin user
│   ├── README_SEEDING.md         # Seeding documentation
│   └── SEEDING_APPROACHES.md     # Comparison of seeding methods
│
├── HealthChecks/        # Health monitoring
│   ├── DatabaseHealthCheck.cs    # Custom database health check
│   └── README_HEALTHCHECKS.md    # Health checks documentation
│
├── Models/              # Domain entities
│   └── ApplicationUser.cs        # User entity (extends IdentityUser)
│
├── DTOs/                # Data Transfer Objects
│   ├── RegisterDto.cs            # Registration request
│   ├── LoginDto.cs               # Login request
│   ├── AuthResponseDto.cs        # Auth response with JWT token
│   └── UserDto.cs                # User information response
│
├── Services/            # Business logic
│   └── JwtService.cs             # JWT token generation & validation
│
├── Interfaces/          # Service contracts
│   └── IJwtService.cs
│
├── Extensions/          # Extension methods
│   └── DatabaseSeedingExtensions.cs  # Database seeding helpers
│
└── Migrations/          # EF Core migrations
    └── [Auto-generated migration files]
```

**Purpose of Each Folder:**
- **Controllers**: Handle HTTP requests and return responses
- **Data**: Database configuration, context, and seeding logic
- **HealthChecks**: Application health monitoring and probes
- **Models**: Database entities (tables structure)
- **DTOs**: Objects for API input/output (never expose entities directly)
- **Services**: Business logic separated from controllers
- **Interfaces**: Contracts for dependency injection
- **Extensions**: Reusable extension methods
- **Migrations**: Database schema version control

### Frontend (`angularcsharpapidemo.client/`)

```
angularcsharpapidemo.client/
├── src/
│   ├── app/                 # Angular application
│   │   ├── app.component.ts       # Root component
│   │   ├── app.module.ts          # Root module
│   │   └── app-routing.module.ts  # Routing configuration
│   ├── main.ts              # Application entry point
│   └── proxy.conf.js        # Proxy to backend API
├── angular.json             # Angular CLI configuration
├── package.json             # NPM dependencies
└── tsconfig.json            # TypeScript configuration
```

## 🏁 Quick Start

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd AngularCSharpApiDemo

# Start PostgreSQL and PGAdmin with Docker
docker-compose up -d
```

### 2. Configure Database

The application uses PostgreSQL. Connection strings are in:
- `appsettings.Development.json` (development)
- `appsettings.json` (production)

**Default connection:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=angularcsharpapidemo;Username=admin;Password=admin"
  }
}
```

### 3. Run Database Migrations

```bash
cd AngularCSharpApiDemo.Server

# Install EF Core tools (first time only)
dotnet tool install --global dotnet-ef

# Apply migrations (creates database and tables)
dotnet ef database update
```

### 4. Run the Application

**Backend:**
```bash
cd AngularCSharpApiDemo.Server
dotnet run
```

**Frontend:**
```bash
cd angularcsharpapidemo.client
npm install
npm start
```

The application will:
- Automatically create **Admin** and **User** roles
- Seed a default admin user (see below)
- Apply pending migrations (if configured)

### 5. Access the Application

- **Frontend**: https://localhost:55428
- **Backend API**: https://localhost:7000 (check console for actual port)
- **Swagger/OpenAPI**: https://localhost:7000/openapi/v1.json (in development)
- **PGAdmin**: http://localhost:5050 (Docker container PgAdmin needs to be running)
- **Health Checks**:
  - Complete status: https://localhost:7000/health
  - Liveness probe: https://localhost:7000/health/live
  - Readiness probe: https://localhost:7000/health/ready

## 🔐 Authentication

### Default Admin Credentials

A default admin user is automatically created on first run:

- **Email**: `admin@app.fr`
- **Username**: `admin`
- **Password**: `Azerty123!`

**⚠️ Security Warning**: Change these credentials before deploying to production!

### Authentication Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/register` | POST | Register new user | No |
| `/api/auth/login` | POST | Login and get JWT token | No |
| `/api/auth/me` | GET | Get current user info | Yes |

### Example: Register a User

```bash
curl -X POST https://localhost:7000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "johndoe",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "expiresAt": "2025-11-09T18:30:00Z"
}
```

### Example: Login

```bash
curl -X POST https://localhost:7000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "admin",
    "password": "Azerty123!"
  }'
```

### Using JWT Token

Include the token in the `Authorization` header:

```bash
curl -X GET https://localhost:7000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🗄️ Database

### PostgreSQL with Docker

Docker Compose provides:
- **PostgreSQL 17** on port `5432`
- **PGAdmin** on port `5050`

**PGAdmin Login:**
- Email: `admin@admin.com`
- Password: `admin`

**PostgreSQL Connection in PGAdmin:**
- Host: `postgres` (from container) or `localhost` (from host)
- Port: `5432`
- Database: `angularcsharpapidemo`
- Username: `postgres`
- Password: `postgres`

### Working with Migrations

```bash
# Create a new migration
dotnet ef migrations add MigrationName

# Apply migrations to database
dotnet ef database update

# Revert to a specific migration
dotnet ef database update PreviousMigrationName

# Remove last migration (if not applied)
dotnet ef migrations remove

# Generate SQL script
dotnet ef migrations script

# Drop database
dotnet ef database drop
```

## 🌱 Database Seeding

The application uses a **dedicated seeding system** that runs automatically at startup.

### What Gets Seeded?

1. **Roles**: `Admin` and `User`
2. **Admin User**: Default admin account (see credentials above)

### Seeding Approach

The project uses an **extension method approach** for maximum flexibility:

```csharp
// Program.cs
var app = builder.Build();

await app.MigrateDatabaseAsync(true);  // Auto-apply migrations
await app.SeedDatabaseAsync();         // Seed roles & admin user
```

**Benefits:**
- ✅ Full access to UserManager/RoleManager
- ✅ Proper password hashing
- ✅ Clean, maintainable code
- ✅ Idempotent (safe to run multiple times)
- ✅ Extensible for additional seeders

### Adding Custom Seed Data

See `AngularCSharpApiDemo.Server/Data/README_SEEDING.md` for detailed instructions.

**Quick example:**

```csharp
// Data/ProductSeeder.cs
public class ProductSeeder
{
    public async Task SeedAsync()
    {
        if (!await _context.Products.AnyAsync())
        {
            await _context.Products.AddRangeAsync(
                new Product { Name = "Laptop", Price = 999.99m },
                new Product { Name = "Mouse", Price = 29.99m }
            );
            await _context.SaveChangesAsync();
        }
    }
}

// Program.cs
await app.SeedDatabaseAsync();    // Default seeding
await app.SeedProductsAsync();    // Custom seeding
```

## 🏥 Health Checks

The application includes a comprehensive health checks system for monitoring application health and readiness.

### Health Check Endpoints

| Endpoint | Purpose | Use Case |
|----------|---------|----------|
| `/health` | Complete health status | General monitoring, detailed diagnostics |
| `/health/live` | Liveness probe | Kubernetes/Docker container restarts |
| `/health/ready` | Readiness probe | Kubernetes/Docker traffic routing |

### What Gets Checked?

1. **Self Check** - Verifies the API is running
2. **PostgreSQL Connection** - Checks database connectivity
3. **Database Migrations** - Detects pending migrations

### Health Status Responses

**Healthy** (HTTP 200):
```json
{
  "status": "Healthy",
  "totalDuration": "00:00:00.1234567",
  "entries": {
    "self": {
      "status": "Healthy",
      "description": "API is running"
    },
    "PostgreSQL": {
      "status": "Healthy"
    },
    "Database Migrations": {
      "status": "Healthy",
      "description": "Database is healthy",
      "data": {
        "provider": "PostgreSQL",
        "database": "angularcsharpapidemo"
      }
    }
  }
}
```

**Degraded** (HTTP 200) - Database has pending migrations:
```json
{
  "status": "Degraded",
  "entries": {
    "Database Migrations": {
      "status": "Degraded",
      "description": "Database has 2 pending migration(s)"
    }
  }
}
```

**Unhealthy** (HTTP 503) - Cannot connect to database:
```json
{
  "status": "Unhealthy",
  "entries": {
    "PostgreSQL": {
      "status": "Unhealthy",
      "description": "Failed to connect to database"
    }
  }
}
```

### Testing Health Checks

```bash
# Check overall health
curl https://localhost:7000/health | jq

# Check liveness (is the app alive?)
curl https://localhost:7000/health/live | jq

# Check readiness (is the app ready to serve traffic?)
curl https://localhost:7000/health/ready | jq
```

### Docker/Kubernetes Integration

**Dockerfile HEALTHCHECK:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health/live || exit 1
```

**Kubernetes Deployment:**
```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 30

readinessProbe:
  httpGet:
    path: /health/ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10
```

For detailed health checks documentation, see **[HealthChecks/README_HEALTHCHECKS.md](AngularCSharpApiDemo.Server/HealthChecks/README_HEALTHCHECKS.md)**.

## 🛠️ Development Workflow

### Creating a New API Endpoint

1. **Create a Model** (`Models/Product.cs`):
```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}
```

2. **Add DbSet** (`Data/ApplicationDbContext.cs`):
```csharp
public DbSet<Product> Products { get; set; }
```

3. **Create Migration**:
```bash
dotnet ef migrations add AddProductTable
dotnet ef database update
```

4. **Create DTOs** (`DTOs/CreateProductDto.cs`):
```csharp
public class CreateProductDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }
}
```

5. **Create Controller** (`Controllers/ProductsController.cs`):
```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = "Admin")]  // Only admins can create
    public async Task<ActionResult<ProductDto>> Create(CreateProductDto dto)
    {
        // Implementation
    }
}
```

### Role-Based Authorization

```csharp
[Authorize]                    // Any authenticated user
[Authorize(Roles = "Admin")]   // Admin only
[Authorize(Roles = "Admin,User")] // Admin OR User
```

## 🔧 Configuration

### JWT Settings

Configure in `appsettings.json`:

```json
{
  "JwtSettings": {
    "SecretKey": "YOUR_SECRET_KEY_AT_LEAST_32_CHARACTERS",
    "Issuer": "AngularCSharpApiDemo",
    "Audience": "AngularCSharpApiDemo.Client",
    "ExpiryInMinutes": "60"
  }
}
```

**Production**: Use environment variables or Azure Key Vault for the secret key.

### CORS Settings

Configured in `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("https://localhost:55428", "http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
```

## 🐳 Docker

### Development (Database Only)

```bash
docker-compose -f docker-compose.development.yml up -d      # Start PostgreSQL & PGAdmin
docker-compose down       # Stop services
docker-compose logs -f    # View logs
```

### Production Build

Multi-stage Dockerfile included for production deployment:

```bash
docker build -f AngularCSharpApiDemo.Server/Dockerfile -t angularcsharpapidemo .
docker run -p 8080:8080 angularcsharpapidemo
```

## 📚 Documentation

Detailed documentation is available in:

- **[AUTH_SETUP.md](AUTH_SETUP.md)** - Complete authentication guide
  - JWT configuration
  - Password policies
  - Creating models, migrations, DTOs
  - API endpoint examples
  - Testing with Swagger
  - Troubleshooting

- **[HealthChecks/README_HEALTHCHECKS.md](AngularCSharpApiDemo.Server/HealthChecks/README_HEALTHCHECKS.md)** - Health checks system
  - Endpoint descriptions with response examples
  - Docker/Kubernetes integration
  - Monitoring and alerting setup
  - Custom health checks creation
  - Testing and troubleshooting

- **[Data/SEEDING_APPROACHES.md](AngularCSharpApiDemo.Server/Data/SEEDING_APPROACHES.md)** - Database seeding comparison
  - Extension method vs UseSeeding vs ModelBuilder
  - When to use each approach
  - Performance and flexibility comparison
  - Migration guide

- **[Data/README_SEEDING.md](AngularCSharpApiDemo.Server/Data/README_SEEDING.md)** - Seeding how-to guide
  - Adding custom seed data
  - Changing admin credentials
  - Security best practices
  - Troubleshooting seeding issues

## 🧪 Testing

### Frontend Tests

```bash
cd angularcsharpapidemo.client

# Run tests (watch mode)
npm test

# Single run (for CI)
ng test --watch=false --browsers=ChromeHeadless

# With coverage
ng test --code-coverage
```

### Backend Tests

Add your tests in a separate test project:

```bash
dotnet new xunit -n AngularCSharpApiDemo.Tests
```

## 📋 Useful Commands

### .NET Commands

```bash
dotnet build                    # Build project
dotnet run                      # Run application
dotnet clean                    # Clean build artifacts
dotnet restore                  # Restore dependencies
```

### Angular Commands

```bash
npm start                       # Start dev server
npm run build                   # Build for production
ng generate component name      # Generate component
ng generate service name        # Generate service
```

### Docker Commands

```bash
docker-compose up -d            # Start in background
docker-compose down             # Stop and remove containers
docker-compose ps               # List containers
docker-compose logs -f postgres # Follow PostgreSQL logs
docker-compose restart          # Restart services
```

### EF Core Commands

```bash
dotnet ef migrations add Name   # Create migration
dotnet ef database update       # Apply migrations
dotnet ef migrations remove     # Remove last migration
dotnet ef database drop         # Drop database
dotnet ef migrations script     # Generate SQL script
```

## 🔒 Security Best Practices

1. **Change Default Credentials**: Update admin password in production
2. **Environment Variables**: Store secrets in env vars, not code
3. **HTTPS Only**: Use HTTPS in production
4. **JWT Secret**: Use a strong, random secret key (32+ characters)
5. **CORS**: Restrict origins in production
6. **Rate Limiting**: Implement rate limiting for auth endpoints
7. **Input Validation**: Always validate user input with DTOs
8. **SQL Injection**: Use parameterized queries (EF Core does this)
9. **Password Policy**: Enforce strong passwords
10. **Audit Logging**: Log authentication events

## 🚧 Troubleshooting

### Cannot Connect to PostgreSQL

```bash
# Check if Docker is running
docker ps

# Check PostgreSQL logs
docker-compose logs postgres

# Verify connection string
cat AngularCSharpApiDemo.Server/appsettings.Development.json
```

### Migration Fails

```bash
# Ensure database is running
docker-compose ps

# Check connection string
# Verify you're in correct directory
cd AngularCSharpApiDemo.Server

# Try building first
dotnet build
dotnet ef database update
```

### JWT Token Invalid

- Check token hasn't expired (default: 60 minutes)
- Verify SecretKey matches in appsettings
- Ensure Issuer and Audience are correct
- Check Authorization header format: `Bearer {token}`

### CORS Errors

- Verify frontend URL is in CORS policy
- Check request includes credentials
- Ensure API is running on correct port

## 🎯 Next Steps

After setup, consider implementing:

1. **Refresh Tokens** - For better security and UX
2. **Email Verification** - Verify user email addresses
3. **Password Reset** - Forgot password functionality
4. **Two-Factor Authentication (2FA)** - Additional security layer
5. **User Profile Management** - Update user information
6. **Audit Logging** - Track user actions
7. **API Versioning** - Version your API endpoints
8. **Rate Limiting** - Prevent abuse
9. **Background Jobs** - Using Hangfire or similar
10. **Caching** - Redis or in-memory caching

## 📦 Tech Stack

### Backend
- ASP.NET Core 9.0
- Entity Framework Core 9.0
- PostgreSQL 17
- ASP.NET Core Identity
- JWT Bearer Authentication
- Npgsql (PostgreSQL provider)
- AspNetCore.HealthChecks (NpgSql, UI.Client)

### Frontend
- Angular 20.3.10
- TypeScript 5.9.3
- RxJS
- Angular Build (Vite-based)

### DevOps
- Docker & Docker Compose
- PGAdmin 4
- OpenAPI/Swagger
