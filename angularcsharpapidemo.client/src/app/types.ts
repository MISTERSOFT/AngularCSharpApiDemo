export interface ProductListItemDto {
  id: number
  name: string
  price: number
  image: string
}

export interface CategoryDto {
  id: number
  name: string
}

export interface ProductImageDto {
  id: number
  url: string
}

export interface ProductDto {
  id: number
  name: string
  description: string
  price: number
  categories: CategoryDto[]
  productImages: ProductImageDto[]
}

export interface CreateProductDto {
  name: string
  description: string
  price: number
  categoryIds: number[]
  imageUrls: string[]
}

export interface UpdateProductDto {
  name: string
  description: string
  price: number
  categoryIds: number[]
  imageUrls: string[]
}

export interface CreateCategoryDto {
  name: string
}

export interface UpdateCategoryDto {
  name: string
}

export interface PaginationParams {
  pageNumber: number
  pageSize: number
}

export interface ProductFilterParams extends PaginationParams {
  search?: string | null
  categories?: string | null
  minPrice?: number | null
  maxPrice?: number | null
}

export interface PagedResponse<T> {
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  items: T[]
}
