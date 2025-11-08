# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **integrated full-stack application** combining:
- **Backend**: ASP.NET Core 9.0 Web API (C#)
- **Frontend**: Angular 20.3.10 with TypeScript 5.9.3
- **Architecture**: SPA with REST API communication via proxy

The solution (`AngularCSharpApiDemo.sln`) contains two projects managed together:
- `AngularCSharpApiDemo.Server` - C# backend API
- `angularcsharpapidemo.client` - Angular frontend

## Development Commands

### Backend (C# API)

```bash
# Build the solution
dotnet build

# Run the server (from AngularCSharpApiDemo.Server directory)
dotnet run

# Restore dependencies
dotnet restore
```

### Frontend (Angular)

```bash
# Install dependencies (from angularcsharpapidemo.client directory)
npm install

# Start development server (with HTTPS and proxy)
npm start

# Build for production
npm run build

# Run tests
npm test

# Build production bundle
ng build --configuration production
```

### Docker

```bash
# Build Docker image (multi-stage build with Node.js 20 and .NET 9)
docker build -f AngularCSharpApiDemo.Server/Dockerfile -t angularcsharpapidemo .

# Run container
docker run -p 8080:8080 angularcsharpapidemo
```

## Architecture

### Backend Structure

- **Pattern**: Controller-based REST API with minimal hosting model
- **Entry Point**: `AngularCSharpApiDemo.Server/Program.cs` - uses .NET 9 minimal API pattern
- **Controllers**: Located in `AngularCSharpApiDemo.Server/Controllers/`
  - `WeatherForecastController.cs` - Example API endpoint at `/api/weatherforecast`
- **Models**: Domain models like `WeatherForecast.cs` in project root
- **Configuration**:
  - `appsettings.json` - Base configuration
  - `appsettings.Development.json` - Development-specific settings

**Key Backend Features**:
- Integrated SPA proxy during development (launches Angular dev server)
- Static file serving for production builds
- HTTPS configuration
- OpenAPI/Swagger support

### Frontend Structure

- **Pattern**: Module-based Angular with component architecture
- **Core Files**:
  - `src/main.ts` - Application bootstrap
  - `src/app/app.module.ts` - Root module with HttpClientModule
  - `src/app/app-routing.module.ts` - Client-side routing
  - `src/app/app.component.ts` - Root component with service calls

**Component Architecture**:
- Components make HTTP calls directly (no separate service layer in demo)
- TypeScript interfaces define API response types
- RxJS observables for async data handling

### Development Workflow Integration

**Proxy Configuration** (`src/proxy.conf.js`):
- Frontend dev server proxies `/api/*` requests to backend
- Default backend target: `https://localhost:32769` (configurable via `ASPNETCORE_HTTPS_PORT`)
- Self-signed certificate validation disabled for local development

**SPA Integration in Backend**:
- `SpaRoot` property in `.csproj` points to `../angularcsharpapidemo.client`
- `SpaProxyLaunchCommand` automatically starts Angular dev server
- Production: Backend serves compiled Angular assets from `dist/`

## Coding Guidelines
- For Angular, use the following guidelines `@./.claude/guidelines/angular-coding-guidelines.md`
- For C#, use the following guidelines `@./.claude/guidelines/c-sharp-coding-conventions.md`
- For ASP.NET Core, use the following best practices `@./.claude/guidelines/asp-net-core-best-practices.md`


## Testing

### Frontend Tests (Karma + Jasmine)

```bash
# Run tests with watch mode
npm test

# Single run (for CI)
ng test --watch=false --browsers=ChromeHeadless

# With coverage
ng test --code-coverage
```

**Test Configuration**:
- Framework: Jasmine 5.6.0
- Runner: Karma 6.4.0
- Config: `karma.conf.js`
- Coverage output: `./coverage/`
- Test specs: `*.spec.ts` files alongside components

## Build Configuration

### Angular Build System

- **Build tool**: Angular Build (Vite-based) via `@angular/build:application`
- **Output**: `dist/angularcsharpapidemo.client/`
- **Builders**:
  - Build: `@angular/build:application`
  - Dev Server: `@angular/build:dev-server`
  - Tests: `@angular/build:karma`

**Production Budgets** (configured in `angular.json`):
- Initial bundle: 500kB warning, 1MB error
- Styles per component: 4kB warning, 8kB error

### TypeScript Configuration

- **Target**: ES2022
- **Module**: ES2022 with bundler resolution
- **Strict mode**: Enabled
- **Experimental decorators**: Enabled (required for Angular)

## Key Configuration Files

| File | Purpose |
|------|---------|
| `AngularCSharpApiDemo.sln` | Visual Studio solution file |
| `AngularCSharpApiDemo.Server/AngularCSharpApiDemo.Server.csproj` | C# project with SPA integration settings |
| `angularcsharpapidemo.client/angular.json` | Angular workspace configuration |
| `angularcsharpapidemo.client/package.json` | Node dependencies and npm scripts |
| `angularcsharpapidemo.client/tsconfig.json` | TypeScript compiler options |
| `angularcsharpapidemo.client/src/proxy.conf.js` | Development proxy configuration |
| `AngularCSharpApiDemo.Server/appsettings.json` | Backend configuration |
| `.vscode/launch.json` | VS Code debugger configuration (Chrome/Edge) |

## Environment Variables

- `ASPNETCORE_HTTPS_PORT` - Backend HTTPS port (default: 32769)
- `ASPNETCORE_URLS` - Alternative backend URL configuration
- `ASPNETCORE_ENVIRONMENT` - Set to "Development" or "Production"

## Commit Conventions

This project follows **Conventional Commits 1.0.0** specification.

Everything is describe in this file `@./.claude/guidelines/commit-conventions.md`

## VS Code Integration

The project includes VS Code configuration for debugging:

**Launch Configurations** (`.vscode/launch.json`):
- Chrome debugger on `https://localhost:55428`
- Microsoft Edge debugger on `https://localhost:55428`

**Tasks** (`.vscode/tasks.json`):
- `npm: start` - Launch Angular dev server
- `npm: test` - Run tests

## Docker Multi-Stage Build

The Dockerfile uses a multi-stage build process:

1. **Base**: .NET 9 ASP.NET runtime
2. **Build**: .NET 9 SDK + Node.js 20.x + Angular CLI
3. **Publish**: Builds both Angular and .NET projects
4. **Final**: Minimal runtime image with published output

Target OS: Linux
