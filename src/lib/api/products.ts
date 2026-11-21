import { apiFetch, apiJson } from './client';
export type Product = {
  id: string;
  name: string;
  slug: string;
  status?: string;
  modelNumber?: string | null;
  description?: string | null;
  specifications?: Record<string, unknown> | null;
  brand?: { id: string; name: string } | null;
  createdAt?: string;
  updatedAt?: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
  siteProducts?: SiteProduct[];
  [key: string]: unknown;
};
export type ProductVariant = { id: string; productId: string; name: string; sku: string; attributes?: Record<string, unknown> | null; status?: string };
export type ProductImage = { id: string; productId: string; mediaAssetId: string; alt?: string | null; caption?: string | null; position: number; isPrimary: boolean };
export type SiteProduct = { id: string; siteId: string; productId: string; title: string; slug: string; summary?: string | null; isFeatured: boolean };
export type ProductInput = {
  name: string;
  slug: string;
  brandId?: string;
  modelNumber?: string;
  description?: string;
  specifications?: Record<string, unknown>;
};
export type Brand = { id: string; name: string; slug: string; description?: string | null; _count?: { products: number } };
export const productsApi = {
  brands: () => apiFetch<Brand[]>('/brands'),
  createBrand: (input: { name: string; slug: string; description?: string }) => apiJson<Brand>('/brands', 'POST', input),
  updateBrand: (id: string, input: Partial<{ name: string; slug: string; description: string }>) => apiJson<Brand>(`/brands/${id}`, 'PATCH', input),
  removeBrand: (id: string) => apiJson<{ message: string }>(`/brands/${id}`, 'DELETE'),
  list: () => apiFetch<Product[]>('/products'),
  get: (id: string) => apiFetch<Product>(`/products/${id}`),
  addVariant: (productId: string, input: { name: string; sku: string; attributes?: Record<string, unknown> }) => apiJson<ProductVariant>(`/products/${productId}/variants`, 'POST', input),
  addImage: (productId: string, mediaAssetId: string, input: Partial<Pick<ProductImage, 'alt' | 'caption' | 'position' | 'isPrimary'>>) => apiJson<ProductImage>(`/products/${productId}/images/${mediaAssetId}`, 'POST', input),
  updateImage: (id: string, input: Partial<Pick<ProductImage, 'alt' | 'caption' | 'position' | 'isPrimary'>>) => apiJson<ProductImage>(`/product-images/${id}`, 'PATCH', input),
  removeImage: (id: string) => apiJson<{ message: string }>(`/product-images/${id}`, 'DELETE'),
  updateSiteProduct: (id: string, input: Partial<Pick<SiteProduct, 'title' | 'slug' | 'summary' | 'isFeatured'>>) => apiJson<SiteProduct>(`/site-products/${id}`, 'PATCH', input),
  create: (input: ProductInput) => apiJson<Product>('/products', 'POST', input),
  update: (id: string, input: Partial<ProductInput>) =>
    apiJson<Product>(`/products/${id}`, 'PATCH', input),
  remove: (id: string) =>
    apiJson<{ message: string }>(`/products/${id}`, 'DELETE'),
  publish: (siteId: string, productId: string, input: { slug?: string; title?: string; summary?: string; categoryIds?: string[] }) => apiJson<Record<string, unknown>>(`/sites/${siteId}/products/${productId}/publish`, 'POST', input),
};
