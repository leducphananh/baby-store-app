import { useMutation, useQueryClient } from '@tanstack/react-query';

import { archiveProduct } from '../api/archive-product';
import { productsKeys } from '../api/query-keys';

/** Archive a product (soft delete) and invalidate the affected list/detail queries. */
export function useArchiveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productsKeys.detail(data.id) });
    },
  });
}
