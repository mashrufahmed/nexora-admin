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
  [key: string]: unknown;
};
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
  create: (input: ProductInput) => apiJson<Product>('/products', 'POST', input),
  update: (id: string, input: Partial<ProductInput>) =>
    apiJson<Product>(`/products/${id}`, 'PATCH', input),
  remove: (id: string) =>
    apiJson<{ message: string }>(`/products/${id}`, 'DELETE'),
  publish: (siteId: string, productId: string, input: { slug?: string; title?: string; summary?: string; categoryIds?: string[] }) => apiJson<Record<string, unknown>>(`/sites/${siteId}/products/${productId}/publish`, 'POST', input),
};
