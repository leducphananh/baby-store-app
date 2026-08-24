import { useQuery } from '@tanstack/react-query';

import { getCategoryById } from '../api/get-category';
import { categoriesKeys } from '../api/query-keys';

/** Fetch a single category by id. */
export function useCategory(id: string | undefined) {
  return useQuery({
    queryKey: categoriesKeys.detail(id ?? ''),
    queryFn: () => getCategoryById(id as string),
    enabled: Boolean(id),
  });
}
