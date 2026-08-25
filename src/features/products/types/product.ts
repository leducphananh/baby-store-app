import type { Database } from '@/services/supabase/database.types';
import type { CategoryRow } from '@/features/categories/types/category';

export type ProductRow = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

/**
 * A product row with its category embedded via the `products_category_id_fkey`
 * relationship (`.select('*, categories(id, name)')`). `category_id` is
 * nullable in the actual schema, so `categories` is `null` for an
 * uncategorized product.
 */
export type ProductWithCategory = ProductRow & {
  categories: Pick<CategoryRow, 'id' | 'name'> | null;
};

/** The two states a product can be in. Products are never hard-deleted. */
export type ProductStatus = 'active' | 'archived';

/** Status used to filter the product list; 'all' includes both. */
export type ProductStatusFilter = ProductStatus | 'all';
