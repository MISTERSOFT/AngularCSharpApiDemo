using AngularCSharpApiDemo.Server.Models;

namespace AngularCSharpApiDemo.Server.DTOs.Converters
{
    public static class UserConverterExtentions
    {
        public static UserDto ToUserDto(this ApplicationUser user)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                CreatedAt = user.CreatedAt,
                Username = user.UserName ?? string.Empty
            };
        }
    }
}
