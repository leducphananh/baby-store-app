import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createProduct } from '../api/create-product';
import { productsKeys } from '../api/query-keys';

/** Create a product and invalidate the list so it reflects server state. */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
    },
  });
}
