using AngularCSharpApiDemo.Server.Models;

namespace AngularCSharpApiDemo.Server.DTOs.Converters
{
    public static class ProductConverterExtensions
    {
        public static ProductDto ToDto(this Product src)
        {
            if (src == null)
                return null;

            return new ProductDto
            {
                Id = src.Id,
                Name = src.Name,
                Description = src.Description,
                Price = src.Price,
                Categories = src.Categories.ToDtos(),
                ProductImages = src.ProductImages.ToDtos()
            };
        }

        public static List<ProductDto> ToDtos(this IEnumerable<Product> src)
        {
            return src.Select(p => p.ToDto()).ToList();
        }
    }
}
