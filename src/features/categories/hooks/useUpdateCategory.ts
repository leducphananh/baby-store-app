import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateCategory } from '../api/update-category';
import { categoriesKeys } from '../api/query-keys';

/** Update a category and invalidate the affected detail + list queries. */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.detail(data.id) });
    },
  });
}
