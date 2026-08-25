import { useQuery } from '@tanstack/react-query';

import { getCustomerById } from '../api/get-customer';
import { customersKeys } from '../api/query-keys';

/** Fetch a single customer by id. */
export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: customersKeys.detail(id ?? ''),
    queryFn: () => getCustomerById(id as string),
    enabled: Boolean(id),
  });
}
