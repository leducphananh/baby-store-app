import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateCustomer } from '../api/update-customer';
import { customersKeys } from '../api/query-keys';

/** Update a customer and invalidate the affected detail + list queries. */
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: customersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customersKeys.detail(data.id) });
    },
  });
}
