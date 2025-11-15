using AngularCSharpApiDemo.Server.Models;

namespace AngularCSharpApiDemo.Server.DTOs.Converters
{
    public static class ProductImageConverterExtensions
    {
        public static ProductImageDto ToDto(this ProductImage src)
        {
            if (src == null)
                return null;

            return new ProductImageDto
            {
                Id = src.Id,
                Url = src.Url,
            };
        }
        public static List<ProductImageDto> ToDtos(this IEnumerable<ProductImage> src)
        {
            return src.Select(x => x.ToDto()).ToList();
        }
    }
}
