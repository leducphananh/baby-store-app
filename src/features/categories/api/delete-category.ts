import { supabase } from '@/services/supabase/client';
import { CategoryInUseError, getCategoryErrorMessage } from '../utils/errors';

/**
 * Deletes a category. Pre-checks whether any product still references it
 * (the `products.category_id` foreign key is `ON DELETE RESTRICT`, so the
 * database would reject the delete anyway — this pre-check just gives a
 * fast, friendly message instead of a round-trip failure). The Postgres
 * error is still mapped as a fallback in case of a race condition.
 */
export async function deleteCategory(id: string): Promise<void> {
  const { count, error: countError } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id);

  if (countError) {
    throw new Error(getCategoryErrorMessage(countError));
  }
  if (count && count > 0) {
    throw new CategoryInUseError();
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    throw new Error(getCategoryErrorMessage(error));
  }
}
