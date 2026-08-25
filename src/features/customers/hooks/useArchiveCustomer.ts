import { useMutation, useQueryClient } from '@tanstack/react-query';

import { archiveCustomer } from '../api/archive-customer';
import { customersKeys } from '../api/query-keys';

/** Archive a customer (soft delete) and invalidate the affected list/detail queries. */
export function useArchiveCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveCustomer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: customersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customersKeys.detail(data.id) });
    },
  });
}
