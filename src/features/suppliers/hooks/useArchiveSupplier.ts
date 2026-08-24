import { useMutation, useQueryClient } from '@tanstack/react-query';

import { archiveSupplier } from '../api/archive-supplier';
import { suppliersKeys } from '../api/query-keys';

/** Archive a supplier (soft delete) and invalidate the affected list/detail queries. */
export function useArchiveSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveSupplier,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: suppliersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: suppliersKeys.detail(data.id) });
    },
  });
}
