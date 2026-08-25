import { useMutation, useQueryClient } from '@tanstack/react-query';

import { restoreProduct } from '../api/archive-product';
import { productsKeys } from '../api/query-keys';

/** Restore an archived product back to active and invalidate affected queries. */
export function useRestoreProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productsKeys.detail(data.id) });
    },
  });
}
