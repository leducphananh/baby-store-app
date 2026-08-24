import type { SupplierStatusFilter } from '../types/supplier';

export type SupplierListFilters = {
  search: string;
  status: SupplierStatusFilter;
};

/** Stable TanStack Query keys for the suppliers feature. */
export const suppliersKeys = {
  all: ['suppliers'] as const,
  lists: () => [...suppliersKeys.all, 'list'] as const,
  list: (filters: SupplierListFilters) => [...suppliersKeys.lists(), filters] as const,
  details: () => [...suppliersKeys.all, 'detail'] as const,
  detail: (id: string) => [...suppliersKeys.details(), id] as const,
};
