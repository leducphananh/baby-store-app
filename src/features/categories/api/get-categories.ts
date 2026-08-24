import { supabase } from '@/services/supabase/client';
import { getCategoryErrorMessage } from '../utils/errors';
import type { CategoryRow } from '../types/category';

type GetCategoriesParams = {
  search?: string;
};

/** Fetches categories, optionally filtered server-side by a case-insensitive name search. */
export async function getCategories({ search }: GetCategoriesParams = {}): Promise<CategoryRow[]> {
  let query = supabase.from('categories').select('*').order('name', { ascending: true });

  const trimmedSearch = search?.trim();
  if (trimmedSearch) {
    query = query.ilike('name', `%${trimmedSearch}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(getCategoryErrorMessage(error));
  }

  return data ?? [];
}
