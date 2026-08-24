import { supabase } from '@/services/supabase/client';
import { DuplicateCategoryNameError, getCategoryErrorMessage } from '../utils/errors';
import type { CategoryFormValues } from '../schemas/categorySchema';
import type { CategoryRow } from '../types/category';

/**
 * Creates a category. Performs a case-insensitive duplicate-name check
 * first, since the `categories` table has no unique constraint on `name`
 * (see Phase 3.1 walkthrough — schema gap).
 */
export async function createCategory(values: CategoryFormValues): Promise<CategoryRow> {
  const name = values.name.trim();
  const description = values.description?.trim() || null;

  const { data: existing, error: checkError } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', name)
    .limit(1);

  if (checkError) {
    throw new Error(getCategoryErrorMessage(checkError));
  }
  if (existing && existing.length > 0) {
    throw new DuplicateCategoryNameError();
  }

  const { data, error } = await supabase.from('categories').insert({ name, description }).select().single();

  if (error) {
    throw new Error(getCategoryErrorMessage(error));
  }

  return data;
}
