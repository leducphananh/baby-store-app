import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createSupplier } from '../api/create-supplier';
import { suppliersKeys } from '../api/query-keys';

/** Create a supplier and invalidate the list so it reflects server state. */
export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: suppliersKeys.lists() });
    },
  });
}
