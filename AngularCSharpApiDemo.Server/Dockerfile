# Consultez https://aka.ms/customizecontainer pour savoir comment personnaliser votre conteneur de débogage et comment Visual Studio utilise ce Dockerfile pour générer vos images afin d'accélérer le débogage.

# Cet index est utilisé lors de l'exécution à partir de VS en mode rapide (par défaut pour la configuration de débogage)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# Stage 1: Build Angular frontend
FROM node:20-alpine AS angular-build
WORKDIR /src/frontend

# Copy Angular project files
COPY angularcsharpapidemo.client/package*.json ./
RUN npm ci --silent

# Copy Angular source code and build
COPY angularcsharpapidemo.client/ ./
RUN npm run build -- --configuration production


# Stage 2: Build .NET backend
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy project files and restore
COPY ["AngularCSharpApiDemo.Server/AngularCSharpApiDemo.Server.csproj", "AngularCSharpApiDemo.Server/"]
#COPY ["angularcsharpapidemo.client/angularcsharpapidemo.client.esproj", "angularcsharpapidemo.client/"]
RUN dotnet restore "./AngularCSharpApiDemo.Server/AngularCSharpApiDemo.Server.csproj"

# Copy backend source code
COPY . .

# Copy Angular build output to wwwroot
COPY --from=angular-build /src/frontend/dist/angularcsharpapidemo.client/browser ./AngularCSharpApiDemo.Server/wwwroot

# Build backend
WORKDIR "/src/AngularCSharpApiDemo.Server"
RUN dotnet build "./AngularCSharpApiDemo.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build


# Stage 3: Publish .NET application
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./AngularCSharpApiDemo.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false


# Stage 4: Final runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AngularCSharpApiDemo.Server.dll"]
