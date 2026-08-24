import { useMutation, useQueryClient } from '@tanstack/react-query';

import { restoreSupplier } from '../api/archive-supplier';
import { suppliersKeys } from '../api/query-keys';

/** Restore an archived supplier back to active and invalidate affected queries. */
export function useRestoreSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreSupplier,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: suppliersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: suppliersKeys.detail(data.id) });
    },
  });
}
