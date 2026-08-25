import { useQuery } from '@tanstack/react-query';

import { getCustomers } from '../api/get-customers';
import { customersKeys } from '../api/query-keys';
import type { CustomerStatusFilter } from '../types/customer';

/** List customers, filtered server-side by status and an optional search term. */
export function useCustomers(search = '', status: CustomerStatusFilter = 'active') {
  const trimmedSearch = search.trim();

  return useQuery({
    queryKey: customersKeys.list({ search: trimmedSearch, status }),
    queryFn: () => getCustomers({ search: trimmedSearch, status }),
  });
}
