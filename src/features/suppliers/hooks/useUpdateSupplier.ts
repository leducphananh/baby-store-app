import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateSupplier } from '../api/update-supplier';
import { suppliersKeys } from '../api/query-keys';

/** Update a supplier and invalidate the affected detail + list queries. */
export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSupplier,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: suppliersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: suppliersKeys.detail(data.id) });
    },
  });
}
