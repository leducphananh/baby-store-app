import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteCategory } from '../api/delete-category';
import { categoriesKeys } from '../api/query-keys';

/** Delete a category and invalidate the list + drop its detail cache. */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
      queryClient.removeQueries({ queryKey: categoriesKeys.detail(id) });
    },
  });
}
