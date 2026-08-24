import { supabase } from '@/services/supabase/client';
import { DuplicateCategoryNameError, getCategoryErrorMessage } from '../utils/errors';
import type { CategoryFormValues } from '../schemas/categorySchema';
import type { CategoryRow } from '../types/category';

type UpdateCategoryParams = {
  id: string;
  values: CategoryFormValues;
};

/** Updates a category, re-checking the case-insensitive duplicate-name rule against other rows. */
export async function updateCategory({ id, values }: UpdateCategoryParams): Promise<CategoryRow> {
  const name = values.name.trim();
  const description = values.description?.trim() || null;

  const { data: existing, error: checkError } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', name)
    .neq('id', id)
    .limit(1);

  if (checkError) {
    throw new Error(getCategoryErrorMessage(checkError));
  }
  if (existing && existing.length > 0) {
    throw new DuplicateCategoryNameError();
  }

  const { data, error } = await supabase
    .from('categories')
    // `categories` has no DB trigger to auto-refresh `updated_at` (verified
    // via information_schema.triggers), so it is set explicitly here.
    .update({ name, description, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(getCategoryErrorMessage(error));
  }

  return data;
}
