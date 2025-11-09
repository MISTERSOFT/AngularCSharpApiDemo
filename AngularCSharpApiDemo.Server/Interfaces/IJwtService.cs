using AngularCSharpApiDemo.Server.Models;

namespace AngularCSharpApiDemo.Server.Interfaces;

/// <summary>
/// Service for generating and validating JWT tokens
/// </summary>
public interface IJwtService
{
    /// <summary>
    /// Generates a JWT token for the specified user
    /// </summary>
    /// <param name="user">The user to generate a token for</param>
    /// <param name="roles">The roles assigned to the user</param>
    /// <returns>A JWT token string and expiration date</returns>
    (string Token, DateTime ExpiresAt) GenerateToken(ApplicationUser user, IList<string> roles);

    /// <summary>
    /// Validates a JWT token
    /// </summary>
    /// <param name="token">The token to validate</param>
    /// <returns>True if the token is valid, false otherwise</returns>
    bool ValidateToken(string token);
}
