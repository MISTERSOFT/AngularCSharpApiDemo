# Angular & C# Asp.NET Core API Demo App

A full-stack **e-commerce application** combining **Angular 20** frontend with **ASP.NET Core 9** backend, featuring product management, shopping cart, admin dashboard, JWT authentication, PostgreSQL database, and Docker support.

## 📝 Project Summary

This is a **production-ready e-commerce starter** with:

- [x] **Complete Authentication System** - Registration, login, JWT tokens, role-based access
- [x] **Full E-Commerce Features** - Products, categories, cart, admin dashboard
- [x] **Modern Angular Architecture** - Signals, standalone components, guards, resolvers
- [x] **Clean Backend Design** - Controllers, services, DTOs, converters, health checks
- [x] **Database Management** - PostgreSQL, EF Core, migrations, seeding
- [x] **Responsive UI** - Tailwind CSS, reusable components, theme support
- [x] **Security Best Practices** - JWT authentication, CORS, input validation, authorization
- [x] **Developer Experience** - Hot reload, Docker Compose, comprehensive documentation
- [x] **Production Ready** - Health checks, Docker support, proper error handling

**Perfect for:**
- Learning full-stack development with Angular and .NET
- Starting a new e-commerce project
- Understanding modern web application architecture
- Reference implementation for best practices

## 📦 Tech Stack

### Backend
- **ASP.NET Core 9.0** - Web API framework
- **Entity Framework Core 9.0** - ORM for database access
- **PostgreSQL 17** - Relational database
- **ASP.NET Core Identity** - Authentication & user management
- **JWT Bearer Authentication** - Token-based security
- **Npgsql** - PostgreSQL provider for .NET
- **AspNetCore.HealthChecks** - Application health monitoring
- **OpenAPI/Swagger** - API documentation

### Frontend
- **Angular 20.3.10** - SPA framework
- **TypeScript 5.9.3** - Type-safe JavaScript
- **RxJS** - Reactive programming
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **ng-icons** - Icon library (Lucide icons)
- **tailwind-merge** - Utility for merging Tailwind classes

### DevOps & Tools
- **Docker & Docker Compose** - Containerization
- **PGAdmin 4** - PostgreSQL administration
- **OpenAPI/Swagger** - API documentation
- **Angular CLI** - Development tooling


## 📁 Project Architecture

### Backend (`AngularCSharpApiDemo.Server/`)

```
AngularCSharpApiDemo.Server/
├── Controllers/          # API endpoints
│   ├── AuthController.cs              # Authentication (register, login, me)
│   ├── ProductsController.cs          # Products CRUD & filtering
│   ├── CategoriesController.cs        # Categories CRUD
│   └── AdminDashboardController.cs    # Admin statistics
│
├── Data/                # Database context and seeding
│   ├── ApplicationDbContext.cs   # EF Core DbContext
│   ├── DatabaseSeeder.cs         # Seeds roles, admin user & sample data
│   ├── README_SEEDING.md         # Seeding documentation
│   └── SEEDING_APPROACHES.md     # Comparison of seeding methods
│
├── HealthChecks/        # Health monitoring
│   ├── DatabaseHealthCheck.cs    # Custom database health check
│   └── README_HEALTHCHECKS.md    # Health checks documentation
│
├── Models/              # Domain entities
│   ├── ApplicationUser.cs        # User entity (extends IdentityUser)
│   ├── Product.cs                # Product entity
│   ├── Category.cs               # Category entity
│   └── ProductImage.cs           # Product image entity
│
├── DTOs/                # Data Transfer Objects
│   ├── Auth/
│   │   ├── RegisterDto.cs        # Registration request
│   │   ├── LoginDto.cs           # Login request
│   │   ├── AuthResponseDto.cs    # Auth response with JWT token
│   │   └── UserDto.cs            # User information response
│   ├── Product/
│   │   ├── ProductDto.cs         # Product response
│   │   ├── CreateProductDto.cs   # Create product request
│   │   └── UpdateProductDto.cs   # Update product request
│   ├── Category/
│   │   ├── CategoryDto.cs        # Category response
│   │   ├── CreateCategoryDto.cs  # Create category request
│   │   └── UpdateCategoryDto.cs  # Update category request
│   ├── Converters/               # DTO conversion extensions
│   │   ├── ProductConverterExtensions.cs
│   │   ├── CategoryConverterExtensions.cs
│   │   └── ProductImageConverterExtensions.cs
│   ├── DashboardStatsDto.cs      # Dashboard statistics
│   ├── PagedResponse.cs          # Pagination response wrapper
│   └── ProductFilterParams.cs    # Product filtering parameters
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
│   ├── app/
│   │   ├── core/                    # Core functionality
│   │   │   ├── constants.ts         # App constants (storage keys)
│   │   │   ├── utils.ts             # Utility functions
│   │   │   ├── guards/              # Route guards
│   │   │   │   ├── admin-only.guard.ts    # Admin access guard
│   │   │   │   ├── deny-if-auth.guard.ts  # Prevent auth users
│   │   │   │   └── is-auth.guard.ts       # Require authentication
│   │   │   └── http/                # HTTP utilities
│   │   │       ├── abstract-base-api-service.ts
│   │   │       └── interceptors/
│   │   │           └── auth.interceptor.ts  # JWT token injection
│   │   │
│   │   ├── pages/                   # Application pages
│   │   │   ├── landing/             # Landing page
│   │   │   ├── signin/              # Sign in page
│   │   │   ├── signup/              # Sign up page
│   │   │   ├── products/            # Products listing & detail
│   │   │   │   ├── product-view/    # Product detail view
│   │   │   │   └── resolvers/       # Product resolver
│   │   │   ├── cart/                # Shopping cart
│   │   │   │   └── resolvers/       # Cart products resolver
│   │   │   ├── admin/               # Admin section
│   │   │   │   ├── admin.component  # Admin dashboard
│   │   │   │   ├── products/        # Product management
│   │   │   │   │   └── products-edit/  # Create/edit product
│   │   │   │   └── categories/      # Category management
│   │   │   │       └── categories-edit/  # Create/edit category
│   │   │   └── errors/
│   │   │       └── error404/        # 404 error page
│   │   │
│   │   ├── services/                # Business services
│   │   │   ├── auth.service.ts      # Authentication service
│   │   │   ├── products.service.ts  # Products API service
│   │   │   ├── categories.service.ts  # Categories API service
│   │   │   ├── cart.service.ts      # Shopping cart service
│   │   │   ├── admin-dashboard.service.ts  # Admin stats service
│   │   │   └── theme.service.ts     # UI theme service
│   │   │
│   │   ├── shared/                  # Shared components
│   │   │   ├── navbar/              # Navigation bar
│   │   │   ├── footer/              # Footer component
│   │   │   ├── admin-side-menu/     # Admin sidebar
│   │   │   └── ui/                  # Reusable UI components
│   │   │       ├── button/          # Button directive
│   │   │       ├── dropdown-menu/   # Dropdown component
│   │   │       ├── input/           # Input component
│   │   │       └── pagination/      # Pagination component
│   │   │
│   │   ├── types.ts                 # TypeScript type definitions
│   │   ├── app.component.ts         # Root component
│   │   ├── app.module.ts            # Root module
│   │   └── app-routing.module.ts    # Routing configuration
│   │
│   ├── main.ts                      # Application entry point
│   └── proxy.conf.js                # Proxy to backend API
│
├── angular.json                     # Angular CLI configuration
├── package.json                     # NPM dependencies
├── tsconfig.json                    # TypeScript configuration
└── tailwind.config.js               # Tailwind CSS configuration
```

**Frontend Architecture Highlights:**
- **Pages**: Organized by feature (products, cart, admin, auth)
- **Services**: API communication and state management
- **Guards**: Route protection and access control
- **Shared Components**: Reusable UI components
- **Resolvers**: Data pre-loading before route activation
- **Signals**: Reactive state management (Angular 20)

## 🏁 Quick Start

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 20+](https://nodejs.org/)
- [Docker](https://www.docker.com/)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd AngularCSharpApiDemo

# Start PostgreSQL and PGAdmin with Docker
docker-compose -f docker-compose.development.yml up -d
```

### 2. Configure Database

The application uses PostgreSQL. Connection strings are in:
- `appsettings.Development.json` (development)
- `appsettings.json` (production)

**Default connection:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=angularcsharpapidemo;Username=root;Password=root"
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

```bash
cd AngularCSharpApiDemo.Server
dotnet run --launch-profile "https"
```

The application will:
- Automatically create **Admin** and **User** roles
- Seed a defa ult admin user (see below)
- Apply pending migrations (if configured)

### 5. Access the Application

> NOTE: Frontend will run on port `55428` but you can access the API by using the `/api` in the URL. Config in the `src/proxy.conf.js` file. If the app don't run on port `55428` check out the console.

- **Frontend**: https://localhost:55428
- **Backend API**: https://localhost:7041 (check console for actual port)
- **OpenAPI**: https://localhost:7041/openapi/v1.json (in development)
- **Swagger**: https://localhost:7041/swagger/index.html (in development)
- **PGAdmin**: http://localhost:5050 (Docker container PgAdmin needs to be running)
- **Health Checks**:
  - Complete status: https://localhost:7041/health
  - Liveness probe: https://localhost:7041/health/live
  - Readiness probe: https://localhost:7041/health/ready

## 🔐 Authentication

### Default Admin Credentials

A default admin user is automatically created on first run:

- **Email**: `admin@app.fr`
- **Username**: `admin`
- **Password**: `Azerty123!`


## 🛍️ E-Commerce Features

### Product Management

The application includes a complete product management system with:
- **Product Catalog**: Browse products with pagination and filtering
- **Product Details**: View detailed product information with image gallery
- **Admin CRUD**: Create, update, and delete products (admin only)
- **Categories**: Organize products by categories
- **Product Images**: Multiple images per product
- **Pricing**: Support for price display with discounts

### Shopping Cart

- **Add to Cart**: Add products from product detail page
- **Cart Management**: Update quantities, remove items
- **Persistence**: Cart stored in localStorage
- **Cart Count**: Real-time cart item count in navbar
- **Protected Route**: Cart accessible only to authenticated users

### Admin Dashboard

Admins have access to a dedicated dashboard with:
- **Statistics**: View total products and categories count
- **Product Management**: Full CRUD operations for products
- **Category Management**: Full CRUD operations for categories
- **Theme Support**: Special admin theme for better UX

### Frontend Routes

```
+------------------------------+-----------------------+---------------------+--------------+
|            Route             |       Component       |     Description     |    Guard     |
+------------------------------+-----------------------+---------------------+--------------+
|  `/`                         |  Landing              |  Landing page       |  None        |
|  `/signin`                   |  SignIn               |  User login         |  DenyIfAuth  |
|  `/signup`                   |  SignUp               |  User registration  |  DenyIfAuth  |
|  `/products`                 |  Products             |  Product listing    |  None        |
|  `/products/:id`             |  ProductView          |  Product details    |  None        |
|  `/cart`                     |  Cart                 |  Shopping cart      |  IsAuth      |
|  `/admin`                    |  Admin                |  Admin dashboard    |  AdminOnly   |
|  `/admin/products`           |  AdminProducts        |  Manage products    |  AdminOnly   |
|  `/admin/products/create`    |  AdminProductsEdit    |  Create product     |  AdminOnly   |
|  `/admin/products/:id`       |  AdminProductsEdit    |  Edit product       |  AdminOnly   |
|  `/admin/categories`         |  AdminCategories      |  Manage categories  |  AdminOnly   |
|  `/admin/categories/create`  |  AdminCategoriesEdit  |  Create category    |  AdminOnly   |
|  `/admin/categories/:id`     |  AdminCategoriesEdit  |  Edit category      |  AdminOnly   |
|  `/404`                      |  Error404             |  Not found page     |  None        |
+------------------------------+-----------------------+---------------------+--------------+
```


## 🗄️ Database

### PostgreSQL with Docker

Docker Compose provides:
- **PostgreSQL 17** on port `5432`
- **PGAdmin** on port `5050`

**PGAdmin Login:**
- Email: `root@root.com`
- Password: `root`

**PostgreSQL Connection in PGAdmin:**
- Host: `postgres` (from container) or `localhost` (from host)
- Port: `5432`
- Database: `angularcsharpapidemo`
- Username: `root`
- Password: `root`

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
3. **Categories**: Sample product categories (Electronics, Clothing, Books, etc.)
4. **Products**: Sample products with images and pricing

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
// Data/DatabaseSeeder.cs
public class DatabaseSeeder
{
    public async Task SeedAsync()
    {
        // ...
        await SeedTagsAsync()
    }

    public async Tag SeedTagsAsync()
    {
        // Add tags in database
    }
}
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
        // Update the port "55428" is necessary
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

1. Ensure database is running
2. Check connection string
3. Try building first: `dotnet build` then `dotnet ef database update`


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

1. **Order Management** - Complete checkout and order processing
2. **Payment Integration** - Stripe, PayPal, etc.
3. **Refresh Tokens** - For better security and UX
4. **Email Verification** - Verify user email addresses
5. **Password Reset** - Forgot password functionality
6. **Two-Factor Authentication (2FA)** - Additional security layer
7. **User Profile Management** - Update user information
8. **Product Reviews & Ratings** - Customer feedback system
9. **Wishlist** - Save products for later
10. **Search Optimization** - Full-text search with ElasticSearch
11. **Audit Logging** - Track user actions
12. **API Versioning** - Version your API endpoints
13. **Rate Limiting** - Prevent abuse
14. **Background Jobs** - Using Hangfire for order processing
15. **Caching** - Redis for product catalog


## Resources

- **UI blocks inspiration**: https://prebuiltui.com/components