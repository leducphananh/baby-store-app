import { useInfiniteQuery } from '@tanstack/react-query';

import { getProducts } from '../api/get-products';
import { productsKeys } from '../api/query-keys';
import type { ProductStatusFilter } from '../types/product';

type UseProductsParams = {
  search?: string;
  categoryId?: string | null;
  status?: ProductStatusFilter;
};

/**
 * Server-side paginated product list (20/page) via `useInfiniteQuery`,
 * filtered by status/category with an optional debounced search term.
 * Chosen over a plain `useQuery` + manual page state because the list
 * screen needs infinite scroll (`onEndReached`) — this is the simpler
 * option for that UX, not a departure from the rest of the app's pattern.
 */
export function useProducts({ search = '', categoryId = null, status = 'active' }: UseProductsParams = {}) {
  const trimmedSearch = search.trim();

  return useInfiniteQuery({
    queryKey: productsKeys.list({ search: trimmedSearch, categoryId, status }),
    queryFn: ({ pageParam }) => getProducts({ search: trimmedSearch, categoryId, status, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
