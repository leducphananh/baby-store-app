import { useQuery } from '@tanstack/react-query';

import { getSupplierById } from '../api/get-supplier';
import { suppliersKeys } from '../api/query-keys';

/** Fetch a single supplier by id. */
export function useSupplier(id: string | undefined) {
  return useQuery({
    queryKey: suppliersKeys.detail(id ?? ''),
    queryFn: () => getSupplierById(id as string),
    enabled: Boolean(id),
  });
}
