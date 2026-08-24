import { useQuery } from '@tanstack/react-query';

import { getCategories } from '../api/get-categories';
import { categoriesKeys } from '../api/query-keys';

/** List categories, optionally filtered server-side by name. */
export function useCategories(search = '') {
  const trimmedSearch = search.trim();

  return useQuery({
    queryKey: categoriesKeys.list(trimmedSearch),
    queryFn: () => getCategories({ search: trimmedSearch }),
  });
}
