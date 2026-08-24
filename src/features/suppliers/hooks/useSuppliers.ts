import { useQuery } from '@tanstack/react-query';

import { getSuppliers } from '../api/get-suppliers';
import { suppliersKeys } from '../api/query-keys';
import type { SupplierStatusFilter } from '../types/supplier';

/** List suppliers, filtered server-side by status and an optional search term. */
export function useSuppliers(search = '', status: SupplierStatusFilter = 'active') {
  const trimmedSearch = search.trim();

  return useQuery({
    queryKey: suppliersKeys.list({ search: trimmedSearch, status }),
    queryFn: () => getSuppliers({ search: trimmedSearch, status }),
  });
}
