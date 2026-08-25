import { supabase } from '@/services/supabase/client';
import { ProductNotFoundError, getProductErrorMessage } from '../utils/errors';
import type { ProductWithCategory } from '../types/product';

/** Fetches a single product (with its category embedded) by id. Throws `ProductNotFoundError` if it does not exist. */
export async function getProductById(id: string): Promise<ProductWithCategory> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(getProductErrorMessage(error));
  }

  if (!data) {
    throw new ProductNotFoundError();
  }

  return data as unknown as ProductWithCategory;
}
