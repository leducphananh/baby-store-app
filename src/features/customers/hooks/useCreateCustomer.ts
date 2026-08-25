import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCustomer } from '../api/create-customer';
import { customersKeys } from '../api/query-keys';

/** Create a customer and invalidate the list so it reflects server state. */
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customersKeys.lists() });
    },
  });
}
