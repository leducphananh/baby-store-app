import { useQuery } from '@tanstack/react-query';

import { getProductById } from '../api/get-product';
import { productsKeys } from '../api/query-keys';

/** Fetch a single product (with its category embedded) by id. */
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: productsKeys.detail(id ?? ''),
    queryFn: () => getProductById(id as string),
    enabled: Boolean(id),
  });
}
