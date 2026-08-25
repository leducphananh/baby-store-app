import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateProduct } from '../api/update-product';
import { productsKeys } from '../api/query-keys';

/** Update a product and invalidate the affected detail + list queries. */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productsKeys.detail(data.id) });
    },
  });
}
