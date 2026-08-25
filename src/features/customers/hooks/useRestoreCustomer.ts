import { useMutation, useQueryClient } from '@tanstack/react-query';

import { restoreCustomer } from '../api/archive-customer';
import { customersKeys } from '../api/query-keys';

/** Restore an archived customer back to active and invalidate affected queries. */
export function useRestoreCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreCustomer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: customersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customersKeys.detail(data.id) });
    },
  });
}
