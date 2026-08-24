import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCategory } from '../api/create-category';
import { categoriesKeys } from '../api/query-keys';

/** Create a category and invalidate the list so it reflects server state. */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
    },
  });
}
