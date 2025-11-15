using AngularCSharpApiDemo.Server.Models;

namespace AngularCSharpApiDemo.Server.DTOs.Converters
{
    public static class CategoryConverterExtensions
    {
        public static CategoryDto ToDto(this Category src)
        {
            if (src == null)
                return null;

            return new CategoryDto
            {
                Id = src.Id,
                Name = src.Name,
            };
        }

        public static List<CategoryDto> ToDtos(this IEnumerable<Category> src)
        {
            return src.Select(c => c.ToDto()).ToList();
        }
    }
}
