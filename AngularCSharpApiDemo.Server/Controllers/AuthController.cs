using AngularCSharpApiDemo.Server.DTOs;
using AngularCSharpApiDemo.Server.DTOs.Converters;
using AngularCSharpApiDemo.Server.Interfaces;
using AngularCSharpApiDemo.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AngularCSharpApiDemo.Server.Controllers;

/// <summary>
/// Controller for authentication operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IJwtService _jwtService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IJwtService jwtService,
        ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
        _logger = logger;
    }

    /// <summary>
    /// Register a new user
    /// </summary>
    /// <param name="registerDto">Registration information</param>
    /// <returns>Authentication response with JWT token</returns>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = new ApplicationUser
        {
            // Username is not used in this app but we have to define one with AspNetCore.
            // So we create a random GUID for the Username.
            UserName = Guid.CreateVersion7().ToString(),
            Email = registerDto.Email,
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
            return BadRequest(ModelState);
        }

        // Assign default role (optional)
        await _userManager.AddToRoleAsync(user, "User");

        _logger.LogInformation("User {Email} registered successfully", user.Email);

        // Generate JWT token
        var roles = await _userManager.GetRolesAsync(user);
        var (token, expiresAt) = _jwtService.GenerateToken(user, roles);

        return Ok(new AuthResponseDto
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = user.ToUserDto(roles)
        });
    }

    /// <summary>
    /// Login an existing user
    /// </summary>
    /// <param name="loginDto">Login credentials</param>
    /// <returns>Authentication response with JWT token</returns>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Find user by username or email
        var user = await _userManager.FindByEmailAsync(loginDto.Email);

        if (user == null)
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

        if (!result.Succeeded)
        {
            _logger.LogWarning("Failed login attempt for user {Email}", loginDto.Email);
            return Unauthorized(new { message = "Invalid credentials" });
        }

        _logger.LogInformation("User {Email} logged in successfully", user.Email);

        // Generate JWT token
        var roles = await _userManager.GetRolesAsync(user);
        var (token, expiresAt) = _jwtService.GenerateToken(user, roles);

        return Ok(new AuthResponseDto
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = user.ToUserDto(roles)
        });
    }

    /// <summary>
    /// Get current user information
    /// </summary>
    /// <returns>Current user details</returns>
    [HttpGet("me")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var userId = User.FindFirst("userId")?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return NotFound();
        }

        // Get user roles
        var roles = await _userManager.GetRolesAsync(user);

        return Ok(user.ToUserDto(roles));
    }
}
