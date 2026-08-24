import { supabase } from '@/services/supabase/client';
import { CategoryNotFoundError, getCategoryErrorMessage } from '../utils/errors';
import type { CategoryRow } from '../types/category';

/** Fetches a single category by id. Throws `CategoryNotFoundError` if it does not exist. */
export async function getCategoryById(id: string): Promise<CategoryRow> {
  const { data, error } = await supabase.from('categories').select('*').eq('id', id).maybeSingle();

  if (error) {
    throw new Error(getCategoryErrorMessage(error));
  }

  if (!data) {
    throw new CategoryNotFoundError();
  }

  return data;
}
