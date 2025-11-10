# Health Checks System

## Overview

This project implements a comprehensive health checks system using ASP.NET Core Health Checks to monitor the application's health and readiness.

## 🏥 Health Check Endpoints

The application exposes three health check endpoints:

### 1. `/health` - Complete Health Status

Returns the overall health of all configured health checks.

**URL**: `GET /health`

**Response Example** (Healthy):
```json
{
  "status": "Healthy",
  "totalDuration": "00:00:00.1234567",
  "entries": {
    "self": {
      "status": "Healthy",
      "description": "API is running",
      "duration": "00:00:00.0001"
    },
    "PostgreSQL": {
      "status": "Healthy",
      "description": null,
      "duration": "00:00:00.0123"
    },
    "Database Migrations": {
      "status": "Healthy",
      "description": "Database is healthy",
      "duration": "00:00:00.0456",
      "data": {
        "provider": "PostgreSQL",
        "database": "angularcsharpapidemo"
      }
    }
  }
}
```

**Response Example** (Unhealthy):
```json
{
  "status": "Unhealthy",
  "totalDuration": "00:00:00.1234567",
  "entries": {
    "PostgreSQL": {
      "status": "Unhealthy",
      "description": "Failed to connect to database",
      "exception": "Npgsql.NpgsqlException: ...",
      "duration": "00:00:00.0123"
    }
  }
}
```

### 2. `/health/live` - Liveness Probe

Checks if the application is alive and running. Used by container orchestrators (Kubernetes, Docker) to determine if the container needs to be restarted.

**URL**: `GET /health/live`

**Checks**:
- Self check (API is running)

**Use Case**: Kubernetes liveness probe configuration

### 3. `/health/ready` - Readiness Probe

Checks if the application is ready to serve traffic (database connections, migrations, etc.).

**URL**: `GET /health/ready`

**Checks**:
- PostgreSQL connection
- Database migrations status

**Use Case**: Kubernetes readiness probe configuration

## 📦 Configured Health Checks

### 1. Self Check
**Name**: `self`
**Type**: Basic
**Purpose**: Verifies the API is running
**Tags**: `self`

### 2. PostgreSQL Connection
**Name**: `PostgreSQL`
**Type**: Database (Npgsql)
**Purpose**: Verifies PostgreSQL database connectivity
**Tags**: `database`, `postgresql`, `ready`
**Status**:
- ✅ `Healthy`: Can connect to database
- ❌ `Unhealthy`: Cannot connect to database

### 3. Database Migrations
**Name**: `Database Migrations`
**Type**: Custom (DatabaseHealthCheck)
**Purpose**: Checks database connection and pending migrations
**Tags**: `database`, `migrations`
**Status**:
- ✅ `Healthy`: Database is connected, no pending migrations
- ⚠️ `Degraded`: Database is connected, but has pending migrations
- ❌ `Unhealthy`: Cannot connect to database

## 🔧 Configuration

### Adding New Health Checks

#### Built-in Health Checks

ASP.NET Core provides many built-in health checks:

```csharp
// In Program.cs
builder.Services.AddHealthChecks()
    // Redis
    .AddRedis("redis-connection-string", name: "Redis")

    // SQL Server
    .AddSqlServer("sql-connection-string", name: "SQL Server")

    // HTTP endpoint
    .AddUrlGroup(new Uri("https://api.example.com"), name: "External API")

    // Memory usage
    .AddPrivateMemoryHealthCheck(1024 * 1024 * 1024, name: "Memory Check") // 1GB

    // Disk storage
    .AddDiskStorageHealthCheck(s =>
        s.AddDrive(@"C:\", minimumFreeMegabytes: 1024), // 1GB free
        name: "Disk Storage");
```

#### Custom Health Check

Create a class implementing `IHealthCheck`:

```csharp
using Microsoft.Extensions.Diagnostics.HealthChecks;

public class CustomHealthCheck : IHealthCheck
{
    private readonly ILogger<CustomHealthCheck> _logger;

    public CustomHealthCheck(ILogger<CustomHealthCheck> logger)
    {
        _logger = logger;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Your custom health check logic here
            var isHealthy = true; // Replace with actual check

            if (!isHealthy)
            {
                return HealthCheckResult.Unhealthy("Custom check failed");
            }

            return HealthCheckResult.Healthy("Custom check passed",
                data: new Dictionary<string, object>
                {
                    { "customData", "value" }
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Custom health check failed");
            return HealthCheckResult.Unhealthy("Error during health check", ex);
        }
    }
}
```

Register it:
```csharp
builder.Services.AddHealthChecks()
    .AddCheck<CustomHealthCheck>("Custom Check",
        tags: new[] { "custom", "ready" });
```

## 🐳 Docker & Kubernetes Integration

### Dockerfile Health Check

Add to your `Dockerfile`:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health/live || exit 1
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: angularcsharpapidemo-server
spec:
  template:
    spec:
      containers:
      - name: server
        image: angularcsharpapidemo-server:latest
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 30
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
          timeoutSeconds: 3
          failureThreshold: 3
```

### Docker Compose Health Check

Update `docker-compose.yml`:

```yaml
services:
  server:
    image: angularcsharpapidemo-server
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health/live"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
```

## 📊 Monitoring & Alerting

### Prometheus Integration

Install package:
```bash
dotnet add package AspNetCore.HealthChecks.Publisher.Prometheus
```

Configure:
```csharp
builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy())
    .ForwardToPrometheus();
```

### Application Insights

```csharp
builder.Services.AddHealthChecks()
    .AddApplicationInsightsPublisher();
```

### Custom Monitoring

Poll the `/health` endpoint from your monitoring system:

```bash
# Check health status
curl http://localhost:8080/health

# Parse JSON response
curl -s http://localhost:8080/health | jq '.status'
```

## 🧪 Testing Health Checks

### Manual Testing

```bash
# Test all health checks
curl http://localhost:8080/health | jq

# Test liveness probe
curl http://localhost:8080/health/live | jq

# Test readiness probe
curl http://localhost:8080/health/ready | jq
```

### Expected Responses

**Healthy** (HTTP 200):
```json
{"status":"Healthy"}
```

**Degraded** (HTTP 200):
```json
{"status":"Degraded"}
```

**Unhealthy** (HTTP 503):
```json
{"status":"Unhealthy"}
```

### Unit Testing

```csharp
[Fact]
public async Task DatabaseHealthCheck_WhenDatabaseIsAvailable_ReturnsHealthy()
{
    // Arrange
    var context = CreateTestDbContext();
    var logger = Mock.Of<ILogger<DatabaseHealthCheck>>();
    var healthCheck = new DatabaseHealthCheck(context, logger);

    // Act
    var result = await healthCheck.CheckHealthAsync(new HealthCheckContext());

    // Assert
    Assert.Equal(HealthStatus.Healthy, result.Status);
}
```

## 🔍 Troubleshooting

### Health Check Always Returns Unhealthy

1. **Check database connection string** in `appsettings.json`
2. **Verify PostgreSQL is running**: `docker-compose ps`
3. **Check logs**: Look for exceptions in application logs
4. **Test database manually**:
   ```bash
   dotnet ef database update
   ```

### Health Check Timeout

Increase timeout in Kubernetes/Docker:
```yaml
timeoutSeconds: 10  # Increase from default 3s
```

### Degraded Status

If you see "Degraded" status:
- Check for pending migrations: `dotnet ef migrations list`
- Apply migrations: `dotnet ef database update`

## 📝 Best Practices

1. **Keep Checks Fast**: Health checks should complete in < 1 second
2. **Use Appropriate Tags**: Tag checks as `ready` if they affect readiness
3. **Log Failures**: Always log why a health check failed
4. **Don't Check External APIs in Liveness**: Only check your own app
5. **Cache Results**: For expensive checks, cache results for a few seconds
6. **Return Useful Data**: Include diagnostic info in the `data` property
7. **Set Proper Timeouts**: Configure realistic timeouts in orchestrators

## 🔗 Additional Resources

- [ASP.NET Core Health Checks Documentation](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks)
- [AspNetCore.Diagnostics.HealthChecks GitHub](https://github.com/Xabaril/AspNetCore.Diagnostics.HealthChecks)
- [Kubernetes Liveness/Readiness Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
