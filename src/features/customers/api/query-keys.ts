import type { CustomerStatusFilter } from '../types/customer';

export type CustomerListFilters = {
  search: string;
  status: CustomerStatusFilter;
};

/** Stable TanStack Query keys for the customers feature. */
export const customersKeys = {
  all: ['customers'] as const,
  lists: () => [...customersKeys.all, 'list'] as const,
  list: (filters: CustomerListFilters) => [...customersKeys.lists(), filters] as const,
  details: () => [...customersKeys.all, 'detail'] as const,
  detail: (id: string) => [...customersKeys.details(), id] as const,
};
