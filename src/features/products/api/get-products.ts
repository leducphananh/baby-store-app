import { supabase } from '@/services/supabase/client';
import { getProductErrorMessage } from '../utils/errors';
import type { ProductStatusFilter, ProductWithCategory } from '../types/product';

export const PRODUCTS_PAGE_SIZE = 20;

type GetProductsParams = {
  search?: string;
  categoryId?: string | null;
  status?: ProductStatusFilter;
  /** 0-based page index. */
  page?: number;
  pageSize?: number;
};

export type ProductsPage = {
  items: ProductWithCategory[];
  /** Next page index to fetch, or `null` when this was the last page. */
  nextPage: number | null;
};

/**
 * Fetches products, server-side paginated (default 20/page) and filtered by
 * status (defaults to 'active') and an optional category. Search covers
 * name/sku/barcode/brand via `ilike`; the `name` column benefits from the
 * existing `idx_products_name_trgm` trigram index (Phase 1) since Postgres
 * trigram indexes accelerate `%term%` patterns, not just prefixes — no new
 * index is created here. The category is embedded via the
 * `products_category_id_fkey` relationship so the list/detail never needs a
 * second round-trip to resolve a category name.
 */
export async function getProducts({
  search,
  categoryId,
  status = 'active',
  page = 0,
  pageSize = PRODUCTS_PAGE_SIZE,
}: GetProductsParams = {}): Promise<ProductsPage> {
  let query = supabase
    .from('products')
    .select('*, categories(id, name)')
    .order('name', { ascending: true });

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const trimmedSearch = search?.trim();
  if (trimmedSearch) {
    // `,` and `()` are structural characters in PostgREST's `or=` filter
    // syntax — strip them from the needle so a search term containing them
    // cannot break the query.
    const sanitized = trimmedSearch.replace(/[,()]/g, '').trim();
    if (sanitized) {
      const pattern = `%${sanitized}%`;
      query = query.or(`name.ilike.${pattern},sku.ilike.${pattern},barcode.ilike.${pattern},brand.ilike.${pattern}`);
    }
  }

  const from = page * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error } = await query;

  if (error) {
    throw new Error(getProductErrorMessage(error));
  }

  const items = (data ?? []) as unknown as ProductWithCategory[];

  return {
    items,
    nextPage: items.length === pageSize ? page + 1 : null,
  };
}
