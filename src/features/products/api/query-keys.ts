import type { ProductStatusFilter } from '../types/product';

export type ProductListFilters = {
  search: string;
  categoryId: string | null;
  status: ProductStatusFilter;
};

/** Stable TanStack Query keys for the products feature. */
export const productsKeys = {
  all: ['products'] as const,
  lists: () => [...productsKeys.all, 'list'] as const,
  list: (filters: ProductListFilters) => [...productsKeys.lists(), filters] as const,
  details: () => [...productsKeys.all, 'detail'] as const,
  detail: (id: string) => [...productsKeys.details(), id] as const,
};
