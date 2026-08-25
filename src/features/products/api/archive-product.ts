import { supabase } from '@/services/supabase/client';
import { getProductErrorMessage } from '../utils/errors';
import type { ProductRow, ProductStatus } from '../types/product';

async function updateStatus(id: string, status: ProductStatus): Promise<ProductRow> {
  const { data, error } = await supabase
    .from('products')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(getProductErrorMessage(error));
  }

  return data;
}

/**
 * Archives a product (status = 'archived'). This is a soft delete: a
 * product may be referenced by `import_receipt_items`, `product_batches`,
 * `inventory_transactions`, `order_items` and `order_item_batches`, so
 * historical rows are never hard-deleted — the app never issues a DELETE
 * against `products`. This only touches the `products` row itself; it
 * never writes to any inventory/order table.
 */
export function archiveProduct(id: string): Promise<ProductRow> {
  return updateStatus(id, 'archived');
}

/** Restores an archived product back to active. */
export function restoreProduct(id: string): Promise<ProductRow> {
  return updateStatus(id, 'active');
}
